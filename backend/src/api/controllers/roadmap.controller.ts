import { Request, Response } from "express";
import { createRoadmapForJob } from "../../services/roadmap.service";
import { updateTaskStatus } from "../../data-access/roadmap.repository";
import { JobDetailsSchema, RoadmapUpdateSchema } from "../../utils/zodSchemas";

export async function handleCreateRoadmap(req: Request, res: Response) {
  try {
    const userId = (req as any).user.uid;
    const jobDetails = JobDetailsSchema.parse(req.body);
    const result = await createRoadmapForJob(userId, jobDetails);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function handleUpdateTask(req: Request, res: Response) {
  try {
    const userId = (req as any).user.uid;
    const { roadmapId } = req.params;
    const { task, isCompleted } = RoadmapUpdateSchema.parse(req.body);
    await updateTaskStatus(userId, roadmapId, task, isCompleted);
    res.status(200).json({ message: "Task updated successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

