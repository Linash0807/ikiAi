"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCollection = getOrCreateCollection;
exports.upsertDocuments = upsertDocuments;
exports.queryRelevant = queryRelevant;
const chromadb_1 = require("chromadb");
const embeddings_service_1 = require("./embeddings.service");
const client = new chromadb_1.ChromaClient();
const COLLECTION_NAME = "ikigai_knowledge";
async function getOrCreateCollection() {
    try {
        return await client.getCollection({ name: COLLECTION_NAME });
    }
    catch {
        return await client.createCollection({ name: COLLECTION_NAME });
    }
}
async function upsertDocuments(docs) {
    const collection = await getOrCreateCollection();
    const ids = docs.map((d) => d.id);
    const metadatas = docs.map((d) => d.metadata || {});
    const embeddingsVectors = await (0, embeddings_service_1.embedDocuments)(docs.map((d) => d.text));
    await collection.upsert({ ids, embeddings: embeddingsVectors, metadatas, documents: docs.map((d) => d.text) });
}
async function queryRelevant(text, k = 4) {
    const collection = await getOrCreateCollection();
    const queryEmbedding = await (0, embeddings_service_1.embedQuery)(text);
    const results = await collection.query({ queryEmbeddings: [queryEmbedding], nResults: k, include: [chromadb_1.IncludeEnum.Documents, chromadb_1.IncludeEnum.Metadatas] });
    const docs = results.documents?.[0] || [];
    const metas = results.metadatas?.[0] || [];
    return docs.map((doc, i) => ({ text: doc, metadata: metas[i] }));
}
