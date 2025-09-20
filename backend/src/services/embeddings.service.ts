import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Use Gemini text embeddings model via LangChain.
const modelName = "text-embedding-004";
export const geminiEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
  modelName: modelName as any,
} as any);

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  return geminiEmbeddings.embedDocuments(texts);
}

export async function embedQuery(text: string): Promise<number[]> {
  return geminiEmbeddings.embedQuery(text);
}


