/**
 * Simple file-based JSON database — no native deps required.
 * Data persists in server/data.json
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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
  createUser({ email, passwordHash, role, name = '', companyName = '', emailVerified = false }) {
    const data = load();
    const verificationToken = crypto.randomBytes(32).toString('hex');
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
      email_verified: emailVerified,
      verification_token: emailVerified ? null : verificationToken,
      verification_sent_at: emailVerified ? null : new Date().toISOString(),
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

  findUserByVerificationToken(token) {
    return load().users.find(u => u.verification_token === token) || null;
  },

  markEmailVerified(userId) {
    const data = load();
    const idx = data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    data.users[idx].email_verified = true;
    data.users[idx].verification_token = null;
    save(data);
    return data.users[idx];
  },

  updateVerificationToken(userId) {
    const data = load();
    const idx = data.users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    const newToken = crypto.randomBytes(32).toString('hex');
    data.users[idx].verification_token = newToken;
    data.users[idx].verification_sent_at = new Date().toISOString();
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

  const student = db.createUser({ email: 'student@demo.com', passwordHash, role: 'student', name: 'Alex Johnson', emailVerified: true });
  const company = db.createUser({ email: 'company@demo.com', passwordHash, role: 'company', name: 'Sarah Chen', companyName: 'TechCorp Solutions', emailVerified: true });

  const internshipSeed = [
    {
      company: 'TechCorp Solutions', role: 'Software Engineering Intern', location: 'Antwerpen', duration: '3 months',
      description: 'Join our Antwerp engineering hub and contribute to large-scale React and Node.js applications used by over two million users across the Benelux. You will work directly within a cross-functional squad alongside senior engineers, picking up tickets from our Jira board, attending sprint planning and daily standups, and shipping real features to production. Expect deep dives into TypeScript, REST API design, CI/CD pipelines, and cloud infrastructure on AWS. We run pair-programming sessions every Friday and a dedicated learning budget of €500 for any course or conference you choose.',
      requirements: ['React', 'TypeScript', 'Node.js', 'Git', 'REST APIs'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop'
    },
    {
      company: 'Studio Brussel Design', role: 'UX/UI Design Intern', location: 'Brussel', duration: '6 months',
      description: 'Work alongside our award-winning Brussels design team to craft digital products for Belgian government clients and fast-growing startups. You will run usability tests, build Figma prototypes, participate in stakeholder workshops, and contribute to our in-house design system. The role is bilingual (NL/FR) and you will get exposure to accessibility auditing, motion design in After Effects, and brand identity work. Our studio is located in the heart of Ixelles — expect a creative, candid team with flat hierarchy and honest feedback.',
      requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Accessibility'], tags: ['On-site', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop'
    },
    {
      company: 'DataViz Analytics', role: 'Data Science Intern', location: 'Leuven', duration: '4 months',
      description: 'Based in Leuven\'s tech district, DataViz Analytics partners with KU Leuven research groups to turn academic datasets into actionable business intelligence. As an intern you will clean and explore datasets using Python and pandas, build predictive models with scikit-learn, and create interactive dashboards in Tableau and Plotly. You will attend weekly data reviews with our chief analyst and co-author internal research notes. A strong mathematical foundation and curiosity about statistics are more important to us than years of experience.',
      requirements: ['Python', 'SQL', 'Machine Learning', 'pandas', 'Data Visualisation'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop'
    },
    {
      company: 'GreenTech Innovations', role: 'Sustainability Analyst Intern', location: 'Gent', duration: '3 months',
      description: 'GreenTech Innovations is a Ghent-based cleantech consultancy advising Belgian municipalities and industrial players on decarbonisation roadmaps. Your internship will focus on life-cycle analysis (LCA) of renewable energy projects, compiling ESG reports aligned with the EU Taxonomy Regulation, and researching policy incentives available under the Belgian energy transition plan. You will attend client meetings, draft policy briefs, and present findings to our sustainability board. We are a small team of 12 — every contribution is visible and valued.',
      requirements: ['Environmental Science', 'Data Analysis', 'Research', 'Excel', 'Report Writing'], tags: ['On-site', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=400&fit=crop'
    },
    {
      company: 'FinanceFlow', role: 'Financial Analyst Intern', location: 'Brussel', duration: '6 months',
      description: 'FinanceFlow is a fintech scale-up headquartered in Brussels offering automated treasury solutions to Belgian SMEs. During this internship you will support the finance team with financial modelling in Excel and Python, assist in producing monthly management accounts, conduct sector benchmarking, and help prepare investor materials for our Series B fundraise. You will sit in on board presentations and gain exposure to IFRS accounting standards and Belgian corporate tax frameworks. Fluency in either Dutch or French is a plus.',
      requirements: ['Finance', 'Excel', 'Financial Modeling', 'Python', 'IFRS'], tags: ['On-site', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop'
    },
    {
      company: 'Marketing Minds', role: 'Digital Marketing Intern', location: 'Gent', duration: '3 months',
      description: 'Marketing Minds is a growth marketing agency in Ghent managing paid and organic campaigns for 30+ Belgian e-commerce brands. As an intern you will manage Meta and Google Ads campaigns (with real budgets), write SEO-optimised blog content in Dutch and English, analyse campaign performance in Google Analytics 4, and build weekly performance reports for clients. You will attend client calls and strategy sessions from day one. We value proactivity and creativity — if you have a good idea, we will test it.',
      requirements: ['Social Media', 'Content Creation', 'Google Analytics', 'SEO', 'Copywriting'], tags: ['Hybrid', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=400&fit=crop'
    },
    {
      company: 'HealthTech Labs', role: 'Product Management Intern', location: 'Leuven', duration: '4 months',
      description: 'HealthTech Labs builds clinical decision-support software used by Belgian hospitals and GP practices. This PM internship is one of the most hands-on in our company — you will write user stories and acceptance criteria, facilitate sprint reviews, conduct interviews with clinical users, and help prioritise the product backlog using data from Mixpanel. You will work closely with our CTO and lead designer. Prior knowledge of healthcare or medical informatics is a strong advantage, but not required. Expect to be challenged and to grow fast.',
      requirements: ['Product Strategy', 'User Stories', 'Agile', 'Jira', 'Stakeholder Management'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop'
    },
    {
      company: 'Creative Content Co', role: 'Content Writing Intern', location: 'Brugge', duration: '3 months',
      description: 'Creative Content Co is a Bruges-based content agency producing long-form editorial, product copy, and video scripts for Belgian and Dutch brands. As a content writing intern you will research and draft blog articles (1,000–2,000 words), optimise existing content for SEO using SemRush, write social media captions in both Dutch and English, and assist the editorial team with tone-of-voice guidelines. Strong written communication in at least one of NL or EN is required. Remote-friendly with biweekly in-person team days in Bruges.',
      requirements: ['Writing', 'SEO', 'Research', 'SemRush', 'Social Media'], tags: ['Remote', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop'
    },
  ];

  internshipSeed.forEach(i => db.createInternship({ companyId: company.id, ...i }));

  console.log('✓ Database seeded');
  console.log('  student@demo.com / password123');
  console.log('  company@demo.com / password123');
}

module.exports = db;
