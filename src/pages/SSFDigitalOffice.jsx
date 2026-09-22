import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBook, FaChartLine, FaDownload, FaPlus, FaSearch, FaUsers, FaFileAlt, FaRupeeSign, FaCalendarAlt, FaTasks, FaUserShield, FaHistory } from "react-icons/fa";
import jsPDF from "jspdf";
import { ENDPOINTS } from "../config/api";

const TOKEN_KEY = "ssf_admin_token";
const MODULES = [
 ["dashboard","Dashboard",FaChartLine],["members","Members",FaUsers],["volunteers","Volunteers",FaUsers],["donors","Donors",FaUsers],
 ["donations","Donations",FaRupeeSign],["internships","Internship Applications",FaTasks],["beneficiaries","Beneficiaries",FaUsers],
 ["events","Events / Camps",FaCalendarAlt],["projects","Projects / Initiatives",FaTasks],["documents","Documents",FaFileAlt],
 ["expenses","Expenses",FaRupeeSign],["contribution","Contribution Register",FaBook],["cash","Cash Book",FaBook],["bank","Bank Book",FaBook],
 ["ledger","Ledger",FaBook],["inward","Inward",FaFileAlt],["outward","Outward",FaFileAlt],["meetings","Meetings & Resolutions",FaCalendarAlt],
 ["activities","Volunteer Activities",FaTasks],["reports","Reports",FaChartLine],["users","Users & Permissions",FaUserShield],["audit","Audit Trail",FaHistory]
];
const LABELS = Object.fromEntries(MODULES.map(function(x){return [x[0],x[1]];}));
const MONEY = new Set(["donations","expenses","contribution","cash","bank","ledger"]);

const cls = "w-full px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20";

export default function SSFDigitalOffice(){
 const token=localStorage.getItem(TOKEN_KEY)||"";
 const [active,setActive]=useState("dashboard"), [summary,setSummary]=useState(null), [rows,setRows]=useState([]);
 const [loading,setLoading]=useState(false), [search,setSearch]=useState(""), [notice,setNotice]=useState("");
 const auth=function(){return {Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"};};
 const refreshSummary=async function(){const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_SUMMARY,{headers:auth()});if(r.ok)setSummary(await r.json());};
 const load=async function(module){
  setLoading(true);
  try{
   await refreshSummary();
   if(["dashboard","reports","audit","users"].includes(module)){setRows([]);return;}
   const q=ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+encodeURIComponent(module)+(search?"&search="+encodeURIComponent(search):"");
   const r=await fetch(q,{headers:auth()}); const d=await r.json(); if(!r.ok)throw new Error(d.message||"Unable to load records."); setRows(d);
  }catch(e){setNotice(e.message||"Unable to load Digital Office.");}finally{setLoading(false);}
 };
 useEffect(function(){if(token)load(active);},[active]);
 useEffect(function(){if(token&&!["dashboard","reports","audit","users"].includes(active)){const t=setTimeout(function(){load(active);},350);return function(){clearTimeout(t);};}},[search]);

 const add=async function(module,data){
  try{
   var endpoint=module==="donations"?ENDPOINTS.DIGITAL_OFFICE_DONATIONS:module==="expenses"?ENDPOINTS.DIGITAL_OFFICE_EXPENSES:ENDPOINTS.DIGITAL_OFFICE_RECORDS;
   var body=module==="donations"||module==="expenses"?data:Object.assign({module:module},data);
   var r=await fetch(endpoint,{method:"POST",headers:auth(),body:JSON.stringify(body)}), out=await r.json();
   if(!r.ok)throw new Error(out.message||"Save failed.");
   setNotice(out.donationId?"Saved. Donation ID: "+out.donationId:"Record saved successfully.");
   await load(module);
  }catch(e){setNotice(e.message||"Save failed.");}
 };
 const archive=async function(id){
  if(!confirm("Archive this record? Financial records are not hard-deleted."))return;
  const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"DELETE",headers:auth()});
  if(r.ok){setNotice("Record archived.");load(active);}
 };
 const exportRows=function(data,name){
  const flat=(data||[]).map(function(x){return {ID:x.recordId,Module:x.module,Type:x.recordType||"",Date:new Date(x.recordDate).toLocaleDateString("en-IN"),Amount:x.amount||"",PaymentMode:x.paymentMode||"",Status:x.status,PersonID:x.personId||"",LinkedID:x.linkedRecordId||"",Details:JSON.stringify(x.data||{})};});
  const headers=Object.keys(flat[0]||{ID:"",Module:"",Date:"",Amount:"",Status:""}); const csv=[headers.join(","),...flat.map(function(row){return headers.map(function(h){return JSON.stringify(row[h] == null ? "" : row[h]);}).join(",");})].join("\\n"); const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name+".csv"; a.click(); URL.revokeObjectURL(a.href);
 };
 const exportPdf=function(data,title){
  const d=new jsPDF();d.setFontSize(16);d.text("Swastik Srijan Foundation Samiti",14,16);d.setFontSize(11);d.text(title,14,25);
  var y=34;(data||[]).slice(0,38).forEach(function(x){d.text([x.recordId,x.module,new Date(x.recordDate).toLocaleDateString("en-IN"),x.amount?"Rs. "+x.amount:"",x.status].join(" | ").slice(0,110),14,y);y+=7;if(y>280){d.addPage();y=20;}});d.save(title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".pdf");
 };

 if(!token)return <div className="min-h-screen bg-zinc-50 pt-32 px-6 flex items-center justify-center"><div className="bg-white rounded-3xl p-8 border max-w-md"><h1 className="text-2xl font-black text-[#002344]">Admin login required</h1><p className="text-zinc-500 mt-2">Open Admin Portal and login first, then open Digital Office.</p><Link to="/AdminPortal" className="inline-block mt-5 bg-[#002344] text-white px-5 py-3 rounded-xl font-bold">Go to Admin Portal</Link></div></div>;

 return <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-3 sm:px-6"><div className="max-w-[1500px] mx-auto">
  <header className="bg-[#002344] text-white rounded-[2rem] p-6 sm:p-8 mb-5"><div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
   <div><Link to="/AdminPortal" className="text-white/70 text-sm font-bold inline-flex items-center gap-2"><FaArrowLeft/> Admin Portal</Link><p className="text-xs text-orange-300 font-black uppercase tracking-[.2em] mt-4">SSF Digital Office · Secure Database Edition</p><h1 className="text-3xl sm:text-4xl font-black mt-2">Paperless NGO Office</h1><p className="text-white/70 mt-2 max-w-3xl">One source record → linked registers → reports → audit trail. Existing website records are preserved.</p></div>
   <div className="flex flex-wrap gap-2"><button onClick={function(){exportRows(rows,"ssf-"+active+"-"+new Date().toISOString().slice(0,10));}} className="bg-white text-[#002344] px-4 py-3 rounded-xl font-bold flex items-center gap-2"><FaDownload/> Excel (CSV)</button><button onClick={function(){exportPdf(rows,"SSF "+(LABELS[active]||"Records"));}} className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl font-bold flex items-center gap-2"><FaFileAlt/> PDF</button></div>
  </div></header>
  {notice&&<div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 font-semibold">{notice}</div>}
  <div className="grid lg:grid-cols-[245px_1fr] gap-5">
   <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-auto">{MODULES.map(function(x){var Icon=x[2];return <button key={x[0]} onClick={function(){setActive(x[0]);}} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold mb-1 "+(active===x[0]?"bg-[#002344] text-white":"text-zinc-700 hover:bg-zinc-100")}><Icon/> {x[1]}</button>;})}</aside>
   <main className="min-w-0">
    {active==="dashboard"&&<Dashboard summary={summary}/>}
    {active==="reports"&&<Reports token={token} exportRows={exportRows} exportPdf={exportPdf}/>}
    {active==="audit"&&<Audit token={token}/>}
    {active==="users"&&<Users add={add}/>}
    {!["dashboard","reports","audit","users"].includes(active)&&<Register module={active} rows={rows} loading={loading} search={search} setSearch={setSearch} add={add} archive={archive}/>}
   </main>
  </div>
 </div></div>;
}

function Dashboard({summary}){
 const t=summary&&summary.totals||{},c=summary&&summary.counts||{};
 const cards=[["Members",c.members||0],["Volunteers",c.volunteers||0],["Donors",c.donors||0],["Beneficiaries",c.beneficiaries||0],["Donations","₹"+Number(t.donations||0).toLocaleString("en-IN")],["Expenses","₹"+Number(t.expenses||0).toLocaleString("en-IN")],["Cash","₹"+Number(t.cash||0).toLocaleString("en-IN")],["Bank","₹"+Number(t.bank||0).toLocaleString("en-IN")]];
 return <div className="space-y-5"><div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(function(x){return <div key={x[0]} className="bg-white border rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">{x[0]}</p><p className="text-2xl font-black text-[#002344] mt-2">{x[1]}</p></div>;})}</div>
 <div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-2xl border p-6"><h2 className="text-xl font-black text-[#002344]">All required office modules</h2><p className="text-zinc-500 mt-2">Members, Volunteers, Donors, Donations, Internship, Beneficiaries, Events/Camps, Projects, Documents, Expenses, all registers, reports, users and audit trail.</p><div className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">{MODULES.filter(function(x){return x[0]!=="dashboard";}).map(function(x){return <div key={x[0]} className="bg-zinc-50 rounded-lg px-3 py-2 font-semibold">{x[1]}</div>;})}</div></div>
 <div className="bg-white rounded-2xl border p-6"><h2 className="text-xl font-black text-[#002344]">Automatic financial linking</h2><p className="text-zinc-500 mt-2">Donation and expense workflows write linked contribution, cash/bank and ledger records in one database transaction.</p><div className="mt-5 space-y-2 text-sm font-bold text-zinc-700"><p>Donation → Donor → Contribution → Cash/Bank → Ledger → Receipt record</p><p>Expense → Expense Register → Cash/Bank → Ledger</p><p>Create/update/archive → Audit Trail</p></div><div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><strong>Compliance:</strong> final statutory/tax treatment, 80G particulars and audit requirements must be verified with SSF's CA/tax advisor.</div></div></div></div>;
}

function Register({module,rows,loading,search,setSearch,add,archive}){
 const [open,setOpen]=useState(false);
 return <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-5 sm:p-7 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344]">{LABELS[module]}</h2><p className="text-sm text-zinc-500 mt-1">{rows.length} record(s) · secure database</p></div><div className="flex gap-2"><div className="relative"><FaSearch className="absolute left-3 top-3 text-zinc-400"/><input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search ID / person" className="pl-9 pr-3 py-2.5 border rounded-xl w-56"/></div><button onClick={function(){setOpen(!open);}} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus/> Add</button></div></div>
 {open&&<RecordForm module={module} onSave={function(d){add(module,d);setOpen(false);}}/>}
 {loading?<div className="p-10 text-center text-zinc-400">Loading…</div>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Details</th>{MONEY.has(module)&&<th className="p-3">Amount</th>}<th className="p-3">Status</th><th className="p-3"></th></tr></thead><tbody className="divide-y">{rows.length===0?<tr><td colSpan="6" className="p-10 text-center text-zinc-400">No records yet.</td></tr>:rows.map(function(r){return <tr key={r.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td><td className="p-3 whitespace-nowrap">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3 min-w-[260px]"><b>{r.data&& (r.data.fullName||r.data.donorName||r.data.name||r.data.payee||r.data.title||r.recordType)||"—"}</b><div className="text-xs text-zinc-400 mt-1">{r.data&&(r.data.purpose||r.data.description||r.data.category||r.data.email||"")}</div></td>{MONEY.has(module)&&<td className="p-3 font-bold">₹{Number(r.amount||0).toLocaleString("en-IN")}</td>}<td className="p-3">{r.status}</td><td className="p-3 text-right"><button onClick={function(){archive(r.id);}} className="text-xs font-bold text-red-600">Archive</button></td></tr>;})}</tbody></table></div>}
 </div>;
}

function RecordForm({module,onSave}){
 const [f,setF]=useState({date:new Date().toISOString().slice(0,10),name:"",email:"",phone:"",amount:"",paymentMode:"Cash",purpose:"",category:"General",notes:"",projectId:"",pan:"",address:""});
 const set=function(k,v){setF(function(x){return Object.assign({},x,{[k]:v});});};
 const submit=function(e){e.preventDefault();if(module==="donations")onSave({date:f.date,donorName:f.name,amount:f.amount,paymentMode:f.paymentMode,purpose:f.purpose,paymentStatus:"paid",email:f.email,phone:f.phone,pan:f.pan,address:f.address,notes:f.notes,projectId:f.projectId});else if(module==="expenses")onSave({date:f.date,payee:f.name,amount:f.amount,paymentMode:f.paymentMode,category:f.category,purpose:f.purpose,notes:f.notes,projectId:f.projectId});else onSave({recordDate:f.date,recordType:f.category,amount:f.amount||null,paymentMode:f.paymentMode,data:f});};
 return <form onSubmit={submit} className="p-5 bg-zinc-50 border-b grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><input value={f.name} onChange={function(e){set("name",e.target.value);}} placeholder="Name / title / payee" className={cls} required/><input type="date" value={f.date} onChange={function(e){set("date",e.target.value);}} className={cls}/>{MONEY.has(module)&&<input type="number" min="0" step="0.01" value={f.amount} onChange={function(e){set("amount",e.target.value);}} placeholder="Amount" className={cls} required/>}<input value={f.email} onChange={function(e){set("email",e.target.value);}} placeholder="Email (optional)" className={cls}/><input value={f.phone} onChange={function(e){set("phone",e.target.value);}} placeholder="Phone (optional)" className={cls}/>{MONEY.has(module)&&<select value={f.paymentMode} onChange={function(e){set("paymentMode",e.target.value);}} className={cls}><option>Cash</option><option>Bank</option><option>UPI</option><option>Cheque</option><option>Other</option></select>}<input value={f.category} onChange={function(e){set("category",e.target.value);}} placeholder="Category / type" className={cls}/><input value={f.purpose} onChange={function(e){set("purpose",e.target.value);}} placeholder="Purpose" className={cls}/><input value={f.projectId} onChange={function(e){set("projectId",e.target.value);}} placeholder="Project ID (optional)" className={cls}/><input value={f.pan} onChange={function(e){set("pan",e.target.value);}} placeholder="PAN (optional)" className={cls}/><textarea value={f.address} onChange={function(e){set("address",e.target.value);}} placeholder="Address / details" className={cls+" sm:col-span-2"}/><textarea value={f.notes} onChange={function(e){set("notes",e.target.value);}} placeholder="Notes" className={cls+" sm:col-span-2"}/><button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save Record</button></form>;
}

function Reports({token,exportRows,exportPdf}){
 const [report,setReport]=useState(null);
 const load=async function(){const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_REPORTS,{headers:{Authorization:"Bearer "+token}});if(r.ok)setReport(await r.json());};
 return <div className="space-y-5"><div className="bg-white rounded-2xl border p-6"><h2 className="text-2xl font-black text-[#002344]">Reports & Financial Summary</h2><p className="text-zinc-500 mt-1">Donation, expense, volunteer, member and project-wise records are exportable.</p><button onClick={load} className="mt-4 bg-[#002344] text-white px-5 py-3 rounded-xl font-bold">Generate Current Report</button></div>{report&&<><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{Object.entries(report.summary||{}).map(function(x){return <div className="bg-white border rounded-2xl p-5" key={x[0]}><p className="text-xs uppercase text-zinc-400 font-bold">{x[0]}</p><p className="text-xl font-black text-[#002344] mt-2">₹{Number(x[1]||0).toLocaleString("en-IN")}</p></div>;})}</div><div className="bg-white border rounded-2xl p-6 flex gap-2"><button onClick={function(){exportRows(report.rows,"ssf-financial-report");}} className="bg-[#002344] text-white px-4 py-3 rounded-xl font-bold">Excel</button><button onClick={function(){exportPdf(report.rows,"SSF Financial Report");}} className="bg-zinc-100 px-4 py-3 rounded-xl font-bold">PDF</button></div></>}</div>;
}

function Audit({token}){const [rows,setRows]=useState([]);useEffect(function(){fetch(ENDPOINTS.DIGITAL_OFFICE_AUDIT,{headers:{Authorization:"Bearer "+token}}).then(function(r){return r.json();}).then(setRows);},[]);return <div className="bg-white rounded-2xl border p-6"><h2 className="text-2xl font-black text-[#002344]">Audit Trail</h2><p className="text-zinc-500 mb-5">Create, update and archive actions are retained.</p><div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="bg-zinc-50"><th className="p-3 text-left">Time</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Module</th><th className="p-3 text-left">Record</th><th className="p-3 text-left">Actor</th></tr></thead><tbody>{rows.map(function(x){return <tr className="border-b" key={x.id}><td className="p-3">{new Date(x.createdAt).toLocaleString("en-IN")}</td><td className="p-3 font-bold">{x.action}</td><td className="p-3">{x.module}</td><td className="p-3">{x.recordId||"—"}</td><td className="p-3">{x.actor||"admin"}</td></tr>;})}</tbody></table></div></div>;}

function Users({add}){const [f,setF]=useState({name:"",email:"",role:"Secretary",permissions:"dashboard,members,volunteers,donors,reports"});return <div className="bg-white rounded-2xl border p-6"><h2 className="text-2xl font-black text-[#002344]">Users & Permissions</h2><p className="text-zinc-500 mt-1">Maintain office role and permission records without changing existing login accounts.</p><form className="grid sm:grid-cols-2 gap-3 mt-5" onSubmit={function(e){e.preventDefault();add("users",{data:Object.assign({},f,{fullName:f.name})});}}><input required value={f.name} onChange={function(e){setF(Object.assign({},f,{name:e.target.value}));}} placeholder="Office user name" className={cls}/><input value={f.email} onChange={function(e){setF(Object.assign({},f,{email:e.target.value}));}} placeholder="Email" className={cls}/><select value={f.role} onChange={function(e){setF(Object.assign({},f,{role:e.target.value}));}} className={cls}><option>National President / Admin</option><option>Secretary</option><option>Treasurer</option><option>Volunteer / Staff</option><option>Member</option><option>Donor</option></select><input value={f.permissions} onChange={function(e){setF(Object.assign({},f,{permissions:e.target.value}));}} placeholder="Comma-separated modules" className={cls}/><button className="sm:col-span-2 bg-[#002344] text-white py-3 rounded-xl font-bold">Add Permission Record</button></form></div>;}
