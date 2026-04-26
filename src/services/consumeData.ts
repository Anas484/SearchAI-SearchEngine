import { getChannel } from "../configs/rabbitConfig.js";
import VectorizeData from "./embeddedText.js";
import { createQdrantConnection } from "../configs/qdrantConfig.js";



function poetryToText(poetry: any): string {
  return `id: ${poetry.id}\npoetry: ${poetry.poetry}`.trim();
}

const startConsumer = async () => {
  const channel = getChannel();
  const qdrant = await createQdrantConnection();

  const collectionExists = await qdrant.collectionExists('poetry');
  if (!collectionExists.exists) {
    await qdrant.createCollection('poetry', {
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

      console.log("Processing:", data.id);
      if (!data) {
        console.log("No data");
        channel.ack(msg);
        return;
      }
    
      const res = await VectorizeData(poetryToText(data));

      const final_data: any  = {
            id: data.id,
            vector: Array.from(res),
            payload:data
          }
        console.log(final_data);
          await qdrant.upsert('poetry', {
            points: [final_data]
          });
          console.log('Upserted to Qdrant');


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