import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.SCRAPE_CREATORS_API_KEY;

export async function getCommentsFromPost(postUrl) {
  if (!API_KEY) {
    throw new Error('SCRAPE_CREATORS_API_KEY não configurada no .env');
  }

  try {
    console.log('Buscando comentários via ScrapeCreators:', postUrl);

    const response = await axios.get(
      'https://api.scrapecreators.com/v2/instagram/post/comments',
      {
        params: {
          url: postUrl,
          // include_replies: false  // deixe false para economizar créditos
        },
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const comments = response.data?.comments || [];

    // Map para remover duplicados pelo username
    const participantsMap = new Map();

    comments.forEach(comment => {
      const user = comment.user;
      if (!user || !user.username) return;

      const username = user.username;

      // Só adiciona se ainda não existir
      if (!participantsMap.has(username)) {
        participantsMap.set(username, {
          username: username,
          profilePic: user.profile_pic_url || null,
          fullName: user.full_name || null
        });
      }
    });

    const participants = Array.from(participantsMap.values());

    console.log(`Total de autores únicos: ${participants.length}`);
    console.log('Autores:', participants.map(p => p.username));

    return participants;

  } catch (error) {
    console.error('Erro na ScrapeCreators:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('API Key inválida');
    }
    if (error.response?.status === 402) {
      throw new Error('Créditos esgotados na ScrapeCreators');
    }
    
    throw new Error(error.response?.data?.message || 'Falha ao buscar comentários');
  }
}