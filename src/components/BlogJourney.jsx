// SSF Blog — "Our Journey 2013 → 2026" explorer.
// Year + category filters, search, bilingual toggle, read-more modal and share.
// Renders from src/data/blogJourney.js (real documented history). It sits above
// the original blog grid, so no existing story is removed.
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, X, Search, Share2, Calendar } from 'lucide-react';
import { JOURNEY_POSTS, BLOG_CATEGORIES, categoryLabel } from '../data/blogJourney';

function sharePost(post, lang) {
  const url = `${window.location.origin}/Blog#${post.id}`;
  const text = `${post.title[lang]}\n${post.short[lang]}`;
  if (navigator.share) {
    navigator.share({ title: post.title[lang], text, url }).catch(() => {});
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, '_blank', 'noopener,noreferrer');
}

export default function BlogJourney() {
  const [lang, setLang] = useState('en');
  const [year, setYear] = useState('all');
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);

  const years = useMemo(() => [...new Set(JOURNEY_POSTS.map((p) => p.year))].sort((a, b) => b - a), []);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOURNEY_POSTS
      .filter((p) => year === 'all' || p.year === Number(year))
      .filter((p) => cat === 'all' || p.category === cat)
      .filter((p) => !q || (p.title[lang] + ' ' + p.short[lang] + ' ' + p.full[lang]).toLowerCase().includes(q))
      .sort((a, b) => b.year - a.year || String(a.date).localeCompare(String(b.date)));
  }, [year, cat, query, lang]);

  const hi = lang === 'hi';

  return (
    <section className="mx-auto mb-14 w-full max-w-7xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white sm:text-3xl">
            {hi ? 'हमारी यात्रा 2013 → 2026' : 'Our Journey 2013 → 2026'}
          </h2>
          <p className="mt-1 text-sm text-white/60">
            {hi ? 'एक पंजीयन से पूरे भारत के मिशन तक — दस्तावेज़ित यात्रा' : 'From one registration to a Pan-India mission — the documented journey'}
          </p>
        </div>
        <button onClick={() => setLang(hi ? 'en' : 'hi')}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
          <Languages size={14} /> {hi ? 'English' : 'हिंदी'}
        </button>
      </div>

      {/* filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={hi ? 'खोजें — शिक्षा, स्वास्थ्य, 2013 …' : 'Search — education, health, 2013 …'}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/40 outline-none focus:border-[#FF6600]" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setYear('all')} className={`rounded-full px-3 py-1 text-xs font-semibold ${year === 'all' ? 'bg-[#FF6600] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{hi ? 'सभी वर्ष' : 'All years'}</button>
          {years.map((y) => (
            <button key={y} onClick={() => setYear(y)} className={`rounded-full px-3 py-1 text-xs font-semibold ${Number(year) === y ? 'bg-[#FF6600] text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{y}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setCat('all')} className={`rounded-full px-3 py-1 text-xs font-semibold ${cat === 'all' ? 'bg-[#002344] text-white ring-1 ring-white/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{hi ? 'सभी श्रेणियाँ' : 'All categories'}</button>
          {BLOG_CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={`rounded-full px-3 py-1 text-xs font-semibold ${cat === c.key ? 'bg-[#002344] text-white ring-1 ring-white/30' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
              {c.icon} {categoryLabel(c.key, lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <motion.article key={post.id} id={post.id}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="overflow-hidden rounded-2xl bg-white text-black shadow-xl">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img src={post.image} alt={post.title[lang]} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#002344]/10 px-2 py-0.5 font-bold text-[#002344]"><Calendar size={12} />{post.year}</span>
                <span className="rounded-full bg-[#FF6600]/10 px-2 py-0.5 font-semibold text-[#c2410c]">{categoryLabel(post.category, lang)}</span>
              </div>
              <h3 className="text-lg font-bold leading-snug">{post.title[lang]}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-zinc-600">{post.short[lang]}</p>
              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => setActive(post)} className="text-sm font-semibold text-[#003366] hover:underline">
                  {hi ? 'और पढ़ें →' : 'Read more →'}
                </button>
                <button onClick={() => sharePost(post, lang)} title={hi ? 'साझा करें' : 'Share'}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">
                  <Share2 size={13} /> {hi ? 'शेयर' : 'Share'}
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="py-10 text-center text-sm text-white/50">{hi ? 'कोई परिणाम नहीं मिला।' : 'No results found.'}</p>
      )}

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setActive(null)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white text-black">
              <button onClick={() => setActive(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"><X size={18} /></button>
              <div className="aspect-[16/9] w-full">
                <img src={active.image} alt={active.title[lang]} className="h-full w-full object-cover" />
              </div>
              <div className="p-8">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[#002344]/10 px-2 py-0.5 font-bold text-[#002344]">{active.year}</span>
                  <span className="rounded-full bg-[#FF6600]/10 px-2 py-0.5 font-semibold text-[#c2410c]">{categoryLabel(active.category, lang)}</span>
                  <span className="text-zinc-400">{active.date}</span>
                </div>
                <h2 className="text-3xl font-bold">{active.title[lang]}</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-zinc-700">{active.full[lang]}</p>
                <button onClick={() => sharePost(active, lang)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#002344] px-4 py-2 text-sm font-semibold text-white hover:bg-[#001529]">
                  <Share2 size={15} /> {hi ? 'साझा करें' : 'Share this story'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
