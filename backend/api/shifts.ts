import { Router } from "express";
import { getDb } from "./backend/src/index.ts";

export const shiftsRouter = Router();

// GET /api/shifts?from=...&to=...
shiftsRouter.get("/", async (req, res) => {
  try {
    const from = req.query.from ? new Date(String(req.query.from)) : null;
    const to = req.query.to ? new Date(String(req.query.to)) : null;

    const filter: any = {};
    if (from || to) {
      filter.shiftstart_datetime = {};
      if (from) filter.shiftstart_datetime.$gte = from;
      if (to) filter.shiftstart_datetime.$lt = to;
    }

    const db = await getDb();
    const docs = await db
      .collection("shifts")
      .find(filter)
      .sort({ shiftstart_datetime: 1 })
      .limit(500)
      .toArray();

    const shifts = docs.map((d: any) => ({
      id: d._id.toString(),
      shiftstart_datetime: d.shiftstart_datetime,
      shiftend_datetime: d.shiftend_datetime,
      site_id: d.site_id,
      position_id: d.position_id,
      worker_id: d.worker_id,
      wage: d.wage ?? 0,
      earnings: d.earnings ?? 0,
      avatar: d.avatar ?? "https://placehold.co/48",
      origin: d.origin ?? "schedule",
    }));

    res.json(shifts);
  } catch (err) {
    console.error("❌ Failed to fetch shifts", err);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});
