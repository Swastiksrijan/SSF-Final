import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ENDPOINTS } from "../config/api";

function LearningCertificateVerify() {
  const [code,setCode]=useState("");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const initial=params.get("code")||"";
    if(initial){ setCode(initial); verify(initial); }
  },[]);

  async function verify(value){
    const trimmed=String(value||"").trim();
    if(!trimmed) return;
    setLoading(true); setResult(null);
    try{
      const response=await fetch(ENDPOINTS.LEARNING_CERTIFICATE_VERIFY(trimmed));
      const data=await response.json().catch(()=>({}));
      setResult(response.ok?data:{valid:false,message:data.message||"Certificate not found or no longer valid."});
    }catch{ setResult({valid:false,message:"Verification service is temporarily unavailable."}); }
    finally{setLoading(false);}
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-12">
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Swastik Srijan Foundation</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">SSF Learning Hub Certificate Verification</h1>
        <p className="mt-2 text-slate-600">SSF Learning Hub प्रमाणपत्र सत्यापन</p>
        <form onSubmit={(e)=>{e.preventDefault();verify(code)}} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter Certificate ID / Certificate ID दर्ज करें" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-emerald-500"/>
          <button disabled={loading} className="rounded-xl bg-emerald-700 px-6 py-3 font-black text-white disabled:opacity-50">{loading?"Verifying...":"Verify / सत्यापित करें"}</button>
        </form>
      </div>
      {result && <div className={`rounded-3xl bg-white p-8 shadow-sm ring-1 ${result.valid?"ring-emerald-200":"ring-red-200"}`}>
        <div className="text-lg font-black">{result.valid?"✓ Valid Certificate / मान्य प्रमाणपत्र":"✕ Certificate Not Valid / प्रमाणपत्र मान्य नहीं है"}</div>
        {result.valid ? <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><span className="text-xs font-bold text-slate-500">Learner / शिक्षार्थी</span><p className="font-black text-slate-900">{result.learnerName}</p></div>
          <div><span className="text-xs font-bold text-slate-500">Course / पाठ्यक्रम</span><p className="font-black text-slate-900">{result.courseTitle}</p></div>
          <div><span className="text-xs font-bold text-slate-500">Certificate ID</span><p className="font-black text-slate-900">{result.certificateId}</p></div>
          <div><span className="text-xs font-bold text-slate-500">Completion / पूर्णता</span><p className="font-black text-slate-900">{result.completionPercent}%</p></div>
          <div><span className="text-xs font-bold text-slate-500">Learning Hours / अध्ययन घंटे</span><p className="font-black text-slate-900">{result.learningHours ?? "—"}</p></div>
          <div><span className="text-xs font-bold text-slate-500">Issued / जारी</span><p className="font-black text-slate-900">{result.issuedAt?new Date(result.issuedAt).toLocaleDateString("en-IN"):"—"}</p></div>
        </div>:<p className="mt-4 text-red-700">{result.message}</p>}
      </div>}
    </div>
  </main>;
}
export const Route=createFileRoute("/LearningCertificateVerify")({component:LearningCertificateVerify});
