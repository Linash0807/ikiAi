"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = void 0;
const knowledge_service_1 = require("../../services/knowledge.service");
const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // Call our new service to process the file
        await (0, knowledge_service_1.addDocumentToKnowledgeBase)(req.file);
        res.status(200).json({ message: `Successfully processed and added '${req.file.originalname}' to the knowledge base.` });
    }
    catch (error) {
        console.error('File ingestion error:', error);
        res.status(500).json({ error: 'Failed to process the uploaded file.' });
    }
};
exports.handleFileUpload = handleFileUpload;
