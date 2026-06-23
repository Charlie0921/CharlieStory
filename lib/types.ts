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
export type Track = { title: string; artist: string; src: string };
export type WindowId = "about" | "projects" | "experience" | "resume" | "contact";
