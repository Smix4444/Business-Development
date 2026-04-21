const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || process.env.Resend);
const FROM = process.env.RESEND_FROM_EMAIL || 'InternMatch <onboarding@resend.dev>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:5173';

async function sendVerificationEmail(email, name, token) {
  const link = `${BASE_URL}/verify-email?token=${token}`;
  const firstName = (name || 'there').split(' ')[0];

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your InternMatch account',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>
    body { margin:0; padding:0; background:#060606; font-family:'Inter',Arial,sans-serif; color:#F2F2F2; }
    .wrap { max-width:520px; margin:40px auto; padding:0 16px; }
    .card { background:#0F0F0F; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:40px; }
    .logo { font-size:1.1rem; font-weight:800; letter-spacing:-0.03em; color:#F2F2F2; margin-bottom:32px; }
    .logo span { color:#22C55E; }
    h1 { font-size:1.4rem; font-weight:700; margin:0 0 12px; color:#F2F2F2; letter-spacing:-0.02em; }
    p { font-size:0.9rem; color:#C8C8C8; line-height:1.6; margin:0 0 24px; }
    .btn { display:inline-block; background:#F2F2F2; color:#060606; font-weight:700; font-size:0.9rem; padding:14px 28px; border-radius:10px; text-decoration:none; letter-spacing:-0.01em; }
    .note { font-size:0.75rem; color:#888888; margin-top:24px; border-top:1px solid rgba(255,255,255,0.07); padding-top:20px; }
    .link-text { color:#C8C8C8; word-break:break-all; font-size:0.75rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="logo">Intern<span>Match</span></div>
      <h1>Hey ${firstName}, confirm your email</h1>
      <p>You're almost ready. Click the button below to verify your email address and activate your account.</p>
      <a href="${link}" class="btn">Verify my email</a>
      <p class="note">
        This link expires in 24 hours. If you didn't create an InternMatch account, you can safely ignore this email.<br/><br/>
        Or copy this link into your browser:<br/>
        <span class="link-text">${link}</span>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

async function sendPasswordResetEmail(email, name, token) {
  const link = `${BASE_URL}/reset-password?token=${token}`;
  const firstName = (name || 'there').split(' ')[0];

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your InternMatch password',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { margin:0; padding:0; background:#060606; font-family:'Inter',Arial,sans-serif; color:#F2F2F2; }
    .wrap { max-width:520px; margin:40px auto; padding:0 16px; }
    .card { background:#0F0F0F; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:40px; }
    .logo { font-size:1.1rem; font-weight:800; letter-spacing:-0.03em; color:#F2F2F2; margin-bottom:32px; }
    .logo span { color:#22C55E; }
    h1 { font-size:1.4rem; font-weight:700; margin:0 0 12px; color:#F2F2F2; letter-spacing:-0.02em; }
    p { font-size:0.9rem; color:#C8C8C8; line-height:1.6; margin:0 0 24px; }
    .btn { display:inline-block; background:#F2F2F2; color:#060606; font-weight:700; font-size:0.9rem; padding:14px 28px; border-radius:10px; text-decoration:none; letter-spacing:-0.01em; }
    .note { font-size:0.75rem; color:#888888; margin-top:24px; border-top:1px solid rgba(255,255,255,0.07); padding-top:20px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="logo">Intern<span>Match</span></div>
      <h1>Password reset request</h1>
      <p>Hey ${firstName}, we received a request to reset your password. Click the button below — this link expires in 1 hour.</p>
      <a href="${link}" class="btn">Reset my password</a>
      <p class="note">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
    </div>
  </div>
</body>
</html>`,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
