// import { json } from "express";
// import { connectRabbitMQ,getChannel } from "../configs/rabbitConfig.js";
// import { PrismaClient } from '@prisma/client'
// import {extractText, chunkByParagraph } from "./chunkPdf.js"
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import fs from 'fs';
// import path from "path";

// const CHECKPOINT_FILE = 'checkpoint.json';
// const directoryPath = "C:\\Users\\anas1\\OneDrive\\Desktop\\Ai_Search_Engine\\books"

// const prisma = new PrismaClient();

// function loadCheckpoint(): string | null {
//   if (!fs.existsSync(CHECKPOINT_FILE)) return null;
//   const data = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'));
//   return data.lastId ?? null;
// }

// const streamDBData = async () => {
//   let lastId: string | null = loadCheckpoint();
//   const channel = getChannel();

//   await channel.assertQueue("db_stream", { durable: true });
//   await channel.purgeQueue("db_stream");
//   const entries = fs.readdirSync(directoryPath);


//   const fileNames = entries.filter((file) => {
//       const fullPath = path.join(directoryPath, file);
//       return fs.lstatSync(fullPath).isFile();
//   });
//   for (const name in fileNames){
//       const pdf = await extractText(name)
//       const allChunks = RecursiveCharacterTextSplitter(pdf,{
//         chunkSize: 500,
//         chunkOverlap: 100,
//       })
//   }
  
//   while (true) {
//     const rows: any = await prisma.poetry.findMany({
//       take: 1,
//       ...(lastId && {
//         cursor: { id: lastId },
//         skip: 1,
//       }),
//       orderBy: { id: "asc" },
//     });

//     if (!rows || rows.length === 0) {
//       console.log("No more data");
//       break;
//     }

//     for (const row of rows) {
//       channel.sendToQueue(
//         "db_stream",
//         Buffer.from(JSON.stringify(row)),
//         { persistent: false }
//       );
//     }

//     lastId = rows[rows.length - 1].id;
    
//     fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify({ lastId }));
//   }
// };

// export {
//     streamDBData
// }
