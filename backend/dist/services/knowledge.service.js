"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDocumentToKnowledgeBase = void 0;
// src/services/knowledge.service.ts
const vectorstore_service_1 = require("./vectorstore.service");
const uuid_1 = require("uuid");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
/**
 * Extracts text from an uploaded file buffer.
 * Supports PDF and plain text.
 */
const extractTextFromFile = async (file) => {
    if (file.mimetype === 'application/pdf') {
        const data = await (0, pdf_parse_1.default)(file.buffer);
        return data.text;
    }
    else if (file.mimetype === 'text/plain') {
        return file.buffer.toString('utf-8');
    }
    throw new Error(`Unsupported file type: ${file.mimetype}`);
};
/**
 * Processes an uploaded file, chunks its text, and upserts it into the vector store.
 */
const addDocumentToKnowledgeBase = async (file) => {
    // 1. Extract raw text from the file.
    const rawText = await extractTextFromFile(file);
    // 2. A simple but effective chunking strategy: split by paragraphs.
    // We also filter out any very short or empty chunks.
    const chunks = rawText.split(/\n\s*\n/).filter(chunk => chunk.trim().length > 20);
    if (chunks.length === 0) {
        console.warn(`No valid text chunks found in document: ${file.originalname}`);
        return;
    }
    // 3. Prepare the documents for the vector store, adding metadata.
    const documentsToUpsert = chunks.map(chunk => ({
        id: (0, uuid_1.v4)(), // Each chunk needs a unique ID.
        text: chunk,
        metadata: {
            source: file.originalname,
            uploadedAt: new Date().toISOString(),
        },
    }));
    // 4. Call our existing vector store service to handle the embedding and database insertion.
    console.log(`Ingesting ${documentsToUpsert.length} chunks from ${file.originalname} into the knowledge base...`);
    await (0, vectorstore_service_1.upsertDocuments)(documentsToUpsert);
    console.log("Ingestion complete.");
};
exports.addDocumentToKnowledgeBase = addDocumentToKnowledgeBase;
