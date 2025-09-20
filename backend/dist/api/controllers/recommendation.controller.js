"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecommendation = createRecommendation;
const recommendation_service_1 = require("../../services/recommendation.service");
const recommendation_repository_1 = require("../../data-access/recommendation.repository");
const uuid_1 = require("uuid");
async function createRecommendation(req, res) {
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const ikigaiData = req.body;
        const aiResult = await (0, recommendation_service_1.getAiRecommendation)(ikigaiData, userId);
        const sessionId = (0, uuid_1.v4)();
        await (0, recommendation_repository_1.saveRecommendation)(userId, sessionId, aiResult);
        res.status(201).json({ sessionId, recommendation: aiResult });
    }
    catch (err) {
        res.status(400).json({ error: err.message ?? "Failed to generate recommendation" });
    }
}
