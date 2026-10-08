// SSF Social Awareness Publisher — IMS workspace.
// Connect every social account, watch today's bilingual posts, and let the
// scheduler publish them automatically (twice a day). Nothing here removes any
// existing feature; it is a new module on top of the IMS.
import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import ImsLayout from '../ImsLayout';
import { Card, SectionHero, Button, Badge, Spinner, Toggle } from '../ui';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { makeReel, speakPost, downloadBlob } from '../reelMaker';
import { profileUrlFor, idHintFor, captionFor } from '../socialProfiles';

const FIELD_LABELS = {
  pageId: { en: 'Page ID', hi: 'पेज ID' },
  igUserId: { en: 'Instagram User ID', hi: 'इंस्टाग्राम यूज़र ID' },
  botToken: { en: 'Bot Token', hi: 'बॉट टोकन' },
  chatId: { en: 'Chat ID / Channel', hi: 'चैट ID / चैनल' },
  authorUrn: { en: 'Author URN (urn:li:organization:…)', hi: 'लेखक URN' },
  accessToken: { en: 'Access Token', hi: 'एक्सेस टोकन' },
  phoneNumberId: { en: 'Phone Number ID', hi: 'फ़ोन नंबर ID' },
  to: { en: 'Send-to number', hi: 'भेजने का नंबर' },
  consumerKey: { en: 'API Key (Consumer Key)', hi: 'API Key (कंज़्यूमर Key)' },
  consumerSecret: { en: 'API Key Secret', hi: 'API Key Secret' },
  accessTokenSecret: { en: 'Access Token Secret', hi: 'Access Token Secret' },
};

const STATUS_STYLE = {
  published: 'text-emerald-700 bg-emerald-50 ring-emerald-100',
  partial: 'text-amber-700 bg-amber-50 ring-amber-100',
  draft: 'text-slate-600 bg-slate-100 ring-slate-200',
  failed: 'text-rose-700 bg-rose-50 ring-rose-100',
  connected: 'text-emerald-700 bg-emerald-50 ring-emerald-100',
  not_connected: 'text-slate-500 bg-slate-100 ring-slate-200',
  error: 'text-rose-700 bg-rose-50 ring-rose-100',
};

function Chip({ label, tone = 'draft' }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${STATUS_STYLE[tone] || STATUS_STYLE.draft}`}>{label}</span>;
}

function KpiBox({ icon, en, hi, value, tone = 'text-[#002344]' }) {
  const { lang } = useLang();
  const I = Icons[icon] || Icons.Activity;
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[#002344]"><I size={18} /></span>
        <div className="min-w-0">
          <div className={`text-2xl font-black leading-none ${tone}`}>{value}</div>
          <div className="mt-1 truncate text-[11px] font-semibold text-slate-500">{lang === 'hi' ? hi : en}</div>
        </div>
      </div>
    </Card>
  );
}

function ChannelCard({ ch, onSave, onDisconnect, onTest, onFbExchange, busy }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [copied, setCopied] = useState('');
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState('');
  const [fb, setFb] = useState({ appId: '', appSecret: '', shortToken: '' });
  const [fbBusy, setFbBusy] = useState(false);
  const [fbMsg, setFbMsg] = useState('');
  const required = ch.fields || [];
  const profileUrl = profileUrlFor(ch.platform);

  // One-time exchange: short-lived token -> permanent Page token.
  const runFbExchange = async () => {
    setFbBusy(true); setFbMsg('');
    try {
      const out = await onFbExchange(fb);
      if (out && out.ok) {
        const never = !out.expiresAt;
        const tail = never
          ? (lang === 'hi' ? 'कभी expire नहीं होगा ✅' : 'never expires ✅')
          : (lang === 'hi' ? `expire: ${new Date(out.expiresAt * 1000).toLocaleString('en-IN')}` : `expires: ${new Date(out.expiresAt * 1000).toLocaleString('en-IN')}`);
        setFbMsg(lang === 'hi'
          ? `✅ स्थायी token सेव हुआ — पेज: ${out.pageName || out.pageId} · ${tail}`
          : `✅ Permanent token saved — page: ${out.pageName || out.pageId} · ${tail}`);
      } else {
        setFbMsg(`⚠️ ${(out && (out.error || out.hint)) || 'failed'}`);
      }
    } catch (e) { setFbMsg(`⚠️ ${e.message}`); } finally { setFbBusy(false); }
  };

  const copyProfile = async () => {
    try { await navigator.clipboard.writeText(profileUrl); setCopied('url'); setTimeout(() => setCopied(''), 1500); } catch { /* clipboard blocked */ }
  };

  const runTest = async () => {
    setTesting(true); setTestMsg('');
    try {
      const out = await onTest(ch.platform);
      setTestMsg(out && out.ok
        ? (lang === 'hi' ? '✅ भेज दिया — अपने चैनल में देखें' : '✅ Sent — check your channel')
        : `⚠️ ${(out && (out.error || out.hint)) || 'failed'}`);
    } catch (e) {
      setTestMsg(`⚠️ ${e.message}`);
    } finally { setTesting(false); }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-[#002344]">{lang === 'hi' ? ch.hi : ch.en}</span>
            <Chip label={ch.always ? (lang === 'hi' ? 'हमेशा चालू' : 'Always on') : ch.status} tone={ch.always ? 'connected' : ch.status} />
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {ch.lastPublishedAt ? `${lang === 'hi' ? 'अंतिम पोस्ट' : 'Last posted'}: ${new Date(ch.lastPublishedAt).toLocaleString('en-IN')}` : (lang === 'hi' ? 'अभी तक पोस्ट नहीं' : 'No posts yet')}
          </div>
          {ch.lastError && <div className="mt-1 truncate text-[11px] text-rose-500" title={ch.lastError}>{ch.lastError}</div>}
          {profileUrl && (
            <div className="mt-1.5 flex items-center gap-2 text-[11px]">
              <a href={profileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#002344] hover:text-[#FF6600]">
                <Icons.ExternalLink size={12} /> {lang === 'hi' ? 'आपका पेज खोलें' : 'Open your page'}
              </a>
              <button type="button" onClick={copyProfile} className="inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-[#FF6600]">
                <Icons.Copy size={12} /> {copied === 'url' ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'लिंक कॉपी' : 'Copy link')}
              </button>
            </div>
          )}
        </div>
        {!ch.always && (
          <div className="flex shrink-0 items-center gap-2">
            <Toggle on={ch.enabled} onChange={(v) => onSave(ch.platform, { enabled: v })} label={ch.enabled ? (lang === 'hi' ? 'ऑन' : 'On') : (lang === 'hi' ? 'ऑफ' : 'Off')} />
          </div>
        )}
      </div>

      {!ch.always && (
        <div className="mt-3">
          <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6600]">
            <Icons.KeyRound size={13} /> {lang === 'hi' ? 'क्रेडेंशियल जोड़ें' : 'Add credentials'} <Icons.ChevronDown size={13} />
          </button>
          {open && (
            <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              {required.map((f) => (
                <label key={f} className="block">
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">{lang === 'hi' ? FIELD_LABELS[f]?.hi : FIELD_LABELS[f]?.en}{f === 'accessToken' || f === 'botToken' ? ' 🔒' : ''}</span>
                  <input
                    value={form[f] || ''} onChange={(e) => setForm((s) => ({ ...s, [f]: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#FF6600]"
                    placeholder={f}
                  />
                  {idHintFor(ch.platform, f, lang) && (
                    <span className="mt-1 block text-[10px] leading-snug text-slate-400">{idHintFor(ch.platform, f, lang)}</span>
                  )}
                </label>
              ))}
              {ch.platform === 'facebook' && (
                <div className="mt-1 rounded-xl border border-[#FF6600]/30 bg-[#FFF7F0] p-3">
                  <div className="text-[11px] font-bold text-[#002344]">
                    {lang === 'hi' ? '🔁 स्थायी token बनाएँ (कभी expire न हो)' : '🔁 Get a permanent token (never expires)'}
                  </div>
                  <p className="mt-1 text-[10px] leading-snug text-slate-500">
                    {lang === 'hi'
                      ? 'Facebook App ID, App Secret और एक छोटा user token डालें — हम उसे स्थायी Page token में बदलकर सेव कर देंगे।'
                      : 'Enter the Facebook App ID, App Secret and a short-lived user token — we exchange it for a permanent Page token and save it.'}
                  </p>
                  <div className="mt-2 space-y-2">
                    {[['appId', 'App ID'], ['appSecret', 'App Secret'], ['shortToken', lang === 'hi' ? 'छोटा user token' : 'Short-lived user token']].map(([k, ph]) => (
                      <input key={k} type={k === 'appSecret' || k === 'shortToken' ? 'password' : 'text'}
                        value={fb[k]} onChange={(e) => setFb((s) => ({ ...s, [k]: e.target.value }))}
                        placeholder={ph} className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-[#FF6600]" />
                    ))}
                  </div>
                  <div className="mt-2">
                    <Button variant="ghost" icon="KeyRound" disabled={fbBusy} onClick={runFbExchange}>
                      {fbBusy ? (lang === 'hi' ? 'बदल रहे हैं…' : 'Exchanging…') : (lang === 'hi' ? 'स्थायी token बनाएँ' : 'Exchange for permanent token')}
                    </Button>
                  </div>
                  {fbMsg && <div className="mt-1 text-[11px] font-semibold text-slate-600">{fbMsg}</div>}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button disabled={busy} icon="Check" onClick={() => { onSave(ch.platform, { ...form, enabled: true }); setForm({}); setOpen(false); }}>
                  {lang === 'hi' ? 'सहेजें' : 'Save & connect'}
                </Button>
                {ch.configured && (
                  <>
                    <Button variant="ghost" icon="FlaskConical" disabled={testing} onClick={runTest}>
                      {testing ? (lang === 'hi' ? 'भेज रहे हैं…' : 'Sending…') : (lang === 'hi' ? 'टेस्ट भेजें' : 'Send test')}
                    </Button>
                    <Button variant="danger" icon="Trash2" disabled={busy} onClick={() => onDisconnect(ch.platform)}>
                      {lang === 'hi' ? 'हटाएँ' : 'Disconnect'}
                    </Button>
                  </>
                )}
              </div>
              {testMsg && <div className="pt-1 text-[11px] font-semibold text-slate-600">{testMsg}</div>}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function PostCard({ post, onPublish, onEdit, busy }) {
  const { lang } = useLang();
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(lang === 'hi' ? post.bodyHi : post.bodyEn);
  const [reelBusy, setReelBusy] = useState(false);
  const [reelPct, setReelPct] = useState(0);
  const [copied, setCopied] = useState('');
  const img = `${import.meta.env.VITE_BACKEND_URL || ''}/api/social/image/daily?postId=${post.id}`;
  const imgSrc = img.startsWith('/') ? `${(import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')}${img}` : img;

  const genReel = async () => {
    setReelBusy(true); setReelPct(0);
    try {
      const blob = await makeReel(post, lang, { seconds: 18, onProgress: setReelPct });
      downloadBlob(blob, `ssf-reel-${post.postRef || post.id}.webm`);
    } catch (e) {
      alert(e.message);
    } finally {
      setReelBusy(false); setReelPct(0);
    }
  };

  // Token-free sharing: copy the caption, or open WhatsApp/Telegram prefilled.
  // This is what makes the module useful on day one, before any API keys exist.
  const copyCaption = async () => {
    try { await navigator.clipboard.writeText(captionFor(post, lang)); setCopied('caption'); setTimeout(() => setCopied(''), 1500); } catch { /* clipboard blocked */ }
  };
  const shareTo = (kind) => {
    const text = captionFor(post, lang);
    const url = kind === 'telegram'
      ? `https://t.me/share/url?url=${encodeURIComponent('https://swastiksrijan.in/Blog')}&text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="hidden w-28 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200 sm:block">
          <img src={imgSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Chip label={post.slot} />
            <Chip label={post.status} tone={post.status} />
            {post.category && <Chip label={post.category} />}
            <span className="text-[11px] font-semibold text-slate-400">{post.postRef}</span>
          </div>
          <h3 className="mt-2 text-sm font-bold text-[#002344]">{lang === 'hi' ? post.titleHi : post.titleEn}</h3>
          {lang !== 'hi' && <p className="text-xs font-semibold text-slate-500">{post.titleHi}</p>}
          {editing ? (
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6}
              className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-[#FF6600]" />
          ) : (
            <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-600">{body}</pre>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button icon="Send" disabled={busy} onClick={() => onPublish(post.id)}>{lang === 'hi' ? 'अभी पोस्ट करें' : 'Publish now'}</Button>
            {editing ? (
              <Button variant="ghost" icon="Check" disabled={busy} onClick={() => { onEdit(post.id, lang === 'hi' ? { bodyHi: body } : { bodyEn: body }); setEditing(false); }}>
                {lang === 'hi' ? 'सहेजें' : 'Save'}
              </Button>
            ) : (
              <Button variant="ghost" icon="Pencil" onClick={() => setEditing(true)}>{lang === 'hi' ? 'संपादित करें' : 'Edit'}</Button>
            )}
            <Button variant="ghost" icon="Video" disabled={reelBusy} onClick={genReel}>
              {reelBusy ? `${Math.round(reelPct * 100)}%` : (lang === 'hi' ? 'रील बनाएँ' : 'Make reel')}
            </Button>
            <Button variant="ghost" icon="Volume2" disabled={reelBusy} onClick={() => speakPost(post, lang)}>
              {lang === 'hi' ? 'सुनें (हिंदी)' : 'Listen'}
            </Button>
            <Button variant="ghost" icon="Copy" onClick={copyCaption}>
              {copied === 'caption' ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'कैप्शन कॉपी' : 'Copy caption')}
            </Button>
            <Button variant="ghost" icon="MessageCircle" onClick={() => shareTo('whatsapp')}>
              {lang === 'hi' ? 'WhatsApp शेयर' : 'Share WhatsApp'}
            </Button>
            <Button variant="ghost" icon="Send" onClick={() => shareTo('telegram')}>
              {lang === 'hi' ? 'Telegram शेयर' : 'Share Telegram'}
            </Button>
          </div>
          {post.results && post.results.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.results.map((r) => (
                <span key={r.platform} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  {r.ok ? '✓' : '✕'} {r.platform}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ImsSocial() {
  const { lang } = useLang();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');

  const load = async () => {
    try { setData(await ims.socialDashboard()); } catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, []);

  const run = async (fn, msg) => {
    setBusy(true); setErr(''); setNote('');
    try { await fn(); setNote(msg); await load(); }
    catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const saveConfig = (patch) => run(() => ims.socialSaveConfig(patch), lang === 'hi' ? 'सहेजा गया' : 'Saved');
  const times = (data && data.times) || { morning: '08:00', evening: '18:00' };
  const today = (data && data.recent || []).filter((p) => p.postDate === new Date().toISOString().slice(0, 10));

  return (
    <ImsLayout active="social_publisher">
      <SectionHero
        eyebrow={lang === 'hi' ? 'सोशल मीडिया' : 'Social Media'}
        title={lang === 'hi' ? 'जागरूकता प्रकाशक' : 'Awareness Publisher'}
        hi={lang === 'hi' ? undefined : 'जागरूकता प्रकाशक'}
        icon="Megaphone"
        tone="orange"
        actions={
          <>
            <Button variant="hero" icon="Zap" disabled={busy} onClick={() => run(() => ims.socialRun(true), lang === 'hi' ? 'प्रकाशित' : 'Published')}>
              {lang === 'hi' ? 'अभी चलाएँ' : 'Run now'}
            </Button>
            <Button variant="hero" icon="PlusCircle" disabled={busy} onClick={() => run(() => ims.socialPostNow(), lang === 'hi' ? 'अतिरिक्त पोस्ट बनी' : 'Extra post created')}>
              {lang === 'hi' ? 'तुरंत पोस्ट' : 'Post now'}
            </Button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
          <span>🌅 {lang === 'hi' ? 'सुबह' : 'Morning'} <b className="text-white">{times.morning}</b></span>
          <span>🌙 {lang === 'hi' ? 'शाम' : 'Evening'} <b className="text-white">{times.evening}</b></span>
          <span className="inline-flex items-center gap-2">
            {lang === 'hi' ? 'ऑटो-प्रकाशन' : 'Auto-publish'}:{' '}
            <Toggle on={!!data?.autoApprove} onChange={(v) => saveConfig({ autoApprove: v })} label={data?.autoApprove ? 'ON' : 'OFF'} />
          </span>
          <span className="text-white/70">🇮🇳 Asia/Kolkata (IST)</span>
        </div>
      </SectionHero>

      {err && <Card className="mb-4 border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</Card>}
      {note && <Card className="mb-4 border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{note}</Card>}
      {!data && !err && <Spinner />}

      {data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            <KpiBox icon="CalendarClock" en="Posts / day" hi="पोस्ट / दिन" value={data.scheduledPerDay} />
            <KpiBox icon="CheckCircle2" en="Published" hi="प्रकाशित" value={data.stats.published} tone="text-emerald-600" />
            <KpiBox icon="CircleDot" en="Draft" hi="ड्राफ़्ट" value={data.stats.draft} />
            <KpiBox icon="AlertTriangle" en="Partial" hi="आंशिक" value={data.stats.partial} tone="text-amber-600" />
            <KpiBox icon="PlugZap" en="Channels on" hi="चैनल चालू" value={data.channels.filter((c) => c.enabled).length} tone="text-[#FF6600]" />
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{lang === 'hi' ? 'चैनल जोड़ें' : 'Channels'}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {data.channels.map((ch) => (
                <ChannelCard key={ch.platform} ch={ch} busy={busy}
                  onSave={(p, payload) => run(() => ims.socialConnect(p, payload), lang === 'hi' ? 'चैनल अपडेट' : 'Channel updated')}
                  onTest={(p) => ims.socialTestChannel(p)}
                  onFbExchange={(payload) => ims.socialFbExchange(payload).then((out) => { if (out && out.ok) run(() => Promise.resolve(out), lang === 'hi' ? 'स्थायी token सेव' : 'Permanent token saved'); return out; })}
                  onDisconnect={(p) => run(() => ims.socialDisconnect(p), lang === 'hi' ? 'डिसकनेक्ट' : 'Disconnected')} />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">{lang === 'hi' ? 'आज के पोस्ट' : "Today's posts"}</h2>
              <Button variant="ghost" icon="RefreshCw" disabled={busy} onClick={() => run(() => ims.socialPlan(true), lang === 'hi' ? 'फिर बनाया' : 'Regenerated')}>
                {lang === 'hi' ? 'फिर बनाएँ' : 'Regenerate'}
              </Button>
            </div>
            <div className="grid gap-3">
              {today.length === 0 && <Card className="p-6 text-center text-sm text-slate-400">{lang === 'hi' ? 'आज के लिए अभी कोई पोस्ट नहीं — ऊपर “अभी चलाएँ” दबाएँ।' : 'No posts for today yet — press “Run now” above.'}</Card>}
              {today.map((p) => (
                <PostCard key={p.id} post={p} busy={busy}
                  onPublish={(id) => run(() => ims.socialPublishPost(id), lang === 'hi' ? 'प्रकाशित' : 'Published')}
                  onEdit={(id, payload) => run(() => ims.socialEditPost(id, payload), lang === 'hi' ? 'सहेजा' : 'Saved')} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{lang === 'hi' ? 'हाल के पोस्ट' : 'Recent posts'}</h2>
            <Card className="divide-y divide-slate-100">
              {data.recent.length === 0 && <div className="p-6 text-center text-sm text-slate-400">—</div>}
              {data.recent.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#002344]">{p.postRef}</span>
                    <span className="ml-2 text-xs text-slate-500">{p.titleEn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip label={p.slot} />
                    <Chip label={p.status} tone={p.status} />
                    <span className="text-[11px] text-slate-400">{p.postDate}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <Card className="mt-6 p-4 text-xs text-slate-500">
            <b className="text-slate-700">{lang === 'hi' ? 'नोट' : 'Note'}:</b>{' '}
            {lang === 'hi'
              ? 'पोस्ट पहले ड्राफ़्ट बनती है, फिर तय समय पर हर जुड़े चैनल पर अपने-आप प्रकाशित होती है। टोकन बदलने पर तुरंत प्रभावी होते हैं।'
              : 'Posts are drafted first, then auto-published to every connected channel at the scheduled time. Updated tokens take effect immediately.'}
          </Card>
        </>
      )}
    </ImsLayout>
  );
}
