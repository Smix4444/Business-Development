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
    description: "Join our innovative team to work on cutting-edge web applications. You'll collaborate with senior engineers on real-world projects that impact millions of users.",
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
    description: "Work alongside our award-winning design team creating beautiful, user-centered digital experiences for Fortune 500 clients.",
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
    description: "Dive into big data and machine learning projects. Help us build predictive models and create insightful visualizations for our clients.",
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
    description: "Help us develop sustainable solutions for tomorrow's challenges. Research renewable energy technologies and environmental impact strategies.",
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
    description: "Gain hands-on experience in financial modeling, market analysis, and investment research at a leading fintech company.",
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
    description: "Create compelling campaigns across social media, email, and digital advertising. Learn from industry experts in a fast-paced environment.",
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
    description: "Help shape the future of healthcare technology. Work with cross-functional teams to define product roadmaps and features.",
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
    description: "Write engaging content for blogs, websites, and marketing materials. Develop your voice while learning SEO and content strategy.",
    requirements: ["Writing", "SEO", "Research"],
    tags: ["Remote", "Paid", "Part-time"],
    logo: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop"
  }
];
