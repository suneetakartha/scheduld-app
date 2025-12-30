import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { MongoClient, Db } from "mongodb";

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------
// ENV + CONFIG
// ---------------------------
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://mongo:27017/myapp"; // works in Docker
const DB_NAME = process.env.MONGODB_DB || "myapp";

// ---------------------------
// MONGO CONNECTION (lazy + reused)
// ---------------------------
let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (db) return db;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  return db;
}

// ---------------------------
// ROUTES
// ---------------------------

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/shifts", async (req, res) => {
  try {
    const database = await getDb();
    const collection = database.collection("shifts");

    const from = req.query.from ? new Date(String(req.query.from)) : null;
    const to = req.query.to ? new Date(String(req.query.to)) : null;

    const filter: any = {};
    if (from || to) {
      filter.shiftstart_datetime = {};
      if (from) filter.shiftstart_datetime.$gte = from;
      if (to) filter.shiftstart_datetime.$lt = to;
    }

    const docs = await collection
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
  } catch (err: any) {
    console.error("❌ Failed to fetch shifts");
    console.error(err);
    console.error(err?.stack);
    res.status(500).json({ error: err?.message || "Failed to fetch shifts" });
  }
});

// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
});
