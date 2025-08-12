import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch projects
app.get("/projects", async (req, res) => {
  const { data, error } = await supabase.from("projects").select("*");

  console.log(data);
  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Database fetch error" });
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
