/**
 * POST /api/seed
 * One-time seed endpoint — populates demo users + internships.
 * Safe to call multiple times (skips existing records).
 */
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const INTERNSHIPS = [
  {
    company: 'TechCorp Solutions', role: 'Software Engineering Intern', location: 'Antwerpen', duration: '3 months',
    description: 'Join our Antwerp engineering hub and contribute to large-scale React and Node.js applications used by over two million users across the Benelux. You will work directly within a cross-functional squad alongside senior engineers, picking up tickets from our Jira board, attending sprint planning and daily standups, and shipping real features to production. Expect deep dives into TypeScript, REST API design, CI/CD pipelines, and cloud infrastructure on AWS. We run pair-programming sessions every Friday and a dedicated learning budget of €500 for any course or conference you choose.',
    requirements: ['React', 'TypeScript', 'Node.js', 'Git', 'REST APIs'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=400&fit=crop',
  },
  {
    company: 'Studio Brussel Design', role: 'UX/UI Design Intern', location: 'Brussel', duration: '6 months',
    description: 'Work alongside our award-winning Brussels design team to craft digital products for Belgian government clients and fast-growing startups. You will run usability tests, build Figma prototypes, participate in stakeholder workshops, and contribute to our in-house design system. The role is bilingual (NL/FR) and you will get exposure to accessibility auditing, motion design in After Effects, and brand identity work. Our studio is located in the heart of Ixelles — expect a creative, candid team with flat hierarchy and honest feedback.',
    requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Accessibility'], tags: ['On-site', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop',
  },
  {
    company: 'DataViz Analytics', role: 'Data Science Intern', location: 'Leuven', duration: '4 months',
    description: "Based in Leuven's tech district, DataViz Analytics partners with KU Leuven research groups to turn academic datasets into actionable business intelligence. As an intern you will clean and explore datasets using Python and pandas, build predictive models with scikit-learn, and create interactive dashboards in Tableau and Plotly. You will attend weekly data reviews with our chief analyst and co-author internal research notes. A strong mathematical foundation and curiosity about statistics are more important to us than years of experience.",
    requirements: ['Python', 'SQL', 'Machine Learning', 'pandas', 'Data Visualisation'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
  },
  {
    company: 'GreenTech Innovations', role: 'Sustainability Analyst Intern', location: 'Gent', duration: '3 months',
    description: 'GreenTech Innovations is a Ghent-based cleantech consultancy advising Belgian municipalities and industrial players on decarbonisation roadmaps. Your internship will focus on life-cycle analysis (LCA) of renewable energy projects, compiling ESG reports aligned with the EU Taxonomy Regulation, and researching policy incentives available under the Belgian energy transition plan. You will attend client meetings, draft policy briefs, and present findings to our sustainability board. We are a small team of 12 — every contribution is visible and valued.',
    requirements: ['Environmental Science', 'Data Analysis', 'Research', 'Excel', 'Report Writing'], tags: ['On-site', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=400&fit=crop',
  },
  {
    company: 'FinanceFlow', role: 'Financial Analyst Intern', location: 'Brussel', duration: '6 months',
    description: 'FinanceFlow is a fintech scale-up headquartered in Brussels offering automated treasury solutions to Belgian SMEs. During this internship you will support the finance team with financial modelling in Excel and Python, assist in producing monthly management accounts, conduct sector benchmarking, and help prepare investor materials for our Series B fundraise. You will sit in on board presentations and gain exposure to IFRS accounting standards and Belgian corporate tax frameworks. Fluency in either Dutch or French is a plus.',
    requirements: ['Finance', 'Excel', 'Financial Modeling', 'Python', 'IFRS'], tags: ['On-site', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop',
  },
  {
    company: 'Marketing Minds', role: 'Digital Marketing Intern', location: 'Gent', duration: '3 months',
    description: 'Marketing Minds is a growth marketing agency in Ghent managing paid and organic campaigns for 30+ Belgian e-commerce brands. As an intern you will manage Meta and Google Ads campaigns (with real budgets), write SEO-optimised blog content in Dutch and English, analyse campaign performance in Google Analytics 4, and build weekly performance reports for clients. You will attend client calls and strategy sessions from day one. We value proactivity and creativity — if you have a good idea, we will test it.',
    requirements: ['Social Media', 'Content Creation', 'Google Analytics', 'SEO', 'Copywriting'], tags: ['Hybrid', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=400&fit=crop',
  },
  {
    company: 'HealthTech Labs', role: 'Product Management Intern', location: 'Leuven', duration: '4 months',
    description: 'HealthTech Labs builds clinical decision-support software used by Belgian hospitals and GP practices. This PM internship is one of the most hands-on in our company — you will write user stories and acceptance criteria, facilitate sprint reviews, conduct interviews with clinical users, and help prioritise the product backlog using data from Mixpanel. You will work closely with our CTO and lead designer. Prior knowledge of healthcare or medical informatics is a strong advantage, but not required. Expect to be challenged and to grow fast.',
    requirements: ['Product Strategy', 'User Stories', 'Agile', 'Jira', 'Stakeholder Management'], tags: ['Hybrid', 'Paid', 'Full-time'], logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop',
  },
  {
    company: 'Creative Content Co', role: 'Content Writing Intern', location: 'Brugge', duration: '3 months',
    description: 'Creative Content Co is a Bruges-based content agency producing long-form editorial, product copy, and video scripts for Belgian and Dutch brands. As a content writing intern you will research and draft blog articles (1,000–2,000 words), optimise existing content for SEO using SemRush, write social media captions in both Dutch and English, and assist the editorial team with tone-of-voice guidelines. Strong written communication in at least one of NL or EN is required. Remote-friendly with biweekly in-person team days in Bruges.',
    requirements: ['Writing', 'SEO', 'Research', 'SemRush', 'Social Media'], tags: ['Remote', 'Paid', 'Part-time'], logo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop',
  },
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const passwordHash = bcrypt.hashSync('password123', 10);

    // Upsert demo users (skip if already exist)
    const { data: student } = await supabase
      .from('users')
      .upsert({ email: 'student@demo.com', password_hash: passwordHash, role: 'student', name: 'Alex Johnson', bio: '', company_name: '' }, { onConflict: 'email', ignoreDuplicates: false })
      .select()
      .single();

    const { data: company } = await supabase
      .from('users')
      .upsert({ email: 'company@demo.com', password_hash: passwordHash, role: 'company', name: 'Sarah Chen', bio: '', company_name: 'TechCorp Solutions' }, { onConflict: 'email', ignoreDuplicates: false })
      .select()
      .single();

    // Only seed internships if none exist
    const { count } = await supabase
      .from('internships')
      .select('*', { count: 'exact', head: true });

    let internshipsSeeded = 0;
    if (count === 0) {
      const rows = INTERNSHIPS.map(i => ({ ...i, company_id: company.id }));
      await supabase.from('internships').insert(rows);
      internshipsSeeded = rows.length;
    }

    res.json({
      success: true,
      message: `Demo accounts upserted. ${internshipsSeeded > 0 ? `${internshipsSeeded} internships seeded.` : 'Internships already exist, skipped.'}`,
      accounts: ['student@demo.com / password123', 'company@demo.com / password123'],
    });
  } catch (err) {
    console.error('seed error:', err);
    res.status(500).json({ error: err.message });
  }
};
