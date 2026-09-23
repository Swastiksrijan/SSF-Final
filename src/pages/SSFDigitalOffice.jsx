import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBook, FaChartLine, FaDownload, FaPlus, FaSearch, FaUsers, FaFileAlt, FaRupeeSign, FaCalendarAlt, FaTasks, FaUserShield, FaHistory, FaBoxes, FaIdCard, FaCertificate, FaHandshake, FaBalanceScale, FaPrint, FaVideo } from "react-icons/fa";
import jsPDF from "jspdf";
import { ENDPOINTS } from "../config/api";
import logoImg from "../assets/new-logo.png";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";

const TOKEN_KEY = "ssf_admin_token";
const MODULES = [
 ["dashboard","Dashboard",FaChartLine],
 ["onlineMeetings","Online Meetings",FaVideo],
 ["members","Members",FaUsers],["volunteers","Volunteers",FaUsers],["donors","Donors",FaUsers],
 ["donations","Donations",FaRupeeSign],["expenses","Expenses",FaRupeeSign],["contribution","Contribution Register",FaBook],
 ["cash","Cash Book",FaBook],["bank","Bank Book",FaBook],["ledger","Ledger",FaBalanceScale],
 ["inventory","Stock / Samaan",FaBoxes],
 ["inward","Aavak / Inward",FaFileAlt],["outward","Jaavak / Outward",FaFileAlt],
 ["meetings","Meeting / Baithak",FaCalendarAlt],["projects","Projects / Initiatives",FaTasks],["events","Events / Camps",FaCalendarAlt],
 ["mou","MoU / Agreements",FaHandshake],["documents","Documents",FaFileAlt],
 ["certificates","Certificates",FaCertificate],["idcards","ID Cards",FaIdCard],
 ["beneficiaries","Beneficiaries",FaUsers],["internships","Internship Applications",FaTasks],["activities","Volunteer Activities",FaTasks],
 ["assets","Assets & Equipment",FaBoxes],["notifications","Alerts & Follow-ups",FaTasks],
 ["reports","Reports",FaChartLine],["users","Users & Permissions",FaUserShield],["audit","Audit Trail",FaHistory]
];
const LABELS = Object.fromEntries(MODULES.map(function(x){return [x[0],x[1]];}));
const MONEY = new Set(["donations","expenses","contribution","cash","bank","ledger"]);
const SPECIAL_DOCS = new Set(["meetings","mou","certificates","idcards"]);
const NO_RECORD_MODULES = new Set(["dashboard","reports","audit","users"]);

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
   if(NO_RECORD_MODULES.has(module)){setRows([]);return;}
   const q=ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+encodeURIComponent(module)+(search?"&search="+encodeURIComponent(search):"");
   const r=await fetch(q,{headers:auth()}); const d=await r.json(); if(!r.ok)throw new Error(d.message||"Unable to load records."); setRows(d);
  }catch(e){setNotice(e.message||"Unable to load Digital Office.");}finally{setLoading(false);}
 };
 useEffect(function(){if(token)load(active);},[active]);
 useEffect(function(){if(token&&!NO_RECORD_MODULES.has(active)){const t=setTimeout(function(){load(active);},350);return function(){clearTimeout(t);};}},[search]);

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
  const headers=Object.keys(flat[0]||{ID:"",Module:"",Date:"",Amount:"",Status:""}); const csv=[headers.join(","),...flat.map(function(row){return headers.map(function(h){return JSON.stringify(row[h] == null ? "" : row[h]);}).join(",");})].join("\
"); const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name+".csv"; a.click(); URL.revokeObjectURL(a.href);
 };
 const downloadPdf=function(d,filename){
  const blob=d.output("blob"); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; a.style.display="none"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},1500);
 };
 const printDesignedDocument=async function(r,type){
  const data=r.data||{};
  const name=data.fullName||data.name||data.donorName||data.title||"Recipient";
  const role=data.role||data.position||data.category||"Volunteer";
  const date=data.date||r.recordDate||new Date().toISOString().slice(0,10);
  const certId=r.recordId||data.certificateId||null;
  const memberId=data.memberId||data.officialId||data.volunteerId||null;
  const photoUrl=data.photoUrl||data.photo||data.imageUrl||null;
  if(type==="certificate"){
   await generateCertificate(name,role,date,certId,memberId,data.certificateType||"Participation");
  }else{
   await generateIdentityCard({name,role,date,officialId:memberId||certId,certId,photoUrl});
  }
 };
 const printRecord=function(r){
  const d=new jsPDF(); const data=r.data||{}; d.setTextColor(0,35,68); d.addImage(logoImg,"PNG",16,9,18,18); d.setFontSize(18); d.text("Swastik Srijan Foundation Samiti",105,18,{align:"center"}); d.setFontSize(11); d.setTextColor(80); d.text((LABELS[r.module]||r.module)+" · "+r.recordId,105,26,{align:"center"});
  let y=42; d.setTextColor(20); d.setFontSize(11); const lines=[]; Object.entries(data).forEach(([k,v])=>{if(v!==null&&v!==undefined&&String(v).trim()!==""){let val=String(v); if(val.length>95) val=val.slice(0,95)+"…"; lines.push([k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()),val]);}}); lines.forEach(([k,v])=>{d.setFont(undefined,"bold");d.text(k+":",16,y);d.setFont(undefined,"normal");d.text(v,58,y);y+=7;if(y>275){d.addPage();y=20;}}); d.setFontSize(9); d.setTextColor(120); d.text("Computer-generated office record · SSF Digital Office",105,288,{align:"center"}); downloadPdf(d,r.recordId+".pdf");
 };
 const exportPdf=function(data,title){
  const d=new jsPDF();d.addImage(logoImg,"PNG",14,8,18,18);d.setFontSize(16);d.text("Swastik Srijan Foundation Samiti",36,16);d.setFontSize(11);d.text(title,14,32);
  var y=34;(data||[]).slice(0,38).forEach(function(x){d.text([x.recordId,x.module,new Date(x.recordDate).toLocaleDateString("en-IN"),x.amount?"Rs. "+x.amount:"",x.status].join(" | ").slice(0,110),14,y);y+=7;if(y>280){d.addPage();y=20;}});d.save(title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".pdf");
 };

 if(!token)return <div className="min-h-screen bg-zinc-50 pt-32 px-6 flex items-center justify-center"><div className="bg-white rounded-3xl p-8 border max-w-md"><h1 className="text-2xl font-black text-[#002344]">Admin login required</h1><p className="text-zinc-500 mt-2">Open Admin and login first, then open Digital Office.</p><Link to="/Admin" className="inline-block mt-5 bg-[#002344] text-white px-5 py-3 rounded-xl font-bold">Go to Admin</Link></div></div>;

 return <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-3 sm:px-6"><div className="max-w-[1500px] mx-auto">
  <header className="bg-[#002344] text-white rounded-[2rem] p-6 sm:p-8 mb-5"><div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
   <div className="flex items-start gap-4"><img src={logoImg} alt="SSF logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-2xl bg-white p-2 shrink-0"/><div><Link to="/Admin" className="text-white/70 text-sm font-bold inline-flex items-center gap-2"><FaArrowLeft/> Admin</Link><p className="text-xs text-orange-300 font-black uppercase tracking-[.2em] mt-4">SSF Digital Office · Secure Database Edition</p><h1 className="text-3xl sm:text-4xl font-black mt-2">Paperless NGO Office</h1><p className="text-white/70 mt-2 max-w-3xl">One source record → linked registers → reports → audit trail. Existing website records are preserved.</p></div></div>
   <DownloadCenter active={active} rows={rows} exportRows={exportRows} exportPdf={exportPdf} setActive={setActive}/>
  </div></header>
  {notice&&<div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 font-semibold">{notice}</div>}
  <div className="grid lg:grid-cols-[245px_1fr] gap-5">
   <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-auto"><div className="px-4 pt-4 pb-3 border-b border-zinc-200"><div className="flex items-center gap-3"><img src={logoImg} alt="SSF logo" className="h-12 w-12 object-contain rounded-xl bg-white border border-zinc-100 p-1" /><div><div className="text-sm font-black text-[#002344]">SSF Digital Office</div><div className="text-[10px] text-zinc-500 font-semibold">Paperless Office Management</div></div></div></div>{MODULES.map(function(x){var Icon=x[2];return <button key={x[0]} onClick={function(){setActive(x[0]);}} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold mb-1 "+(active===x[0]?"bg-[#002344] text-white":"text-zinc-700 hover:bg-zinc-100")}><Icon/> {x[1]}</button>;})}</aside>
   <main className="min-w-0">
    {active==="dashboard"&&<Dashboard summary={summary}/>}
    {active==="onlineMeetings"&&<OnlineMeetings token={token}/>}
    {active==="reports"&&<Reports token={token} exportRows={exportRows} exportPdf={exportPdf}/>}
    {active==="audit"&&<Audit token={token}/>}
    {active==="users"&&<Users add={add}/>}
    {!["dashboard","reports","audit","users"].includes(active)&&<Register module={active} rows={rows} loading={loading} search={search} setSearch={setSearch} add={add} archive={archive}/>}
   </main>
  </div>
 </div></div>;
}
function OnlineMeetings({token}){
 const [title,setTitle]=useState("Managing Committee Meeting"),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[time,setTime]=useState("19:00"),[type,setType]=useState("Managing Committee"),[agenda,setAgenda]=useState(""),[link,setLink]=useState(""),[members,setMembers]=useState([]),[selected,setSelected]=useState([]),[notice,setNotice]=useState(""),[working,setWorking]=useState(false),[googleConnected,setGoogleConnected]=useState(false);
 const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"};
 useEffect(()=>{fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=members",{headers}).then(r=>r.ok?r.json():[]).then(d=>setMembers(Array.isArray(d)?d:[])).catch(()=>setMembers([]));fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_STATUS,{headers}).then(r=>r.ok?r.json():{connected:false}).then(d=>setGoogleConnected(Boolean(d.connected))).catch(()=>setGoogleConnected(false));},[]);
 const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const selectedEmails=()=>members.filter(r=>selected.includes(r.id)).map(r=>(r.data||{}).email).filter(Boolean);
 const saveMeeting=async(meetingLink,delivery={})=>{const data={date,title,meetingType:type,time,agenda,meetingLink,inviteeRecordIds:selected,platform:"Google Meet",delivery};const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS,{method:"POST",headers,body:JSON.stringify({module:"onlineMeetings",recordDate:date,recordType:type,data})});const out=await r.json().catch(()=>({}));if(!r.ok)throw new Error(out.message||"Meeting save failed.");};
 const connectGoogle=async()=>{setWorking(true);setNotice("Google authorization page khola ja raha hai…");try{const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_CONNECT_URL,{headers});const out=await r.json();if(!r.ok)throw new Error(out.message||"Google Meet integration is not configured.");window.location.href=out.url;}catch(e){setNotice(e.message||"Unable to start Google authorization.");setWorking(false);}};
 const createMeeting=async()=>{if(!title.trim()||!date||!time){setNotice("Meeting title, date and time required.");return;}if(!googleConnected){await connectGoogle();return;}setWorking(true);setNotice("Google Meet link banaya ja raha hai…");try{const emails=selectedEmails();const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_CREATE_MEETING,{method:"POST",headers,body:JSON.stringify({title,date,time,agenda,emails})});const out=await r.json();if(!r.ok)throw new Error(out.message||"Google Meet creation failed.");setLink(out.meetingLink||"");await saveMeeting(out.meetingLink,{emailed:out.emailed,emailErrors:out.emailErrors||[],addedMembers:out.addedMembers||0});setNotice(out.emailConfigured?("Google Meet link created, saved and "+out.emailed+" member(s) ko email invitation bhej diya gaya."): "Google Meet link created and saved. Email service configured nahi hai, isliye WhatsApp se share kar sakte hain.");}catch(e){setNotice(e.message||"Unable to create Google Meet.");}finally{setWorking(false);}};
 const meetingMessage=()=> [
  "Swastik Srijan Foundation Samiti",
  "",
  "Meeting Details",
  "",
  "Meeting Title: "+title,
  "Meeting Type: "+type,
  "Date: "+date,
  "Time: "+time,
  "",
  "Why this meeting:",
  "Managing Committee members ke saath important organisational matters par discussion.",
  "",
  "Agenda:",
  agenda||"As per meeting notice",
  "",
  "Google Meet Link:",
  link
 ].join("\\n");
 const shareWhatsApp=()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}window.open("https://wa.me/?text="+encodeURIComponent(meetingMessage()),"_blank");};
 const copyMeetingLink=async()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}try{await navigator.clipboard.writeText(meetingMessage());setNotice("Complete meeting invitation copied.");}catch(e){setNotice("Invitation copy nahi ho saki. Please manually copy karein.");}};
 const shareEmail=()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}const subject="SSF Online Meeting: "+title;window.location.href="mailto:?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(meetingMessage());};
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="bg-[#002344] text-white p-6"><div className="flex items-center gap-3"><FaVideo className="text-2xl"/><div><h2 className="text-2xl font-black">Online Managing Committee Meeting</h2><p className="text-white/70 mt-1">SSF Digital Office se direct Google Meet link create karein aur selected members ko invitation bhejein.</p></div></div></div>
   <div className="p-6 grid md:grid-cols-2 gap-4">
    <div><label className="text-xs font-bold text-zinc-500">Meeting Title</label><input value={title} onChange={e=>setTitle(e.target.value)} className={cls+" mt-1"}/></div>
    <div><label className="text-xs font-bold text-zinc-500">Meeting Type</label><select value={type} onChange={e=>setType(e.target.value)} className={cls+" mt-1"}><option>Managing Committee</option><option>General Body</option><option>Emergency Meeting</option><option>Other</option></select></div>
    <div><label className="text-xs font-bold text-zinc-500">Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={cls+" mt-1"}/></div>
    <div><label className="text-xs font-bold text-zinc-500">Time</label><input type="time" value={time} onChange={e=>setTime(e.target.value)} className={cls+" mt-1"}/></div>
    <div className="md:col-span-2"><label className="text-xs font-bold text-zinc-500">Agenda</label><textarea value={agenda} onChange={e=>setAgenda(e.target.value)} className={cls+" mt-1 min-h-[90px]"} placeholder="Meeting agenda"/></div>
    <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="font-black text-[#002344]">Google Meet</div><p className="text-xs text-zinc-600 mt-1">{googleConnected?"Google account connected. Ab meeting link directly create hoga.":"Pehli baar sirf Google authorization karna hoga. Uske baad yahin se Google Meet link banega."}</p><div className="flex flex-wrap gap-2 mt-3"><button type="button" disabled={working} onClick={createMeeting} className="bg-[#002344] text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50">{working?"Please wait…":googleConnected?"Create Google Meet & Send Link":"Connect Google & Continue"}</button>{link&&<a href={link} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold">Join Google Meet</a>}</div>{link&&<div className="mt-3 bg-white border rounded-xl p-4 text-sm"><div className="font-black text-[#002344] mb-3">Meeting Details</div><div className="grid sm:grid-cols-2 gap-2 text-zinc-700"><div><b>Meeting Title:</b> {title}</div><div><b>Meeting Type:</b> {type}</div><div><b>Date:</b> {date}</div><div><b>Time:</b> {time}</div></div><div className="mt-3"><b>Why this meeting:</b><div className="text-zinc-600 mt-1">Managing Committee members ke saath important organisational matters par discussion.</div></div><div className="mt-3"><b>Agenda:</b><div className="text-zinc-600 mt-1 whitespace-pre-wrap">{agenda||"As per meeting notice"}</div></div><div className="mt-3 pt-3 border-t break-all"><b>Google Meet Link:</b> {link}</div></div>}</div>
    <div className="md:col-span-2"><div className="font-black text-[#002344] mb-2">Meeting Members</div><p className="text-xs text-zinc-500 mb-2">Email wale members select karein; invitation configured email service se bheja jayega.</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-auto">{members.length===0?<div className="text-sm text-zinc-500">No members found.</div>:members.map(r=>{const d=r.data||{};const email=d.email||"";return <label key={r.id} className={"flex items-center gap-2 border rounded-xl p-3 cursor-pointer "+(selected.includes(r.id)?"bg-zinc-100 border-[#002344]":"bg-white")}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggle(r.id)} disabled={!email}/><span><b>{d.fullName||d.name||"Member"}</b><small className="block text-zinc-500">{email||"No email — cannot send invitation"}</small></span></label>;})}</div></div>
    <div className="md:col-span-2 flex flex-wrap gap-2">{link&&<><button type="button" onClick={shareWhatsApp} className="border px-5 py-3 rounded-xl font-bold">WhatsApp Share</button><button type="button" onClick={shareEmail} className="border px-5 py-3 rounded-xl font-bold">Email Share</button><button type="button" onClick={copyMeetingLink} className="border px-5 py-3 rounded-xl font-bold">Copy Meeting Details</button></>}</div>
    {notice&&<div className="md:col-span-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 font-semibold">{notice}</div>}
   </div>
  </div>
 </div>;
}

function DownloadCenter({active,rows,exportRows,exportPdf,setActive}){
 const [open,setOpen]=useState(false);
 const [target,setTarget]=useState(active==="dashboard" ? "members" : active);
 const [format,setFormat]=useState("pdf");
 const available=Object.entries(LABELS).filter(function(x){return x[0]!=="dashboard"&&x[0]!=="audit"&&x[0]!=="users"&&x[0]!=="reports";});
 const download=function(){
  if(target!==active){setActive(target);setOpen(false);return;}
  const data=rows||[];
  if(format==="pdf")exportPdf(data,"SSF "+(LABELS[target]||"Records"));
  else exportRows(data,"ssf-"+target+"-"+new Date().toISOString().slice(0,10));
  setOpen(false);
 };
 return <div className="relative">
  <button onClick={function(){setOpen(!open);}} className="bg-white text-[#002344] px-4 py-3 rounded-xl font-bold flex items-center gap-2"><FaDownload/> Download / Export</button>
  {open&&<div className="absolute right-0 top-14 z-30 w-[min(92vw,390px)] bg-white text-zinc-800 rounded-2xl shadow-2xl border p-5">
   <div className="font-black text-[#002344] text-lg">What do you want to download?</div>
   <p className="text-xs text-zinc-500 mt-1">Select document/register and then format.</p>
   <label className="block text-xs font-bold text-zinc-500 mt-4 mb-1">Document / Register</label>
   <select value={target} onChange={e=>setTarget(e.target.value)} className={cls}>
    {available.map(function(x){return <option key={x[0]} value={x[0]}>{x[1]}</option>;})}
   </select>
   <label className="block text-xs font-bold text-zinc-500 mt-3 mb-1">Format</label>
   <div className="grid grid-cols-2 gap-2"><button type="button" onClick={()=>setFormat("pdf")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="pdf"?"bg-[#002344] text-white":"bg-white")}>PDF</button><button type="button" onClick={()=>setFormat("csv")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="csv"?"bg-[#002344] text-white":"bg-white")}>Excel / CSV</button></div>
   {target!==active&&<p className="mt-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3">Open the selected module first to export its current records.</p>}
   <div className="flex gap-2 mt-4"><button type="button" onClick={()=>setOpen(false)} className="flex-1 border px-3 py-2.5 rounded-xl font-bold">Cancel</button><button type="button" disabled={false} onClick={download} className="flex-1 bg-[#002344] text-white px-3 py-2.5 rounded-xl font-bold disabled:opacity-40">Download</button></div>
  </div>}
 </div>;
}

function Dashboard({summary}){
 const t=summary&&summary.totals||{},c=summary&&summary.counts||{};
 const cards=[["Members",c.members||0],["Volunteers",c.volunteers||0],["Donors",c.donors||0],["Beneficiaries",c.beneficiaries||0],["Donations","₹"+Number(t.donations||0).toLocaleString("en-IN")],["Expenses","₹"+Number(t.expenses||0).toLocaleString("en-IN")],["Cash","₹"+Number(t.cash||0).toLocaleString("en-IN")],["Bank","₹"+Number(t.bank||0).toLocaleString("en-IN")],["Stock Balance",Number(t.stockBalance||0).toLocaleString("en-IN")],["Pending",summary?.workflow?.pending||0],["Active MoUs",summary?.workflow?.activeMous||0],["Upcoming Meetings",summary?.workflow?.upcomingMeetings||0]];
 return <div className="space-y-5"><div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(function(x){return <div key={x[0]} className="bg-white border rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">{x[0]}</p><p className="text-2xl font-black text-[#002344] mt-2">{x[1]}</p></div>;})}</div>
 <div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-2xl border p-6"><h2 className="text-xl font-black text-[#002344]">All required office modules</h2><p className="text-zinc-500 mt-2">Members, Volunteers, Donors, Donations, Internship, Beneficiaries, Events/Camps, Projects, Documents, Expenses, all registers, reports, users and audit trail.</p><div className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">{MODULES.filter(function(x){return x[0]!=="dashboard";}).map(function(x){return <div key={x[0]} className="bg-zinc-50 rounded-lg px-3 py-2 font-semibold">{x[1]}</div>;})}</div></div>
 <div className="bg-white rounded-2xl border p-6"><h2 className="text-xl font-black text-[#002344]">Automatic financial linking</h2><p className="text-zinc-500 mt-2">Donation and expense workflows write linked contribution, cash/bank and ledger records in one database transaction.</p><div className="mt-5 space-y-2 text-sm font-bold text-zinc-700"><p>Donation → Donor → Contribution → Cash/Bank → Ledger → Receipt record</p><p>Expense → Expense Register → Cash/Bank → Ledger</p><p>Create/update/archive → Audit Trail</p></div><div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><strong>Compliance:</strong> final statutory/tax treatment, 80G particulars and audit requirements must be verified with SSF's CA/tax advisor.</div></div></div></div>;
}

function Register({module,rows,loading,search,setSearch,add,archive}){
 const [open,setOpen]=useState(false), [status,setStatus]=useState("all"), [from,setFrom]=useState(""), [to,setTo]=useState("");
 const filtered=rows.filter(function(r){const d=String(r.recordDate||"").slice(0,10);return (status==="all"||String(r.status||"").toLowerCase()===status)&&(from===""||d>=from)&&(to===""||d<=to);});
 return <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-5 sm:p-7 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344]">{LABELS[module]}</h2><p className="text-sm text-zinc-500 mt-1">{filtered.length} of {rows.length} record(s) · secure database</p></div><div className="flex gap-2"><div className="relative"><FaSearch className="absolute left-3 top-3 text-zinc-400"/><input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search ID / person" className="pl-9 pr-3 py-2.5 border rounded-xl w-56"/></div><div className="flex flex-wrap gap-2 items-center"><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm" title="From date"/><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm" title="To date"/><select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="archived">Archived</option></select><button onClick={function(){setOpen(!open);}} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus/> Add</button></div></div></div>
 {open&&<RecordForm module={module} onSave={function(d){add(module,d);setOpen(false);}}/>}
 {loading?<div className="p-10 text-center text-zinc-400">Loading…</div>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Details</th>{MONEY.has(module)&&<th className="p-3">Amount</th>}<th className="p-3">Status</th><th className="p-3"></th></tr></thead><tbody className="divide-y">{filtered.length===0?<tr><td colSpan="6" className="p-10 text-center text-zinc-400">No records yet.</td></tr>:filtered.map(function(r){return <tr key={r.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td><td className="p-3 whitespace-nowrap">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3 min-w-[260px]"><b>{r.data&& (r.data.fullName||r.data.donorName||r.data.name||r.data.payee||r.data.title||r.recordType)||"—"}</b><div className="text-xs text-zinc-400 mt-1">{r.data&&(r.data.purpose||r.data.description||r.data.category||r.data.email||"")}</div></td>{MONEY.has(module)&&<td className="p-3 font-bold">₹{Number(r.amount||0).toLocaleString("en-IN")}</td>}<td className="p-3">{r.status}</td><td className="p-3 text-right whitespace-nowrap">{module==="certificates"&&<button onClick={function(){printDesignedDocument(r,"certificate");}} className="text-xs font-bold text-[#002344] mr-3"><FaCertificate className="inline mr-1"/>Certificate</button>}{module==="idcards"&&<button onClick={function(){printDesignedDocument(r,"idcard");}} className="text-xs font-bold text-[#002344] mr-3"><FaIdCard className="inline mr-1"/>ID Card</button>}{SPECIAL_DOCS.has(module)&&module!=="certificates"&&module!=="idcards"&&<button onClick={function(){printRecord(r);}} className="text-xs font-bold text-[#002344] mr-3"><FaPrint className="inline mr-1"/>PDF</button>}<button onClick={function(){archive(r.id);}} className="text-xs font-bold text-red-600">Archive</button></td></tr>;})}</tbody></table></div>}
 </div>;
}

function RecordForm({module,onSave}){
 const [f,setF]=useState({date:new Date().toISOString().slice(0,10),name:"",email:"",phone:"",amount:"",paymentMode:"Cash",purpose:"",category:"General",notes:"",projectId:"",pan:"",address:"",direction:"in",item:"",qty:"",unit:"Nos",source:"",recipient:"",subject:"",referenceNo:"",agenda:"",participants:"",decision:"",actionPoints:"",parties:"",terms:"",startDate:"",endDate:"",role:"",validUntil:"",certificateType:"Participation",memberId:"",sourceRecordId:""});
 const [people,setPeople]=useState([]);
 useEffect(()=>{if(module!=="certificates")return; const token=localStorage.getItem(TOKEN_KEY)||""; const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"}; Promise.all(["members","volunteers"].map(m=>fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+m,{headers}).then(r=>r.ok?r.json():[]).catch(()=>[]))).then(([members,volunteers])=>setPeople([...(Array.isArray(members)?members:[]).map(r=>({...r,_source:"Member"})),...(Array.isArray(volunteers)?volunteers:[]).map(r=>({...r,_source:"Volunteer"}))]));},[module]);
 const selectPerson=(id)=>{const r=people.find(x=>String(x.id)===String(id));if(!r)return;const d=r.data||{};const personId=r.personId||d.memberId||d.volunteerId||d.officialId||"";setF(x=>({...x,name:d.fullName||d.name||d.title||"",role:d.role||d.position||(r._source==="Member"?"Member":"Volunteer"),memberId:personId,sourceRecordId:r.recordId||""}));};
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const input=(k,ph,req=false)=><input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required={req} className={cls}/>;
 const area=(k,ph)=><textarea value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} className={cls+" min-h-[92px]"}/>;
 const submit=e=>{e.preventDefault();
   if(module==="donations") return onSave({date:f.date,donorName:f.name,amount:f.amount,paymentMode:f.paymentMode,purpose:f.purpose,paymentStatus:"paid",email:f.email,phone:f.phone,pan:f.pan,address:f.address,notes:f.notes,projectId:f.projectId});
   if(module==="expenses") return onSave({date:f.date,payee:f.name,amount:f.amount,paymentMode:f.paymentMode,category:f.category,purpose:f.purpose,notes:f.notes,projectId:f.projectId});
   const data={...f}; onSave({recordDate:f.date,recordType:f.category,amount:f.amount||null,paymentMode:f.paymentMode,direction:f.direction,linkedRecordId:f.sourceRecordId||null,data});
 };
 const money=MONEY.has(module);
 return <form onSubmit={submit} className="p-5 bg-zinc-50 border-b grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {input("name",module==="mou"?"Agreement / MoU title":module==="meetings"?"Meeting title":module==="certificates"?"Recipient Name":"Name / title / person",!(["cash","bank","inventory"].includes(module)))}
  {input("date","Date",true)}
  {money&&module!=="cash"&&module!=="bank"&&input("amount","Amount",true)}
  {money&&<select value={f.paymentMode} onChange={e=>set("paymentMode",e.target.value)} className={cls}><option>Cash</option><option>Bank</option><option>UPI</option><option>Cheque</option><option>Other</option></select>}
  {money&&["cash","bank"].includes(module)&&<select value={f.direction} onChange={e=>set("direction",e.target.value)} className={cls}><option value="opening">Opening Balance</option><option value="in">Money In</option><option value="out">Money Out</option></select>}
  {module==="inventory"&&<>{input("item","Item / Samaan",true)}{input("qty","Quantity",true)}{input("unit","Unit (Nos/Kg/etc.)")}<select value={f.direction} onChange={e=>set("direction",e.target.value)} className={cls}><option value="in">Samaan Aaya</option><option value="out">Samaan Gaya / Diya</option></select>{input("source","Source / From whom")}{input("recipient","Given to / Recipient")}</>}
  {["inward","outward"].includes(module)&&<>{input("referenceNo","Letter / Reference No.")}{input("subject","Subject",true)}{input(module==="inward"?"source":"recipient",module==="inward"?"From whom":"To whom",true)}{input("category","Document Type")}</>}
  {module==="meetings"&&<>{input("category","Meeting Type (Board/General/etc.)")}{area("agenda","Agenda")}{area("participants","Members / Participants Present")}{area("decision","Minutes / Decisions")}{area("actionPoints","Action Points / Responsibility")}</>}
  {module==="mou"&&<>{input("parties","Parties / Organisations",true)}{input("purpose","Purpose / Scope",true)}{input("startDate","Start Date")}{input("endDate","End Date / Duration")}{area("terms","Key Terms / Responsibilities")}</>}
  {module==="certificates"&&<><div className="sm:col-span-2 lg:col-span-4 bg-white border border-blue-100 rounded-xl p-4"><div className="font-black text-[#002344]">Certificate Recipient</div><div className="text-xs text-zinc-500 mt-1">Select an existing Member/Volunteer so the certificate is generated for the correct person. The selected record is linked to this certificate.</div><select value={f.sourceRecordId} onChange={e=>selectPerson(e.target.value)} className={cls+" mt-3"}><option value="">Select Member / Volunteer</option>{people.map(r=><option key={r.recordId||r.id} value={r.id}>{(r.data?.fullName||r.data?.name||r.data?.title||"Unnamed")} · {r._source} · {r.recordId}</option>)}</select></div>{input("name","Recipient Name",true)}{input("certificateType","Certificate Type (Participation / Appreciation / Service / Experience / Completion / Membership)")}{input("role","Role / Activity",true)}{input("validUntil","Valid Until")}{input("memberId","Member / Volunteer ID")}{area("purpose","Activity / Certificate Details")}</>}
  {module==="idcards"&&<>{input("memberId","Member / Volunteer ID")}{input("role","Role / Designation",true)}{input("validUntil","Valid Until")}{input("phone","Phone")}{input("address","Address")}</>}
  {!["inventory","inward","outward","meetings","mou","certificates","idcards","cash","bank"].includes(module)&&<>{input("email","Email (optional)")}{input("phone","Phone (optional)")}{input("category","Category / Type")}{input("purpose","Purpose")}{input("projectId","Project ID (optional)")}{input("pan","PAN (optional)")}{area("address","Address / Details")}{area("notes","Notes")}</>}
  {(["cash","bank"].includes(module))&&<>{input("category","Transaction Type")}{input("purpose","Description / Purpose",true)}{input("referenceNo","Voucher / Cheque / UTR No.")}{area("notes","Remarks")}</>}
  {module==="inventory"&&<>{input("category","Stock Category")}{area("notes","Remarks")}</>}
  {module==="assets"&&<>{input("category","Asset Category",true)}{input("item","Asset / Equipment Name",true)}{input("source","Purchase / Donor Source")}{input("qty","Quantity")}{input("unit","Unit")}{input("validUntil","Warranty / Review Date")}{input("recipient","Custodian / Location")}{area("notes","Condition / Remarks")}</>}
  {module==="notifications"&&<>{input("category","Alert Type",true)}{input("subject","Subject",true)}{input("validUntil","Due Date")}{input("recipient","Responsible Person")}{area("notes","Action / Follow-up")}</>}
  {(["inward","outward","meetings","mou","certificates","idcards"].includes(module))&&area("notes","Remarks")}
  <button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold hover:opacity-95">Save {LABELS[module]||"Record"}</button>
 </form>;
}



function Reports({token,exportRows,exportPdf}){
 const [data,setData]=useState(null),[from,setFrom]=useState(""),[to,setTo]=useState(""),[loading,setLoading]=useState(false);
 const run=async()=>{setLoading(true);try{const q=ENDPOINTS.DIGITAL_OFFICE_REPORTS+((from||to)?("?from="+encodeURIComponent(from)+"&to="+encodeURIComponent(to)):"");const r=await fetch(q,{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Report could not be loaded");setData(await r.json());}catch(e){setData({error:e.message});}finally{setLoading(false);}};
 useEffect(()=>{run();},[]);
 if(data&&data.error)return <div className="bg-white border rounded-2xl p-6 text-red-700">{data.error}</div>;
 const s=data?.summary||{}; const rows=data?.rows||[];
 return <div className="space-y-5"><div className="bg-white border rounded-2xl p-5 flex flex-wrap gap-3 items-end"><div><label className="text-xs font-bold text-zinc-500">From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="block mt-1 px-3 py-2.5 border rounded-xl"/></div><div><label className="text-xs font-bold text-zinc-500">To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="block mt-1 px-3 py-2.5 border rounded-xl"/></div><button onClick={run} className="bg-[#002344] text-white px-5 py-2.5 rounded-xl font-bold">Generate Report</button><button onClick={()=>exportRows(rows,"ssf-report")} className="border px-4 py-2.5 rounded-xl font-bold">CSV</button><button onClick={()=>exportPdf(rows,"SSF Financial / Office Report")} className="border px-4 py-2.5 rounded-xl font-bold">PDF</button></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{[["Donations",s.donations], ["Expenses",s.expenses],["Cash In",s.cashIn],["Cash Out",s.cashOut],["Bank In",s.bankIn],["Bank Out",s.bankOut],["Contributions",s.contributions]].map(x=><div className="bg-white border rounded-2xl p-5" key={x[0]}><div className="text-xs text-zinc-400 font-bold uppercase">{x[0]}</div><div className="text-2xl font-black text-[#002344] mt-2">₹{Number(x[1]||0).toLocaleString("en-IN")}</div></div>)}</div><div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Module</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Status</th></tr></thead><tbody className="divide-y">{rows.slice(0,100).map(r=><tr key={r.id}><td className="p-3 font-bold">{r.recordId}</td><td className="p-3">{LABELS[r.module]||r.module}</td><td className="p-3">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3">{r.amount?"₹"+Number(r.amount).toLocaleString("en-IN"):"—"}</td><td className="p-3">{r.status}</td></tr>)}</tbody></table></div></div>;
}

function Audit({token}){const [rows,setRows]=useState([]);useEffect(()=>{fetch(ENDPOINTS.DIGITAL_OFFICE_AUDIT,{headers:{Authorization:"Bearer "+token}}).then(r=>r.json()).then(setRows).catch(()=>setRows([]));},[]);return <div className="bg-white border rounded-2xl overflow-auto"><div className="p-6 border-b"><h2 className="text-2xl font-black text-[#002344]">Audit Trail</h2><p className="text-sm text-zinc-500 mt-1">Create, update and archive activity is retained.</p></div><table className="w-full text-sm"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">Time</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Module</th><th className="p-3 text-left">Record</th><th className="p-3 text-left">Actor</th></tr></thead><tbody className="divide-y">{rows.map(r=><tr key={r.id}><td className="p-3">{new Date(r.createdAt).toLocaleString("en-IN")}</td><td className="p-3 font-bold">{r.action}</td><td className="p-3">{LABELS[r.module]||r.module}</td><td className="p-3">{r.recordId||"—"}</td><td className="p-3">{r.actor||"—"}</td></tr>)}</tbody></table></div>}

function Users({add}){const [role,setRole]=useState("Office Admin"),[name,setName]=useState(""),[email,setEmail]=useState(""),[saved,setSaved]=useState(false);const save=async()=>{if(!name||!email)return;await add("users",{recordDate:new Date().toISOString().slice(0,10),recordType:role,status:"active",data:{name,email,role,permissions:"View, Create, Update, Archive, Reports"}});setSaved(true);setName("");setEmail("");};return <div className="bg-white border rounded-2xl p-6"><h2 className="text-2xl font-black text-[#002344]">Users & Permissions</h2><p className="text-zinc-500 mt-1">Office-level role record. Existing admin authentication remains unchanged.</p><div className="grid sm:grid-cols-3 gap-3 mt-6"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className={cls}/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className={cls}/><select value={role} onChange={e=>setRole(e.target.value)} className={cls}><option>Office Admin</option><option>President</option><option>Secretary</option><option>Treasurer</option><option>Data Entry</option><option>Viewer / Auditor</option></select></div><button onClick={save} className="mt-4 bg-[#002344] text-white px-5 py-3 rounded-xl font-bold">Save Office Role</button>{saved&&<p className="mt-3 text-emerald-700 font-semibold">Role record saved.</p>}<div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">This module records office roles and permissions. It does not create a new website login or change existing Admin Portal authentication.</div></div>}