"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testProfile = testProfile;
exports.testRecommendation = testRecommendation;
exports.testChat = testChat;
exports.testJobs = testJobs;
exports.testRoadmap = testRoadmap;
const user_repository_1 = require("../../data-access/user.repository");
const recommendation_service_1 = require("../../services/recommendation.service");
const jobSearch_service_1 = require("../../services/jobSearch.service");
const roadmap_service_1 = require("../../services/roadmap.service");
const chat_service_1 = require("../../services/chat.service");
async function testProfile(req, res) {
    try {
        const userId = req.params.userId;
        const profile = await (0, user_repository_1.getUserProfile)(userId);
        res.status(200).json(profile);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function testRecommendation(req, res) {
    try {
        const userId = req.params.userId;
        // Sample Ikigai input
        const ikigaiData = {
            interests: ["AI", "Healthcare"],
            skills: ["Python", "Data Analysis"],
            values: ["Impact", "Growth"],
        };
        const result = await (0, recommendation_service_1.getAiRecommendation)(ikigaiData, userId);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function testChat(req, res) {
    try {
        const userId = req.params.userId;
        const sessionId = "test-session";
        const newMessage = { content: "What jobs fit my skills?" };
        // Run the chat workflow
        const aiResponse = await (0, chat_service_1.handleChatMessage)(userId, sessionId, newMessage);
        res.status(200).json({ role: "ai", content: aiResponse });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function testJobs(req, res) {
    try {
        const userId = req.params.userId;
        const query = "AI jobs in India";
        const result = await (0, jobSearch_service_1.findPersonalizedJobs)(userId, query);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function testRoadmap(req, res) {
    try {
        const userId = req.params.userId;
        const jobDetails = {
            title: "Cloud Solutions Architect",
            company: "Microsoft",
            location: "Bangalore, India",
            description: "Design and implement cloud infrastructure for enterprise clients...",
            url: "https://careers.microsoft.com/"
        };
        const result = await (0, roadmap_service_1.createRoadmapForJob)(userId, jobDetails);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
