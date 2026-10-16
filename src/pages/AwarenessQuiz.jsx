import { useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaCheckCircle, FaTimesCircle, FaWhatsapp, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { Link } from "@tanstack/react-router";
import AuthModal from "../components/AuthModal";
import { ENDPOINTS } from "../config/api";
import { generateCertificate } from "../utils/generateCertificate";

const SESSION_KEY = "ssf_user_session";
const QUIZ_ID = "ssf-awareness-1";
const readSession = () => {
  try { const raw = sessionStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const sessionUser = (e) => e?.detail || null;

/**
 * Public awareness quiz. The questions are fetched from the server; the answer
 * key stays on the server. On a pass (>= 80%) the certificate is issued
 * automatically and can be downloaded immediately — no admin step required.
 */
export default function AwarenessQuiz() {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [user, setUser] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(ENDPOINTS.AWARENESS_QUIZ(QUIZ_ID))
      .then((r) => r.json())
      .then((d) => setQuiz(d.quiz))
      .catch(() => setError("Quiz load nahi ho payi. Please try again."));
    const fn = (e) => setUser(sessionUser(e));
    window.addEventListener("ssf-auth-changed", fn);
    return () => window.removeEventListener("ssf-auth-changed", fn);
  }, []);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  const submit = async () => {
    if (!user) { setAuthOpen(true); return; }
    setSubmitting(true); setError("");
    try {
      // Send the chosen option INDEX only — never the answer key (the server owns it).
      const payload = { accountId: user.id, learner: { fullName: user.fullName, email: user.email }, answers };
      const res = await fetch(ENDPOINTS.AWARENESS_QUIZ_SUBMIT(QUIZ_ID), {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submit fail ho gaya.");
      setResult(data);
    } catch (e) { setError(e.message || "Submit fail ho gaya."); }
    finally { setSubmitting(false); }
  };

  const download = async () => {
    const cert = result?.certificate;
    if (!cert) return;
    await generateCertificate(cert.learnerName, "Awareness Quiz", new Date(cert.issuedAt || Date.now()), cert.certificateId, null, cert.courseTitle || "Awareness Quiz");
  };

  const waHref = useMemo(() => {
    const t = "Namaste SSF. I passed the SSF Awareness Quiz. Certificate: " + (result?.certificate?.certificateId || "") + ". Learner: " + (user?.fullName || "");
    return "https://wa.me/919718346691?text=" + encodeURIComponent(t);
  }, [result, user]);

  return (
    <div className="min-h-screen bg-[#EAF0F6] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <FaGraduationCap className="text-4xl text-[#12345A]" />
          <div>
            <h1 className="text-2xl font-black text-[#12345A] md:text-3xl">SSF Awareness Quiz / जागरूकता प्रश्नोत्तरी</h1>
            <p className="text-sm text-zinc-500">10 प्रश्न · Pass 80% · Pass होते ही certificate तुरंत मिलेगा।</p>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

        {!quiz && !error && <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-400">Loading…</div>}

        {quiz && !result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-600">
              <span>{answeredCount}/{quiz.questions.length} answered</span>
              <span>Pass: {quiz.passPercent}%</span>
            </div>
            {quiz.questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
                <div className="text-[11px] font-black uppercase tracking-widest text-[#12345A]">{q.subject} · Q{i + 1}</div>
                <div className="mt-1 text-base font-bold text-[#12345A]">{q.q.en}</div>
                <div className="text-sm text-zinc-500">{q.q.hi}</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((o, idx) => {
                    const chosen = Number(answers[q.id]) === idx;
                    return (
                      <button key={idx} type="button" onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                        className={"rounded-xl border px-4 py-2 text-left text-sm font-semibold transition " + (chosen ? "border-[#176447] bg-[#FAF9F5] text-[#12345A]" : "border-zinc-200 bg-white text-zinc-700 hover:border-[#12345A]/40")}>
                        <span className="font-black">{String.fromCharCode(65 + idx)}.</span> {o.en} <span className="text-zinc-400">/ {o.hi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button type="button" disabled={submitting} onClick={submit}
              className="w-full rounded-xl bg-[#176447] px-5 py-4 text-base font-black text-white disabled:opacity-50">
              {submitting ? "Submitting…" : user ? "Submit & get certificate" : "Login to submit & get certificate"}
            </button>
          </div>
        )}

        {result && (
          <div className={"rounded-2xl border p-6 shadow-sm md:p-8 " + (result.passed ? "border-emerald-200 bg-white" : "border-red-200 bg-white")}>
            <div className="flex items-center gap-3">
              {result.passed ? <FaCheckCircle className="text-3xl text-[#176447]" /> : <FaTimesCircle className="text-3xl text-red-500" />}
              <div>
                <div className="text-xl font-black text-[#12345A]">{result.passed ? "Congratulations! आप पास हो गए 🎉" : "Not passed yet / अभी पास नहीं"}</div>
                <div className="text-sm text-zinc-500">Score: {result.correct}/{result.total} · {result.percent}% (pass {result.passPercent}%)</div>
              </div>
            </div>

            {result.passed && result.certificate && (
              <div className="mt-5 rounded-2xl border border-[#F7A814] bg-gradient-to-br from-[#FAF9F5] to-white p-5">
                <div className="text-xs font-black uppercase tracking-widest text-[#12345A]">Certificate issued / प्रमाणपत्र जारी</div>
                <div className="mt-1 text-lg font-black text-[#12345A]">{result.certificate.certificateId}</div>
                <div className="text-sm text-zinc-500">Issued to {result.certificate.learnerName} · {result.certificate.courseTitle}</div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={download} className="flex-1 rounded-xl bg-[#12345A] px-4 py-3 text-sm font-black text-white">Download certificate (PDF)</button>
                  <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><FaWhatsapp /> Share</a>
                  <a href={ENDPOINTS.AWARENESS_QUIZ_CERTIFICATE(result.certificate.certificateId)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#12345A]/25 bg-[#EAF0F6] px-4 py-3 text-sm font-black text-[#12345A]"><FaEnvelope /> Verify</a>
                </div>
              </div>
            )}

            {result.passed && !result.certificate && (
              <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-800">
                {result.message || "Certificate पाने के लिए अपने learning account से login करें।"}
              </p>
            )}

            {!result.passed && (
              <div className="mt-4">
                <div className="text-sm font-black text-zinc-600">Review your answers / उत्तर देखें</div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                  {(result.wrong || []).map((w) => (
                    <li key={w.id} className="rounded-lg bg-zinc-50 px-3 py-2">
                      <b>{w.id}:</b> {w.explain?.en} <span className="text-zinc-400">/ {w.explain?.hi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="button" onClick={() => { setResult(null); setAnswers({}); }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-black text-[#12345A]">Retry <FaArrowRight /></button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/" className="font-bold text-[#12345A]">← Back to home</Link>
        </div>
      </div>

      <AuthModal open={authOpen} initialMode="signup" stayOnSuccess onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => { setUser(u); setAuthOpen(false); }} />
    </div>
  );
}
