// src/api/controllers/knowledge.controller.ts
import { Request, Response } from 'express';
import { addDocumentToKnowledgeBase } from '../../services/knowledge.service';

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!(req as any).file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    
    // Call our new service to process the file
    await addDocumentToKnowledgeBase((req as any).file);
    
    res.status(200).json({ message: `Successfully processed and added '${(req as any).file.originalname}' to the knowledge base.` });
  } catch (error) {
    console.error('File ingestion error:', error);
    res.status(500).json({ error: 'Failed to process the uploaded file.' });
  }
};


