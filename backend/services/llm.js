const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// Pilih model yang sesuai dari NVIDIA NIM
const EMBEDDING_MODEL = 'nvidia/nv-embedqa-e5-v5'; // Model embedding yang sering digunakan di NIM
const CHAT_MODEL = 'meta/llama-3.1-70b-instruct'; // Model chat

const axios = require('axios');

/**
 * Generate Embeddings untuk array of texts
 */
async function generateEmbeddings(texts, inputType = "passage") {
  const response = await axios.post(
    'https://integrate.api.nvidia.com/v1/embeddings',
    {
      model: EMBEDDING_MODEL,
      input: texts,
      input_type: inputType,
      encoding_format: "float",
      truncate: "NONE"
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );
  return response.data.data.map(item => item.embedding);
}

/**
 * Chat Completion dengan konteks
 */
async function generateChatCompletion(query, contextTexts) {
  const systemPrompt = `Anda adalah "Second Brain", asisten AI untuk pengetahuan pribadi. 
Jawab pertanyaan hanya berdasarkan konteks yang diberikan di bawah ini.
Jika konteks tidak mengandung jawaban yang relevan, katakan bahwa Anda tidak memiliki informasi tersebut di arsip.

Konteks:
${contextTexts.join('\n\n')}
`;

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query }
    ],
    temperature: 0.2,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateEmbeddings,
  generateChatCompletion
};
