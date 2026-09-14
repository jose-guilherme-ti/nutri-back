import express from 'express';
import { getCommentsFromPost } from '../service/instagramScraper.js';

const router = express.Router();

router.post('/comments', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.includes('instagram.com')) {
      return res.status(400).json({ error: 'URL inválida' });
    }

    console.log('URL recebida:', url);

    const participants = await getCommentsFromPost(url);

    res.json({
      participants,          // agora é array de objetos
      total: participants.length
    });

  } catch (err) {
    console.error('ERRO DETALHADO:', err);
    res.status(500).json({
      error: 'Falha ao obter comentários',
      details: err.message
    });
  }
});

export default router;