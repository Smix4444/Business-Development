const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function signToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, role, name, companyName } = req.body;

  if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role are required' });
  if (!['student', 'company'].includes(role)) return res.status(400).json({ error: 'role must be student or company' });

  if (db.findUserByEmail(email)) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser({ email, passwordHash, role, name: name || '', companyName: companyName || '' });

  const token = signToken(user.id, role);
  res.status(201).json({ token, role, userId: user.id });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = db.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user.id, user.role);
  res.json({
    token,
    role: user.role,
    userId: user.id,
    profile: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      photo: user.photo,
      cvFile: user.cv_file,
      company: user.company_name,
    },
  });
});

module.exports = router;
