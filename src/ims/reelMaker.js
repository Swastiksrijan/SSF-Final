// SSF Reel Maker — generates a share video for a post entirely in the browser.
// No server, no API key, no cost: a canvas slideshow is captured with
// MediaRecorder into a .webm clip (9:16 ready), and Hindi narration is offered
// through the browser's built-in speech engine.
//
// Why browser-only: the free backend has no ffmpeg and sleeps, so doing this on
// the device keeps reels free and instant.

const W = 1080;
const H = 1350; // 4:5 portrait, safe for reels/shorts feeds

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawFrame(ctx, post, lang, progress) {
  const hi = lang === 'hi';
  const title = hi ? post.titleHi : (post.titleEn || post.titleHi);
  const sub = hi ? post.subtitleHi : (post.subtitleEn || '');
  const body = hi ? post.bodyHi : (post.bodyEn || '');
  const takeaway = hi ? post.takeawayHi : (post.takeawayEn || '');
  const cta = hi ? post.ctaHi : (post.ctaEn || '');

  // background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#001529');
  g.addColorStop(0.55, '#002344');
  g.addColorStop(1, '#0b3a63');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // soft accent glow that gently moves over time
  const cx = W * 0.8 + Math.sin(progress * Math.PI * 2) * 60;
  const rg = ctx.createRadialGradient(cx, H * 0.18, 40, cx, H * 0.18, 420);
  rg.addColorStop(0, 'rgba(255,102,0,0.35)');
  rg.addColorStop(1, 'rgba(255,102,0,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  // brand bar
  ctx.fillStyle = '#FF6600';
  roundRect(ctx, 70, 70, 240, 60, 30);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 30px "Segoe UI", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('SSF', 100, 102);
  ctx.font = '600 26px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(hi ? 'स्वास्तिक सृजन फाउंडेशन' : 'Swastik Srijan Foundation', 340, 100);

  // title (fades + rises in the first 15%)
  const tIn = Math.min(1, progress / 0.15);
  ctx.globalAlpha = 0.35 + 0.65 * tIn;
  ctx.fillStyle = '#fff';
  ctx.font = '800 66px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
  const titleLines = wrapText(ctx, title, W - 160).slice(0, 4);
  let y = 260 - (1 - tIn) * 30;
  for (const ln of titleLines) {
    ctx.fillText(ln, 80, y);
    y += 82;
  }

  // sub-title
  if (sub) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#FFD166';
    ctx.font = '600 34px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
    for (const ln of wrapText(ctx, sub, W - 160).slice(0, 2)) {
      ctx.fillText(ln, 80, y + 6);
      y += 48;
    }
  }

  // body lines revealed over the middle of the clip
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.font = '500 36px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
  const bodyLines = wrapText(ctx, body, W - 160).slice(0, 12);
  const reveal = Math.floor(bodyLines.length * Math.min(1, Math.max(0, (progress - 0.15) / 0.6)));
  let by = y + 50;
  for (let i = 0; i < reveal && by < H - 420; i++) {
    ctx.fillText(bodyLines[i], 80, by);
    by += 52;
  }

  // takeaway card
  if (takeaway) {
    ctx.globalAlpha = progress > 0.6 ? 1 : 0.5;
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    roundRect(ctx, 70, H - 360, W - 140, 150, 24);
    ctx.fill();
    ctx.fillStyle = '#FFD166';
    ctx.font = '700 30px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
    ctx.fillText(hi ? 'आज की बात' : 'Takeaway', 100, H - 315);
    ctx.fillStyle = '#fff';
    ctx.font = '600 30px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
    let ty = H - 270;
    for (const ln of wrapText(ctx, takeaway, W - 220).slice(0, 2)) {
      ctx.fillText(ln, 100, ty);
      ty += 42;
    }
  }

  // CTA + footer
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FF6600';
  ctx.font = '700 32px "Segoe UI", system-ui, "Noto Sans Devanagari", sans-serif';
  ctx.fillText(cta || (hi ? 'सकारात्मक बदलाव में साथ दें' : 'Join the positive change'), 80, H - 150);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '600 26px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('swastiksrijan.in  •  #SSF  •  ' + (hi ? 'एक संस्था • एक रिकॉर्ड' : 'One Organisation • One Record'), 80, H - 100);
}

/** Draw one frame of the post at a given progress (0..1). Exported for reuse. */
export function renderFrame(canvas, post, lang, progress) {
  const ctx = canvas.getContext('2d');
  drawFrame(ctx, post, lang, progress);
}

/** Render a shareable reel (webm) for one post. Resolves with a Blob. */
export async function makeReel(post, lang = 'en', { seconds = 18, onProgress } = {}) {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('This browser cannot record video. Try Chrome or Edge.');
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  drawFrame(ctx, post, lang, 0);

  const stream = canvas.captureStream(30);
  const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    .find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

  const done = new Promise((resolve) => { rec.onstop = () => resolve(new Blob(chunks, { type: mime })); });
  rec.start();

  const t0 = performance.now();
  await new Promise((resolve) => {
    const loop = () => {
      const elapsed = (performance.now() - t0) / 1000;
      const p = Math.min(1, elapsed / seconds);
      drawFrame(ctx, post, lang, p);
      if (onProgress) onProgress(p);
      if (p < 1) requestAnimationFrame(loop);
      else resolve();
    };
    requestAnimationFrame(loop);
  });

  rec.stop();
  stream.getTracks().forEach((t) => t.stop());
  return done;
}

/** Speak the post aloud using the device's built-in Hindi/English voices. */
export function speakPost(post, lang = 'en') {
  if (typeof speechSynthesis === 'undefined') return false;
  const hi = lang === 'hi';
  const text = [hi ? post.titleHi : post.titleEn, hi ? post.bodyHi : post.bodyEn,
    hi ? post.takeawayHi : post.takeawayEn].filter(Boolean).join('. ');
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const pref = voices.find((v) => /hi[-_]IN/i.test(v.lang)) ||
    voices.find((v) => /^hi/i.test(v.lang)) ||
    voices.find((v) => /en[-_]IN/i.test(v.lang));
  if (pref) u.voice = pref;
  u.lang = pref ? pref.lang : (hi ? 'hi-IN' : 'en-IN');
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  return true;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
