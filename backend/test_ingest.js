require('dotenv').config();
const { ingestContent, scrapeUrl, chunkText } = require('./services/rag');

async function test() {
  try {
    console.log("Memulai ingest Wikipedia...");
    const result = await ingestContent('https://id.wikipedia.org/wiki/Reksa_dana', 'url');
    console.log("Berhasil:", result);
  } catch (error) {
    console.error("Gagal:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

test();
