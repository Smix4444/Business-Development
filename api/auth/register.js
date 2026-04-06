const bcrypt = require('bcryptjs');
const db = require('../_lib/db');
const { signToken } = require('../_lib/authMiddleware');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password, role, name, companyName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password and role are required' });
    }
    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ error: 'role must be student or company' });
    }
    if (await db.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await db.createUser({ email, passwordHash, role, name: name || '', companyName: companyName || '' });

    const token = signToken(user.id, role);
    res.status(201).json({ token, role, userId: user.id });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
