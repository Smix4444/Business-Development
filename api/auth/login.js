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
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await db.findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Block unverified users
    if (!user.email_verified) {
      return res.status(403).json({
        error: 'Please verify your email before signing in. Check your inbox for a verification link.',
        needsVerification: true,
        email: user.email,
      });
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
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
