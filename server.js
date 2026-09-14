import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scrapeRouter from './routes/scrape.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*'
}));

app.use(express.json());

// Rota de teste (para verificar se está online)
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend Instagram Sorteio online!',
    status: 'ok'
  });
});

// Suas rotas
app.use('/api', scrapeRouter);

// Exporta o app (obrigatório no Vercel)
export default app;