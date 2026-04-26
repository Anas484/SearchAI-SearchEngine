import { getChannel } from "../configs/rabbitConfig.js";
import { extractText } from "./chunkPdf.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";

const directoryPath = "C:\\Users\\anas1\\OneDrive\\Desktop\\Ai_Search_Engine\\books";

const streamPDFData = async () => {
  const channel = getChannel();

  await channel.assertQueue("db_stream", { durable: true });
  await channel.purgeQueue("db_stream");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const fullPath = path.join(directoryPath, file);

    if (!fs.lstatSync(fullPath).isFile()) continue;

    console.log("Processing PDF:", file);

    // extractText returns Document[], not a string
    const docs = await extractText(fullPath);

    // Sanitize each doc's pageContent before splitting
    const safeDocs = docs.map((doc) => ({
      pageContent: String(doc.pageContent ?? ""),
      metadata: { ...doc.metadata, source: file },
    }));

    const chunks = await splitter.splitDocuments(safeDocs);

    for (const chunk of chunks) {
      channel.sendToQueue(
        "db_stream",
        Buffer.from(JSON.stringify(chunk)),
        { persistent: false }
      );
    }

    console.log(`Sent ${chunks.length} chunks for: ${file}`);
  }
};

export { streamPDFData };