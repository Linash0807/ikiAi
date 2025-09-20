"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateRoadmap = handleCreateRoadmap;
exports.handleUpdateTask = handleUpdateTask;
const roadmap_service_1 = require("../../services/roadmap.service");
const roadmap_repository_1 = require("../../data-access/roadmap.repository");
const zodSchemas_1 = require("../../utils/zodSchemas");
async function handleCreateRoadmap(req, res) {
    try {
        const userId = req.user.uid;
        const jobDetails = zodSchemas_1.JobDetailsSchema.parse(req.body);
        const result = await (0, roadmap_service_1.createRoadmapForJob)(userId, jobDetails);
        res.status(201).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function handleUpdateTask(req, res) {
    try {
        const userId = req.user.uid;
        const { roadmapId } = req.params;
        const { task, isCompleted } = zodSchemas_1.RoadmapUpdateSchema.parse(req.body);
        await (0, roadmap_repository_1.updateTaskStatus)(userId, roadmapId, task, isCompleted);
        res.status(200).json({ message: "Task updated successfully." });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
