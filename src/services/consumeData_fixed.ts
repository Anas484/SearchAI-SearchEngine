import { getChannel } from "../configs/rabbitConfig.js";
import VectorizeData from "./embeddedText.js";
import { createQdrantConnection } from "../configs/qdrantConfig.js";
import fs from 'fs'
import crypto from 'crypto'

const CHECKPOINT_FILE = "checkpoint.json";

function storyToText(story: any): string {
  return `id: ${story.id}\ncontent: ${story.pageContent}`.trim();
}

// function checkpoint(id: string) {
//   fs.writeSync('checkpoint.json', JSON.stringify({ id }));
// }

const startConsumer = async () => {
  const channel = getChannel();
  const qdrant = await createQdrantConnection();

  const collectionExists = await qdrant.collectionExists('story');
  if (!collectionExists.exists) {
    await qdrant.createCollection('story', {
      vectors: {
        size: 384,
        distance: 'Cosine'
      }
    });
  }

  await channel.assertQueue("db_stream", { durable: true });

  channel.prefetch(10)

  channel.consume("db_stream", async (msg: any) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());

      console.log("Processing:", data.metadata.source);
      if (!data) {
        console.log("No data");
        channel.ack(msg);
        return;
      }
    
      const res = await VectorizeData(storyToText(data));

      const final_data: any  = {
            id: crypto.randomUUID(),
            vector: Array.from(res),
            payload:data
          }
        console.log(final_data);
          await qdrant.upsert('story', {
            points: [final_data]
          });
          console.log('Upserted to Qdrant');
          // checkpoint(data.id);

      channel.ack(msg); 
    } catch (err) {
      console.error(err);
      await channel.purgeQueue("db_stream")
      channel.nack(msg, false, false);
    }
  });
};

export {
    startConsumer
}
