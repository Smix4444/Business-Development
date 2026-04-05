const store = require('./_lib/store');
const { verifyRequest } = require('./_lib/authMiddleware');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const payload = verifyRequest(req);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    if (payload.role === 'student') {
      const apps = store.getApplicationsByStudent(payload.userId);
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

    if (payload.role === 'company') {
      const apps = store.getApplicationsByCompany(payload.userId);
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

    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    if (payload.role !== 'student') return res.status(403).json({ error: 'Only students can apply' });

    const { internshipId, message } = req.body;
    if (!internshipId || !message || message.length < 20) {
      return res.status(400).json({ error: 'internshipId and message (min 20 chars) required' });
    }

    const internship = store.findInternshipById(parseInt(internshipId));
    if (!internship) return res.status(404).json({ error: 'Internship not found' });

    const existing = store.findApplication(payload.userId, parseInt(internshipId));
    if (existing) return res.status(409).json({ error: 'Already applied' });

    const app = store.createApplication({ studentId: payload.userId, internshipId: parseInt(internshipId), message });
    return res.status(201).json({ id: app.id, status: 'pending' });
  }

  if (req.method === 'PATCH') {
    if (payload.role !== 'company') return res.status(403).json({ error: 'Only companies can update status' });

    // id from query: PATCH /api/applications?id=3
    const id = parseInt(req.query.id);
    if (!id) return res.status(400).json({ error: 'id required' });

    const { status } = req.body;
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    store.updateApplicationStatus(id, status);
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
