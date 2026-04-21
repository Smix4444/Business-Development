const db = require('../_lib/db');
const { sendVerificationEmail } = require('../_lib/email');

// Simple in-memory rate limiter: 1 resend per 60 seconds per email
const lastResent = new Map();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Rate limit check
    const now = Date.now();
    const lastSent = lastResent.get(email);
    if (lastSent && now - lastSent < 60_000) {
      const wait = Math.ceil((60_000 - (now - lastSent)) / 1000);
      return res.status(429).json({
        error: `Please wait ${wait} seconds before requesting another email.`,
        retryAfter: wait,
      });
    }

    const user = await db.findUserByEmail(email);

    if (!user) {
      // Don't reveal whether email exists — return success anyway
      return res.json({ success: true, message: 'If that email is registered, a new verification link has been sent.' });
    }

    if (user.email_verified) {
      return res.json({ success: true, message: 'Email is already verified. You can sign in.' });
    }

    // Generate new token and send email
    const updated = await db.updateVerificationToken(user.id);

    try {
      await sendVerificationEmail(email, user.name || '', updated.verification_token);
    } catch (emailErr) {
      console.error('Failed to resend verification email:', emailErr);
      return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
    }

    lastResent.set(email, now);

    res.json({ success: true, message: 'Verification email sent! Check your inbox.' });
  } catch (err) {
    console.error('resend-verification error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
