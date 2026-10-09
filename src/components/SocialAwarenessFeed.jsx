// Website → News / Blog: live "Awareness & Updates" feed.
// Pulls the same posts the social publisher creates (public endpoint, no auth)
// so whatever is published to social handles also appears on the website.
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Languages, Megaphone, ExternalLink, Share2, X as CloseIcon, Check, Copy,
  MessageCircle, Send, Facebook, Linkedin, Twitter, Link2,
} from 'lucide-react';
import { publicSocial } from '../ims/api';

const SITE = 'https://swastiksrijan.in/';

// Keep the wording short so WhatsApp/Facebook/X previews stay clean.
function shareText(post, hi) {
  const title = hi ? post.titleHi : post.titleEn;
  const body = (hi ? post.bodyHi : post.bodyEn) || '';
  const excerpt = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(2, 4)
    .join('\n');
  return [title, excerpt, post.hashtags].filter(Boolean).join('\n\n');
}

async function shareImageFile(url, name) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const mime = blob.type || 'image/png';
    if (!mime.startsWith('image/')) return null;
    const ext = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
    const file = new File([blob], `${name}.${ext}`, { type: mime });
    return navigator.canShare?.({ files: [file] }) ? file : null;
  } catch { return null; }
}

export default function SocialAwarenessFeed() {
  const [posts, setPosts] = useState([]);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    let live = true;
    publicSocial.posts(12)
      .then((r) => { if (live) setPosts(r.posts || []); })
      .catch(() => { if (live) setPosts([]); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, []);

  if (loading || posts.length === 0) return null;
  const hi = lang === 'hi';
  const open = posts.find((p) => p.id === openId) || null;

  return (
    <section id="awareness" className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FF6600] text-white"><Megaphone size={20} /></span>
          <div>
            <h2 className="text-xl font-black text-white">{hi ? 'जागरूकता और अपडेट' : 'Awareness & Updates'}</h2>
            <p className="text-xs text-white/60">{hi ? 'हमारे सोशल चैनलों से सीधे' : 'Straight from our social channels'}</p>
          </div>
        </div>
        <button onClick={() => setLang(hi ? 'en' : 'hi')}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
          <Languages size={14} /> {hi ? 'English' : 'हिंदी'}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <motion.article key={p.id} id={`awareness-${p.id}`}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <a href={SITE} target="_blank" rel="noopener noreferrer" aria-label="Join Us — swastiksrijan.in" className="block">
              <img src={publicSocial.imageUrl(p)} alt="" className="aspect-square w-full object-cover" loading="lazy" />
            </a>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#FFD166]">
                <span>{p.kind === 'awareness' ? (hi ? 'जागरूकता दिवस' : 'Awareness Day') : (hi ? 'दैनिक' : 'Daily')}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/40">{p.date}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{hi ? p.titleHi : p.titleEn}</h3>
              <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-relaxed text-white/70">
                {(hi ? p.bodyHi : p.bodyEn).split('\n').slice(2, 5).join('\n').trim()}
              </p>
              <p className="mt-3 text-[10px] text-white/40">{p.hashtags}</p>
              <div className="mt-3 flex items-center gap-2">
                <a href={SITE} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6600] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#e65c00]">
                  <ExternalLink size={13} /> {hi ? 'जुड़ें' : 'Join Us'}
                </a>
                <button type="button" onClick={() => setOpenId(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-white/10">
                  <Share2 size={13} /> {hi ? 'शेयर' : 'Share'}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {open && (
        <ShareSheet
          key={open.id}
          post={open}
          hi={hi}
          copied={copiedId === open.id}
          onCopied={() => { setCopiedId(open.id); window.setTimeout(() => setCopiedId(null), 1800); }}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}

function ShareSheet({ post, hi, copied, onCopied, onClose }) {
  const img = publicSocial.imageUrl(post);
  const url = `${SITE}Blog#awareness-${post.id}`;
  const text = shareText(post, hi);
  const enc = encodeURIComponent;
  const label = (en, hiText) => (hi ? hiText : en);

  const openWindow = (href) => window.open(href, '_blank', 'noopener,noreferrer');

  const targets = [
    { key: 'whatsapp', icon: MessageCircle, name: 'WhatsApp', color: 'bg-[#25D366]', href: `https://wa.me/?text=${enc(`${text}\n\n${url}`)}` },
    { key: 'facebook', icon: Facebook, name: 'Facebook', color: 'bg-[#1877F2]', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}` },
    { key: 'x', icon: Twitter, name: 'X', color: 'bg-black', href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { key: 'linkedin', icon: Linkedin, name: 'LinkedIn', color: 'bg-[#0A66C2]', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { key: 'telegram', icon: Send, name: 'Telegram', color: 'bg-[#229ED9]', href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
    { key: 'email', icon: MessageCircle, name: label('Email', 'ईमेल'), color: 'bg-white/15', href: `mailto:?subject=${enc(post.titleEn)}&body=${enc(`${text}\n\n${url}`)}` },
  ];

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`${text}\n\n${url}`); onCopied(); } catch { /* clipboard blocked */ }
  };

  const moreShare = async () => {
    try {
      const file = await shareImageFile(img, `SSF-${post.id}`);
      if (file) { await navigator.share({ title: post.titleEn, text, files: [file] }); return; }
      if (navigator.share) { await navigator.share({ title: post.titleEn, text, url }); return; }
      await navigator.clipboard.writeText(`${text}\n\n${url}`); onCopied();
    } catch (e) { if (e?.name !== 'AbortError') { /* user dismissed */ } }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl border border-white/15 bg-[#001529] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 border-b border-white/10 p-4">
          <img src={img} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{hi ? post.titleHi : post.titleEn}</p>
            <p className="mt-0.5 text-[11px] text-white/50">{label('Share this post to', 'यह पोस्ट शेयर करें')}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/10">
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4">
          {targets.map((t) => (
            <button key={t.key} type="button" onClick={() => openWindow(t.href)}
              className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-white/5">
              <span className={`grid h-11 w-11 place-items-center rounded-full text-white ${t.color}`}><t.icon size={20} /></span>
              <span className="text-[11px] font-semibold text-white/80">{t.name}</span>
            </button>
          ))}
          <button type="button" onClick={copyLink}
            className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-white/5">
            <span className={`grid h-11 w-11 place-items-center rounded-full text-white ${copied ? 'bg-emerald-600' : 'bg-white/15'}`}>
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </span>
            <span className="text-[11px] font-semibold text-white/80">{copied ? label('Copied', 'कॉपी हुआ') : label('Copy', 'कॉपी')}</span>
          </button>
          <button type="button" onClick={moreShare}
            className="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center hover:bg-white/5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FF6600] text-white"><Share2 size={20} /></span>
            <span className="text-[11px] font-semibold text-white/80">{label('More', 'और')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-[11px] text-white/50">
          <Link2 size={13} /> <span className="truncate">{url}</span>
        </div>
      </div>
    </div>
  );
}
