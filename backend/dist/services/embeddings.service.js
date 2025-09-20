"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiEmbeddings = void 0;
exports.embedDocuments = embedDocuments;
exports.embedQuery = embedQuery;
const google_genai_1 = require("@langchain/google-genai");
// Use Gemini text embeddings model via LangChain.
const modelName = "text-embedding-004";
exports.geminiEmbeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
    modelName: modelName,
});
async function embedDocuments(texts) {
    return exports.geminiEmbeddings.embedDocuments(texts);
}
async function embedQuery(text) {
    return exports.geminiEmbeddings.embedQuery(text);
}
