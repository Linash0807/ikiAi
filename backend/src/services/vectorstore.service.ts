import { ChromaClient, IncludeEnum } from "chromadb";
import { embedDocuments, embedQuery } from "./embeddings.service";

const client = new ChromaClient();
const COLLECTION_NAME = "ikigai_knowledge";

export async function getOrCreateCollection() {
  try {
    return await client.getCollection({ name: COLLECTION_NAME });
  } catch {
    return await client.createCollection({ name: COLLECTION_NAME });
  }
}

export async function upsertDocuments(docs: { id: string; text: string; metadata?: Record<string, any> }[]) {
  const collection = await getOrCreateCollection();
  const ids = docs.map((d) => d.id);
  const metadatas = docs.map((d) => d.metadata || {});
  const embeddingsVectors = await embedDocuments(docs.map((d) => d.text));
  await collection.upsert({ ids, embeddings: embeddingsVectors, metadatas, documents: docs.map((d) => d.text) });
}

export async function queryRelevant(text: string, k = 4) {
  const collection = await getOrCreateCollection();
  const queryEmbedding = await embedQuery(text);
  const results = await collection.query({ queryEmbeddings: [queryEmbedding], nResults: k, include: [IncludeEnum.Documents, IncludeEnum.Metadatas] });
  const docs = results.documents?.[0] || [];
  const metas = results.metadatas?.[0] || [];
  return docs.map((doc: string, i: number) => ({ text: doc, metadata: metas[i] }));
}


