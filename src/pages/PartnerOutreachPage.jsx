import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Share2, Mail, MessageCircle, FileText, Building2, ClipboardCheck, ExternalLink } from "lucide-react";

const SITE = "https://swastiksrijan.in";
const templates = {
  csr: {
    title: "CSR / Corporate Partnership",
    subject: "CSR Partnership Proposal Discussion | Swastik Srijan Foundation Samiti",
    body: "Dear CSR Team,\n\nGreetings from Swastik Srijan Foundation Samiti, a grassroots organisation based in Rewa, Madhya Pradesh, continuing its journey since 2013. We would welcome an opportunity to understand your CSR priorities and explore a suitable, measurable community project in areas such as education and digital learning, health and nutrition, skill development, women and youth empowerment, rural development and environment.\n\nWe can share an organisation profile, concept note, project-wise budget and supporting documents for your review. Any proposal will be aligned with your CSR policy, applicable law and eligibility requirements.\n\nWebsite: " + SITE + "\nFunding & Partnerships: " + SITE + "/FundingPartnerships\n\nRegards,\nSwastik Srijan Foundation Samiti\nRewa, Madhya Pradesh | +91 97183 46691"
  },
  donor: {
    title: "Individual Donor / Philanthropy",
    subject: "Support grassroots education and community development | SSF",
    body: "Namaste,\n\nSwastik Srijan Foundation Samiti has continued its social journey since 2013 with a grassroots focus. We invite responsible support for clearly defined work in education, digital learning, health, skills, women and youth development, rural communities and the environment.\n\nWe share project purpose and available details transparently, and record contributions for their stated purpose. Please explore our work and official support options: " + SITE + "\n\nFor discussion: +91 97183 46691\nSwastik Srijan Foundation Samiti"
  },
  equipment: {
    title: "Equipment / Machinery / In-kind Support",
    subject: "Request to explore equipment and in-kind partnership | SSF",
    body: "Dear Partner,\n\nSwastik Srijan Foundation Samiti, Rewa (Madhya Pradesh), invites discussion with manufacturers and institutions willing to consider computers, learning equipment, tools, machinery, raw materials, workspace, technical training, installation or maintenance support for suitable community and livelihood initiatives.\n\nNo production unit has been launched yet. Any proposed equipment will first be assessed for actual need, feasibility, safety, installation and recurring costs. We would be glad to discuss a suitable, documented partnership.\n\nWebsite: " + SITE + "\nContact: +91 97183 46691"
  }
};

export default function PartnerOutreachPage() {
  const [kind, setKind] = useState("csr");
  const [copied, setCopied] = useState(false);
  const item = templates[kind];
  const shareText = useMemo(() => item.title + "\n\n" + item.body, [item]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareText); setCopied(true); window.setTimeout(() => setCopied(false), 2200); }
    catch { window.prompt("Copy this outreach message:", shareText); }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: item.title, text: shareText, url: SITE }); } catch (e) { if (e?.name !== "AbortError") console.error(e); }
    } else await copy();
  };
  const mailto = "mailto:?subject=" + encodeURIComponent(item.subject) + "&body=" + encodeURIComponent(item.body);
  const whatsapp = "https://wa.me/?text=" + encodeURIComponent(shareText);
  const social = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(SITE + "/FundingPartnerships");
  return <main className="min-h-screen bg-[#F7F9FC] text-[#26343D]">
    <section className="bg-[#002344] px-5 pb-16 pt-36 text-white md:px-8 md:pb-20 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[.25em] text-[#ffb347]">SSF · Donor & CSR Outreach Desk</p>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-tight md:text-6xl">One organisation. The right message. The right partner.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/80 md:text-lg">Prepare clear, relevant outreach for CSR teams, companies, donors, institutions and equipment partners. Share the official website and invite a project discussion—without making unsupported funding claims.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/FundingPartnerships" className="rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b]">Explore funding options</Link>
          <Link to="/Contact" className="rounded-full border border-white/30 px-6 py-3 font-bold text-white">Send partnership enquiry</Link>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-[.8fr_1.2fr]">
      <aside className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-extrabold text-[#002344]">Choose the audience</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Each audience gets a different message. Select one to prepare the draft.</p>
          <div className="mt-5 space-y-2">
            {Object.entries(templates).map(([key, value]) => <button key={key} onClick={() => setKind(key)} className={"w-full rounded-xl border p-4 text-left text-sm font-bold transition " + (kind === key ? "border-[#2d6a4f] bg-[#EAF2EE] text-[#002344]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}>{value.title}</button>)}
          </div>
        </div>
        <div className="rounded-2xl border border-[#C9DDD1] bg-[#F1F6F3] p-6">
          <h3 className="font-extrabold text-[#002344]">Important before sending</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>Check the company’s actual CSR themes and current application route.</li>
            <li>Attach a project-specific concept note and budget—not a generic request.</li>
            <li>Confirm current 80G and CSR implementing-agency eligibility before making any claim.</li>
            <li>Do not send repeated bulk messages or contact personal addresses without a proper basis.</li>
          </ul>
        </div>
      </aside>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-wider text-[#2d6a4f]">Ready-to-use outreach draft</p><h2 className="mt-1 text-2xl font-extrabold text-[#002344]">{item.title}</h2></div>
          <span className="rounded-full bg-[#EAF2EE] px-3 py-1 text-xs font-bold text-[#2d6a4f]">Editable message</span>
        </div>
        <label className="mt-6 block text-xs font-bold uppercase tracking-wider text-slate-500">Email subject</label>
        <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-[#002344]">{item.subject}</div>
        <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
        <textarea readOnly value={item.body} rows={14} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 focus:outline-none" />
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-[#002344] px-5 py-3 text-sm font-bold text-white"><Copy size={16}/>{copied ? "Copied" : "Copy message"}</button>
          <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-3 text-sm font-bold text-white"><Share2 size={16}/>Share</button>
          <a href={mailto} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#002344]"><Mail size={16}/>Open email</a>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#002344]"><MessageCircle size={16}/>WhatsApp</a>
          <a href={social} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-[#002344]"><ExternalLink size={16}/>LinkedIn share</a>
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-500">These controls prepare and open a message for you to review. They do not automatically email companies, publish to social accounts or submit grant applications. Those actions require authorised accounts, recipient data, the relevant platform/API access and your approval.</p>
      </div>
    </section>
    <section className="bg-white px-5 py-14 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 p-6"><Building2 className="text-[#2d6a4f]" size={28}/><h3 className="mt-3 font-extrabold text-[#002344]">Company matching</h3><p className="mt-2 text-sm leading-6 text-slate-600">Match each company to the themes it actually supports and its published application process.</p></article>
        <article className="rounded-2xl border border-slate-200 p-6"><FileText className="text-[#2d6a4f]" size={28}/><h3 className="mt-3 font-extrabold text-[#002344]">Proposal preparation</h3><p className="mt-2 text-sm leading-6 text-slate-600">Prepare a concept note, DPR, item-wise budget, documents and outcomes for each eligible opportunity.</p></article>
        <article className="rounded-2xl border border-slate-200 p-6"><ClipboardCheck className="text-[#2d6a4f]" size={28}/><h3 className="mt-3 font-extrabold text-[#002344]">Application tracking</h3><p className="mt-2 text-sm leading-6 text-slate-600">Record submissions, acknowledgement, follow-up dates, replies and next steps in a central register.</p></article>
      </div>
      <div className="mx-auto mt-8 max-w-7xl rounded-2xl bg-[#002344] p-7 text-white md:p-9">
        <h2 className="text-2xl font-extrabold">For companies and institutions</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">If your organisation would like to discuss CSR, philanthropy, equipment, institutional partnership or market linkage, please contact SSF through the official enquiry form.</p>
        <Link to="/Contact" className="mt-5 inline-flex rounded-full bg-[#fb8500] px-6 py-3 font-bold text-[#17212b]">Contact SSF</Link>
      </div>
    </section>
  </main>;
}
