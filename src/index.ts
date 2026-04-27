import express from 'express'
import { connectRabbitMQ } from './configs/rabbitConfig.js';
import { streamPDFData } from './services/streamData.js';
import { startConsumer } from './services/consumeData.js';
import searchRouter from './routes/searchRouter.js';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());
const startConnection = async () => {
    await connectRabbitMQ();
}
await startConnection();

await streamPDFData()

await startConsumer()

app.use('/search', searchRouter);

app.listen(3001 , ()=>{
    console.log("Server started on 3001")
})