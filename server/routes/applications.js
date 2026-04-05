const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/applications
router.get('/', requireAuth, (req, res) => {
  if (req.userRole === 'student') {
    const apps = db.getApplicationsByStudent(req.userId);
    return res.json(apps.map(a => ({
      id: a.id,
      message: a.message,
      status: a.status,
      appliedAt: a.applied_at,
      internship: a.internship ? {
        id: a.internship.id,
        company: a.internship.company,
        role: a.internship.role,
        location: a.internship.location,
        duration: a.internship.duration,
        description: a.internship.description,
        requirements: a.internship.requirements,
        tags: a.internship.tags,
        logo: a.internship.logo,
      } : null,
    })));
  }

  if (req.userRole === 'company') {
    const apps = db.getApplicationsByCompany(req.userId);
    return res.json(apps.map(a => ({
      id: a.id,
      message: a.message,
      status: a.status,
      appliedAt: a.applied_at,
      student: a.student ? {
        name: a.student.name,
        email: a.student.email,
        bio: a.student.bio,
        photo: a.student.photo,
      } : null,
      internship: a.internship ? {
        role: a.internship.role,
        company: a.internship.company,
      } : null,
    })));
  }

  res.status(403).json({ error: 'Forbidden' });
});

// POST /api/applications
router.post('/', requireAuth, (req, res) => {
  if (req.userRole !== 'student') return res.status(403).json({ error: 'Only students can apply' });

  const { internshipId, message } = req.body;
  if (!internshipId || !message || message.length < 20) {
    return res.status(400).json({ error: 'internshipId and message (min 20 chars) required' });
  }

  const internship = db.findInternshipById(parseInt(internshipId));
  if (!internship) return res.status(404).json({ error: 'Internship not found' });

  const existing = db.findApplication(req.userId, parseInt(internshipId));
  if (existing) return res.status(409).json({ error: 'Already applied' });

  const app = db.createApplication({ studentId: req.userId, internshipId: parseInt(internshipId), message });
  res.status(201).json({ id: app.id, status: 'pending' });
});

// PATCH /api/applications/:id/status — companies only
router.patch('/:id/status', requireAuth, (req, res) => {
  if (req.userRole !== 'company') return res.status(403).json({ error: 'Only companies can update status' });

  const { status } = req.body;
  if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.updateApplicationStatus(parseInt(req.params.id), status);
  res.json({ success: true });
});

module.exports = router;
