const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// ─── Email helper ─────────────────────────────────────────────────────────────
// In dev we use Resend if RESEND_API_KEY is set, otherwise log to console
let sendVerificationEmail;
try {
  const { Resend } = require('resend');
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const FROM = process.env.RESEND_FROM_EMAIL || 'InternMatch <onboarding@resend.dev>';
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

    sendVerificationEmail = async (email, name, token) => {
      const link = `${BASE_URL}/verify-email?token=${token}`;
      const firstName = (name || 'there').split(' ')[0];
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Verify your InternMatch account',
        html: `<div style="font-family:sans-serif;padding:20px"><h2>Hey ${firstName}, confirm your email</h2><p>Click below to verify:</p><a href="${link}" style="display:inline-block;background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Verify my email</a><p style="color:#888;font-size:12px;margin-top:16px">Or copy: ${link}</p></div>`,
      });
      console.log(`✉ Verification email sent to ${email}`);
    };
  }
} catch {}

if (!sendVerificationEmail) {
  sendVerificationEmail = async (email, name, token) => {
    const link = `http://localhost:5173/verify-email?token=${token}`;
    console.log(`\n══════════════════════════════════════════════`);
    console.log(`📧 VERIFICATION EMAIL (dev console mode)`);
    console.log(`   To: ${email}`);
    console.log(`   Link: ${link}`);
    console.log(`══════════════════════════════════════════════\n`);
  };
}

// ─── Rate limiter for resend ──────────────────────────────────────────────────
const lastResent = new Map();

function signToken(userId, role) {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'dev_secret_change_in_prod', { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, password, role, name, companyName } = req.body;

  if (!email || !password || !role) return res.status(400).json({ error: 'email, password and role are required' });
  if (!['student', 'company', 'school'].includes(role)) return res.status(400).json({ error: 'role must be student, company or school' });

  if (db.findUserByEmail(email)) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.createUser({ email, passwordHash, role, name: name || '', companyName: companyName || '' });

  // Send verification email (async, don't block response)
  sendVerificationEmail(email, name || companyName || '', user.verification_token).catch(err =>
    console.error('Failed to send verification email:', err)
  );

  // Don't return JWT — user must verify first
  res.status(201).json({ needsVerification: true, email });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = db.findUserByEmail(email);
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
});

// GET /api/auth/verify-email?token=xxx
router.get('/verify-email', (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ error: 'Verification token is required' });

  const user = db.findUserByVerificationToken(token);

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired verification link. Please request a new one.' });
  }

  if (user.email_verified) {
    return res.json({ success: true, message: 'Email already verified' });
  }

  db.markEmailVerified(user.id);
  res.json({ success: true, message: 'Email verified successfully! You can now sign in.' });
});

// POST /api/auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Rate limit: 1 per 60s per email
  const now = Date.now();
  const last = lastResent.get(email);
  if (last && now - last < 60_000) {
    const wait = Math.ceil((60_000 - (now - last)) / 1000);
    return res.status(429).json({ error: `Please wait ${wait} seconds before requesting another email.`, retryAfter: wait });
  }

  const user = db.findUserByEmail(email);
  if (!user) return res.json({ success: true, message: 'If that email is registered, a new verification link has been sent.' });
  if (user.email_verified) return res.json({ success: true, message: 'Email is already verified. You can sign in.' });

  const updated = db.updateVerificationToken(user.id);

  try {
    await sendVerificationEmail(email, user.name || '', updated.verification_token);
    lastResent.set(email, now);
    res.json({ success: true, message: 'Verification email sent! Check your inbox.' });
  } catch (err) {
    console.error('Failed to resend verification email:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

module.exports = router;
