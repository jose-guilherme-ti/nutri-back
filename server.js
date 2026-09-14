import express from 'express';
import cors from 'cors';
import scrapeRouter from './routes/scrape.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api', scrapeRouter);

app.listen(3001, '0.0.0.0', () => {
  console.log('Servidor rodando em http://0.0.0.0:3001');
});