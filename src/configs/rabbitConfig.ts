import amqp from 'amqplib';

let channel : any;

async function connectRabbitMQ() {

  const connection = await amqp.connect('amqp://localhost:5672');
  channel = await connection.createChannel();

  console.log('RabbitMQ connected (DB Stream)');
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ not initialized');
  }
  return channel;
}

export {
  connectRabbitMQ,
  getChannel,
};