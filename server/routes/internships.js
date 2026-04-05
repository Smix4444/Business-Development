const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/internships — public
router.get('/', (req, res) => {
  const internships = db.getAllInternships();
  res.json(internships);
});

// POST /api/internships — company only
router.post('/', requireAuth, (req, res) => {
  if (req.userRole !== 'company') return res.status(403).json({ error: 'Only companies can post internships' });

  const { company, role, location, duration, description, requirements, tags, logo } = req.body;
  if (!company || !role || !location || !duration || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const created = db.createInternship({
    companyId: req.userId,
    company,
    role,
    location,
    duration,
    description,
    requirements: requirements || [],
    tags: tags || [],
    logo,
  });

  res.status(201).json(created);
});

// DELETE /api/internships/:id — company only
router.delete('/:id', requireAuth, (req, res) => {
  if (req.userRole !== 'company') return res.status(403).json({ error: 'Only companies can delete' });

  const id = parseInt(req.params.id);
  const internship = db.findInternshipById(id);
  if (!internship) return res.status(404).json({ error: 'Not found' });
  if (internship.company_id !== req.userId) return res.status(403).json({ error: 'Not your listing' });

  db.deleteInternship(id);
  res.json({ success: true });
});

module.exports = router;
