export type Domain = "enterprise" | "research" | "product";

export type Project = {
  fileNo: string;
  title: string;
  impact: string;
  org: string;
  status: string;
  domain: Domain;
  problem: string;
  solution: string;
  stack: string[];
  role: string;
  result: string;
};

export type Role = {
  org: string;
  title: string;
  dates: string;
  place: string;
  logs: string[];
  skills: string[];
  impact: string;
};

export type SkillGroup = { group: string; items: string };
export type Track = { title: string; artist: string };
export type WindowId = "about" | "projects" | "experience" | "resume" | "contact" | "playlist";
