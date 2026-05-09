require('dotenv').config();
const { index } = require('./services/pinecone');

async function testPinecone() {
  console.log("Upserting 1 dummy vector...");
  const dummyVector = {
    id: "dummy-id-1",
    values: new Array(1024).fill(0.1),
    metadata: { text: "hello world" }
  };
  
  try {
    await index.upsert(dummyVector);
    console.log("Berhasil upsert dummyVector!");
  } catch (error) {
    console.error("Gagal 1:", error.message);
  }
  
  try {
    await index.upsert([dummyVector]);
    console.log("Berhasil upsert [dummyVector]!");
  } catch (error) {
    console.error("Gagal 2:", error.message);
  }

  try {
    await index.upsert({ records: [dummyVector] });
    console.log("Berhasil upsert { records: [dummyVector] }!");
  } catch (error) {
    console.error("Gagal 3:", error.message);
  }
}

testPinecone();
