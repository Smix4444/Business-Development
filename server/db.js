/**
 * Simple file-based JSON database — no native deps required.
 * Data persists in server/data.json
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_FILE = path.join(__dirname, 'data.json');

// ─── Schema ──────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  users: [],
  internships: [],
  applications: [],
  _seq: { users: 0, internships: 0, applications: 0 },
};

function load() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function nextId(data, table) {
  data._seq[table] = (data._seq[table] || 0) + 1;
  return data._seq[table];
}

// ─── Public API ───────────────────────────────────────────────────────
const db = {
  // Users
  findUserByEmail(email) {
    return load().users.find(u => u.email === email) || null;
  },
  findUserById(id) {
    return load().users.find(u => u.id === id) || null;
  },
  createUser({ email, passwordHash, role, name = '', companyName = '' }) {
    const data = load();
    const user = {
      id: nextId(data, 'users'),
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
    data.users.push(user);
    save(data);
    return user;
  },
  updateUser(id, updates) {
    const data = load();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    const allowed = ['name', 'bio', 'photo', 'cv_file', 'company_name'];
    allowed.forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        data.users[idx][key] = updates[key];
      }
    });
    save(data);
    return data.users[idx];
  },

  // Internships
  getAllInternships() {
    return load().internships.slice().reverse();
  },
  createInternship({ companyId, company, role, location, duration, description, requirements, tags, logo }) {
    const data = load();
    const internship = {
      id: nextId(data, 'internships'),
      company_id: companyId,
      company,
      role,
      location,
      duration,
      description,
      requirements,
      tags,
      logo: logo || null,
      created_at: new Date().toISOString(),
    };
    data.internships.push(internship);
    save(data);
    return internship;
  },
  findInternshipById(id) {
    return load().internships.find(i => i.id === id) || null;
  },
  deleteInternship(id) {
    const data = load();
    data.internships = data.internships.filter(i => i.id !== id);
    save(data);
  },

  // Applications
  getApplicationsByStudent(studentId) {
    const data = load();
    return data.applications
      .filter(a => a.student_id === studentId)
      .map(a => {
        const internship = data.internships.find(i => i.id === a.internship_id);
        return { ...a, internship };
      })
      .reverse();
  },
  getApplicationsByCompany(companyId) {
    const data = load();
    return data.applications
      .filter(a => {
        const internship = data.internships.find(i => i.id === a.internship_id);
        return internship && internship.company_id === companyId;
      })
      .map(a => {
        const internship = data.internships.find(i => i.id === a.internship_id);
        const student = data.users.find(u => u.id === a.student_id);
        return { ...a, internship, student };
      })
      .reverse();
  },
  findApplication(studentId, internshipId) {
    return load().applications.find(a => a.student_id === studentId && a.internship_id === internshipId) || null;
  },
  createApplication({ studentId, internshipId, message }) {
    const data = load();
    const application = {
      id: nextId(data, 'applications'),
      student_id: studentId,
      internship_id: internshipId,
      message,
      status: 'pending',
      applied_at: new Date().toISOString(),
    };
    data.applications.push(application);
    save(data);
    return application;
  },
  updateApplicationStatus(id, status) {
    const data = load();
    const idx = data.applications.findIndex(a => a.id === id);
    if (idx !== -1) { data.applications[idx].status = status; save(data); }
  },
};

// ─── Seed on first run ────────────────────────────────────────────────
if (!fs.existsSync(DATA_FILE)) {
  const passwordHash = bcrypt.hashSync('password123', 10);

  const student = db.createUser({ email: 'student@demo.com', passwordHash, role: 'student', name: 'Alex Johnson' });
  const company = db.createUser({ email: 'company@demo.com', passwordHash, role: 'company', name: 'Sarah Chen', companyName: 'TechCorp Solutions' });

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

  internshipSeed.forEach(i => db.createInternship({ companyId: company.id, ...i }));

  console.log('✓ Database seeded');
  console.log('  student@demo.com / password123');
  console.log('  company@demo.com / password123');
}

module.exports = db;
