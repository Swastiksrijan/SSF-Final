import { useEffect, useMemo, useRef, useState } from "react";


import {
  ArrowRight, Search, X, Check, Phone, Mail, MapPin, ShieldAlert,
  ChevronDown, Sparkles, Clock, FileText, BadgeCheck, Send, Loader2
} from "lucide-react";
import HelpIcon from "../components/help/HelpIcon";
import {
  HELP_CATEGORIES, HELP_SERVICES, HELP_SERVICE_COUNT, HELP_FILTERS,
  HELP_PROCESS, HELP_AUDIENCE, HELP_POPULAR, HELP_FAQ,
  searchHelpServices, helpCategoriesWithCounts
} from "../data/digitalHelpCentre";
import { ENDPOINTS } from "../config/api";
import { CONTACT_INFO } from "../config/contact";

const NAVY = "#002344";
const ACCENT = "#FF6600";

const CATEGORIES_WITH_COUNTS = helpCategoriesWithCounts();

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function makeReference() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SSF-HC-${ymd}-${rand}`;
}

/* ------------------------------------------------------------------ hero */
function Hero({ onExplore, onRequest }) {
  return (
    <section className="relative overflow-hidden bg-[#001529] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:34px_34px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0e7490]/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FF6600]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-28 sm:px-6 md:pb-20 md:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#FFB347]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> SSF Digital Assistance
          </p>
          <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Free Digital Help Centre
          </h1>
          <p className="mt-3 font-hindi text-2xl font-bold text-[#FFD166] sm:text-3xl" lang="hi">
            निःशुल्क डिजिटल सहायता केंद्र
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
            Practical digital guidance for people, students, job seekers, families, farmers, community organisations and NGOs.
          </p>
          <p className="mt-2 max-w-xl font-hindi text-sm leading-relaxed text-blue-100/80 sm:text-base" lang="hi">
            लोगों, विद्यार्थियों, नौकरी तलाशने वालों, परिवारों, किसानों, सामुदायिक संस्थाओं और गैर-लाभकारी संस्थाओं के लिए व्यावहारिक डिजिटल सहायता।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs font-bold text-blue-100/85 sm:text-sm">
            {["Information", "Understanding", "Assistance", "Self-Reliance"].map((step, i, arr) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="rounded-lg bg-white/[0.07] px-2.5 py-1 ring-1 ring-white/10">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-[#FFB347]" aria-hidden="true" />}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={onExplore} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#FF6600]/25 transition hover:bg-[#ff7b26] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Explore Services <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button onClick={onRequest} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/10 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Request Assistance
            </button>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold text-blue-100/60">
            <span>{HELP_SERVICE_COUNT}+ services</span>
            <span>{HELP_CATEGORIES.length} categories</span>
            <span>Free assistance, where offered</span>
          </p>
        </div>

        {/* coded illustration — Apple-style product card grid, no stock art */}
        <div className="relative">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/60">How SSF helps</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "education", en: "Scholarships", hi: "छात्रवृत्ति" },
                { icon: "career", en: "Resume", hi: "रिज्यूमे" },
                { icon: "government", en: "Schemes", hi: "योजनाएँ" },
                { icon: "ngo", en: "NGO Help", hi: "संस्था सहायता" },
                { icon: "documents", en: "Forms", hi: "फॉर्म" },
                { icon: "cyber", en: "Cyber Safety", hi: "साइबर सुरक्षा" }
              ].map((c) => (
                <div key={c.en} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 transition hover:bg-white/10">
                  <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#0e7490]/25 text-[#7fd8e8] ring-1 ring-white/10">
                    <HelpIcon name={c.icon} className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm font-black text-white">{c.en}</p>
                  <p className="font-hindi text-xs text-blue-100/70" lang="hi">{c.hi}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2.5">
              <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
              <p className="text-[11px] font-semibold leading-snug text-emerald-50">Assistance &amp; guidance — decisions belong to the concerned authority.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- trust */
function TrustStrip() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <p className="text-center text-sm font-black text-[#002344] sm:text-base">
          Human guidance. Clear information. Responsible digital assistance.
        </p>
        <p className="mt-1 text-center font-hindi text-sm text-zinc-500" lang="hi">
          मानवीय सहयोग। स्पष्ट जानकारी। जिम्मेदार डिजिटल सहायता।
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "check", t: "Assistance, not a guarantee", d: "SSF guides you; approval stays with the concerned authority." },
            { icon: "cyber", t: "Your safety first", d: "We never ask for OTP, PIN, CVV or passwords." },
            { icon: "people", t: "For everyone", d: "Students, families, farmers, seniors, NGOs and communities." }
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#002344]/5 text-[#002344]">
                <HelpIcon name={x.icon} className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-black text-[#002344]">{x.t}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{x.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- finder */
function Finder({ query, setQuery, filter, setFilter, onOpen }) {
  const results = useMemo(() => searchHelpServices(query, filter).slice(0, 8), [query, filter]);
  const searching = query.trim().length > 0;
  const listId = "help-finder-results";

  return (
    <section id="help-finder" className="bg-[#f6f8fb] py-14 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[#002344] sm:text-4xl">How can we help you?</h2>
          <p className="mt-2 font-hindi text-lg text-zinc-500" lang="hi">हम आपकी किस प्रकार सहायता कर सकते हैं?</p>
        </div>

        <div className="mt-7">
          <label htmlFor="help-search" className="sr-only">Search for a service</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              id="help-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a service / सेवा खोजें"
              aria-controls={listId}
              autoComplete="off"
              className="w-full rounded-2xl border border-zinc-200 bg-white py-4 pl-12 pr-11 text-base text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-[#0e7490] focus:ring-4 focus:ring-[#0e7490]/10"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e7490]">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter services by category">
            {HELP_FILTERS.map((f) => (
              <button key={f.id} type="button" onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={"shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490] " +
                  (filter === f.id ? "bg-[#002344] text-white shadow-sm" : "border border-zinc-200 bg-white text-zinc-600 hover:border-[#002344]/30 hover:text-[#002344]")}>
                {f.en}
              </button>
            ))}
          </div>

          <div id={listId} aria-live="polite" className="mt-4">
            {searching && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                {results.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm font-bold text-[#002344]">No matching services found.</p>
                    <p className="mt-1 text-xs text-zinc-500">Try a different word, or <button type="button" className="font-bold text-[#0e7490] underline" onClick={() => { setQuery(""); setFilter("all"); }}>browse all services</button>.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-zinc-100">
                    {results.map((s) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => onOpen(s)}
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0e7490]">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#002344]/5 text-[#002344]">
                            <HelpIcon name={s.icon} className="h-4.5 w-4.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-[#002344]">{s.en}</span>
                            <span className="block truncate font-hindi text-xs text-zinc-500" lang="hi">{s.hi} · {s.categoryEn}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {!searching && (
              <p className="text-center text-xs font-semibold text-zinc-400">
                Try “resume”, “NGO registration”, “scholarship”, “project report”, “job” or “online form”.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- categories */
function CategoryCard({ cat, onOpen }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#0e7490]/30 hover:shadow-lg">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#002344] to-[#0e4a70] text-white shadow-sm">
        <HelpIcon name={cat.icon} className="h-5.5 w-5.5" />
      </span>
      <h3 className="text-base font-black leading-snug text-[#002344]">{cat.en}</h3>
      <p className="mt-0.5 font-hindi text-sm font-semibold text-zinc-500" lang="hi">{cat.hi}</p>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-600">{cat.blurbEn}</p>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-zinc-400">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" /> {cat.count} services
        </span>
        <button type="button" onClick={() => onOpen(cat)}
          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-[#0e7490] transition hover:bg-[#0e7490]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490]">
          Explore Services <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function CategoryGrid({ onOpenCategory }) {
  return (
    <section id="help-categories" className="bg-white py-14 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#002344] sm:text-4xl">Service Categories</h2>
          <p className="mt-2 font-hindi text-lg text-zinc-500" lang="hi">सेवा श्रेणियाँ</p>
          <p className="mt-3 text-sm text-zinc-500 sm:text-base">Organised help across education, career, government, documents, digital skills and more.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES_WITH_COUNTS.map((cat) => <CategoryCard key={cat.id} cat={cat} onOpen={onOpenCategory} />)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- popular */
function Popular({ onOpen }) {
  return (
    <section className="bg-[#062a52] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">Frequently Requested Services</h2>
            <p className="mt-1 font-hindi text-base text-blue-100/70" lang="hi">अक्सर अनुरोधित सेवाएँ</p>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-blue-100/60">A curated starting list — not a statistical popularity claim.</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HELP_POPULAR.map((s) => (
            <button key={s.id} type="button" onClick={() => onOpen(s)}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left transition hover:bg-white/12 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#7fd8e8] ring-1 ring-white/10">
                <HelpIcon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black leading-snug">{s.en}</span>
                <span className="mt-0.5 block truncate font-hindi text-xs text-blue-100/70" lang="hi">{s.hi}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- audience */
function Audience() {
  return (
    <section className="bg-[#f6f8fb] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#002344] sm:text-4xl">Who can use it?</h2>
          <p className="mt-2 font-hindi text-lg text-zinc-500" lang="hi">यह किसके लिए है?</p>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {HELP_AUDIENCE.map((a) => (
            <div key={a.en} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:shadow-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0e7490]/10 text-[#0e7490]">
                <HelpIcon name={a.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-black leading-snug text-[#002344]">{a.en}</span>
                <span className="block font-hindi text-xs text-zinc-500" lang="hi">{a.hi}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ how works */
function HowItWorks() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#002344] sm:text-4xl">How it works</h2>
          <p className="mt-2 font-hindi text-lg text-zinc-500" lang="hi">यह कैसे काम करता है</p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {HELP_PROCESS.map((step, i) => (
            <li key={step.n} className="relative">
              {i < HELP_PROCESS.length - 1 && (
                <span className="absolute left-[22px] top-12 hidden h-[2px] w-[calc(100%-1rem)] bg-gradient-to-r from-[#0e7490]/30 to-transparent md:block" aria-hidden="true" />
              )}
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#002344] text-sm font-black text-white shadow-sm">{step.n}</span>
              <h3 className="mt-4 text-base font-black text-[#002344]">{step.en}</h3>
              <p className="mt-0.5 font-hindi text-sm text-zinc-500" lang="hi">{step.hi}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- policy */
function Policy() {
  return (
    <section className="bg-[#f6f8fb] py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-6 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BadgeCheck className="h-5.5 w-5.5" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-black text-[#002344]">Free Assistance Policy</h2>
          <p className="mt-1 font-hindi text-sm text-zinc-500" lang="hi">निःशुल्क सहायता नीति</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            Where specifically offered, SSF provides digital assistance and guidance
            <strong className="text-[#002344]"> without an assistance charge</strong>.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">However, official third-party costs may still apply:</p>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
            {["Government fees", "Registration fees", "Examination fees", "Stamp duty", "Professional fees", "Notary charges", "Printing", "Courier", "Third-party platform charges"].map((x) => (
              <li key={x} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ShieldAlert className="h-5.5 w-5.5" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-black text-[#002344]">Service is not a guarantee</h2>
          <p className="mt-1 font-hindi text-sm text-zinc-500" lang="hi">सेवा गारंटी नहीं है</p>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-white/70 p-4 text-sm font-semibold leading-relaxed text-amber-900">
            SSF provides digital assistance and guidance. Final approval, eligibility and
            decisions remain with the concerned government department, institution or service provider.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-amber-800/80">
            SSF does not promise government approval, job placement, grant, scholarship, registration,
            certificate, loan, legal or medical outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- safety */
function Safety() {
  const forbidden = ["OTP", "Password", "ATM PIN", "UPI PIN", "CVV", "Authentication token", "Login credentials"];
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-red-100 bg-red-50/50 p-6 sm:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="md:flex-1">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <ShieldAlert className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#002344] sm:text-3xl">Safety &amp; Privacy</h2>
              <p className="mt-1 font-hindi text-base text-zinc-500" lang="hi">सुरक्षा एवं गोपनीयता</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
                SSF will <strong className="text-red-700">never</strong> ask for any of the following.
                Do not upload or share them with anyone — including us.
              </p>
              <p className="mt-2 max-w-xl font-hindi text-sm leading-relaxed text-zinc-500" lang="hi">
                पासवर्ड, OTP, PIN, CVV, authentication code या अन्य गोपनीय credentials साझा न करें।
              </p>
            </div>
            <div className="md:w-80">
              <ul className="flex flex-wrap gap-2 md:flex-col">
                {forbidden.map((f) => (
                  <li key={f} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2.5 text-sm font-bold text-red-700">
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ faq */
function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-[#f6f8fb] py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[#002344] sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-2 font-hindi text-lg text-zinc-500" lang="hi">अक्सर पूछे जाने वाले प्रश्न</p>
        </div>
        <div className="mt-8 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {HELP_FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0e7490]">
                    <span>
                      <span className="block text-sm font-black text-[#002344] sm:text-base">{item.q}</span>
                      <span className="mt-0.5 block font-hindi text-xs text-zinc-500" lang="hi">{item.qHi}</span>
                    </span>
                    <ChevronDown className={"h-5 w-5 shrink-0 text-zinc-400 transition-transform " + (isOpen ? "rotate-180" : "")} aria-hidden="true" />
                  </button>
                </h3>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-zinc-600">{item.a}</p>
                    <p className="mt-2 font-hindi text-sm leading-relaxed text-zinc-500" lang="hi">{item.aHi}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- cta/foot */
function RequestCta({ onRequest }) {
  return (
    <section className="bg-[#002344] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to get help?</h2>
        <p className="mt-2 font-hindi text-lg text-blue-100/80" lang="hi">सहायता के लिए तैयार हैं?</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100/80">
          Tell us what you need. SSF reviews your request and guides you on the next step.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={onRequest} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#FF6600]/25 transition hover:bg-[#ff7b26] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Request Assistance <Send className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href={`https://wa.me/${CONTACT_INFO.phones.primary.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/10">
            <Phone className="h-4 w-4" aria-hidden="true" /> WhatsApp SSF
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-blue-100/60">
          <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden="true" /> {CONTACT_INFO.primaryEmail}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Registered Office: Rewa, Madhya Pradesh</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Operational scope: Pan India</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- modals */
function ModalShell({ titleId, onClose, children, size = "max-w-2xl" }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#001529]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl`}>
        {children}
      </div>
    </div>
  );
}

function ServiceModal({ service, onClose, onRequest }) {
  const [showAll, setShowAll] = useState(false);
  const siblings = useMemo(() => HELP_SERVICES.filter((s) => s.categoryId === service.categoryId), [service]);
  const visible = showAll ? siblings : siblings.slice(0, 6);
  return (
    <ModalShell titleId="help-service-title" onClose={onClose} size="max-w-3xl">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#002344] to-[#0e4a70] text-white">
            <HelpIcon name={service.icon} className="h-5.5 w-5.5" />
          </span>
          <div>
            <h2 id="help-service-title" className="text-lg font-black leading-snug text-[#002344]">{service.en}</h2>
            <p className="font-hindi text-sm font-semibold text-zinc-500" lang="hi">{service.hi}</p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-[#0e7490]">{service.categoryEn}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close"
          className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e7490]">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-zinc-400">What is this?</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            <strong className="text-[#002344]">{service.en}</strong> is offered under
            <strong className="text-[#002344]"> {service.categoryEn}</strong>. SSF provides digital assistance and guidance to help you complete the correct process using the right official channel.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
            <h3 className="text-sm font-black text-[#002344]">Who can use this help?</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{service.whoEn}</p>
            <p className="mt-1.5 font-hindi text-xs leading-relaxed text-zinc-500" lang="hi">{service.whoHi}</p>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
            <h3 className="text-sm font-black text-[#002344]">What may be required?</h3>
            <ul className="mt-2 space-y-1.5">
              {service.docsEn.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />{d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-[#002344]">What can SSF help with?</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">{service.helpEn}</p>
          <p className="mt-1.5 font-hindi text-xs leading-relaxed text-zinc-500" lang="hi">{service.helpHi}</p>
        </div>

        <div>
          <h3 className="text-sm font-black text-[#002344]">How does it work?</h3>
          <ol className="mt-3 space-y-3">
            {[
              "Submit an assistance request.",
              "SSF reviews the request.",
              "Guidance / assistance is provided.",
              "You complete the official process.",
              "You receive the final result from the concerned authority, where applicable."
            ].map((t, i) => (
              <li key={t} className="flex items-start gap-3 text-sm text-zinc-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#002344] text-[11px] font-black text-white">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900">
          <strong>Important:</strong> Official eligibility and approval belong to the concerned authority.
          SSF provides guidance only. Never share OTP, PIN, password, CVV or authentication codes.
        </div>

        {siblings.length > 1 && (
          <div>
            <h3 className="text-sm font-black text-[#002344]">More in {service.categoryEn}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {visible.map((s) => (
                <span key={s.id} className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600">{s.en}</span>
              ))}
              {siblings.length > 6 && !showAll && (
                <button type="button" onClick={() => setShowAll(true)} className="rounded-xl border border-[#0e7490]/30 px-3 py-1.5 text-xs font-black text-[#0e7490] hover:bg-[#0e7490]/8">
                  +{siblings.length - 6} more
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-zinc-100 bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:px-7">
        <button type="button" onClick={() => onRequest(service)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#ff7b26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6600]">
          Request Assistance <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={onClose}
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-black text-zinc-600 transition hover:bg-zinc-50">
          Close
        </button>
      </div>
    </ModalShell>
  );
}

/* --------------------------------------------------------- request form */
function RequestModal({ service, categories, onClose }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    language: "English",
    categoryId: service?.categoryId || categories[0]?.id || "",
    serviceId: service?.id || "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [reference, setReference] = useState("");

  const servicesForCat = useMemo(
    () => HELP_SERVICES.filter((s) => s.categoryId === form.categoryId),
    [form.categoryId]
  );

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "categoryId") next.serviceId = "";
      return next;
    });
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 3) e.fullName = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Please enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number.";
    if (!form.serviceId) e.serviceId = "Please choose the service you need.";
    if (form.message.trim().length < 10) e.message = "Please describe your requirement in a few words.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setState("sending");
    const svc = HELP_SERVICES.find((s) => s.id === form.serviceId);
    const composed = [
      `Free Digital Help Centre request`,
      `Service: ${svc ? svc.en : "General"}`,
      `Language: ${form.language}`,
      ``,
      `Requirement: ${form.message.trim()}`
    ].join("\n");
    try {
      const res = await fetch(ENDPOINTS.INTEREST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "partner",
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          category: svc ? `Help Centre — ${svc.en}` : "Help Centre — General",
          message: composed
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Request failed");
      setReference(makeReference());
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <ModalShell titleId="help-request-title" onClose={onClose} size="max-w-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
        <div>
          <h2 id="help-request-title" className="text-lg font-black text-[#002344]">Request Assistance</h2>
          <p className="font-hindi text-sm text-zinc-500" lang="hi">सहायता अनुरोध करें</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close"
          className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {state === "done" ? (
        <div className="px-6 py-12 text-center sm:px-8">
          <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Check className="h-8 w-8" aria-hidden="true" />
          </span>
          <h3 className="text-2xl font-black text-[#002344]">Request Received</h3>
          <p className="mt-1 font-hindi text-base text-zinc-500" lang="hi">आपका सहायता अनुरोध प्राप्त हो गया है।</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-600">
            Thank you. The SSF team will review your request and reach out using the contact details you provided.
          </p>
          <div className="mx-auto mt-5 inline-flex flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-4">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Reference number</span>
            <span className="mt-1 font-mono text-lg font-black text-[#002344]">{reference}</span>
          </div>
          <button type="button" onClick={onClose}
            className="mt-7 inline-flex items-center justify-center rounded-2xl bg-[#002344] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#0e4a70]">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-7" noValidate>
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4 text-xs leading-relaxed text-red-800">
            <strong className="text-red-700">Please do not share confidential credentials.</strong> Do not upload or share passwords, OTPs, PINs, CVV, authentication codes or other confidential credentials.
            <span className="mt-1 block font-hindi" lang="hi">पासवर्ड, OTP, PIN, CVV, authentication code या अन्य गोपनीय credentials साझा न करें।</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required error={errors.fullName}>
              <input type="text" value={form.fullName} onChange={set("fullName")} autoComplete="name"
                className={inputCls(errors.fullName)} placeholder="Your full name" />
            </Field>
            <Field label="Preferred language" required>
              <select value={form.language} onChange={set("language")} className={inputCls()}>
                <option>English</option>
                <option>हिन्दी (Hindi)</option>
              </select>
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" value={form.email} onChange={set("email")} autoComplete="email"
                className={inputCls(errors.email)} placeholder="you@example.com" />
            </Field>
            <Field label="Mobile number" required error={errors.phone}>
              <input type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel"
                className={inputCls(errors.phone)} placeholder="+91 …" />
            </Field>
            <Field label="Category" required>
              <select value={form.categoryId} onChange={set("categoryId")} className={inputCls()}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.en}</option>)}
              </select>
            </Field>
            <Field label="Service" required error={errors.serviceId}>
              <select value={form.serviceId} onChange={set("serviceId")} className={inputCls(errors.serviceId)}>
                <option value="">Select a service…</option>
                {servicesForCat.map((s) => <option key={s.id} value={s.id}>{s.en}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Briefly describe your requirement" required error={errors.message}>
            <textarea rows={4} value={form.message} onChange={set("message")}
              className={inputCls(errors.message)} placeholder="Tell us what you need help with…" />
          </Field>

          {state === "error" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              We couldn't submit your request right now. Please try again.
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" disabled={state === "sending"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#FF6600] px-6 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-[#ff7b26] disabled:cursor-not-allowed disabled:opacity-70">
              {state === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…</> : <>Submit Request <Send className="h-4 w-4" aria-hidden="true" /></>}
            </button>
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 px-6 py-3.5 text-sm font-black text-zinc-600 transition hover:bg-zinc-50">
              Cancel
            </button>
          </div>
          <p className="text-center text-[11px] text-zinc-400">
            SSF provides assistance and guidance. Final decisions belong to the concerned authority.
          </p>
        </form>
      )}
    </ModalShell>
  );
}

function inputCls(error) {
  return "w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:ring-4 " +
    (error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-zinc-200 focus:border-[#0e7490] focus:ring-[#0e7490]/10");
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-zinc-500">
        {label}{required && <span className="text-[#FF6600]"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}

/* ----------------------------------------------------------------- page */
export default function FreeHelpCentre() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeService, setActiveService] = useState(null);
  const [requestService, setRequestService] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const openRequest = (service) => {
    setRequestService(service || null);
    setRequestOpen(true);
  };
  const openCategory = (cat) => {
    setFilter(cat.filter);
    setQuery("");
    scrollToId("help-finder");
  };

  return (
    <div className="bg-white">
      <Hero onExplore={() => scrollToId("help-finder")} onRequest={() => openRequest(null)} />
      <TrustStrip />
      <Finder query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} onOpen={setActiveService} />
      <CategoryGrid onOpenCategory={openCategory} />
      <Popular onOpen={setActiveService} />
      <Audience />
      <HowItWorks />
      <Policy />
      <Safety />
      <Faq />
      <RequestCta onRequest={() => openRequest(null)} />

      {activeService && (
        <ServiceModal service={activeService} onClose={() => setActiveService(null)}
          onRequest={(s) => { setActiveService(null); openRequest(s); }} />
      )}
      {requestOpen && (
        <RequestModal service={requestService} categories={CATEGORIES_WITH_COUNTS} onClose={() => setRequestOpen(false)} />
      )}
    </div>
  );
}
