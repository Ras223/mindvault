const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const { generateEmbeddings, generateChatCompletion } = require('./llm');
const { index } = require('./pinecone');

/**
 * Memecah teks panjang menjadi chunk yang lebih kecil.
 * Pendekatan sederhana berdasarkan jumlah kata/karakter.
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += (chunkSize - overlap);
  }
  return chunks;
}

/**
 * Scraping konten dari sebuah URL
 */
async function scrapeUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'SecondBrainApp/1.0 (Contact: your_email@example.com)'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Hapus tag script, style, nav, footer agar tidak masuk ke teks konten
    $('script, style, nav, footer, header').remove();
    
    // Ambil teks dari body
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text;
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw new Error('Gagal mengekstrak teks dari URL');
  }
}

/**
 * Proses Ingestion (Menyimpan teks atau URL ke Vector DB)
 */
async function ingestContent(content, type = 'text', sourceUrl = '') {
  let textToProcess = content;

  if (type === 'url') {
    textToProcess = await scrapeUrl(content);
    sourceUrl = content;
  }

  if (!textToProcess) {
    throw new Error('Tidak ada teks untuk diproses');
  }

  // 1. Chunking
  const chunks = chunkText(textToProcess);
  console.log(`Extracted text length: ${textToProcess.length}. Chunks generated: ${chunks.length}`);

  if (chunks.length === 0) {
    throw new Error('Tidak ada chunk yang dihasilkan dari teks');
  }

  // 2. Generate Embeddings (batch)
  // Untuk kesederhanaan, kita bisa generate satu-satu atau sekaligus jika API mendukung
  const embeddings = await generateEmbeddings(chunks);
  console.log(`Embeddings generated: ${embeddings.length}`);

  // 3. Simpan ke Pinecone
  const vectors = chunks.map((chunk, i) => {
    // Buat ID unik untuk setiap chunk
    const id = crypto.createHash('md5').update(`${sourceUrl}-${Date.now()}-${i}`).digest('hex');
    
    return {
      id: id,
      values: embeddings[i],
      metadata: {
        text: chunk,
        source: sourceUrl || 'manual-text',
        type: type,
        chunkIndex: i
      }
    };
  });

  console.log(`Vectors prepared: ${vectors.length}`);
  if (vectors.length > 0) {
    console.log(`Sample vector ID: ${vectors[0].id}, values length: ${vectors[0].values?.length}`);
  }

  // Upsert batch ke Pinecone
  await index.upsert({ records: vectors });

  return {
    success: true,
    message: `Berhasil meng-ingest ${vectors.length} chunks.`,
    chunks: vectors.length
  };
}

/**
 * Proses Retrieval & Chat
 */
async function askQuestion(query) {
  // 1. Generate embedding untuk pertanyaan
  const [queryEmbedding] = await generateEmbeddings([query], "query");

  // 2. Cari konteks yang relevan di Pinecone (Top-K = 5)
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true
  });

  // 3. Ekstrak teks dari hasil pencarian
  const contextTexts = queryResponse.matches.map(match => match.metadata.text);

  // 4. Kirim ke LLM bersama pertanyaan
  const answer = await generateChatCompletion(query, contextTexts);

  return {
    answer: answer,
    sources: queryResponse.matches.map(m => m.metadata.source)
  };
}

module.exports = {
  ingestContent,
  askQuestion
};
