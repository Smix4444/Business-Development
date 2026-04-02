export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  description: string;
  requirements: string[];
  tags: string[];
  logo: string;
}

export const mockInternships: Internship[] = [
  {
    id: "1",
    company: "TechCorp Solutions",
    role: "Software Engineering Intern",
    location: "Brussels",
    duration: "3 months",
    description: "Join our innovative engineering team to build and ship features used by over 2 million users across Europe. You'll work directly with senior engineers in agile sprints, attend architecture reviews, and contribute to our React/Node.js platform from day one. Expect real responsibilities, meaningful code reviews, and a steep learning curve in the best possible way.",
    requirements: ["React", "TypeScript", "Node.js"],
    tags: ["Remote", "Paid", "Full-time"],
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    company: "Design Studio Pro",
    role: "UX/UI Design Intern",
    location: "Antwerp",
    duration: "6 months",
    description: "Work alongside our award-winning design team to craft beautiful, intuitive digital experiences for Fortune 500 clients across retail, finance, and healthcare. You'll own design tasks end-to-end — from user interviews and wireframes in Figma to final handoff to engineers. Our team believes great design is driven by empathy and data, and you'll be expected to bring both.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research"],
    tags: ["On-site", "Paid", "Part-time"],
    logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop"
  },
  {
    id: "3",
    company: "DataViz Analytics",
    role: "Data Science Intern",
    location: "Ghent",
    duration: "4 months",
    description: "Dive deep into large datasets and machine learning pipelines that power real-time decisions for our clients in logistics and e-commerce. You'll build and validate predictive models, create stunning visualisations in Python and Tableau, and collaborate with data engineers to bring your models to production. Previous experience with Jupyter notebooks and cloud environments is a plus.",
    requirements: ["Python", "SQL", "Machine Learning"],
    tags: ["Hybrid", "Paid", "Full-time"],
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop"
  },
  {
    id: "4",
    company: "GreenTech Innovations",
    role: "Sustainability Analyst Intern",
    location: "Bruges",
    duration: "3 months",
    description: "At GreenTech, we're on a mission to make Belgian industry carbon-neutral by 2030. As a Sustainability Analyst Intern, you'll research renewable energy solutions, build environmental impact reports, and present findings directly to corporate clients. You'll work with our policy team and have the opportunity to attend EU sustainability conferences. Make your internship matter — literally.",
    requirements: ["Environmental Science", "Data Analysis", "Research"],
    tags: ["Remote", "Paid", "Full-time"],
    logo: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=400&fit=crop"
  },
  {
    id: "5",
    company: "FinanceFlow",
    role: "Financial Analyst Intern",
    location: "Leuven",
    duration: "6 months",
    description: "FinanceFlow is one of Belgium's fastest-growing fintech companies, processing over €2B in transactions annually. As a Financial Analyst Intern, you'll build financial models, monitor market trends, and support our investment team with structured research reports. You'll get hands-on exposure to Bloomberg terminals, Excel-based modelling, and cross-team collaboration with our risk and compliance departments.",
    requirements: ["Finance", "Excel", "Financial Modeling"],
    tags: ["On-site", "Paid", "Full-time"],
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop"
  },
  {
    id: "6",
    company: "Marketing Minds",
    role: "Digital Marketing Intern",
    location: "Liege",
    duration: "3 months",
    description: "Marketing Minds runs campaigns for over 80 Belgian and international brands. As our Digital Marketing Intern, you'll manage real ad budgets on Meta and Google, write copy for email campaigns, track performance with GA4, and sit in on strategy sessions with senior brand managers. We move fast, we experiment constantly, and we expect you to bring creative ideas and the data chops to back them up.",
    requirements: ["Social Media", "Content Creation", "Analytics"],
    tags: ["Hybrid", "Paid", "Part-time"],
    logo: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=400&fit=crop"
  },
  {
    id: "7",
    company: "HealthTech Labs",
    role: "Product Management Intern",
    location: "Namur",
    duration: "4 months",
    description: "Join HealthTech Labs and help shape the future of digital healthcare in Belgium. You'll work directly with our CPO to define product roadmaps, write user stories, run usability tests, and coordinate between engineering and clinical teams. Our platform is used by over 120 hospitals and clinics, so your work has a real impact on patient outcomes. Bring your curiosity, your structure, and your user obsession.",
    requirements: ["Product Strategy", "User Stories", "Agile"],
    tags: ["Remote", "Paid", "Full-time"],
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop"
  },
  {
    id: "8",
    company: "Creative Content Co",
    role: "Content Writing Intern",
    location: "Hasselt",
    duration: "3 months",
    description: "Creative Content Co produces editorial and SEO content for over 30 clients ranging from startups to established Belgian media brands. As a Content Writing Intern, you'll write long-form articles, optimise existing content for search, conduct keyword research, and contribute to our editorial calendar. You'll get mentorship from experienced journalists and content strategists, and your bylines will appear on real publications.",
    requirements: ["Writing", "SEO", "Research"],
    tags: ["Remote", "Paid", "Part-time"],
    logo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop"
  }
];
