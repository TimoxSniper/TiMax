// Quick Check: Pinecone Index Dimension
// Run: node check-pinecone-dimension.js

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "YOUR_API_KEY";
const INDEX_NAME = "timax-knowledge";

async function checkIndexDimension() {
  try {
    const response = await fetch(
      `https://api.pinecone.io/indexes/${INDEX_NAME}`,
      {
        headers: {
          "Api-Key": PINECONE_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();

    console.log("\n🔍 PINECONE INDEX INFO");
    console.log("======================");
    console.log(`Index Name: ${data.name}`);
    console.log(`Dimension: ${data.dimension}`);
    console.log(`Metric: ${data.metric}`);
    console.log(`Status: ${data.status?.state}`);
    console.log(`Host: ${data.host}`);

    // Validation
    console.log("\n✅ VALIDATION");
    console.log("======================");

    if (data.dimension === 768) {
      console.log("✅ Dimension 768 ist korrekt für text-embedding-004");
    } else {
      console.log(
        `❌ FEHLER: Dimension ist ${data.dimension}, sollte 768 sein!`,
      );
      console.log("\n📋 LÖSUNG:");
      console.log("1. Index löschen: pinecone index delete timax-knowledge");
      console.log(
        "2. Neu erstellen: pinecone index create --name timax-knowledge --dimension 768 --metric cosine",
      );
    }
  } catch (error) {
    console.error("❌ Fehler beim Prüfen des Index:", error.message);
    console.log("\nBitte stelle sicher, dass:");
    console.log("1. PINECONE_API_KEY korrekt gesetzt ist");
    console.log('2. Der Index "timax-knowledge" existiert');
  }
}

checkIndexDimension();
