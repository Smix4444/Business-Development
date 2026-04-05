const bcrypt = require('bcryptjs');
const store = require('../_lib/store');
const { signToken } = require('../_lib/authMiddleware');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, role, name, companyName } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password and role are required' });
  }
  if (!['student', 'company'].includes(role)) {
    return res.status(400).json({ error: 'role must be student or company' });
  }
  if (store.findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = store.createUser({ email, passwordHash, role, name: name || '', companyName: companyName || '' });

  const token = signToken(user.id, role);
  res.status(201).json({ token, role, userId: user.id });
};
