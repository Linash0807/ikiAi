"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewSession = exports.getSessionDetails = exports.listUserSessions = exports.postChatMessage = void 0;
const chat_service_1 = require("../../services/chat.service");
const zodSchemas_1 = require("../../utils/zodSchemas");
const chat_repository_1 = require("../../data-access/chat.repository");
const postChatMessage = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId } = req.params;
        const parsedBody = zodSchemas_1.ChatInputSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid request body", details: parsedBody.error.errors });
        }
        const newMessage = parsedBody.data;
        const aiResponse = await (0, chat_service_1.handleChatMessage)(userId, sessionId, newMessage);
        res.status(200).json({ reply: aiResponse });
    }
    catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({ error: "Failed to process chat message." });
    }
};
exports.postChatMessage = postChatMessage;
const listUserSessions = async (req, res) => {
    try {
        const userId = req.user.uid;
        const sessions = await (0, chat_repository_1.getUserSessions)(userId);
        res.status(200).json(sessions);
    }
    catch (error) {
        console.error("Error listing user sessions:", error);
        res.status(500).json({ error: "Failed to retrieve sessions." });
    }
};
exports.listUserSessions = listUserSessions;
const getSessionDetails = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { sessionId } = req.params;
        const messages = await (0, chat_repository_1.getSessionMessages)(userId, sessionId);
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error getting session details:", error);
        res.status(500).json({ error: "Failed to retrieve session messages." });
    }
};
exports.getSessionDetails = getSessionDetails;
const startNewSession = async (req, res) => {
    try {
        const userId = req.user.uid;
        const sessionId = await (0, chat_repository_1.createNewSession)(userId);
        res.status(201).json({ sessionId });
    }
    catch (error) {
        console.error("Error starting new session:", error);
        res.status(500).json({ error: "Failed to start a new session." });
    }
};
exports.startNewSession = startNewSession;
