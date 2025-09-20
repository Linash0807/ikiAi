// src/services/knowledge.service.ts
import { upsertDocuments } from './vectorstore.service';
import { v4 as uuidv4 } from 'uuid';
import pdf from 'pdf-parse';

/**
 * Extracts text from an uploaded file buffer.
 * Supports PDF and plain text.
 */
const extractTextFromFile = async (file: any): Promise<string> => {
  if (file.mimetype === 'application/pdf') {
    const data = await pdf(file.buffer);
    return data.text;
  } else if (file.mimetype === 'text/plain') {
    return file.buffer.toString('utf-8');
  }
  throw new Error(`Unsupported file type: ${file.mimetype}`);
};

/**
 * Processes an uploaded file, chunks its text, and upserts it into the vector store.
 */
export const addDocumentToKnowledgeBase = async (file: any) => {
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
    id: uuidv4(), // Each chunk needs a unique ID.
    text: chunk,
    metadata: {
      source: file.originalname,
      uploadedAt: new Date().toISOString(),
    },
  }));

  // 4. Call our existing vector store service to handle the embedding and database insertion.
  console.log(`Ingesting ${documentsToUpsert.length} chunks from ${file.originalname} into the knowledge base...`);
  await upsertDocuments(documentsToUpsert);
  console.log("Ingestion complete.");
};

