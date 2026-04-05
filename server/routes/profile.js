const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/profile
router.get('/', requireAuth, (req, res) => {
  const user = db.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    bio: user.bio,
    photo: user.photo,
    cvFile: user.cv_file,
    company: user.company_name,
  });
});

// PUT /api/profile
router.put('/', requireAuth, (req, res) => {
  const { name, bio, photo, cvFile, company } = req.body;

  const updated = db.updateUser(req.userId, {
    name,
    bio,
    photo,
    cv_file: cvFile,
    company_name: company,
  });

  if (!updated) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: updated.id,
    email: updated.email,
    role: updated.role,
    name: updated.name,
    bio: updated.bio,
    photo: updated.photo,
    cvFile: updated.cv_file,
    company: updated.company_name,
  });
});

module.exports = router;
