import express from 'express'
import { connectRabbitMQ } from './configs/rabbitConfig.js';
import { streamPDFData } from './services/streamData.js';
import { startConsumer } from './services/consumeData.js';
import searchRouter from './routes/searchRouter.js';

const app = express();
app.use(express.json());
const startConnection = async () => {
    await connectRabbitMQ();
}
await startConnection();

await streamPDFData()

await startConsumer()

app.use('/search', searchRouter);

app.listen(3000 , ()=>{
    console.log("Server started on 3000")
})