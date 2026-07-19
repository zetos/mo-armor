import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ARMOR_CAMPAIGN, type CampaignBatch } from './armorCampaign';
import {
  API_URL,
  fetchSampleBatch,
  STANDARD_DENSITY_MATRIX,
  type SampleBatch,
} from './parseSample';

const OUTPUT_DIRECTORY = resolve(import.meta.dir, '../samples/fetched');
const CAMPAIGN_CONCURRENCY = 4;

export interface PersistedCampaignBatch {
  schemaVersion: 1;
  source: string;
  subject: CampaignBatch;
  batch: SampleBatch;
}

function requestsFor(subject: CampaignBatch) {
  return STANDARD_DENSITY_MATRIX.map(({ baseDensity, supportDensity }) => ({
    armorStyleId: subject.armorStyleId,
    baseMatId: subject.baseMatId,
    supportMatId: subject.supportMatId,
    baseDensity,
    supportDensity,
  }));
}

async function fetchSubject(subject: CampaignBatch, force: boolean): Promise<string> {
  const outputPath = resolve(OUTPUT_DIRECTORY, `${subject.slug}.json`);
  if (!force && await Bun.file(outputPath).exists()) return `skip ${subject.slug}`;

  const batch = await fetchSampleBatch(requestsFor(subject));
  if (batch.status !== 'complete') {
    throw new Error(`${subject.slug}: ${batch.failed}/${batch.requested} requests failed`);
  }
  const persisted: PersistedCampaignBatch = {
    schemaVersion: 1,
    source: API_URL,
    subject,
    batch,
  };
  await Bun.write(outputPath, `${JSON.stringify(persisted, null, 2)}\n`);
  return `write ${subject.slug}`;
}

async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  const unknown = process.argv.slice(2).filter((argument) => argument !== '--force');
  if (unknown.length > 0) throw new Error(`Unknown argument: ${unknown[0]}`);
  await mkdir(OUTPUT_DIRECTORY, { recursive: true });

  for (let start = 0; start < ARMOR_CAMPAIGN.length; start += CAMPAIGN_CONCURRENCY) {
    const subjects = ARMOR_CAMPAIGN.slice(start, start + CAMPAIGN_CONCURRENCY);
    const results = await Promise.all(subjects.map((subject) => fetchSubject(subject, force)));
    results.forEach((result) => console.info(result));
  }
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
