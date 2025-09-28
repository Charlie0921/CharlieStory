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

app.get("/", (req, res) => {
  res.send("Backend is running. Try /projects");
});

// Fetch projects
// Fetch projects with details joined
app.get("/projects", async (req, res) => {
  const { data, error } = await supabase.from("projects").select(`
      project_id,
      project_title,
      project_date,
      project_description,
      project_skills,
      project_position,
      project_github,
      project_website,
      project_image,
      details:project_detail (
        id,
        project_inspirations,
        project_whatitdoes,
        project_challenges,
        project_resolutions,
        project_accomplishments,
        project_lessons,
        project_improvements
      )
    `);

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
