const db = require('../_lib/db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token = req.query?.token || new URL(req.url, 'http://localhost').searchParams.get('token');

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const user = await db.findUserByVerificationToken(token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification link. Please request a new one.' });
    }

    if (user.email_verified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    await db.markEmailVerified(user.id);

    res.json({ success: true, message: 'Email verified successfully! You can now sign in.' });
  } catch (err) {
    console.error('verify-email error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
