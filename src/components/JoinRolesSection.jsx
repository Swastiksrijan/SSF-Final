import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaShareAlt, FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import { JOIN_GROUPS, JOIN_ROLES, findGroup, findRole } from "../data/joinRoles";
import { useLanguage } from "../context/LanguageContext";

const ROADMAP = [
  { hi: "अपनी भूमिका चुनें", en: "Choose your role" },
  { hi: "फॉर्म भरें", en: "Submit the form" },
  { hi: "समीक्षा", en: "Review by the Foundation" },
  { hi: "जुड़ाव एवं मार्गदर्शन", en: "Onboarding & guidance" },
];

const T = {
  hi: {
    kicker: "जुड़ाव एवं योगदान",
    title: "किस रूप में जुड़ना चाहेंगे?",
    intro: "सदस्यता, स्वयंसेवा, विभाग, सलाहकार मंडल, प्रशासनिक स्तर या संस्थान-परियोजना — हर भूमिका की जानकारी और आवेदन एक ही जगह। कोई भूमिका चुनें और अपना विवरण भेजें; समीक्षा के बाद संस्था आपसे संपर्क करेगी।",
    all: "सभी",
    searchPh: "भूमिका खोजें…",
    noMatch: "कोई भूमिका नहीं मिली। दूसरा शब्द आज़माएँ।",
    apply: "आवेदन करें",
    share: "शेयर करें",
    copied: link => `लिंक कॉपी हो गया: ${link}`,
    noteTitle: "महत्वपूर्ण सूचना",
    note: "यहाँ दी गई जानकारी सहयोग एवं जुड़ाव के संभावित क्षेत्रों का परिचय है, किसी नौकरी, पद, रिक्ति या तत्काल नियुक्ति की घोषणा नहीं। विभागीय या क्षेत्रीय प्रभारी का पद मुख्य समिति के अधीन कार्य-आवंटन है; इससे कोई व्यक्ति अपने-आप मुख्य समिति का सदस्य या स्वतंत्र प्रबंध निकाय का अधिकारी नहीं बनता। आवेदन भेजने या स्वयंसेवा करने से कोई पद अथवा वित्तीय अधिकार स्वतः प्राप्त नहीं होता; किसी भी नियुक्ति पर नियमावली एवं सक्षम निकाय का निर्णय अंतिम होगा।",
    applyKicker: "आवेदन",
    namePh: "पूरा नाम", emailPh: "ईमेल", phonePh: "मोबाइल",
    msgPh: "संक्षेप में बताएँ कि आप इस भूमिका में कैसे योगदान देंगे",
    submit: "अनुरोध भेजें", sending: "भेजा जा रहा है…",
    successTitle: "अनुरोध प्राप्त हुआ",
    successMsg: role => <>धन्यवाद! <b>{role}</b> हेतु आपका अनुरोध संस्था तक पहुँच गया है। समीक्षा के बाद टीम आपसे संपर्क करेगी।</>,
    ok: "ठीक है",
    errName: "कृपया अपना पूरा नाम लिखें।",
    errEmail: "कृपया सही ईमेल पता लिखें।",
    errPhone: "कृपया सही मोबाइल नंबर लिखें।",
    errMsg: "कृपया संक्षेप में लिखें कि आप इस भूमिका में कैसे योगदान देंगे।",
    errSend: "अनुरोध भेजा नहीं जा सका। कृपया पुनः प्रयास करें।",
    footer: "आवेदन से कोई पद स्वतः प्राप्त नहीं होता; नियुक्ति नियमावली एवं सक्षम निकाय के अनुसार।",
    shareText: role => `${role} — आवेदन हेतु लिंक:`,
  },
  en: {
    kicker: "Join & Contribute",
    title: "How would you like to join?",
    intro: "Membership, volunteering, departments, advisory councils, administrative levels or institution and project posts — every role's details and application in one place. Pick any role and send your details; the Foundation will contact you after review.",
    all: "All",
    searchPh: "Search a role…",
    noMatch: "No role found. Try another word.",
    apply: "Apply",
    share: "Share",
    copied: link => `Link copied: ${link}`,
    noteTitle: "Important note",
    note: "This is an introduction to the possible areas of support and involvement, not an announcement of any job, post, vacancy or immediate appointment. A departmental or field in-charge post is a working assignment under the Managing Committee; it does not by itself make the holder a member of the Managing Committee or an officer of an independent governing body. Sending an application or volunteering does not by itself confer any post or financial authority; the rules and the competent body decide every appointment.",
    applyKicker: "Application",
    namePh: "Full name", emailPh: "Email", phonePh: "Mobile",
    msgPh: "Briefly tell us how you would contribute in this role",
    submit: "Send request", sending: "Sending…",
    successTitle: "Request received",
    successMsg: role => <>Thank you! Your request for <b>{role}</b> has reached the Foundation. The team will contact you after review.</>,
    ok: "Okay",
    errName: "Please enter your full name.",
    errEmail: "Please enter a valid email address.",
    errPhone: "Please enter a valid mobile number.",
    errMsg: "Please briefly describe how you would contribute in this role.",
    errSend: "The request could not be sent. Please try again.",
    footer: "Sending an application does not confer any post; appointment follows the rules and the competent body.",
    shareText: role => `${role} — application link:`,
  },
};

const ROLE_FORM = { name: "", email: "", phone: "", message: "" };

export default function JoinRolesSection() {
  const { lang } = useLanguage();
  const t = T[lang] || T.hi;
  const [group, setGroup] = useState("all");
  const [query, setQuery] = useState("");
  const [applyRole, setApplyRole] = useState(null);
  const [form, setForm] = useState(ROLE_FORM);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [shareNote, setShareNote] = useState("");
  const openedDeepLink = useRef(false);

  const openApply = role => { setApplyRole(role); setForm(ROLE_FORM); setStatus("idle"); setError(""); document.body.style.overflow = "hidden"; };
  const closeApply = () => { setApplyRole(null); document.body.style.overflow = ""; };

  // A share link like /Members?role=<slug> opens that role's form directly, so
  // a role can be circulated to exactly the people it fits.
  useEffect(() => {
    if (openedDeepLink.current) return;
    const slug = new URLSearchParams(window.location.search).get("role");
    if (!slug) return;
    const role = findRole(slug);
    if (!role) return;
    openedDeepLink.current = true;
    setGroup(role.group);
    setQuery("");
    window.setTimeout(() => openApply(role), 200);
  }, []);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const roles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return JOIN_ROLES.filter(r => (group === "all" || r.group === group) && (!q || r.hi.toLowerCase().includes(q) || r.en.toLowerCase().includes(q)));
  }, [group, query]);

  const shareRole = async role => {
    // Share the crawlable card /Members/<slug>: social previews show the role
    // name, and the page redirects straight to that role's form.
    const link = `${window.location.origin}/Members/${role.slug}`;
    try {
      if (navigator.share) { await navigator.share({ title: `${role.en} — Swastik Srijan Foundation`, text: t.shareText(`${role.hi} (${role.en})`), url: link }); return; }
      await navigator.clipboard.writeText(link);
      setShareNote(t.copied(link));
      window.setTimeout(() => setShareNote(""), 4000);
    } catch { setShareNote(link); }
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 3) return setError(t.errName);
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError(t.errEmail);
    if (form.phone.replace(/\D/g, "").length < 7) return setError(t.errPhone);
    if (form.message.trim().length < 10) return setError(t.errMsg);
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/interest`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "role",
          role: applyRole.slug,
          category: applyRole.hi,
          roleLabelEn: applyRole.en,
          fullName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.message || t.errSend);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || t.errSend);
    }
  };

  const other = r => (lang === "hi" ? r.en : r.hi);

  return (
    <section id="roles" style={{ scrollMarginTop: "calc(var(--ssf-header-h, 160px) + 1rem)" }} className="-mt-6 bg-[#F6F9FB] px-5 pb-16 sm:-mt-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative z-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12345A] via-[#153f63] to-[#176447] px-5 py-10 text-white shadow-2xl ring-1 ring-white/10 sm:px-8 md:px-12 md:py-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F7A814]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.28em] text-[#F7A814]">{t.kicker} • {lang === "hi" ? "Join & Contribute" : "जुड़ाव एवं योगदान"}</p>
            <h2 className="mt-4 text-center font-serif text-3xl font-black leading-tight md:text-5xl">{t.title}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-7 text-white/85 md:text-base">{t.intro}</p>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setGroup("all")} className={"rounded-full border px-4 py-2 text-sm font-bold transition " + (group === "all" ? "border-white bg-white text-[#12345A]" : "border-white/25 bg-white/10 text-white hover:border-white hover:bg-white/20")}>{t.all}</button>
                {JOIN_GROUPS.map(g => (
                  <button key={g.id} type="button" onClick={() => setGroup(g.id)} className={"rounded-full border px-4 py-2 text-sm font-bold transition " + (group === g.id ? "border-white bg-white text-[#12345A]" : "border-white/25 bg-white/10 text-white hover:border-white hover:bg-white/20")}>{lang === "hi" ? g.hi : g.en}</button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-3 py-2 lg:w-72">
                <FaSearch className="text-white/70" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPh} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60" />
              </label>
            </div>
          </div>
        </div>

        <ol className="mx-auto mt-8 grid max-w-5xl gap-3 px-2 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((step, i) => (
            <li key={i} className="flex items-start gap-3 rounded-2xl border border-[#E3EAF0] bg-white p-4 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#176447] text-sm font-black text-white">{i + 1}</span>
              <div>
                <p className="text-sm font-black text-[#12345A]">{lang === "hi" ? step.hi : step.en}</p>
                <p className="text-[11px] font-semibold text-zinc-500">{lang === "hi" ? step.en : step.hi}</p>
              </div>
            </li>
          ))}
        </ol>

        {shareNote && <p className="mt-4 break-words rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{shareNote}</p>}

        {roles.length === 0 ? (
          <p className="mt-10 text-center text-zinc-400">{t.noMatch}</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map(role => (
              <article key={role.slug} className="flex flex-col rounded-2xl border border-[#E3EAF0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#176447]">{lang === "hi" ? findGroup(role.group)?.hi : findGroup(role.group)?.en}</span>
                <h3 className="mt-2 text-lg font-black text-[#12345A]">{lang === "hi" ? role.hi : role.en}</h3>
                <p className="text-sm font-semibold text-zinc-500">{other(role)}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.group === "internship" ? (
                    <a href="/Internship" className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2 text-sm font-bold text-white hover:bg-[#176447]">{t.apply} <FaArrowRight /></a>
                  ) : (
                    <button type="button" onClick={() => openApply(role)} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2 text-sm font-bold text-white hover:bg-[#176447]">{t.apply} <FaArrowRight /></button>
                  )}
                  <button type="button" onClick={() => shareRole(role)} className="inline-flex items-center gap-2 rounded-xl border border-[#12345A]/20 px-4 py-2 text-sm font-bold text-[#12345A] hover:border-[#176447]"><FaShareAlt /> {t.share}</button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
          <h3 className="text-lg font-black text-[#12345A]">{t.noteTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-[#5B6872]">{t.note}</p>
        </div>
      </div>

      {applyRole && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#12345A]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={closeApply}>
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeApply} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-500 hover:text-white"><FaTimes /></button>
            {status === "success" ? (
              <div className="py-6 text-center">
                <FaCheckCircle className="mx-auto text-4xl text-[#176447]" />
                <h3 className="mt-4 text-2xl font-black text-[#12345A]">{t.successTitle}</h3>
                <p className="mt-2 text-zinc-600">{t.successMsg(lang === "hi" ? applyRole.hi : applyRole.en)}</p>
                <button type="button" onClick={closeApply} className="mt-6 rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white hover:bg-[#176447]">{t.ok}</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="text-xs font-black uppercase tracking-widest text-[#176447]">{t.applyKicker}</p>
                <h3 className="mt-2 text-2xl font-black text-[#12345A]">{lang === "hi" ? applyRole.hi : applyRole.en}</h3>
                <p className="text-sm font-semibold text-zinc-500">{other(applyRole)}</p>
                <div className="mt-5 grid gap-3">
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder={t.namePh} className="rounded-xl border p-3" />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t.emailPh} className="rounded-xl border p-3" />
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder={t.phonePh} className="rounded-xl border p-3" />
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} placeholder={t.msgPh} className="rounded-xl border p-3" />
                </div>
                {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
                <button type="submit" disabled={status === "submitting"} className="mt-5 w-full rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white hover:bg-[#176447] disabled:opacity-50">{status === "submitting" ? t.sending : t.submit}</button>
                <p className="mt-3 text-center text-xs text-zinc-400">{t.footer}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
