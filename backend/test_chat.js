require('dotenv').config();
const { askQuestion } = require('./services/rag');

async function test() {
  try {
    console.log("Memulai chat...");
    const result = await askQuestion("Apa itu reksadana?");
    console.log("Berhasil:", result);
  } catch (error) {
    console.error("Gagal:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

test();
