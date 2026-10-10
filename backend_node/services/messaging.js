// WhatsApp + SMS sender for the SSF Action Centre.
//
// Mirrors services/mailer.js: it uses HTTPS APIs (never raw SMTP/GSM), stays a
// safe no-op when nothing is configured, and returns { ok, provider, id } so
// callers can log real delivery evidence.
//
//   * WhatsApp — Meta WhatsApp Cloud API  (WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID)
//   * SMS      — Twilio Programmable SMS  (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_SMS_FROM)
//
// India-first phone handling: a bare 10-digit number is treated as +91.

const clean = (v) => String(v == null ? '' : v).trim();

// Turn any user-typed Indian phone into E.164 digits (no '+'), or null if it
// cannot be trusted. Handles spaces, dashes, +91, 0-prefix, and bare 10-digit.
function normalizePhone(value) {
  let d = clean(value).replace(/\D/g, '');
  if (!d) return null;
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);      // 0XXXXXXXXXX
  if (d.length === 10) d = '91' + d;                              // XXXXXXXXXX
  if (d.length === 12 && d.startsWith('91')) return d;            // 91XXXXXXXXXX
  if (d.length >= 11 && d.length <= 15) return d;                 // already E.164-ish
  return null;
}

// ---- WhatsApp (Meta Cloud API) --------------------------------------------
const waToken = () => clean(process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN);
const waPhoneId = () => clean(process.env.WHATSAPP_PHONE_NUMBER_ID);
const waVersion = () => clean(process.env.WHATSAPP_API_VERSION) || 'v21.0';
const waTemplate = () => clean(process.env.WHATSAPP_TEMPLATE_NAME);

function whatsappConfigured() {
  return Boolean(waToken() && waPhoneId());
}

async function sendWhatsApp({ to, text, params = [] }) {
  const phone = normalizePhone(to);
  if (!phone) throw new Error(`WhatsApp: unusable phone "${to}"`);

  // Production WhatsApp is business-initiated, which requires an approved
  // template. When WHATSAPP_TEMPLATE_NAME is set we send that template with the
  // given body parameters; otherwise we send plain text (fine for test numbers).
  let body;
  if (waTemplate()) {
    body = {
      messaging_product: 'whatsapp', to: phone, type: 'template',
      template: {
        name: waTemplate(),
        language: { code: clean(process.env.WHATSAPP_TEMPLATE_LANG) || 'en' },
        components: [{ type: 'body', parameters: params.map((p) => ({ type: 'text', text: String(p) })) }],
      },
    };
  } else {
    body = { messaging_product: 'whatsapp', to: phone, type: 'text', text: { preview_url: true, body: text } };
  }

  const res = await fetch(`https://graph.facebook.com/${waVersion()}/${waPhoneId()}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${waToken()}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${JSON.stringify(out).slice(0, 300)}`);
  return { ok: true, provider: 'whatsapp', id: out && out.messages && out.messages[0] && out.messages[0].id };
}

// ---- SMS (Twilio) ----------------------------------------------------------
const twSid = () => clean(process.env.TWILIO_ACCOUNT_SID);
const twToken = () => clean(process.env.TWILIO_AUTH_TOKEN);
const twFrom = () => clean(process.env.TWILIO_SMS_FROM);

function smsConfigured() {
  return Boolean(twSid() && twToken() && twFrom());
}

async function sendSms({ to, text }) {
  const phone = normalizePhone(to);
  if (!phone) throw new Error(`SMS: unusable phone "${to}"`);
  const auth = Buffer.from(`${twSid()}:${twToken()}`).toString('base64');
  const form = new URLSearchParams({ To: '+' + phone, From: twFrom(), Body: text });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twSid()}/Messages.json`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`SMS ${res.status}: ${(out && out.message) || JSON.stringify(out).slice(0, 200)}`);
  return { ok: true, provider: 'twilio', id: out && out.sid };
}

module.exports = {
  normalizePhone,
  whatsappConfigured, sendWhatsApp,
  smsConfigured, sendSms,
};
