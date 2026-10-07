// Central email sender.
//
// Render's free tier blocks outbound SMTP (ports 25/465/587), so the old Gmail
// SMTP transport silently fails in production. This module sends through the
// Brevo HTTPS API when BREVO_API_KEY is set, and only falls back to the legacy
// Gmail SMTP transport when no API key exists. Call sites keep working with the
// same { from, to, subject, text, html } shape they already used.
const nodemailer = require('nodemailer');

const brevoKey = () => String(process.env.BREVO_API_KEY || '').trim();
const fromEmail = () => String(process.env.EMAIL_FROM || process.env.EMAIL_USER || 'swastiksrijanfoundation@gmail.com').trim();
const fromName = () => String(process.env.EMAIL_FROM_NAME || 'Swastik Srijan Foundation').trim();

function emailConfigured() {
  return Boolean(brevoKey() || (process.env.EMAIL_USER && process.env.EMAIL_PASS));
}

// "Name" <a@b.com>  |  a@b.com  ->  { name, email }
function parseAddress(value) {
  if (!value) return { name: fromName(), email: fromEmail() };
  const m = String(value).match(/^\s*"?([^"<]*?)"?\s*<\s*([^>]+?)\s*>\s*$/);
  if (m) return { name: (m[1] || '').trim() || fromName(), email: m[2].trim() };
  return { name: fromName(), email: String(value).trim() };
}

function toRecipients(to) {
  return (Array.isArray(to) ? to : String(to || '').split(','))
    .map((v) => String(v).trim())
    .filter(Boolean)
    .map((email) => ({ email }));
}

async function sendViaBrevo(opts) {
  const body = {
    sender: parseAddress(opts.from),
    to: toRecipients(opts.to),
    subject: opts.subject || '(no subject)',
  };
  if (opts.html) body.htmlContent = opts.html;
  if (opts.text || !opts.html) body.textContent = opts.text || '';
  if (opts.replyTo) body.replyTo = parseAddress(opts.replyTo);

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': brevoKey(), 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Brevo ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json().catch(() => ({}));
}

async function sendViaGmail(opts) {
  const user = process.env.EMAIL_USER;
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass: process.env.EMAIL_PASS } });
  return transporter.sendMail({
    from: opts.from || `"${fromName()}" <${user}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo,
  });
}

async function sendMail(opts = {}) {
  if (brevoKey()) {
    try {
      const out = await sendViaBrevo(opts);
      return { ok: true, provider: 'brevo', id: out && out.messageId };
    } catch (e) {
      console.error('⚠️ Brevo send failed:', e.message);
      if (!(process.env.EMAIL_USER && process.env.EMAIL_PASS)) throw e;
      console.warn('↩️ Brevo failed, falling back to Gmail SMTP');
    }
  }
  const out = await sendViaGmail(opts);
  return { ok: true, provider: 'gmail', id: out && out.messageId };
}

module.exports = { sendMail, emailConfigured, fromEmail, fromName };
