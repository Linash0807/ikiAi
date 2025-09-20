"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSearch = createJobSearch;
const jobSearch_service_1 = require("../../services/jobSearch.service");
async function createJobSearch(req, res) {
    try {
        const userId = req.user.uid;
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: "Search query is required." });
        }
        const results = await (0, jobSearch_service_1.findPersonalizedJobs)(userId, query);
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
