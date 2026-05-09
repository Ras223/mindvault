require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ingestContent, askQuestion } = require('./services/rag');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint untuk cek status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Second Brain Backend is running' });
});

// Endpoint untuk ingest dokumen (teks atau link)
app.post('/api/ingest', async (req, res) => {
  try {
    const { content, type } = req.body;
    // content: string (teks atau url)
    // type: 'text' | 'url'
    
    if (!content) {
      return res.status(400).json({ error: 'Content tidak boleh kosong' });
    }

    const result = await ingestContent(content, type || 'text');
    res.json(result);
  } catch (error) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk chat/RAG
app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query tidak boleh kosong' });
    }

    const result = await askQuestion(query);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Second Brain Backend running on http://localhost:${PORT}`);
});
