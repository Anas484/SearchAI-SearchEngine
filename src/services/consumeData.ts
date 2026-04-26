import { getChannel } from "../configs/rabbitConfig.js";
import VectorizeData from "./embeddedText.js";
import { createQdrantConnection,createCollection } from "../configs/qdrantConfig.js";



function orderToText(order: any) {
    return `
        Order ID: ${order.id}
        User ID: ${order.userId}
        Items: ${Array.isArray(order.items) ? order.items.join(", ") : ""}
        Total Price: ${order.totalPrice}
        Date: ${order.date}
        `.trim();
}
const startConsumer = async () => {
  const channel = getChannel();
  const qdrant = await createQdrantConnection();

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
    
      const res = await VectorizeData(orderToText(data));

      const final_data: any  = {
            id: data.id,
            vector: Array.from(res),
            payload:data
          }
        console.log(final_data);
          await qdrant.upsert('order', {
            points: [final_data]
          });
          console.log('Upserted to Qdrant');


      channel.ack(msg); 
    } catch (err) {
      console.error(err);

      channel.nack(msg, false, false);
    }
  });
};

export {
    startConsumer
}