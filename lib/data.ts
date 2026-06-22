import type { Project, Role, SkillGroup, Track, WindowId } from "./types";

export const PROFILE = {
  name: "Kunjoong “Charlie” Kim",
  handle: "Kunjoong Charlie Kim",
  role: "CS @ Penn State · SWE / Business Systems",
  status: "Currently debugging life abroad.",
  intro: "I build software for messy real-world workflows, especially where business operations and engineering meet.",
  bio: "I’m Kunjoong “Charlie” Kim, a Computer Science student at Penn State interested in software engineering, business systems, and practical tools that make real office workflows less painful.",
  bio2: "I like working where technical implementation meets operational reality — from business workflow tools to research, data visualization, and user-facing products.",
  email: "kunmiddle02@gmail.com",
  github: "https://github.com/Charlie0921",
  linkedin: "https://linkedin.com/in/kunjoong-kim",
  resume: "https://drive.google.com/file/d/1WzmfO4L1RtpVr2jOr15AoHt4gZ9gZ7Md/view",
  location: "Pennsylvania / California",
  languages: "English · Korean · Chinese",
  education: "Penn State · B.S. Computer Science · Math minor",
  grad: "Expected May 2027 · GPA 3.7",
  open: "Open to Summer 2027 SWE internships and new-grad conversations",
};

export const DOMAIN_LABEL = { enterprise: "Enterprise", research: "Research", product: "Product" } as const;
export const DOMAIN_COLOR = { enterprise: "#b85d52", research: "#77669b", product: "#557d92" } as const;

export const PROJECTS = ([
  {
    fileNo: "PROJECT-001", title: "Personal Portfolio Website", impact: "Built a full-stack portfolio and lightweight project CMS using native web technologies.", org: "Personal Project", status: "Active", domain: "product",
    problem: "A static portfolio made project updates repetitive and did not reflect the depth of my development journey.",
    solution: "Built a responsive portfolio from scratch with custom Web Components and a Supabase-backed project collection.",
    stack: ["JavaScript", "HTML", "CSS", "Supabase", "PostgreSQL"],
    role: "Designer / Full-Stack Developer",
    result: "Created a maintainable portfolio that publishes project updates without a front-end framework.",
    images: [],
    links: { github: "", demo: "", caseStudy: "" }
  },
  {
    fileNo: "PROJECT-002", title: "Faulty Sewage Pipe AI Detector", impact: "Improved detection precision by 35% and reached a top public leaderboard score in a ROK Air Force AI hackathon.", org: "ROK Air Force AI Hackathon", status: "Hackathon", domain: "research",
    problem: "Maintenance teams needed a faster way to classify defects in sewage-pipe inspection images.",
    solution: "Trained and tuned a YOLOv8 computer-vision model while comparing candidate detection architectures and hyperparameters.",
    stack: ["Python", "YOLOv8", "PyTorch", "NumPy"],
    role: "Machine Learning Developer",
    result: "Raised model precision by 35% and achieved a top public test score.",
    images: [
      { src: "/images/projects/sewagepipe/defect-classification.png", alt: "Sewage pipe defect classification results", caption: "Defect Classification" },
      { src: "/images/projects/sewagepipe/plan.jpeg", alt: "Sewage pipe detector project plan", caption: "Project Plan" }
    ],
    links: { github: "", demo: "", caseStudy: "" }
  },
  {
    fileNo: "PROJECT-003", title: "BeyondClass", impact: "Built an education platform that centralizes competitions, scholarships, and student opportunities.", org: "Penn State Inc.U", status: "Top-6 finalist", domain: "product",
    problem: "Students miss useful academic and extracurricular opportunities because information is scattered across different channels.",
    solution: "Led development of a responsive platform that organizes opportunities into one accessible interface.",
    stack: ["React", "JavaScript", "SCSS", "HTML"], role: "Tech Lead",
    result: "Earned Top-6 finalist recognition and $2,500 in Penn State startup funding.",
    images: [
      { src: "/images/projects/beyondclass/about-us.png", alt: "BeyondClass about us page", caption: "About Us" },
      { src: "/images/projects/beyondclass/details-page.png", alt: "BeyondClass opportunity details page", caption: "Details Page" },
      { src: "/images/projects/beyondclass/opportunities-page.png", alt: "BeyondClass opportunities page", caption: "Opportunities Page" }
    ],
    links: { github: "", demo: "", caseStudy: "" }
  },
  {
    fileNo: "PROJECT-004", title: "PSUStudyFinder", impact: "Won 3rd place at HackPSU 2022 by helping students find classmates in the same courses.", org: "HackPSU 2022", status: "3rd place", domain: "product",
    problem: "Students at a large university often struggle to find classmates and form study groups.",
    solution: "Built an Android app where students add courses, discover peers, and share schedules through a course-based community.",
    stack: ["Java", "Android Studio", "Firebase"], role: "Front-End Developer / UI Designer",
    result: "Placed 3rd among more than 900 HackPSU participants.",
    images: [
      { src: "/images/projects/psu-study-finder/app-preview.png", alt: "PSUStudyFinder mobile app preview", caption: "App Preview" },
      { src: "/images/projects/psu-study-finder/login-and-sign-up-pages.png", alt: "PSUStudyFinder login and sign-up pages", caption: "Login & Sign-up" },
      { src: "/images/projects/psu-study-finder/main-and-course-add-page.png", alt: "PSUStudyFinder main and course add pages", caption: "Course Finder" }
    ],
    links: { github: "", demo: "", caseStudy: "" }
  },
  {
    fileNo: "PROJECT-005", title: "Mapping Space Trash", impact: "Visualized orbital debris from NASA open datasets in an interactive 3D experience.", org: "NASA Space Apps Challenge", status: "Hackathon", domain: "research",
    problem: "Space-debris data is difficult for non-specialists to interpret as raw records and coordinates.",
    solution: "Built a browser-based visualization that maps debris orbiting Earth in three dimensions.",
    stack: ["Three.js", "JavaScript", "HTML", "NASA Open Data"], role: "Front-End Developer",
    result: "Delivered an interactive visualization during the NASA Space Apps Challenge.",
    images: [
      { src: "/images/projects/mapping-space/project-demo.gif", alt: "Mapping Space Trash interactive visualization demo", caption: "Interactive Demo" }
    ],
    links: { github: "", demo: "", caseStudy: "" }
  },
  {
    fileNo: "PROJECT-006", title: "Tanyak Laundry", impact: "Built a real-time laundry-management app used by all 60 residents in a military residence hall.", org: "ROK Air Force", status: "Shipped", domain: "product",
    problem: "Residents repeatedly waited for shared machines and relied on group messages to track availability.",
    solution: "Built a responsive availability and notification system, then iterated from direct user feedback.",
    stack: ["React", "TypeScript", "Supabase", "CSS"], role: "App Developer / Product Designer",
    result: "Increased machine utilization by up to 90% and launched to all 60 residents.",
    images: [
      { src: "/images/projects/tanyak/login-page.png", alt: "Tanyak Laundry login page", caption: "Login Page" },
      { src: "/images/projects/tanyak/home-and-device-settings-page.png", alt: "Tanyak Laundry home and device settings pages", caption: "Home & Device Settings" },
      { src: "/images/projects/tanyak/faq-page.png", alt: "Tanyak Laundry FAQ page", caption: "FAQ Page" }
    ],
    links: { github: "", demo: "", caseStudy: "" }
  }
] satisfies Project[]).reverse();

export const EXPERIENCE: Role[] = [
  { org: "Penn State", title: "Undergraduate Research Assistant (Incoming)", dates: "Fall 2026", place: "University Park, PA", logs: ["Selected for an engineering-focused undergraduate research program.", "Preparing to contribute to technical research involving data analysis, visualization, and system-level thinking."], skills: ["Research", "Data Analysis", "Visualization", "Documentation"], impact: "Selected to develop rigorous research and technical communication skills." },
  { org: "Woongjin Inc.", title: "Business Analyst / Full-Stack Developer Intern", dates: "Summer 2026", place: "Buena Park, CA", logs: ["Supported internal business-system and workflow development projects.", "Translated client discussions and operational requirements into actionable development tasks.", "Worked across business and engineering teams to clarify requirements and implementation priorities."], skills: ["Full-Stack Development", "Business Analysis", "Requirements", "Technical Documentation"], impact: "Connected business operations with technical implementation while respecting client confidentiality." },
  { org: "Republic of Korea Air Force", title: "Ammunition Company Leader & App Developer", dates: "2023–2025", place: "South Korea", logs: ["Led personnel and coordinated responsibilities in a structured military environment.", "Designed and developed Tanyak Laundry around a recurring problem in the residence hall.", "Collected user feedback and shipped improvements to all 60 residents."], skills: ["Leadership", "Operations", "React", "TypeScript", "Supabase"], impact: "Led teams while delivering a product that improved machine utilization by up to 90%." },
  { org: "BeyondClass", title: "Tech Lead", dates: "2022–2023", place: "Penn State", logs: ["Led front-end development for a platform centralizing student competitions, scholarships, and opportunities.", "Translated user feedback into interface and product improvements.", "Coordinated technical work with business and design priorities."], skills: ["React", "JavaScript", "SCSS", "Product Development", "Team Leadership"], impact: "Reached the Penn State Inc.U Top 6 and received $2,500 in startup funding." },
  { org: "Penn State", title: "Learning Assistant · MATH 141", dates: "2022", place: "University Park, PA", logs: ["Led weekly question-and-answer sessions for first-year calculus students.", "Worked with instructors to clarify difficult concepts and support student learning."], skills: ["Teaching", "Communication", "Calculus", "Collaboration"], impact: "Made technical material more approachable through structured peer support." }
];

export const SKILLS: SkillGroup[] = [
  { group: "Languages", items: "TypeScript, JavaScript, Python, Java, C, SQL" },
  { group: "Web", items: "React, Next.js, NestJS, Tailwind CSS, Firebase, Supabase" },
  { group: "Data / ML", items: "PyTorch, OpenCV, NumPy, Pandas, Computer Vision" },
  { group: "Business Systems", items: "Workflow Automation, Requirements Analysis, REST APIs, MSSQL" }
];

export const TRACKS: Track[] = [
  { title: "Haru Haru", artist: "BIGBANG", src: "/audios/haru-haru-inst.mp3" },
  { title: "FOCUS", artist: "Hearts2Hearts", src: "/audios/focus-inst.mp3" }
];

export const WINDOW_META: Record<WindowId, { title: string; subtitle: string; accent: string }> = {
  about: { title: "PROFILE", subtitle: "Owner’s card", accent: "#77669b" },
  projects: { title: "PROJECTS", subtitle: "Selected work", accent: "#557d92" },
  experience: { title: "EXPERIENCE", subtitle: "Roles and leadership", accent: "#b85d52" },
  resume: { title: "RESUME", subtitle: "Skills and experience", accent: "#77669b" },
  contact: { title: "MAILBOX", subtitle: "Send a note", accent: "#557d92" }
};
