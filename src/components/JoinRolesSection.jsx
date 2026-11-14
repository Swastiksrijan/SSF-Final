import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaShareAlt, FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../config/api";
import { JOIN_GROUPS, JOIN_ROLES, findGroup, findRole } from "../data/joinRoles";

const ROADMAP = [
  ["01", "अपनी भूमिका चुनें", "Choose your role"],
  ["02", "फॉर्म भरें", "Submit the form"],
  ["03", "समीक्षा", "Review by the Foundation"],
  ["04", "जुड़ाव एवं मार्गदर्शन", "Onboarding & guidance"],
];

const ROLE_FORM = { name: "", email: "", phone: "", message: "" };

export default function JoinRolesSection() {
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
    const link = `${window.location.origin}/Members?role=${role.slug}`;
    try {
      if (navigator.share) { await navigator.share({ title: `${role.hi} — Swastik Srijan Foundation`, text: `${role.hi} (${role.en}) — आवेदन हेतु लिंक:`, url: link }); return; }
      await navigator.clipboard.writeText(link);
      setShareNote(`लिंक कॉपी हो गया: ${link}`);
      window.setTimeout(() => setShareNote(""), 4000);
    } catch { setShareNote(link); }
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 3) return setError("कृपया अपना पूरा नाम लिखें।");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("कृपया सही ईमेल पता लिखें।");
    if (form.phone.replace(/\D/g, "").length < 7) return setError("कृपया सही मोबाइल नंबर लिखें।");
    if (form.message.trim().length < 10) return setError("कृपया संक्षेप में लिखें कि आप इस भूमिका में कैसे योगदान देंगे।");
    setStatus("submitting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/interest`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          type: "role",
          role: applyRole.slug,
          category: applyRole.hi,
          roleLabel: applyRole.hi,
          roleLabelEn: applyRole.en,
          fullName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.message || "अनुरोध भेजा नहीं जा सका। कृपया पुनः प्रयास करें।");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "अनुरोध भेजा नहीं जा सका। कृपया पुनः प्रयास करें।");
    }
  };

  return (
    <section id="roles" className="scroll-mt-28 border-t border-zinc-100 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#176447]">Join & Contribute • जुड़ाव एवं योगदान</p>
          <h2 className="mt-3 text-3xl font-black text-[#12345A] md:text-5xl">किस रूप में जुड़ना चाहेंगे?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-zinc-600 md:text-base">
            सदस्यता, स्वयंसेवा, विभाग, सलाहकार मंडल, प्रशासनिक स्तर या संस्थान-परियोजना — हर भूमिका की जानकारी और आवेदन एक ही जगह। कोई भी भूमिका चुनें और अपना विवरण भेजें। समीक्षा के बाद संस्था आपसे संपर्क करेगी।
          </p>
        </div>

        <ol className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map(([n, hi, en]) => (
            <li key={n} className="rounded-2xl border border-[#E3EAF0] bg-[#F8FAFB] p-5">
              <span className="text-xs font-black tracking-widest text-[#176447]">{n}</span>
              <p className="mt-2 text-base font-black text-[#12345A]">{hi}</p>
              <p className="text-xs font-semibold text-zinc-500">{en}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setGroup("all")} className={"rounded-full border px-4 py-2 text-sm font-bold transition " + (group === "all" ? "border-[#176447] bg-[#176447] text-white" : "border-zinc-200 bg-white text-[#12345A] hover:border-[#176447]")}>सभी</button>
            {JOIN_GROUPS.map(g => (
              <button key={g.id} type="button" onClick={() => setGroup(g.id)} className={"rounded-full border px-4 py-2 text-sm font-bold transition " + (group === g.id ? "border-[#176447] bg-[#176447] text-white" : "border-zinc-200 bg-white text-[#12345A] hover:border-[#176447]")}>{g.hi}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 lg:w-72">
            <FaSearch className="text-zinc-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="भूमिका खोजें… / Search a role" className="w-full bg-transparent text-sm outline-none" />
          </label>
        </div>

        {shareNote && <p className="mt-4 break-words rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{shareNote}</p>}

        {roles.length === 0 ? (
          <p className="mt-10 text-center text-zinc-400">कोई भूमिका नहीं मिली। दूसरा शब्द आज़माएँ।</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map(role => (
              <article key={role.slug} className="flex flex-col rounded-2xl border border-[#E3EAF0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#176447]">{findGroup(role.group)?.en}</span>
                <h3 className="mt-2 text-lg font-black text-[#12345A]">{role.hi}</h3>
                <p className="text-sm font-semibold text-zinc-500">{role.en}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.group === "internship" ? (
                    <a href="/Internship" className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2 text-sm font-bold text-white hover:bg-[#176447]">आवेदन करें <FaArrowRight /></a>
                  ) : (
                    <button type="button" onClick={() => openApply(role)} className="inline-flex items-center gap-2 rounded-xl bg-[#12345A] px-4 py-2 text-sm font-bold text-white hover:bg-[#176447]">आवेदन करें <FaArrowRight /></button>
                  )}
                  <button type="button" onClick={() => shareRole(role)} className="inline-flex items-center gap-2 rounded-xl border border-[#12345A]/20 px-4 py-2 text-sm font-bold text-[#12345A] hover:border-[#176447]"><FaShareAlt /> शेयर करें</button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
          <h3 className="text-lg font-black text-[#12345A]">महत्वपूर्ण सूचना</h3>
          <p className="mt-2 text-sm leading-7 text-[#5B6872]">
            यहाँ दी गई जानकारी सहयोग एवं जुड़ाव के संभावित क्षेत्रों का परिचय है, किसी नौकरी, पद, रिक्ति या तत्काल नियुक्ति की घोषणा नहीं। विभागीय या क्षेत्रीय प्रभारी का पद मुख्य समिति के अधीन कार्य-आवंटन है; इससे कोई व्यक्ति अपने-आप मुख्य समिति का सदस्य या स्वतंत्र प्रबंध निकाय का अधिकारी नहीं बनता। आवेदन भेजने या स्वयंसेवा करने से कोई पद अथवा वित्तीय अधिकार स्वतः प्राप्त नहीं होता; किसी भी नियुक्ति पर नियमावली एवं सक्षम निकाय का निर्णय अंतिम होगा।
          </p>
        </div>
      </div>

      {applyRole && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#12345A]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={closeApply}>
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl md:p-8" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={closeApply} aria-label="बंद करें" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-red-500 hover:text-white"><FaTimes /></button>
            {status === "success" ? (
              <div className="py-6 text-center">
                <FaCheckCircle className="mx-auto text-4xl text-[#176447]" />
                <h3 className="mt-4 text-2xl font-black text-[#12345A]">अनुरोध प्राप्त हुआ</h3>
                <p className="mt-2 text-zinc-600">धन्यवाद! <b>{applyRole.hi}</b> हेतु आपका अनुरोध संस्था तक पहुँच गया है। समीक्षा के बाद टीम आपसे संपर्क करेगी।</p>
                <button type="button" onClick={closeApply} className="mt-6 rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white hover:bg-[#176447]">ठीक है</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="text-xs font-black uppercase tracking-widest text-[#176447]">आवेदन / Apply</p>
                <h3 className="mt-2 text-2xl font-black text-[#12345A]">{applyRole.hi}</h3>
                <p className="text-sm font-semibold text-zinc-500">{applyRole.en}</p>
                <div className="mt-5 grid gap-3">
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="पूरा नाम" className="rounded-xl border p-3" />
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="ईमेल" className="rounded-xl border p-3" />
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="मोबाइल" className="rounded-xl border p-3" />
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} placeholder="संक्षेप में बताएँ कि आप इस भूमिका में कैसे योगदान देंगे" className="rounded-xl border p-3" />
                </div>
                {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
                <button type="submit" disabled={status === "submitting"} className="mt-5 w-full rounded-xl bg-[#12345A] px-6 py-3 font-bold text-white hover:bg-[#176447] disabled:opacity-50">{status === "submitting" ? "भेजा जा रहा है…" : "अनुरोध भेजें"}</button>
                <p className="mt-3 text-center text-xs text-zinc-400">आवेदन से कोई पद स्वतः प्राप्त नहीं होता; नियुक्ति नियमावली एवं सक्षम निकाय के अनुसार।</p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
