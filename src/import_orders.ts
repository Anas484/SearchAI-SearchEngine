import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const prisma = new PrismaClient();

type OrderData = {
  id: string;
  userId: string;
  items: string[];
  totalPrice: number;
  date: string;
};

function parseLine(line: string, lineNum: number): OrderData | null {
  const values:any = line.split(',').map(v => v.trim());

  // Need at least: id, userId, 1 item, totalPrice, date
  if (values.length < 5) {
    console.warn(`Line ${lineNum}: insufficient columns (${values.length})`);
    return null;
  }

  const id = values[0];
  const userId = values[1];
  const date = values[values.length - 1];
  const totalPrice = parseFloat(values[values.length - 2]);
  const items = values.slice(2, values.length - 2);

  if (!id || !userId || !date) {
    console.warn(`Line ${lineNum}: missing required fields`);
    return null;
  }

  if (isNaN(totalPrice)) {
    console.warn(`Line ${lineNum}: invalid totalPrice "${values[values.length - 2]}"`);
    return null;
  }

  if (items.length === 0) {
    console.warn(`Line ${lineNum}: no items found`);
    return null;
  }

  return { id, userId, items, totalPrice, date };
}

async function importOrders() {
  const csvFilePath = path.join(process.cwd(), 'orders.csv');

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`File not found: ${csvFilePath}`);
  }

  console.log(`Found file: ${csvFilePath}`);
  console.log(`File size: ${fs.statSync(csvFilePath).size} bytes`);

  await prisma.$connect();
  console.log('Database connected');

  const batch: OrderData[] = [];
  const BATCH_SIZE = 1000;
  let lineNum = 0;
  let totalInserted = 0;
  let skipped = 0;

  const flushBatch = async () => {
    if (batch.length === 0) return;
    const count = batch.length;
    await prisma.order.createMany({ data: batch, skipDuplicates: true });
    totalInserted += count;
    batch.length = 0;
    console.log(`Inserted batch of ${count} — total inserted: ${totalInserted.toLocaleString()}`);
  };

  try {
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      lineNum++;

      // Skip header row
      if (lineNum === 1) {
        console.log(`Header: ${line.substring(0, 80)}`);
        continue;
      }

      const trimmed = line.trim();
      if (!trimmed) continue;

      const order = parseLine(trimmed, lineNum);

      if (!order) {
        skipped++;
        continue;
      }

      batch.push(order);

      if (batch.length >= BATCH_SIZE) {
        await flushBatch();
      }
    }

    // flush any remaining records
    console.log(`Loop done. ${batch.length} records remaining in batch.`);
    await flushBatch();

    console.log(`\n✅ Import complete`);
    console.log(`   Inserted : ${totalInserted.toLocaleString()}`);
    console.log(`   Skipped  : ${skipped.toLocaleString()}`);
    console.log(`   Total    : ${(totalInserted + skipped).toLocaleString()}`);

  } finally {
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}

importOrders().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});