import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface PoetryRecord {
  id: string;
  poetry: string;
}

function parseCSV(content: string): PoetryRecord[] {
  const records: PoetryRecord[] = [];
  let i = 0;

  // Skip header line
  while (i < content.length && content[i] !== '\n') i++;
  i++; // move past the newline

  while (i < content.length) {
    // Skip blank lines
    if (content[i] === '\n' || content[i] === '\r') {
      i++;
      continue;
    }

    // Parse id (everything up to first comma)
    let id = '';
    while (i < content.length && content[i] !== ',') {
      id += content[i++];
    }
    id = id.trim();
    i++; // skip the comma

    // Parse poetry field (may be quoted and span multiple lines)
    let poetry = '';
    if (content[i] === '"') {
      i++; // skip opening quote
      while (i < content.length) {
        if (content[i] === '"' && content[i + 1] === '"') {
          // escaped quote
          poetry += '"';
          i += 2;
        } else if (content[i] === '"') {
          i++; // skip closing quote
          break;
        } else {
          poetry += content[i++];
        }
      }
    } else {
      // unquoted field — read until newline
      while (i < content.length && content[i] !== '\n' && content[i] !== '\r') {
        poetry += content[i++];
      }
    }

    poetry = poetry.trim();

    if (id && poetry) {
      records.push({ id, poetry });
    }

    // Skip to next line
    while (i < content.length && (content[i] === '\n' || content[i] === '\r')) {
      i++;
    }
  }

  return records;
}

async function insertPoetryData() {
  const csvFilePath = path.join(process.cwd(), 'poetry_data.csv');

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`File not found: ${csvFilePath}`);
  }

  console.log(`Found: ${csvFilePath}`);
  console.log(`Size: ${fs.statSync(csvFilePath).size} bytes`);

  const content = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parseCSV(content);
  console.log(`Parsed ${records.length} records`);

  if (records.length === 0) {
    console.log('No records to insert');
    return;
  }

  await prisma.$connect();
  console.log('Database connected');

  const BATCH_SIZE = 50;
  let totalInserted = 0;

  try {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);
      await prisma.poetry.createMany({
        data: batch,
        skipDuplicates: true,
      });
      totalInserted += batch.length;
      console.log(`Inserted ${totalInserted} / ${records.length}`);
    }

    const count = await prisma.poetry.count();
    console.log(`\n✅ Import complete`);
    console.log(`   Inserted : ${totalInserted.toLocaleString()}`);
    console.log(`   DB total : ${count.toLocaleString()}`);

  } finally {
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}

insertPoetryData().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});