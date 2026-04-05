/**
 * Module-level in-memory store for Vercel Serverless Functions.
 * Seeded with demo data on first import (per cold start).
 * NOTE: Data resets on each cold start — fine for demo/portfolio use.
 */
const bcrypt = require('bcryptjs');

let _seq = { users: 0, internships: 0, applications: 0 };
let users = [];
let internships = [];
let applications = [];

function nextId(table) {
  _seq[table] = (_seq[table] || 0) + 1;
  return _seq[table];
}

// ─── Seed ────────────────────────────────────────────────────────────────────
const passwordHash = bcrypt.hashSync('password123', 10);

const studentUser = {
  id: nextId('users'),
  email: 'student@demo.com',
  password_hash: passwordHash,
  role: 'student',
  name: 'Alex Johnson',
  bio: '',
  photo: null,
  cv_file: null,
  company_name: '',
  created_at: new Date().toISOString(),
};

const companyUser = {
  id: nextId('users'),
  email: 'company@demo.com',
  password_hash: passwordHash,
  role: 'company',
  name: 'Sarah Chen',
  bio: '',
  photo: null,
  cv_file: null,
  company_name: 'TechCorp Solutions',
  created_at: new Date().toISOString(),
};

users.push(studentUser, companyUser);

const internshipSeed = [
  { company: 'TechCorp Solutions', role: 'Software Engineering Intern', location: 'San Francisco, CA', duration: '3 months', description: "Join our innovative team to work on cutting-edge web applications. You'll collaborate with senior engineers on real-world projects that impact millions of users.", requirements: ['React', 'TypeScript', 'Node.js'], tags: ['Remote', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop' },
  { company: 'Design Studio Pro', role: 'UX/UI Design Intern', location: 'New York, NY', duration: '6 months', description: 'Work alongside our award-winning design team creating beautiful, user-centered digital experiences for Fortune 500 clients.', requirements: ['Figma', 'Adobe Creative Suite', 'User Research'], tags: ['On-site', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop' },
  { company: 'DataViz Analytics', role: 'Data Science Intern', location: 'Boston, MA', duration: '4 months', description: 'Dive into big data and machine learning projects. Help us build predictive models and create insightful visualisations.', requirements: ['Python', 'SQL', 'Machine Learning'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop' },
  { company: 'GreenTech Innovations', role: 'Sustainability Analyst Intern', location: 'Seattle, WA', duration: '3 months', description: "Help us develop sustainable solutions for tomorrow's challenges. Research renewable energy technologies and environmental impact strategies.", requirements: ['Environmental Science', 'Data Analysis', 'Research'], tags: ['Remote', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=400&fit=crop' },
  { company: 'FinanceFlow', role: 'Financial Analyst Intern', location: 'Chicago, IL', duration: '6 months', description: 'Gain hands-on experience in financial modelling, market analysis, and investment research at a leading fintech company.', requirements: ['Finance', 'Excel', 'Financial Modeling'], tags: ['On-site', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop' },
  { company: 'Marketing Minds', role: 'Digital Marketing Intern', location: 'Los Angeles, CA', duration: '3 months', description: 'Create compelling campaigns across social media, email, and digital advertising. Learn from industry experts.', requirements: ['Social Media', 'Content Creation', 'Analytics'], tags: ['Hybrid', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=400&fit=crop' },
  { company: 'HealthTech Labs', role: 'Product Management Intern', location: 'Austin, TX', duration: '4 months', description: 'Help shape the future of healthcare technology. Work with cross-functional teams to define product roadmaps.', requirements: ['Product Strategy', 'User Stories', 'Agile'], tags: ['Remote', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop' },
  { company: 'Creative Content Co', role: 'Content Writing Intern', location: 'Portland, OR', duration: '3 months', description: 'Write engaging content for blogs, websites, and marketing materials. Develop your voice while learning SEO.', requirements: ['Writing', 'SEO', 'Research'], tags: ['Remote', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop' },
];

internshipSeed.forEach(i => {
  internships.push({
    id: nextId('internships'),
    company_id: companyUser.id,
    ...i,
    created_at: new Date().toISOString(),
  });
});

// ─── Public API ───────────────────────────────────────────────────────────────
const store = {
  // Users
  findUserByEmail: (email) => users.find(u => u.email === email) || null,
  findUserById: (id) => users.find(u => u.id === id) || null,
  createUser({ email, passwordHash, role, name = '', companyName = '' }) {
    const user = {
      id: nextId('users'),
      email,
      password_hash: passwordHash,
      role,
      name,
      bio: '',
      photo: null,
      cv_file: null,
      company_name: companyName,
      created_at: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },
  updateUser(id, updates) {
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const allowed = ['name', 'bio', 'photo', 'cv_file', 'company_name'];
    allowed.forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        users[idx][key] = updates[key];
      }
    });
    return users[idx];
  },

  // Internships
  getAllInternships: () => internships.slice().reverse(),
  createInternship({ companyId, company, role, location, duration, description, requirements, tags, logo }) {
    const internship = {
      id: nextId('internships'),
      company_id: companyId,
      company, role, location, duration, description,
      requirements: requirements || [],
      tags: tags || [],
      logo: logo || null,
      created_at: new Date().toISOString(),
    };
    internships.push(internship);
    return internship;
  },
  findInternshipById: (id) => internships.find(i => i.id === id) || null,
  deleteInternship(id) {
    internships = internships.filter(i => i.id !== id);
  },

  // Applications
  getApplicationsByStudent(studentId) {
    return applications
      .filter(a => a.student_id === studentId)
      .map(a => ({ ...a, internship: internships.find(i => i.id === a.internship_id) }))
      .reverse();
  },
  getApplicationsByCompany(companyId) {
    return applications
      .filter(a => {
        const internship = internships.find(i => i.id === a.internship_id);
        return internship && internship.company_id === companyId;
      })
      .map(a => ({
        ...a,
        internship: internships.find(i => i.id === a.internship_id),
        student: users.find(u => u.id === a.student_id),
      }))
      .reverse();
  },
  findApplication: (studentId, internshipId) =>
    applications.find(a => a.student_id === studentId && a.internship_id === internshipId) || null,
  createApplication({ studentId, internshipId, message }) {
    const application = {
      id: nextId('applications'),
      student_id: studentId,
      internship_id: internshipId,
      message,
      status: 'pending',
      applied_at: new Date().toISOString(),
    };
    applications.push(application);
    return application;
  },
  updateApplicationStatus(id, status) {
    const idx = applications.findIndex(a => a.id === id);
    if (idx !== -1) applications[idx].status = status;
  },
};

module.exports = store;
