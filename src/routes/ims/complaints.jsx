import { useCallback, useEffect, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { RefreshCw, ShieldCheck, Save } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const TOKEN_KEY = 'ssf_admin_token';
const statusOptions = [['received','Received'],['under_review','Under review'],['awaiting_information','Awaiting information'],['resolved','Resolved'],['closed','Closed']];

function GrievanceRegister() {
  const [rows,setRows]=useState([]);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  const [saving,setSaving]=useState({});
  const [drafts,setDrafts]=useState({});
  const headers=()=>({ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem(TOKEN_KEY)||''}` });
  const load=useCallback(async()=>{setBusy(true);setError('');try{const r=await fetch(`${API_BASE_URL}/api/admin/complaints`,{headers:headers()});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Unable to load complaints');setRows(d.complaints||[]);setDrafts(Object.fromEntries((d.complaints||[]).map(x=>[x.id,{status:x.status,resolutionNote:x.resolutionNote||''}])));}catch(e){setError(e.message);}finally{setBusy(false);}},[]);
  useEffect(()=>{load();},[load]);
  const save=async(id)=>{const draft=drafts[id];setSaving(s=>({...s,[id]:true}));setError('');setSuccess('');try{const r=await fetch(`${API_BASE_URL}/api/admin/complaints/${encodeURIComponent(id)}`,{method:'PATCH',headers:headers(),body:JSON.stringify(draft)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||'Update failed');setSuccess(d.message||'Complaint record saved.');await load();}catch(e){setError(e.message);}finally{setSaving(s=>({...s,[id]:false}));}};
  return <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-[#12345A] sm:px-7"><div className="mx-auto max-w-6xl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-[#12345A] p-6 text-white"><div className="flex items-center gap-3"><ShieldCheck size={30}/><div><h1 className="text-2xl font-black">Grievance Register</h1><p className="text-sm text-white/70">Logged-in IMS users · Confidential complaints</p></div></div><button onClick={load} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2 text-sm font-bold"><RefreshCw size={16}/>{busy?'Loading…':'Refresh'}</button></div>
    {error&&<p className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
    {success&&<p className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{success}</p>}
    {!rows.length&&!busy&&!error&&<div className="rounded-2xl bg-white p-8 text-center text-slate-500">No complaints have been received yet.</div>}
    <div className="space-y-4">{rows.map(row=><article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-2"><div><p className="font-mono text-sm font-black text-[#176447]">{row.reference}</p><h2 className="mt-1 text-lg font-bold">{row.subject}</h2><p className="mt-1 text-xs text-slate-500">{row.category} · {new Date(row.createdAt).toLocaleString('en-IN')}</p></div><span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{row.status.replaceAll('_',' ')}</span></div><div className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><p><b>Name:</b> {row.fullName}</p><p><b>Email:</b> {row.email||'Not provided'}</p><p><b>Mobile:</b> {row.phone||'Not provided'}</p></div><p className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6">{row.description}</p><div className="mt-4 grid gap-3 sm:grid-cols-[220px_1fr_auto]"><label className="text-xs font-bold">Status<select className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm" value={drafts[row.id]?.status||row.status} onChange={e=>setDrafts(s=>({...s,[row.id]:{...s[row.id],status:e.target.value}}))}>{statusOptions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label className="text-xs font-bold">Resolution / staff note<textarea className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm" rows={2} value={drafts[row.id]?.resolutionNote||''} onChange={e=>setDrafts(s=>({...s,[row.id]:{...s[row.id],resolutionNote:e.target.value}}))} placeholder="Required before marking resolved"/></label><button onClick={()=>save(row.id)} disabled={!!saving[row.id]} className="mt-5 inline-flex h-fit items-center justify-center gap-2 rounded-lg bg-[#176447] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={15}/>{saving[row.id]?'Saving…':'Save'}</button></div></article>)}</div>
    <p className="mt-6 text-xs text-slate-500">Keep complaint details confidential. Only logged-in IMS users should access this register. Public tracking reveals status and resolution note only after the submitter verifies the reference and their contact detail.</p>
  </div></main>;
}
export const Route = createFileRoute('/ims/complaints')({ beforeLoad: ({location})=>{if(!localStorage.getItem(TOKEN_KEY))throw redirect({to:'/Admin',search:{redirect:location.href},replace:true});}, component:GrievanceRegister });
