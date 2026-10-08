// Website → News / Blog: live "Awareness & Updates" feed.
// Pulls the same posts the social publisher creates (public endpoint, no auth)
// so whatever is published to social handles also appears on the website.
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Megaphone, ExternalLink } from 'lucide-react';
import { publicSocial } from '../ims/api';

const SITE = 'https://swastiksrijan.in/';

export default function SocialAwarenessFeed() {
  const [posts, setPosts] = useState([]);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);

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
          <motion.article key={p.id}
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
              <a href={SITE} target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FF6600] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#e65c00]">
                <ExternalLink size={13} /> {hi ? 'जुड़ें' : 'Join Us'}
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
