const bcrypt = require('bcryptjs');
const db = require('../_lib/db');
const { sendVerificationEmail } = require('../_lib/email');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password, role, name, companyName, schoolName, schoolDomain, contactName, schoolId } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }
    if (!['student', 'company', 'school'].includes(role)) {
      return res.status(400).json({ error: 'role must be student, company or school' });
    }
    if (await db.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    // ── School registration ──────────────────────────────────────────────────
    if (role === 'school') {
      if (!schoolName) return res.status(400).json({ error: 'School name is required' });
      const user = await db.createUser({
        email,
        passwordHash,
        role: 'school',
        name: contactName || name || '',
        companyName: schoolDomain || '',
      });
      await db.updateUser(user.id, { bio: schoolName });

      // Send verification email
      try {
        await sendVerificationEmail(email, contactName || name || '', user.verification_token);
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr);
      }

      return res.status(201).json({ needsVerification: true, email });
    }

    // ── Student registration — auto-link school by domain or explicit pick ──
    let resolvedSchoolId = schoolId ? parseInt(schoolId) : null;

    if (role === 'student' && !resolvedSchoolId) {
      const domain = email.split('@')[1];
      if (domain) {
        const schools = await db.getAllSchools();
        const matched = schools.find(s => s.domain && domain.endsWith(s.domain.replace(/^@/, '')));
        if (matched) resolvedSchoolId = matched.id;
      }
    }

    const user = await db.createUser({
      email,
      passwordHash,
      role,
      name: name || '',
      companyName: companyName || '',
      schoolId: resolvedSchoolId,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name || companyName || '', user.verification_token);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }

    // Don't return a JWT — user needs to verify email first
    res.status(201).json({ needsVerification: true, email });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
