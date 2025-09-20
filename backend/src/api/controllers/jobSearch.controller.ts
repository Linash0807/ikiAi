import { Request, Response } from "express";
import { findPersonalizedJobs } from "../../services/jobSearch.service";

export async function createJobSearch(req: Request, res: Response) {
  try {
    const userId = (req as any).user.uid;
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }
    const results = await findPersonalizedJobs(userId, query);
    res.status(200).json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
