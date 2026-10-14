import { useEffect, useMemo, useState } from "react";
import { FaGraduationCap, FaWhatsapp, FaEnvelope, FaCheckCircle, FaUserCircle } from "react-icons/fa";
import AuthModal from "../AuthModal";
import { ENDPOINTS } from "../../config/api";

const SESSION_KEY = "ssf_user_session";
const readSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

/**
 * Certificate block shown at the end of every course. It lets a signed-out
 * learner create an SSF account / login (via the shared AuthModal, so the admin
 * gets the signup details), then submits a certificate request to the admin
 * panel. Certificate issuance itself stays a manual admin action.
 */
export default function CourseCertificate({ subject, courseTitle, courseMeta, progress = 0, moduleResults = {}, requiredModuleAssessmentIds = [], finalResult = null, assessmentCourseId = subject.id }) {
  const [user, setUser] = useState(readSession);
  const [authOpen, setAuthOpen] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const fn = (e) => setUser(e.detail || null);
    window.addEventListener("ssf-auth-changed", fn);
    return () => window.removeEventListener("ssf-auth-changed", fn);
  }, []);

  useEffect(() => {
    try { setRequested(Boolean(localStorage.getItem("ssf-learning-certificate-request-" + subject.id))); } catch {}
  }, [subject.id]);

  const title = courseTitle || subject.title;
  const requiredIds = Array.isArray(requiredModuleAssessmentIds) ? requiredModuleAssessmentIds : [];
  const moduleAssessmentsPassed = requiredIds.every((id) => {
    const result = moduleResults?.[id];
    return result?.passed === true && result?.assessmentVersion === "v2" && Number.isInteger(result.score) && Number.isInteger(result.total) && result.total > 0 && result.score >= 0 && result.score <= result.total && result.score / result.total >= 0.7;
  });
  const certificateEligible = progress >= 100 && finalResult?.passed === true && finalResult?.assessmentVersion === "v2" && moduleAssessmentsPassed;
  const whatsappHref = useMemo(() => {
    const text = "Namaste SSF Learning Hub. Certificate request: " + subject.en + " (" + title + "). Learner: " + (user?.fullName || "") + ", email: " + (user?.email || "") + ", progress: " + progress + "%.";
    return "https://wa.me/919718346691?text=" + encodeURIComponent(text);
  }, [subject, title, user, progress]);
  const emailHref = useMemo(() => {
    const body = "Namaste SSF Team,\n\nI have completed the learning for: " + subject.en + " (" + title + ").\n\nLearner name: " + (user?.fullName || "") + "\nAccount email: " + (user?.email || "") + "\nProgress: " + progress + "%\n\nPlease review my certificate request.\n\nThank you.";
    return "mailto:info@swastiksrijan.in?subject=" + encodeURIComponent("Certificate request – " + subject.en) + "&body=" + encodeURIComponent(body);
  }, [subject, title, user, progress]);

  const submitRequest = async () => {
    if (!certificateEligible) {
      setStatus("error");
      setMessage("पहले 100% पाठ पूरा करें और final assessment पास करें। / Complete 100% of the course and pass the final assessment first.");
      return;
    }
    if (!user) { setAuthOpen(true); return; }
    setStatus("submitting"); setMessage("");
    try {
      const response = await fetch(ENDPOINTS.LEARNING_CERTIFICATE_REQUEST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: user.id,
          learner: user,
          courseId: assessmentCourseId,
          courseTitle: title,
          completionPercent: progress,
          moduleAssessments: moduleResults,
          requiredModuleAssessmentIds: requiredIds,
          finalAssessment: finalResult,
          learningHours: courseMeta?.learningHours,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Certificate request could not be submitted.");
      try {
        localStorage.setItem("ssf-learning-certificate-request", JSON.stringify(result.request));
        localStorage.setItem("ssf-learning-certificate-request-" + subject.id, JSON.stringify(result.request || { courseId: subject.id }));
      } catch {}
      setRequested(true);
      setStatus("success");
      setMessage("Certificate request submitted successfully. SSF admin will review it and issue your certificate.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Unable to submit certificate request. Please try again.");
    }
  };

  return <section className="mt-8 rounded-[2rem] border border-[#e6d3a8] bg-gradient-to-br from-[#fff8e8] to-white p-6 shadow-sm md:p-8">
    <div className="flex items-center gap-3"><FaGraduationCap className="text-3xl text-[#002344]" /><div><h2 className="text-2xl font-black text-[#062a52] md:text-3xl">Certificate / प्रमाणपत्र</h2><p className="text-sm text-zinc-500">Course पूरा करने के बाद अपना certificate प्राप्त करें।</p></div></div>

    <div className="mt-5 grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Course</div><div className="mt-1 text-base font-black text-[#062a52] md:text-lg">{title}</div></div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Progress</div><div className="mt-1 text-base font-black text-[#062a52] md:text-lg">{progress}% complete</div></div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4"><div className="text-xs font-black uppercase tracking-widest text-[#0f4c81]">Status</div><div className="mt-1 text-base font-black md:text-lg">{requested ? <span className="text-[#177245]">Requested ✓</span> : <span className="text-[#b45309]">Not requested yet</span>}</div></div>
    </div>

    <p className="mt-4 text-sm leading-7 text-zinc-600 md:text-base">
      प्रमाणपत्र अनुरोध तभी खुलेगा जब पाठ्यक्रम का 100% पूरा हो और अंतिम आकलन पास हो। इसके बाद <strong>Join SSF</strong> / <strong>Login</strong> करें; SSF admin जाँच के बाद प्रमाणपत्र जारी करेगा।
    </p>
    <div className={"mt-3 rounded-xl border p-3 text-sm font-bold " + (certificateEligible ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800")}>
      {certificateEligible ? "✓ पात्र / Eligible: 100% course completion और final assessment passed." : "अभी पात्र नहीं / Not yet eligible: " + progress + "% पूरा; final assessment " + (finalResult?.passed && finalResult?.assessmentVersion === "v2" ? "पास" : "पास नहीं हुआ") + (requiredIds.length && !moduleAssessmentsPassed ? "; सभी required module assessments पास नहीं हुए" : "") + "।"}
    </div>

    {user ? <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <FaUserCircle className="text-2xl text-[#177245]" />
      <div className="min-w-0"><div className="font-black text-[#062a52]">{user.fullName || "Member"}</div><div className="truncate text-xs text-zinc-500">{user.email}</div></div>
      <FaCheckCircle className="ml-auto text-[#177245]" />
    </div> : null}

    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
      {user
        ? <button type="button" disabled={!certificateEligible || status === "submitting"} onClick={submitRequest} className="flex-1 rounded-xl bg-[#177245] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">{status === "submitting" ? "Submitting..." : requested ? "Request Again / दोबारा अनुरोध" : "Request Certificate / प्रमाणपत्र का अनुरोध करें"}</button>
        : <button type="button" onClick={() => setAuthOpen(true)} className="flex-1 rounded-xl bg-gradient-to-br from-[#0b3a63] to-[#001529] px-5 py-3 text-sm font-black text-white">Join SSF / Login</button>}
    </div>

    <div className="mt-4 border-t border-zinc-200 pt-4">
      {certificateEligible ? <>
        <div className="text-xs font-black uppercase tracking-widest text-zinc-400">Or reach SSF directly / सीधे संपर्क करें</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white"><FaWhatsapp /> WhatsApp</a>
          <a href={emailHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0f4c81]/25 bg-[#f1f7fa] px-4 py-3 text-sm font-black text-[#0f4c81]"><FaEnvelope /> Email</a>
        </div>
      </> : <p className="text-sm leading-6 text-zinc-500">Direct certificate request links खुलने के लिए पहले 100% course progress, current final assessment pass और सभी required module assessments पास करना आवश्यक है।</p>}
    </div>

    {message && <div className={"mt-4 rounded-xl p-4 text-sm font-bold " + (status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-[#177245]")}>{message}</div>}

    <AuthModal open={authOpen} initialMode="signup" stayOnSuccess onClose={() => setAuthOpen(false)} onAuthSuccess={(u) => setUser(u)} />
  </section>;
}
