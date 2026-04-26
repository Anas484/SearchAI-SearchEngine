import { json } from "express";
import { connectRabbitMQ,getChannel } from "../configs/rabbitConfig.js";
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();


const streamDBData = async () => {
  let lastId: string | null = null;
  const channel = getChannel();

  await channel.assertQueue("db_stream", { durable: true });
  await channel.purgeQueue("db_stream");

  while (true) {
    const rows: any = await prisma.order.findMany({
      take: 1,
      ...(lastId && {
        cursor: { id: lastId },
        skip: 1,
      }),
      orderBy: { id: "asc" },
    });

    if (!rows || rows.length === 0) {
      console.log("No more data");
      break;
    }

    for (const row of rows) {
      channel.sendToQueue(
        "db_stream",
        Buffer.from(JSON.stringify(row)),
        { persistent: false }
      );
    }

    lastId = rows[rows.length - 1].id;
  }
};

export {
    streamDBData
}
