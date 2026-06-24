export type Domain = "enterprise" | "research" | "product";

export type Project = {
  fileNo: string;
  title: string;
  impact: string;
  org: string;
  status: string;
  domain: Domain;
  category?: string;
  problem: string;
  solution: string;
  stack: string[];
  role: string;
  result: string;
  images: ProjectImage[];
  links: ProjectLinks;
  technicalDetails?: string[];
  riskFormula?: string;
  challenges?: string[];
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectLinks = {
  github: string;
  demo: string;
  caseStudy: string;
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

export type PortfolioExperience = {
  id: string;
  org: string;
  title: string;
  slug: string | null;
  type: string | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  place: string | null;
  logs: string[];
  skills: string[];
  impact: string | null;
  company_url: string | null;
  order_index: number | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SkillGroup = { group: string; items: string };

export type PortfolioProfile = {
  id: string;
  name: string;
  role: string;
  education: string | null;
  grad: string | null;
  resume_url: string | null;
  updated_at?: string;
};

export type PortfolioSkill = {
  id: string;
  skill_group: string;
  items: string;
  order_index: number | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type PortfolioProfileUpdate = {
  name: string;
  role: string;
  education: string | null;
  grad: string | null;
  resume_url: string | null;
};

export type PortfolioSkillUpsert = {
  skill_group: string;
  items: string;
  order_index: number | null;
  is_published: boolean;
};

export type Track = { title: string; artist: string; src: string };
export type Note = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  featured: boolean;
  order: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  notionUrl: string;
};

export type WindowId =
  | "about"
  | "projects"
  | "experience"
  | "resume"
  | "notes"
  | "contact";
