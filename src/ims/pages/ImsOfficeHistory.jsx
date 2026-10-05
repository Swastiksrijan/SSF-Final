// SSF-IMS Managing Committee History.
// The OfficeHistory component below is the EXACT component from the old
// SSF Digital Office (src/pages/SSFDigitalOffice.jsx, function OfficeHistory) —
// same JSX, same classes, same data shape (record.module / record.data.*).
// The only additions are: the ImsLayout wrapper (sidebar/header of the new IMS)
// and a thin adapter (imsOfficeRows / imsOfficeAdd / imsOfficeUpdate /
// imsOfficeArchive) that maps the new backend to the old record contract so the
// component works unchanged. Bilingual: Hindi is added via the lang toggle.
import { useEffect, useState } from 'react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';

const cls = "w-full px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20";

const formatOfficeDate=function(value){ if(!value)return "—";
 const s=String(value);
 const m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
 if(m)return m[3]+"-"+m[2]+"-"+m[1];
 const d=new Date(value);
 return Number.isNaN(d.getTime())?s:d.toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"});
};

// Navy title card — identical to the old Digital Office SimpleOfficeCard.
function SimpleOfficeCard({title,subtitle,children}){return <div className="space-y-5"><div className="bg-[#002344] text-white rounded-2xl p-6"><h2 className="text-2xl font-black">{title}</h2><p className="text-white/70 mt-1">{subtitle}</p></div>{children}</div>}

// ---- adapter: new backend <-> old record contract --------------------------
// old record: { id, recordId, module:"officeHistory", recordType, recordDate,
//               status, data:{ memberId, fullName, eventDate, changeType,
//               previousRole, newRole, referenceNo, resolutionNo, meetingDate,
//               details, remarks } }
function toOldRecord(r){
  const d = (r.data && typeof r.data==='object' && Object.keys(r.data).length) ? r.data : {};
  const pick = (k) => (r[k]!==undefined && r[k]!==null && r[k]!=="") ? r[k] : (d[k]||"");
  return { id:r.id, recordId:r.recordId, module:"officeHistory", recordType:r.recordType,
    recordDate:r.recordDate, status:r.status, data:{
      memberId:pick("memberId"), fullName:pick("fullName"), eventDate:pick("eventDate"),
      changeType:pick("changeType"), previousRole:pick("previousRole"), newRole:pick("newRole"),
      referenceNo:pick("referenceNo"), resolutionNo:pick("resolutionNo"), meetingDate:pick("meetingDate"),
      details:pick("details"), remarks:pick("remarks"),
    } };
}
function fromOldData(data){
  return { memberId:data.memberId||"", fullName:data.fullName||"", eventDate:data.eventDate||null,
    changeType:data.changeType||"", previousRole:data.previousRole||"", newRole:data.newRole||"",
    referenceNo:data.referenceNo||"", resolutionNo:data.resolutionNo||"", meetingDate:data.meetingDate||null,
    details:data.details||"", remarks:data.remarks||"" };
}
const imsOfficeRows=async()=>{
  let d=await ims.list("officeHistory",{limit:500});
  if((d.records||[]).length===0){ await ims.officeHistorySeed().catch(()=>{}); d=await ims.list("officeHistory",{limit:500}); }
  return (d.records||[]).map(toOldRecord);
};
const imsOfficeAdd=async(module,payload)=>{
  try{ await ims.create("officeHistory",{recordDate:payload.recordDate,recordType:payload.recordType,status:payload.status,data:fromOldData(payload.data)},true); return true; }
  catch{ return false; }
};
const imsOfficeUpdate=async(id,module,data)=>{
  try{ await ims.update("officeHistory",id,{recordDate:data.recordDate||data.eventDate,recordType:data.recordType||data.changeType,data:fromOldData(data)}); return true; }
  catch{ return false; }
};
const imsOfficeArchive=async(id)=>{
  try{ await ims.archive("officeHistory",id); return true; }catch{ return false; }
};

// ===========================================================================
// OfficeHistory — copied verbatim from SSFDigitalOffice.jsx (function OfficeHistory)
// ===========================================================================
function OfficeHistory({rows,add,updateRecord,archive}){
 const allExisting=(rows||[]).filter(r=>r.module==="officeHistory"&&r.status!=="deleted");
 const [tab,setTab]=useState("dashboard"),[query,setQuery]=useState(""),[sortBy,setSortBy]=useState("dateAsc");
 const [editingId,setEditingId]=useState(null),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
 const blank={memberId:"",fullName:"",eventDate:new Date().toISOString().slice(0,10),changeType:"Appointment",previousRole:"",newRole:"",referenceNo:"",resolutionNo:"",meetingDate:"",details:"",remarks:""};
 const historyRows=allExisting;
 const [f,setF]=useState(blank);
 const reset=()=>{setEditingId(null);setF({...blank,eventDate:new Date().toISOString().slice(0,10)});};
 const edit=(r)=>{setEditingId(r.id);setF({...blank,...(r.data||{}),eventDate:(r.data||{}).eventDate||r.recordDate||blank.eventDate});setTab("history");window.scrollTo({top:0,behavior:"smooth"});};
 const save=async e=>{e.preventDefault();const needsRole=!["Removal","Resignation","Relieving"].includes(f.changeType);if(!f.fullName.trim()||!f.eventDate||(needsRole&&!f.newRole.trim())){setNotice(needsRole?"Full Name, Event Date and New / Current Position required.":"Full Name and Event Date required.");return;}setSaving(true);const data={...f};const ok=editingId?await updateRecord(editingId,"officeHistory",data):await add("officeHistory",{recordDate:f.eventDate,recordType:f.changeType,status:"active",data});setSaving(false);if(ok){setNotice(editingId?"Office History updated successfully.":"Office History saved successfully.");reset();}};
 const searched=historyRows.filter(r=>{const d=r.data||{},q=query.trim().toLowerCase();if(!q)return true;return [r.recordId,r.recordDate,d.memberId,d.fullName,d.changeType,d.previousRole,d.newRole,d.details,d.remarks].join(" ").toLowerCase().includes(q);});
 const sorted=[...searched].sort((a,b)=>{const da=String(a.recordDate||a.data?.eventDate||""),db=String(b.recordDate||b.data?.eventDate||"");const na=(a.data?.memberId||"").localeCompare(b.data?.memberId||"");const aa=(a.data?.fullName||"").localeCompare(b.data?.fullName||"");if(sortBy==="dateDesc")return db.localeCompare(da);if(sortBy==="member")return na;if(sortBy==="name")return aa;return da.localeCompare(db);});
 const members=Array.from(new Map(historyRows.map(r=>[String(r.data?.memberId||r.data?.fullName||r.recordId),r.data||{}])).values());
 const types=["Appointment","Role Change / Transfer","Re-appointment","Additional Responsibility","Resignation","Removal","Relieving","Other"];
 const roleRows=Array.from(new Map(historyRows.map(r=>[String(r.data?.newRole||r.data?.previousRole||"Unspecified"),r.data||{}])).values());
 const dashboard=<div className="space-y-5">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[["Historical Records",historyRows.length],["Members in History",members.length],["Appointments",historyRows.filter(r=>r.data?.changeType==="Appointment").length],["Role Changes",historyRows.filter(r=>String(r.data?.changeType||"").includes("Role Change")).length]].map(([a,b])=><div key={a} className="bg-slate-50 border rounded-2xl p-5"><div className="text-xs font-bold text-slate-500">{a}</div><div className="text-3xl font-black text-[#002344] mt-1">{b}</div></div>)}</div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{[["Committee & Office History","history"],["Member-wise History","member"],["Position History","position"],["Governance Actions","actions"]].map(([name,id])=><button type="button" key={id} onClick={()=>setTab(id)} className="text-left border rounded-2xl p-4 hover:border-[#1F7A70] hover:shadow-sm bg-white"><div className="text-xs font-black text-[#1F7A70]">SSF GOVERNANCE RECORD</div><div className="font-black text-[#002344] mt-1">{name}</div><div className="text-xs text-slate-500 mt-1">Open section</div></button>)}</div>
  <div className="bg-white border rounded-2xl p-5"><h3 className="text-xl font-black text-[#002344]">Historical Committee Members</h3><p className="text-sm text-slate-500 mt-1">Old and current committee members remain preserved here. Records can be corrected later; this register does not replace Membership History.</p><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">{members.slice(0,12).map((d,i)=><div key={i} className="border rounded-xl p-4"><div className="font-black text-[#002344]">{d.fullName||"—"}</div><div className="text-xs text-[#1F7A70] font-bold mt-1">{d.memberId||"—"}</div><div className="text-sm text-slate-600 mt-2">{d.newRole||d.previousRole||"—"}</div><button type="button" onClick={()=>{const rr=historyRows.find(x=>String(x.data?.memberId||x.data?.fullName)===String(d.memberId||d.fullName));if(rr)edit(rr);}} className="mt-3 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold">✏️ Edit History</button></div>)}</div></div>
 </div>;
 const history=<div className="space-y-4"><div className="flex flex-col sm:flex-row gap-3"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search member, ID, role or action" className={cls}/><select value={sortBy} onChange={e=>setSortBy(e.target.value)} className={cls+" sm:max-w-xs"}><option value="dateAsc">Date — Oldest First</option><option value="dateDesc">Date — Newest First</option><option value="member">Member ID — A to Z</option><option value="name">Name — A to Z</option></select></div><div className="text-xs text-zinc-500">{sorted.length} matching record(s) · {members.length} member(s)</div><div className="overflow-auto"><table className="w-full text-sm min-w-[1450px]"><thead className="bg-slate-50"><tr>{["Date","Member ID","Full Name","Type","Previous Role","New / Current Role","Reference","Resolution","Meeting","Details","Remarks","Action"].map(h=><th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y">{sorted.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3">{formatOfficeDate(d.eventDate||r.recordDate)}</td><td className="p-3 font-bold">{d.memberId||"—"}</td><td className="p-3 font-bold">{d.fullName||"—"}</td><td className="p-3">{d.changeType||r.recordType||"—"}</td><td className="p-3">{d.previousRole||"—"}</td><td className="p-3">{d.newRole||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.resolutionNo||"—"}</td><td className="p-3">{formatOfficeDate(d.meetingDate)}</td><td className="p-3 max-w-[320px]">{d.details||"—"}</td><td className="p-3 max-w-[280px]">{d.remarks||"—"}</td><td className="p-3 whitespace-nowrap"><button type="button" onClick={()=>edit(r)} className="px-3 py-2 rounded-lg bg-[#002344] text-white font-bold mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}</tbody></table></div></div>;
 const memberView=<div className="space-y-4"><div className="bg-slate-50 border rounded-xl p-4 text-sm text-slate-700">Member-wise view groups the preserved committee/office history by member. It is separate from membership joining, validity and membership status.</div><div className="grid md:grid-cols-2 gap-4">{members.map((m,i)=>{const mine=historyRows.filter(r=>String(r.data?.memberId||r.data?.fullName)===String(m.memberId||m.fullName));return <div key={i} className="border rounded-2xl p-5 bg-white"><div className="flex justify-between gap-3"><div><h3 className="font-black text-[#002344]">{m.fullName||"—"}</h3><div className="text-xs text-[#1F7A70] font-bold mt-1">{m.memberId||"—"}</div></div><span className="text-xs bg-slate-100 px-2 py-1 rounded-full font-bold">{mine.length} record(s)</span></div><div className="mt-4 space-y-2">{mine.slice().sort((a,b)=>String(a.recordDate).localeCompare(String(b.recordDate))).map(r=><div key={r.id} className="border-t pt-2 text-sm"><b>{formatOfficeDate(r.data?.eventDate||r.recordDate)}</b> · {r.data?.changeType||r.recordType} · {r.data?.previousRole||"—"} → {r.data?.newRole||"—"}<div className="text-xs text-slate-500 mt-1">{r.data?.details||r.data?.remarks||"—"}</div><button type="button" onClick={()=>edit(r)} className="mt-2 px-3 py-1.5 rounded-lg bg-[#002344] text-white text-xs font-bold">✏️ Edit</button></div>)}</div></div>})}</div></div>;
 const position=<div className="space-y-4"><div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-[#123B5D]">Position history shows the roles recorded over time. It does not infer tenure where dates are missing or approximate.</div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{roleRows.map((d,i)=><div key={i} className="border rounded-2xl p-5 bg-white"><div className="text-xs text-[#1F7A70] font-black">{d.newRole||d.previousRole||"Unspecified"}</div><h3 className="font-black text-[#002344] mt-1">{d.fullName||"—"}</h3><p className="text-sm text-slate-600 mt-2">{d.changeType||"—"} · {formatOfficeDate(d.eventDate)}</p><p className="text-xs text-slate-500 mt-2">{d.details||d.remarks||"—"}</p><button type="button" onClick={()=>{const rr=historyRows.find(x=>x.data===d);if(rr)edit(rr);}} className="mt-3 px-3 py-2 rounded-lg bg-[#002344] text-white text-xs font-bold">✏️ Edit History</button></div>)}</div></div>;
 const actions=<div className="space-y-4"><div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">Use this register for appointment, role change, re-appointment, additional responsibility, resignation, removal and relieving. Formal separation records remain available in the separate Role Changes & Separation module.</div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{types.map(type=><button type="button" key={type} onClick={()=>{setF({...blank,changeType:type,eventDate:new Date().toISOString().slice(0,10)});setEditingId(null);setTab("history");}} className="border rounded-xl p-4 text-left font-bold hover:border-[#1F7A70] hover:bg-slate-50">{type}</button>)}</div></div>;
 const tabs=[["dashboard","📊 Dashboard / डैशबोर्ड"],["history","🏛️ Committee & Office History / समिति एवं पद इतिहास"],["member","👤 Member-wise History / सदस्य-वार इतिहास"],["position","🎯 Position History / पद इतिहास"],["actions","⚙️ Governance Actions / शासन कार्रवाई"],["register","📋 Complete Register / पूर्ण रजिस्टर"]];
 const form=<form onSubmit={save} className="bg-slate-50 border rounded-2xl p-5 space-y-4"><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><div><label className="text-xs font-bold text-slate-600">Member ID</label><input value={f.memberId} onChange={e=>setF({...f,memberId:e.target.value})} className={cls} placeholder="SSF-MBR-00001"/></div><div><label className="text-xs font-bold text-slate-600">Full Name *</label><input value={f.fullName} onChange={e=>setF({...f,fullName:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">Event Date *</label><input type="date" value={f.eventDate} onChange={e=>setF({...f,eventDate:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">Type *</label><select value={f.changeType} onChange={e=>setF({...f,changeType:e.target.value})} className={cls}>{types.map(x=><option key={x}>{x}</option>)}</select></div><div><label className="text-xs font-bold text-slate-600">Previous Position</label><input value={f.previousRole} onChange={e=>setF({...f,previousRole:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">New / Current Position</label><input value={f.newRole} onChange={e=>setF({...f,newRole:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">Reference / File No.</label><input value={f.referenceNo} onChange={e=>setF({...f,referenceNo:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">Resolution No.</label><input value={f.resolutionNo} onChange={e=>setF({...f,resolutionNo:e.target.value})} className={cls}/></div><div><label className="text-xs font-bold text-slate-600">Meeting Date</label><input type="date" value={f.meetingDate} onChange={e=>setF({...f,meetingDate:e.target.value})} className={cls}/></div><div className="sm:col-span-2 lg:col-span-3"><label className="text-xs font-bold text-slate-600">Details</label><textarea value={f.details} onChange={e=>setF({...f,details:e.target.value})} className={cls} rows="3"/></div><div className="sm:col-span-2 lg:col-span-4"><label className="text-xs font-bold text-slate-600">Remarks</label><textarea value={f.remarks} onChange={e=>setF({...f,remarks:e.target.value})} className={cls} rows="2"/></div></div><div className="flex flex-wrap gap-2"><button type="submit" disabled={saving} className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">{saving?"Saving…":editingId?"Update Office History":"Save Office History"}</button>{editingId&&<button type="button" onClick={reset} className="border px-6 py-3 rounded-xl font-bold">Cancel Edit</button>}</div></form>;
 const register=<div className="space-y-5">{form}<div className="bg-white border rounded-2xl overflow-auto"><div className="p-5 border-b"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div><h3 className="text-xl font-black text-[#002344]">Complete Register</h3><p className="text-sm text-slate-500 mt-1">All preserved Managing Committee History records — edit any existing entry without creating a duplicate.</p></div><div className="text-sm font-bold text-[#1F7A70]">{historyRows.length} historical record(s)</div></div></div><table className="w-full text-sm min-w-[1450px]"><thead className="bg-slate-50"><tr>{["Date","Member ID","Full Name","Type","Previous Role","New / Current Role","Reference","Resolution","Meeting","Details","Remarks","Action"].map(h=><th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y">{sorted.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3">{formatOfficeDate(d.eventDate||r.recordDate)}</td><td className="p-3 font-bold">{d.memberId||"—"}</td><td className="p-3 font-bold">{d.fullName||"—"}</td><td className="p-3">{d.changeType||r.recordType||"—"}</td><td className="p-3">{d.previousRole||"—"}</td><td className="p-3">{d.newRole||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.resolutionNo||"—"}</td><td className="p-3">{formatOfficeDate(d.meetingDate)}</td><td className="p-3 max-w-[320px]">{d.details||"—"}</td><td className="p-3 max-w-[280px]">{d.remarks||"—"}</td><td className="p-3 whitespace-nowrap"><button type="button" onClick={()=>edit(r)} className="px-3 py-2 rounded-lg bg-[#002344] text-white font-bold mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!sorted.length&&<tr><td colSpan="12" className="p-8 text-center text-slate-500">No Managing Committee History records found.</td></tr>}</tbody></table></div></div>;
 return <SimpleOfficeCard title="🏛️ Managing Committee History / प्रबंधकारिणी समिति इतिहास" subtitle="संस्था में समय-समय पर हुए appointment, role change, re-appointment, resignation, removal और relieving का permanent historical record."><div className="space-y-5">{notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}<div className="bg-white border rounded-2xl p-2"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">{tabs.map(([id,label])=><button type="button" key={id} onClick={()=>setTab(id)} className={"px-2.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-center leading-tight min-h-[52px] "+(tab===id?"bg-[#002344] text-white":"bg-slate-100 text-[#123B5D] hover:bg-slate-200")}>{label}</button>)}</div></div>{tab==="dashboard"?dashboard:tab==="history"?<div className="space-y-5">{form}{history}</div>:tab==="member"?memberView:tab==="position"?position:tab==="actions"?actions:register}</div></SimpleOfficeCard>;
}

export function ImsOfficeHistory(){
  const { lang } = useLang();
  const [rows,setRows]=useState(null);
  const reload=async()=>{ const r=await imsOfficeRows().catch(()=>[]); setRows(r); };
  useEffect(()=>{ let a=true; (async()=>{ const r=await imsOfficeRows().catch(()=>[]); if(a) setRows(r); })(); return ()=>{a=false}; },[]);
  const add=async(module,payload)=>{ const ok=await imsOfficeAdd(module,payload); if(ok) await reload(); return ok; };
  const updateRecord=async(id,module,data)=>{ const ok=await imsOfficeUpdate(id,module,data); if(ok) await reload(); return ok; };
  const archive=async(id)=>{ const ok=await imsOfficeArchive(id); if(ok) await reload(); return ok; };
  return (
    <ImsLayout active="office_history">
      <div className="p-1">
        {rows===null ? <div className="p-10 text-center text-slate-500">{lang==='hi'?'लोड हो रहा है…':'Loading…'}</div> : <OfficeHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
      </div>
    </ImsLayout>
  );
}
