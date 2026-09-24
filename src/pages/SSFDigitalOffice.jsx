import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBook, FaChartLine, FaDownload, FaPlus, FaSearch, FaUsers, FaFileAlt, FaRupeeSign, FaCalendarAlt, FaTasks, FaUserShield, FaHistory, FaBoxes, FaIdCard, FaCertificate, FaHandshake, FaBalanceScale, FaPrint, FaVideo, FaUserTie } from "react-icons/fa";
import jsPDF from "jspdf";
import { ENDPOINTS } from "../config/api";
import logoImg from "../assets/new-logo.png";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";

const TOKEN_KEY = "ssf_admin_token";
const MODULES = [
 ["dashboard","Dashboard",FaChartLine],
 ["onlineMeetings","Online Meetings",FaVideo],
 ["members","Members Register",FaUsers],["institutionalHistory","संस्था इतिहास (Institutional History)",FaHistory],["officeHistory","प्रबंधकारिणी समिति / Office History",FaUserTie],["managingCommittee","प्रबंधकारिणी समिति (Managing Committee)",FaUserTie],["membershipContributions","Membership & Contribution",FaRupeeSign],["meetingResolutions","Meeting & Resolution",FaCalendarAlt],["volunteers","Volunteers",FaUsers],["donors","Donors",FaUsers],
 ["donations","Donations",FaRupeeSign],["expenses","Expenses",FaRupeeSign],["contribution","Contribution Register",FaBook],
 ["cash","Cash Book",FaBook],["bank","Bank Book",FaBook],["ledger","Ledger",FaBalanceScale],
 ["inventory","Stock / Samaan",FaBoxes],
 ["inward","Aavak / Inward",FaFileAlt],["outward","Jaavak / Outward",FaFileAlt],
 ["meetings","Meeting / Baithak",FaCalendarAlt],["projects","Projects / Initiatives",FaTasks],["events","Events / Camps",FaCalendarAlt],
 ["mou","MoU / Agreements",FaHandshake],["documents","Documents",FaFileAlt],["officialDocuments","Official Documents",FaFileAlt],["donorSlips","Donor Slips / Receipts",FaFileAlt],["separations","Separation / Role Changes",FaFileAlt],["appointmentLetters","Appointment Letters",FaUserTie],
 
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
   if(!r.ok){throw new Error(out.detail ? (out.message+" "+out.detail) : (out.message||"Save failed."));}
   setNotice(out.donationId?"Saved. Donation ID: "+out.donationId:"Record saved successfully.");
   await load(module);
   return true;
  }catch(e){setNotice(e.message||"Save failed.");return false;}
 };
 const archive=async function(id){
  if(!confirm("Archive this record? Financial records are not hard-deleted."))return;
  const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"DELETE",headers:auth()});
  if(r.ok){setNotice("Record archived.");load(active);}
 };
 const updateRecord=async function(id,module,data){
  try{
   const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"PUT",headers:auth(),body:JSON.stringify({module:module,data:data,recordDate:data.eventDate||data.date||new Date().toISOString().slice(0,10),recordType:data.changeType||data.eventType||"Record",status:"active"})});
   const out=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(out.detail?(out.message+" "+out.detail):(out.message||"Update failed."));
   setNotice("Record updated successfully.");
   await load(module);
   return true;
  }catch(e){setNotice(e.message||"Update failed.");return false;}
 };
 const flattenExport=function(data){
  return (data||[]).map(function(x){
   const nested=x.data&&typeof x.data==="object"?x.data:{};
   const row={ID:x.recordId||"",Module:LABELS[x.module]||x.module||"",Type:x.recordType||"",Date:x.recordDate?new Date(x.recordDate).toLocaleDateString("en-IN"):"",Amount:x.amount||"",PaymentMode:x.paymentMode||"",Status:x.status||"",PersonID:x.personId||"",LinkedID:x.linkedRecordId||""};
   Object.entries(nested).forEach(function(entry){const key=entry[0]; const value=entry[1]; if(!(key in row))row[key]=value??"";});
   return row;
  });
 };
 const exportRows=function(data,name){
  const flat=flattenExport(data); const headers=Array.from(new Set(flat.reduce(function(all,row){return all.concat(Object.keys(row));},[])));
  if(!headers.length)headers=["ID","Module","Date","Status"];
  const csv=[headers.map(function(h){return JSON.stringify(h);}).join(","),...flat.map(function(row){return headers.map(function(h){return JSON.stringify(row[h] == null ? "" : row[h]);}).join(",");})].join("\r\n");
  const blob=new Blob(["\\uFEFF",csv],{type:"text/csv;charset=utf-8"}); const a=document.createElement("a"); const url=URL.createObjectURL(blob); a.href=url; a.download=name+".csv"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},1000);
 };
 const exportExcel=function(data,name){
  const flat=flattenExport(data);
  const headers=Array.from(new Set(flat.reduce(function(all,row){return all.concat(Object.keys(row));},[])));
  if(!headers.length)return;
  const escXml=function(v){
   return String(v??"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&apos;");
  };
  const cell=function(v){
   const value=(v===null||v===undefined)?"":(typeof v==="object"?JSON.stringify(v):String(v));
   return '<Cell><Data ss:Type="String">'+escXml(value)+'</Data></Cell>';
  };
  const rowsXml=[
   '<Row>'+headers.map(function(h){return cell(h);}).join("")+'</Row>',
   ...flat.map(function(row){
    return '<Row>'+headers.map(function(h){return cell(row[h]);}).join("")+'</Row>';
   })
  ].join("");
  const xml='<?xml version="1.0" encoding="UTF-8"?>'
   +'<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
   +'xmlns:o="urn:schemas-microsoft-com:office:office" '
   +'xmlns:x="urn:schemas-microsoft-com:office:excel" '
   +'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
   +'<Worksheet ss:Name="SSF Digital Office"><Table>'+rowsXml+'</Table></Worksheet></Workbook>';
  const blob=new Blob(["\\uFEFF",xml],{type:"application/vnd.ms-excel"});
  const a=document.createElement("a");
  const url=URL.createObjectURL(blob);
  a.href=url;
  a.download=name+".xls";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
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
  let y=42;
  (data||[]).forEach(function(x,index){
   const nested=x.data&&typeof x.data==="object"?x.data:{};
   const fields=[["Record ID",x.recordId],["Module",LABELS[x.module]||x.module],["Record Type",x.recordType],["Record Date",x.recordDate?new Date(x.recordDate).toLocaleDateString("en-IN"):""],["Status",x.status]];
   Object.entries(nested).forEach(function(entry){const key=entry[0],value=entry[1];if(value!==null&&value!==undefined&&String(value).trim()!==""){fields.push([key.replace(/([A-Z])/g," $1").replace(/^./,function(ch){return ch.toUpperCase();}),String(value)]);}});
   d.setFont(undefined,"bold");d.setTextColor(0,35,68);d.text("Record "+(index+1),14,y);y+=7;
   fields.forEach(function(pair){let value=String(pair[1]??"");const wrapped=d.splitTextToSize(value,132);d.setFont(undefined,"bold");d.setTextColor(40);d.text(pair[0]+":",16,y);d.setFont(undefined,"normal");d.text(wrapped,58,y);y+=Math.max(7,wrapped.length*5);if(y>275){d.addPage();y=20;}});
   y+=4;if(y>275){d.addPage();y=20;}
  });
  d.setFontSize(9);d.setTextColor(120);d.text("Computer-generated office record · SSF Digital Office",105,288,{align:"center"});d.save(title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".pdf");
 };

 if(!token)return <div className="min-h-screen bg-zinc-50 pt-32 px-6 flex items-center justify-center"><div className="bg-white rounded-3xl p-8 border max-w-md"><h1 className="text-2xl font-black text-[#002344]">Admin login required</h1><p className="text-zinc-500 mt-2">Open Admin and login first, then open Digital Office.</p><Link to="/Admin" className="inline-block mt-5 bg-[#002344] text-white px-5 py-3 rounded-xl font-bold">Go to Admin</Link></div></div>;

 return <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-3 sm:px-6"><div className="max-w-[1500px] mx-auto">
  <header className="bg-[#002344] text-white rounded-[2rem] p-6 sm:p-8 mb-5"><div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
   <div className="flex items-start gap-4"><img src={logoImg} alt="SSF logo" className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-2xl bg-white p-2 shrink-0"/><div><Link to="/Admin" className="text-white/70 text-sm font-bold inline-flex items-center gap-2"><FaArrowLeft/> Admin</Link><p className="text-xs text-orange-300 font-black uppercase tracking-[.2em] mt-4">SSF Digital Office · Secure Database Edition</p><h1 className="text-3xl sm:text-4xl font-black mt-2">Paperless NGO Office</h1><p className="text-white/70 mt-2 max-w-3xl">One source record → linked registers → reports → audit trail. Existing website records are preserved.</p></div></div>
   <DownloadCenter active={active} rows={rows} exportRows={exportRows} exportExcel={exportExcel} exportPdf={exportPdf} setActive={setActive}/>
  </div></header>
  {notice&&<div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 font-semibold">{notice}</div>}
  <div className="grid lg:grid-cols-[245px_1fr] gap-5">
   <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-auto"><div className="px-4 pt-4 pb-3 border-b border-zinc-200"><div className="flex items-center gap-3"><img src={logoImg} alt="SSF logo" className="h-12 w-12 object-contain rounded-xl bg-white border border-zinc-100 p-1" /><div><div className="text-sm font-black text-[#002344]">SSF Digital Office</div><div className="text-[10px] text-zinc-500 font-semibold">Paperless Office Management</div></div></div></div>{MODULES.map(function(x){var Icon=x[2];return <button key={x[0]} onClick={function(){setActive(x[0]);}} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-bold mb-1 "+(active===x[0]?"bg-[#002344] text-white":"text-zinc-700 hover:bg-zinc-100")}><Icon/> {x[1]}</button>;})}</aside>
   <main className="min-w-0">
    {active==="dashboard"&&<Dashboard summary={summary}/>}
    {active==="onlineMeetings"&&<OnlineMeetings token={token}/>}
    {active==="members"&&<MembersRegister rows={rows} add={add} archive={archive}/>}
    {active==="institutionalHistory"&&<InstitutionalHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="officeHistory"&&<OfficeHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="membershipContributions"&&<MembershipContributions rows={rows} add={add} archive={archive}/>}
    {active==="meetingResolutions"&&<MeetingResolutions rows={rows} add={add} archive={archive}/>}
    {active==="appointmentLetters"&&<AppointmentLetters rows={rows} add={add}/>}
    {active==="managingCommittee"&&<ManagingCommittee rows={rows} add={add} archive={archive}/>}
    {active==="officialDocuments"&&<OfficialDocuments rows={rows} add={add}/>}
    {active==="donorSlips"&&<DonorSlips rows={rows} add={add}/>} 
    {active==="separations"&&<SeparationManagement rows={rows} add={add}/>}
    {active==="reports"&&<Reports token={token} exportRows={exportRows} exportPdf={exportPdf}/>}
    {active==="audit"&&<Audit token={token}/>}
    {active==="users"&&<Users add={add}/>}
    {!["dashboard","reports","audit","users","appointmentLetters","officialDocuments","donorSlips","separations","members","institutionalHistory","officeHistory","membershipContributions","meetingResolutions"].includes(active)&&<Register module={active} rows={rows} loading={loading} search={search} setSearch={setSearch} add={add} archive={archive}/>}
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
 ].join("\n");
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

function DownloadCenter({active,rows,exportRows,exportExcel,exportPdf,setActive}){
 const [open,setOpen]=useState(false);
 const [target,setTarget]=useState(active==="dashboard" ? "members" : active);
 const [format,setFormat]=useState("pdf");
 const available=Object.entries(LABELS).filter(function(x){return x[0]!=="dashboard"&&x[0]!=="audit"&&x[0]!=="users"&&x[0]!=="reports";});
 const download=function(){
  if(target!==active){setActive(target);setOpen(false);return;}
  const data=rows||[];
  const filename="ssf-"+target+"-"+new Date().toISOString().slice(0,10);
  if(format==="pdf")exportPdf(data,"SSF "+(LABELS[target]||"Records"));
  else if(format==="excel")exportExcel(data,filename);
  else exportRows(data,filename);
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
   <div className="grid grid-cols-3 gap-2"><button type="button" onClick={()=>setFormat("pdf")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="pdf"?"bg-[#002344] text-white":"bg-white")}>PDF</button><button type="button" onClick={()=>setFormat("excel")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="excel"?"bg-[#002344] text-white":"bg-white")}>Excel</button><button type="button" onClick={()=>setFormat("csv")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="csv"?"bg-[#002344] text-white":"bg-white")}>CSV</button></div>
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


function OfficialDocuments({rows,add}){
 const [f,setF]=useState({docType:"Appointment Letter",name:"",designation:"",date:new Date().toISOString().slice(0,10),validFrom:"",validTill:"",reference:"",subject:"",body:"",remarks:"",signatory:"Ramesh Pandey\\nFounder & National President"});
 const [notice,setNotice]=useState("");
 const [saving,setSaving]=useState(false);
 const types=[
  "Appointment Letter","Joining Letter","Joining Report","Office Order","Role Assignment Order","Responsibility Letter","Promotion / Padonnati Order","Transfer / Role Change Order","Additional Responsibility Order","Extension / Renewal Letter","Relieving Letter","Resignation Acceptance Letter","Termination / Appointment Revocation Order",
  "Membership Approval Letter","Membership Confirmation Letter","Volunteer Joining Letter","Volunteer Engagement Letter","Volunteer ID Card","Member ID Card","Internship Offer / Appointment Letter","Internship Completion Letter","Experience Certificate",
  "Authorization Letter","Authority Delegation Letter","Office Circular","Office Notice","Office Memorandum","Official Communication Letter","Recommendation Letter","No Objection Certificate (NOC)","Permission Letter","Appreciation Letter",
  "Meeting Notice","Meeting Agenda","Meeting Minutes","Resolution","Resolution Certificate / Certified Copy","Attendance Sheet","Action Taken Report",
  "Partnership Letter","Collaboration Letter","MoU","Project Approval Letter","Project Assignment Order","Partner Recognition Letter","Sponsorship / Support Letter",
  "Participation Certificate","Appreciation Certificate","Achievement Certificate","Outstanding Contribution Certificate","Training Certificate","Workshop Certificate","Internship Certificate","Volunteer Service Certificate","Letter of Recognition",
  "Donation Receipt","Donation Acknowledgement Letter","Donation Thank-you Letter","Contribution Acknowledgement","Expense Approval / Sanction Note","Payment Authorization","Fund Utilisation Statement",
  "Covering Letter","Application Letter","Request Letter","Declaration","Undertaking","Consent Letter","Confidentiality / NDA","Document Verification Letter","Certificate Verification Letter","General-purpose Custom Letter"
 ];
 const nextNo=()=>{const year=new Date().getFullYear();const n=(rows||[]).filter(r=>r.data?.documentNo).length+1;return "SSF/DOC/"+year+"/"+String(n).padStart(4,"0");};
 const makePdf=async(data)=>{
  const d=new jsPDF(), navy=[0,35,68], pageW=d.internal.pageSize.getWidth(), pageH=d.internal.pageSize.getHeight(), left=18;
  d.setTextColor(...navy);d.addImage(logoImg,"PNG",left,10,18,18);d.setFontSize(18);d.text("Swastik Srijan Foundation Samiti",pageW/2,17,{align:"center"});
  d.setFontSize(8);d.setTextColor(80);d.text("Registered under Madhya Pradesh Societies Registration Act, 1973",pageW/2,24,{align:"center"});
  d.text("Reg. No. 05/22/03/11448/13 · District Rewa · Pan India",pageW/2,29,{align:"center"});
  d.text("Ward No. 1, Village Dadar, Post Rahat, Tahsil Huzur, Rewa, MP 486446",pageW/2,34,{align:"center"});
  d.text("swastiksrijanfoundation@gmail.com · swastiksrijan.in",pageW/2,39,{align:"center"});
  d.setDrawColor(180);d.line(left,43,pageW-left,43);d.setTextColor(...navy);d.setFontSize(15);d.setFont(undefined,"bold");d.text(data.docType.toUpperCase(),pageW/2,55,{align:"center"});
  d.setFontSize(9);d.setTextColor(90);d.text("Document No.: "+data.documentNo,left,64);d.text("Date: "+data.date,pageW-left,64,{align:"right"});
  let y=77;d.setTextColor(20);d.setFontSize(10);
  const field=(label,value)=>{if(!value)return;d.setFont(undefined,"bold");d.text(label+":",left,y);d.setFont(undefined,"normal");d.text(String(value),left+34,y);y+=7;};
  field("Name",data.name);field("Designation",data.designation);field("Valid From",data.validFrom);field("Valid Till",data.validTill);field("Reference",data.reference);
  if(data.subject){y+=4;d.setFont(undefined,"bold");d.text("Subject: "+data.subject,left,y);y+=10;}
  if(data.body){d.setFont(undefined,"normal");const lines=d.splitTextToSize(String(data.body),pageW-left*2);lines.forEach(line=>{if(y>pageH-45){d.addPage();y=22;}d.text(line,left,y);y+=5.5;});}
  if(data.remarks){y+=6;d.setFont(undefined,"bold");d.text("Remarks:",left,y);y+=6;d.setFont(undefined,"normal");d.splitTextToSize(String(data.remarks),pageW-left*2).forEach(line=>{if(y>pageH-45){d.addPage();y=22;}d.text(line,left,y);y+=5.5;});}
  if(y>pageH-42){d.addPage();y=22;} y+=12;d.setFont(undefined,"bold");d.text("For Swastik Srijan Foundation Samiti",left,y);y+=14;d.text(String(data.signatory||"Ramesh Pandey").split("\\n")[0],left,y);y+=5;d.setFont(undefined,"normal");d.text(String(data.signatory||"Founder & National President").split("\\n").slice(1).join(" ")||"Founder & National President",left,y);
  d.setFontSize(8);d.setTextColor(120);d.text("Computer-generated official office document · Issued by authorised SSF administration",pageW/2,pageH-10,{align:"center"});
  const url=URL.createObjectURL(d.output("blob")),a=document.createElement("a");a.href=url;a.download=data.documentNo.replace(/[\\/]/g,"-")+".pdf";a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
 const submit=async e=>{e.preventDefault();if(!f.name.trim()&&!f.docType.includes("Notice")&&!f.docType.includes("Circular")){setNotice("Name / recipient required.");return;}const data={...f,documentNo:nextNo()};await add("officialDocuments",{recordDate:f.date,recordType:f.docType,status:"active",data});await makePdf(data);setNotice("Official document saved and PDF generated: "+data.documentNo);};
 const input=(k,ph)=><input value={f[k]} onChange={e=>setF(x=>({...x,[k]:e.target.value}))} placeholder={ph} className={cls}/>;
 return <div className="bg-white rounded-2xl border overflow-hidden">
  <div className="bg-[#002344] text-white p-6 sm:p-7"><h2 className="text-2xl font-black">Official Documents</h2><p className="text-white/70 mt-1">Admin can create official SSF papers from one place. Existing records remain preserved.</p></div>
  <form onSubmit={submit} className="p-5 sm:p-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
   <div className="sm:col-span-2 lg:col-span-4"><label className="text-xs font-bold text-zinc-500">Document Type</label><select value={f.docType} onChange={e=>setF(x=>({...x,docType:e.target.value}))} className={cls+" mt-1"}>{types.map(t=><option key={t}>{t}</option>)}</select></div>
   {input("name","Recipient / Person / Organisation")}{input("designation","Designation / Role")}{input("date","Issue Date")}{input("validFrom","Valid From")}{input("validTill","Valid Till / Period End")}{input("reference","Reference No. / File No.")}{input("subject","Subject")}
   <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.body} onChange={e=>setF(x=>({...x,body:e.target.value}))} className={cls+" min-h-[180px]"} placeholder="Document content / main text. Admin can write anything required for this paper."/></div>
   <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.remarks} onChange={e=>setF(x=>({...x,remarks:e.target.value}))} className={cls+" min-h-[90px]"} placeholder="Remarks / special conditions / additional instructions"/></div>
   <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.signatory} onChange={e=>setF(x=>({...x,signatory:e.target.value}))} className={cls+" min-h-[70px]"} placeholder="Authorised signatory"/></div>
   <button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold"><FaFileAlt className="inline mr-2"/>Save & Generate Official PDF</button>
  </form>
  {notice&&<div className="m-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 font-semibold">{notice}</div>}
  <div className="p-5 border-t"><h3 className="font-black text-[#002344] mb-3">Recent Official Documents</h3><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">No.</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Person</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Status</th></tr></thead><tbody className="divide-y">{(rows||[]).slice(0,20).map(r=><tr key={r.id}><td className="p-3 font-bold text-[#002344]">{r.data?.documentNo||r.recordId}</td><td className="p-3">{r.recordType}</td><td className="p-3">{r.data?.name||"—"}</td><td className="p-3">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3">{r.status}</td></tr>)}</tbody></table></div></div>
 </div>;
}

function AppointmentLetters({rows,add}){
 const today=new Date().toISOString().slice(0,10);
 const nextNumber=()=>{
  const year=today.slice(0,4);
  const nums=(rows||[]).map(r=>String(r.data?.appointmentNo||"")).filter(x=>x.startsWith("SSF/APP/"+year+"/")).map(x=>Number(x.split("/").pop())).filter(Number.isFinite);
  return "SSF/APP/"+year+"/"+String((nums.length?Math.max(...nums):0)+1).padStart(4,"0");
 };
 const [f,setF]=useState({
  date:today,name:"",email:"",phone:"",designation:"",department:"",engagement:"Volunteer",
  joiningDate:today,validUntil:"",reportingTo:"",location:"",reference:"",
  responsibilities:"• Work in accordance with the objectives, rules and approved plans of Swastik Srijan Foundation Samiti.\n• Support assigned programmes, projects, meetings, camps and community activities.\n• Coordinate with members, volunteers, beneficiaries and relevant stakeholders as required.\n• Maintain timely activity information, attendance, photographs and other assigned records.\n• Submit activity/progress updates and communicate important issues to the competent authority.\n• Protect organisational records, confidentiality, reputation and resources.\n• Do not make financial commitments, sign agreements or represent the Foundation beyond the authority assigned.",
  terms:"The appointee shall perform the assigned responsibilities with integrity, confidentiality and due care, and follow the applicable policies, instructions and approved plans of the Foundation.",
 });
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const input=(k,ph,req=false)=><input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required={req} className={cls}/>;
 const area=(k,ph,rows=4)=><textarea value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} rows={rows} className={cls+" resize-y"}/>;
 const makePdf=async(data)=>{
  const d=new jsPDF(); const pageW=d.internal.pageSize.getWidth(), pageH=d.internal.pageSize.getHeight(), left=18, right=pageW-18;
  const navy=[0,35,68], grey=[85,85,85];
  const wrap=(text,width)=>d.splitTextToSize(String(text||""),width);
  const lineBlock=(label,value,y,width=pageW-36)=>{
   d.setFont(undefined,"bold");d.setTextColor(...navy);d.text(label,left,y);
   d.setFont(undefined,"normal");d.setTextColor(...grey);const lines=wrap(value,width-42);d.text(lines,left+42,y);return y+Math.max(7,lines.length*5.2);
  };
  d.setFillColor(...navy);d.rect(0,0,pageW,5,"F");
  try{d.addImage(logoImg,"PNG",left,12,24,24);}catch(e){}
  d.setTextColor(...navy);d.setFont(undefined,"bold");d.setFontSize(17);d.text("SWASTIK SRIJAN FOUNDATION SAMITI",48,19);
  d.setFont(undefined,"normal");d.setFontSize(9);d.setTextColor(...grey);
  d.text("Registered under Madhya Pradesh Societies Registration Act, 1973",48,25);
  d.text("Reg. No. 05/22/03/11448/13  |  Registered District: Rewa, Madhya Pradesh",48,30);
  d.text("Ward No. 1, Village Dadar, Post Rahat, Tahsil Huzur, Rewa, MP 486446",48,35);
  d.text("Email: swastiksrijanfoundation@gmail.com  |  Website: swastiksrijan.in",48,40);
  d.setDrawColor(220,220,220);d.line(left,45,right,45);
  d.setTextColor(...navy);d.setFont(undefined,"bold");d.setFontSize(16);d.text("APPOINTMENT LETTER",pageW/2,57,{align:"center"});
  d.setFontSize(9);d.setTextColor(...grey);d.setFont(undefined,"normal");
  d.text("Appointment No.: "+data.appointmentNo,left,67);d.text("Date: "+data.date,right,67,{align:"right"});
  d.setFontSize(11);d.setTextColor(30);d.setFont(undefined,"normal");
  let y=82;d.text("To,",left,y);y+=7;d.setFont(undefined,"bold");d.text(data.name,left,y);y+=6;d.setFont(undefined,"normal");
  if(data.email){d.text(data.email,left,y);y+=6;} if(data.location){d.text(data.location,left,y);y+=6;}
  y+=5;d.setFont(undefined,"bold");d.setTextColor(...navy);d.text("Subject: Appointment as "+data.designation,left,y);y+=9;
  d.setFont(undefined,"normal");d.setTextColor(40);
  const para="Dear "+data.name+", We are pleased to appoint you as "+data.designation+(data.department?" in "+data.department:"")+" with Swastik Srijan Foundation Samiti, subject to the terms and responsibilities set out in this letter. We appreciate your willingness to contribute to the objectives and activities of the Foundation.";
  const paraLines=wrap(para,right-left);d.text(paraLines,left,y);y+=paraLines.length*5.5+7;
  const details=[["Engagement Type",data.engagement],["Joining / Effective Date",data.joiningDate],["Valid Until",data.validUntil||"As per organisational decision / role terms"],["Reporting To",data.reportingTo||"Competent authority of the Foundation"],["Location",data.location||"As assigned by the Foundation"]];
  details.forEach(([k,v])=>{if(y>pageH-55){d.addPage();y=22;}y=lineBlock(k+":",v,y);y+=1;});
  y+=5;d.setFont(undefined,"bold");d.setTextColor(...navy);d.text("Responsibilities",left,y);y+=7;d.setFont(undefined,"normal");d.setTextColor(40);
  wrap(data.responsibilities,right-left).forEach(line=>{if(y>pageH-45){d.addPage();y=22;}d.text(line,left,y);y+=5.2;});y+=6;
  d.setFont(undefined,"bold");d.setTextColor(...navy);d.text("Terms & Conduct",left,y);y+=7;d.setFont(undefined,"normal");d.setTextColor(40);
  wrap(data.terms,right-left).forEach(line=>{if(y>pageH-45){d.addPage();y=22;}d.text(line,left,y);y+=5.2;});y+=8;
  if(data.reference){d.setFont(undefined,"bold");d.setTextColor(...navy);d.text("Reference / Remarks",left,y);y+=7;d.setFont(undefined,"normal");d.setTextColor(40);wrap(data.reference,right-left).forEach(line=>{if(y>pageH-45){d.addPage();y=22;}d.text(line,left,y);y+=5.2;});y+=5;}
  d.setFont(undefined,"normal");d.setTextColor(40);d.text("Please acknowledge this appointment and carry out the assigned responsibilities responsibly and in the best interests of the Foundation.",left,y);y+=14;
  if(y>pageH-35){d.addPage();y=25;}d.setFont(undefined,"bold");d.setTextColor(...navy);d.text("For Swastik Srijan Foundation Samiti",left,y);y+=18;d.text("Ramesh Pandey",left,y);y+=5;d.setFont(undefined,"normal");d.text("Founder & National President",left,y);
  d.setFontSize(8);d.setTextColor(120);d.text("Computer-generated official office document · Issued by authorised SSF administration",pageW/2,pageH-10,{align:"center"});
  const filename=(data.appointmentNo||"SSF-Appointment").replace(/[\/\\]/g,"-")+".pdf";const blob=d.output("blob"),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
 const submit=async e=>{e.preventDefault();const appointmentNo=nextNumber();const data={appointmentNo,...f};await add("appointmentLetters",{recordDate:f.date,recordType:"Appointment Letter",status:"active",data});await makePdf(data);};
 return <div className="bg-white rounded-2xl border overflow-hidden">
  <div className="bg-[#002344] text-white p-6 sm:p-7"><div className="flex items-center gap-3"><FaUserTie className="text-2xl"/><div><h2 className="text-2xl font-black">Appointment Letters</h2><p className="text-white/70 mt-1">Authorised Admin can create, issue and download official SSF appointment letters.</p></div></div></div>
  <form onSubmit={submit} className="p-5 sm:p-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
   {input("name","Full Name",true)}{input("designation","Designation / Position",true)}{input("email","Email (optional)")}{input("phone","Phone (optional)")}
   {input("department","Department / Programme")}{input("date","Issue Date",true)}{input("joiningDate","Joining / Effective Date",true)}{input("validUntil","Valid Until (optional)")}
   <select value={f.engagement} onChange={e=>set("engagement",e.target.value)} className={cls}><option>Volunteer</option><option>Member</option><option>Coordinator</option><option>Intern</option><option>Employee</option><option>Consultant</option><option>Other</option></select>
   {input("reportingTo","Reporting To")}{input("location","Location / Area")}{input("reference","Reference / Remarks")}
   <div className="sm:col-span-2 lg:col-span-4 bg-white border rounded-xl p-4"><div className="font-black text-[#002344]">Standard NGO Responsibilities</div><p className="text-xs text-zinc-500 mt-1 mb-3">Admin can edit these for the specific appointment.</p>{area("responsibilities","Responsibilities",8)}</div>
   <div className="sm:col-span-2 lg:col-span-4">{area("terms","Terms & Conduct",5)}</div>
   <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2"><button className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold"><FaFileAlt className="inline mr-2"/>Save & Generate Appointment Letter</button><span className="text-xs text-zinc-500 self-center">The PDF uses SSF letterhead, registration details, appointment number and authorised signatory.</span></div>
  </form>
 </div>;
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




function DonorSlips({rows,add}){
 const [f,setF]=useState({donorName:"",donationId:"",date:new Date().toISOString().slice(0,10),amount:"",paymentMode:"UPI",transactionNo:"",purpose:"General",email:"",phone:"",address:"",pan:"",remarks:""});
 const [notice,setNotice]=useState("");
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const makePdf=(receiptNo,data)=>{
  const d=new jsPDF();
  d.addImage(logoImg,"PNG",16,10,20,20);
  d.setTextColor(0,35,68); d.setFontSize(18); d.text("Swastik Srijan Foundation Samiti",105,18,{align:"center"});
  d.setFontSize(9); d.setTextColor(80); d.text("Registered under Madhya Pradesh Societies Registration Act, 1973",105,25,{align:"center"});
  d.text("Reg. No. 05/22/03/11448/13 · Rewa, Madhya Pradesh",105,30,{align:"center"});
  d.text("Ward No. 1, Village Dadar, Post Rahat, Tahsil Huzur, Rewa, MP 486446",105,35,{align:"center"});
  d.text("swastiksrijanfoundation@gmail.com · swastiksrijan.in",105,40,{align:"center"});
  d.setTextColor(0,35,68); d.setFontSize(17); d.text("DONATION RECEIPT / DONOR SLIP",105,54,{align:"center"});
  d.setFontSize(10); d.setTextColor(30); d.text("Receipt No.: "+receiptNo,16,66); d.text("Donation ID: "+(data.donationId||"—"),130,66); d.text("Date: "+data.date,16,73);
  let y=86; const fields=[["Donor Name",data.donorName],["Address",data.address],["Mobile",data.phone],["Email",data.email],["PAN",data.pan],["Amount",data.amount?"₹"+Number(data.amount).toLocaleString("en-IN"):""],["Payment Mode",data.paymentMode],["Transaction / UTR / Cheque No.",data.transactionNo],["Purpose / Project",data.purpose],["Remarks",data.remarks]];
  fields.forEach(([k,v])=>{if(v!==undefined&&v!==null&&String(v).trim()!==""){d.setFont(undefined,"bold");d.text(k+":",16,y);d.setFont(undefined,"normal");const lines=d.splitTextToSize(String(v),145);d.text(lines,66,y);y+=Math.max(7,lines.length*5)+3;}});
  d.setFontSize(9);d.setTextColor(80);d.text("This receipt records a donation/contribution entered in the SSF Digital Office. 80G wording is shown only where legally applicable and based on the Foundation's current tax status.",16,y+8,{maxWidth:178});d.text("Authorised Signatory: Ramesh Pandey · Founder & National President",16,y+24);d.setFontSize(8);d.text("Computer-generated receipt · Please retain this receipt for your records.",105,288,{align:"center"});
  downloadPdf(d,receiptNo+".pdf");
 };
 const submit=e=>{e.preventDefault();if(!f.donorName.trim()||!f.amount){setNotice("Donor name and amount are required.");return;}const year=new Date(f.date).getFullYear();const seq=String(rows.length+1).padStart(4,"0");const receiptNo="SSF/DR/"+year+"/"+seq;add("donorSlips",{receiptNo,...f,status:"issued"});makePdf(receiptNo,f);setNotice("Donor slip saved: "+receiptNo);};
 return <div className="bg-white rounded-2xl border overflow-hidden">
  <div className="bg-[#002344] text-white p-6"><div className="flex items-center gap-3"><FaFileAlt className="text-2xl"/><div><h2 className="text-2xl font-black">Donor Slips / Donation Receipts</h2><p className="text-white/70 mt-1">Donation actually received and recorded hone par hi receipt issue karein.</p></div></div></div>
  {notice&&<div className="m-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <form onSubmit={submit} className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
   <input value={f.donorName} onChange={e=>set("donorName",e.target.value)} placeholder="Donor Name" required className={cls}/>
   <input value={f.donationId} onChange={e=>set("donationId",e.target.value)} placeholder="Donation ID (optional)" className={cls}/>
   <input type="date" value={f.date} onChange={e=>set("date",e.target.value)} required className={cls}/>
   <input type="number" min="0" step="0.01" value={f.amount} onChange={e=>set("amount",e.target.value)} placeholder="Amount" required className={cls}/>
   <select value={f.paymentMode} onChange={e=>set("paymentMode",e.target.value)} className={cls}><option>UPI</option><option>Bank Transfer</option><option>Cash</option><option>Cheque</option><option>Other</option></select>
   <input value={f.transactionNo} onChange={e=>set("transactionNo",e.target.value)} placeholder="Transaction / UTR / Cheque No." className={cls}/>
   <input value={f.purpose} onChange={e=>set("purpose",e.target.value)} placeholder="Purpose / Project" className={cls}/>
   <input value={f.pan} onChange={e=>set("pan",e.target.value)} placeholder="PAN (optional)" className={cls}/>
   <input value={f.email} onChange={e=>set("email",e.target.value)} placeholder="Email (optional)" className={cls}/>
   <input value={f.phone} onChange={e=>set("phone",e.target.value)} placeholder="Mobile (optional)" className={cls}/>
   <input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Address" className={cls}/>
   <input value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/>
   <div className="sm:col-span-2 lg:col-span-4 flex gap-2"><button className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">Save + Generate Donor Slip</button></div>
  </form>
  <div className="p-5 border-t"><h3 className="font-black text-[#002344] mb-3">Recent Receipts</h3><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">Receipt No.</th><th className="p-3 text-left">Donor</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Status</th></tr></thead><tbody className="divide-y">{rows.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 font-bold">{d.receiptNo||r.recordId}</td><td className="p-3">{d.donorName||"—"}</td><td className="p-3">{r.recordDate?new Date(r.recordDate).toLocaleDateString("en-IN"):"—"}</td><td className="p-3">₹{Number(d.amount||0).toLocaleString("en-IN")}</td><td className="p-3">{r.status}</td></tr>;})}</tbody></table></div></div>
 </div>;
}

function SeparationManagement({rows,add}){
 const [f,setF]=useState({name:"",currentRole:"",newRole:"",action:"Resignation",effectiveDate:new Date().toISOString().slice(0,10),reason:"",approvedBy:"Ramesh Pandey · Founder & National President",referenceNo:"",resolutionNo:"",meetingDate:"",remarks:""});
 const [notice,setNotice]=useState("");
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const actions=["Resignation","Role Change / Transfer","Responsibility Withdrawal","Appointment Revocation","Membership Cancellation / Removal","Volunteer Disengagement","Termination / Discontinuation","Relieving"];
 const makePdf=(orderNo,data)=>{
  const d=new jsPDF(); d.addImage(logoImg,"PNG",16,10,20,20); d.setTextColor(0,35,68); d.setFontSize(18); d.text("Swastik Srijan Foundation Samiti",105,18,{align:"center"}); d.setFontSize(9);d.setTextColor(80);d.text("Registered under Madhya Pradesh Societies Registration Act, 1973 · Reg. No. 05/22/03/11448/13",105,26,{align:"center"});d.text("Ward No. 1, Village Dadar, Post Rahat, Tahsil Huzur, Rewa, MP 486446",105,32,{align:"center"});d.text("swastiksrijanfoundation@gmail.com · swastiksrijan.in",105,38,{align:"center"});
  d.setTextColor(0,35,68);d.setFontSize(17);d.text("SEPARATION / ROLE CHANGE ORDER",105,54,{align:"center"});d.setTextColor(30);d.setFontSize(10);d.text("Order No.: "+orderNo,16,66);d.text("Effective Date: "+data.effectiveDate,16,73);
  let y=88; [["Name",data.name],["Current Role",data.currentRole],["Action",data.action],["New Role",data.newRole],["Reason",data.reason],["Reference No.",data.referenceNo],["Resolution No.",data.resolutionNo],["Meeting Date",data.meetingDate],["Approved By",data.approvedBy],["Remarks",data.remarks]].forEach(([k,v])=>{if(String(v||"").trim()){d.setFont(undefined,"bold");d.text(k+":",16,y);d.setFont(undefined,"normal");d.text(d.splitTextToSize(String(v),145),66,y);y+=9;}});
  d.setFontSize(9);d.setTextColor(80);d.text("This order changes the person's organisational status/role from the effective date. Historical records, approvals, meeting resolutions and audit entries are retained; records are not hard-deleted.",16,y+7,{maxWidth:178});d.setTextColor(30);d.text("Authorised Signatory: "+data.approvedBy,16,y+25);d.setFontSize(8);d.setTextColor(100);d.text("Computer-generated official office document · SSF Digital Office",105,288,{align:"center"});downloadPdf(d,orderNo+".pdf");
 };
 const submit=e=>{e.preventDefault();if(!f.name.trim()||!f.currentRole.trim()){setNotice("Name and current role are required.");return;}const year=new Date(f.effectiveDate).getFullYear();const no="SSF/SEP/"+year+"/"+String(rows.length+1).padStart(4,"0");add("separations",{orderNo:no,...f,status:f.action==="Role Change / Transfer"?"active":"revoked"});makePdf(no,f);setNotice("Order saved: "+no);};
 return <div className="bg-white rounded-2xl border overflow-hidden">
  <div className="bg-[#002344] text-white p-6"><div className="flex items-center gap-3"><FaFileAlt className="text-2xl"/><div><h2 className="text-2xl font-black">Separation / Removal / Role Change</h2><p className="text-white/70 mt-1">Person ko delete karne ke bajay proper order + history maintain karein.</p></div></div></div>
  {notice&&<div className="m-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <form onSubmit={submit} className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
   <input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Member / Volunteer / Person Name" required className={cls}/>
   <input value={f.currentRole} onChange={e=>set("currentRole",e.target.value)} placeholder="Current Designation / Role" required className={cls}/>
   <select value={f.action} onChange={e=>set("action",e.target.value)} className={cls}>{actions.map(x=><option key={x}>{x}</option>)}</select>
   <input value={f.newRole} onChange={e=>set("newRole",e.target.value)} placeholder="New Role (if applicable)" className={cls}/>
   <input type="date" value={f.effectiveDate} onChange={e=>set("effectiveDate",e.target.value)} required className={cls}/>
   <input value={f.reason} onChange={e=>set("reason",e.target.value)} placeholder="Reason / Grounds" className={cls}/>
   <input value={f.referenceNo} onChange={e=>set("referenceNo",e.target.value)} placeholder="Reference / File No." className={cls}/>
   <input value={f.approvedBy} onChange={e=>set("approvedBy",e.target.value)} placeholder="Approved / Authorised By" className={cls}/>
   <input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No. (where applicable)" className={cls}/>
   <input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} className={cls}/>
   <textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks / Conditions" className={cls+" sm:col-span-2 lg:col-span-2 min-h-[70px]"}/>
   <div className="sm:col-span-2 lg:col-span-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><b>Managing Committee / Governing Body:</b> For removal or change of a committee member, first record the relevant meeting agenda/minutes and resolution as required by the Foundation's governing documents, then issue this order. Do not use a simple delete action.</div>
   <button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save + Generate Official Order</button>
  </form>
  <div className="p-5 border-t"><h3 className="font-black text-[#002344] mb-3">Recent Orders</h3><div className="overflow-auto"><table className="w-full text-sm"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">Order No.</th><th className="p-3 text-left">Person</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Effective</th><th className="p-3 text-left">Status</th></tr></thead><tbody className="divide-y">{rows.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 font-bold">{d.orderNo||r.recordId}</td><td className="p-3">{d.name||"—"}</td><td className="p-3">{d.action||"—"}</td><td className="p-3">{d.effectiveDate||"—"}</td><td className="p-3">{r.status}</td></tr>;})}</tbody></table></div></div>
 </div>;
}



function SimpleOfficeCard({title,subtitle,children}){return <div className="space-y-5"><div className="bg-[#002344] text-white rounded-2xl p-6"><h2 className="text-2xl font-black">{title}</h2><p className="text-white/70 mt-1">{subtitle}</p></div>{children}</div>}
function MembersRegister({rows,add,archive}){
 const existing=(rows||[]).filter(r=>r.module==="members"&&r.status!=="deleted");
 const [f,setF]=useState({memberId:"",membershipNo:"",memberType:"साधारण सदस्य",fullName:"",fatherHusbandName:"",dob:"",gender:"",occupation:"",mobile:"",email:"",address:"",city:"",state:"",pinCode:"",pan:"",aadhaar:"",joiningDate:new Date().toISOString().slice(0,10),membershipEndDate:"",membershipStatus:"Active",membershipFee:"",receiptNo:"",remarks:""});
 const [saving,setSaving]=useState(false),[notice,setNotice]=useState(""); const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const save=async e=>{e.preventDefault();if(saving)return;if(!f.fullName.trim()){setNotice("Full Name required.");return;}if(existing.some(r=>String((r.data||{}).fullName||"").trim().toLowerCase()===f.fullName.trim().toLowerCase()&&String((r.data||{}).joiningDate||"")===f.joiningDate)){setNotice("Same member record already exists for this joining date.");return;}setSaving(true);const ids=existing.map(r=>String((r.data||{}).memberId||"")).map(x=>{const m=x.match(/SSF-MBR-(\d+)/i);return m?Number(m[1]):0;});const memberId=f.memberId.trim()||("SSF-MBR-"+String(Math.max(0,...ids)+1).padStart(5,"0"));const ok=await add("members",{recordDate:f.joiningDate,recordType:"Member Register",status:f.membershipStatus.toLowerCase(),data:{...f,memberId,fullName:f.fullName.trim(),action:"Member Register"}});if(ok){setF({...f,memberId:"",fullName:"",fatherHusbandName:"",dob:"",gender:"",occupation:"",mobile:"",email:"",address:"",city:"",state:"",pinCode:"",pan:"",aadhaar:"",membershipEndDate:"",receiptNo:"",membershipFee:"",remarks:""});setNotice("Member saved and form cleared.");}setSaving(false);};
 return <SimpleOfficeCard title="👥 Members Register" subtitle="व्यक्ति की Master Details — membership identity ko role history se alag rakha gaya hai."><div className="bg-white border rounded-2xl p-5"><form onSubmit={save} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
  <input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID (auto)" className={cls}/><input value={f.membershipNo} onChange={e=>set("membershipNo",e.target.value)} placeholder="Membership No." className={cls}/><select value={f.memberType} onChange={e=>set("memberType",e.target.value)} className={cls}><option>Founder Member</option><option>संरक्षक सदस्य</option><option>आजीवन सदस्य</option><option>साधारण सदस्य</option><option>सम्माननीय सदस्य</option></select><input value={f.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Full Name" required className={cls}/>
  <input value={f.fatherHusbandName} onChange={e=>set("fatherHusbandName",e.target.value)} placeholder="Father / Husband / Guardian Name" className={cls}/><input type="date" value={f.dob} onChange={e=>set("dob",e.target.value)} title="Date of Birth" className={cls}/><select value={f.gender} onChange={e=>set("gender",e.target.value)} className={cls}><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select><input value={f.occupation} onChange={e=>set("occupation",e.target.value)} placeholder="Main Occupation / Profession" className={cls}/><input value={f.mobile} onChange={e=>set("mobile",e.target.value)} placeholder="Mobile No." className={cls}/><input value={f.email} onChange={e=>set("email",e.target.value)} placeholder="Email" className={cls}/>
  <input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Address" className={cls}/><input value={f.city} onChange={e=>set("city",e.target.value)} placeholder="City" className={cls}/><input value={f.state} onChange={e=>set("state",e.target.value)} placeholder="State" className={cls}/><input value={f.pinCode} onChange={e=>set("pinCode",e.target.value)} placeholder="PIN Code" className={cls}/><input value={f.pan} onChange={e=>set("pan",e.target.value)} placeholder="PAN (Optional)" className={cls}/><input value={f.aadhaar} onChange={e=>set("aadhaar",e.target.value)} placeholder="Aadhaar (Optional)" className={cls}/>
  <input type="date" value={f.joiningDate} onChange={e=>set("joiningDate",e.target.value)} title="Joining / Admission Date" className={cls}/><input value={f.receiptNo} onChange={e=>set("receiptNo",e.target.value)} placeholder="Receipt No." className={cls}/><input type="date" value={f.membershipEndDate} onChange={e=>set("membershipEndDate",e.target.value)} title="Membership End Date — only if ended" className={cls}/><select value={f.membershipStatus} onChange={e=>set("membershipStatus",e.target.value)} className={cls}><option>Active</option><option>Inactive</option><option>Expired</option><option>Resigned</option><option>Removed</option></select><input value={f.membershipFee} onChange={e=>set("membershipFee",e.target.value)} placeholder="Membership Fee (₹)" className={cls}/><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/>
  <div className="sm:col-span-2 lg:col-span-4 text-xs text-zinc-500">Active member ke liye Membership End Date blank rakhein. Membership payments alag register mein record honge.</div><button disabled={saving} className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">{saving?"Saving…":"Save Member Record"}</button></form></div>{notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm min-w-[1900px]"><thead className="bg-zinc-50"><tr>{["Member ID","Membership No.","Member Type","Full Name","Father / Husband / Guardian","DOB","Gender","Occupation","Mobile","Email","Address","City","State","PIN","PAN","Aadhaar","Joining Date","End Date","Status","Membership Fee","Receipt No.","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody className="divide-y">{existing.map(r=>{const d=r.data||{};return <tr key={r.id}>{["memberId","membershipNo","memberType","fullName","fatherHusbandName","dob","gender","occupation","mobile","email","address","city","state","pinCode","pan","aadhaar","joiningDate","membershipEndDate","membershipStatus","membershipFee","receiptNo","remarks"].map(k=><td key={k} className="p-3">{d[k]||"—"}</td>)}<td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!existing.length&&<tr><td colSpan="23" className="p-8 text-center text-zinc-500">No member records yet.</td></tr>}</tbody></table></div></SimpleOfficeCard>;
}

function InstitutionalHistory({rows,add,updateRecord,archive}){
 const existing=(rows||[]).filter(r=>r.module==="institutionalHistory"&&r.status!=="deleted").sort((a,b)=>String(a.recordDate||"").localeCompare(String(b.recordDate||"")));
 const blank={date:new Date().toISOString().slice(0,10),eventType:"Institution Formation",title:"",personCommittee:"",previousRole:"",newRole:"",referenceNo:"",meetingDate:"",description:"",supportingDocument:"",remarks:""};
 const [f,setF]=useState(blank),[editingId,setEditingId]=useState(null),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const editRecord=r=>{const d=r.data||{};setEditingId(r.id);setF({...blank,date:d.date||r.recordDate||"",eventType:d.eventType||r.recordType||"Other",title:d.title||"",personCommittee:d.personCommittee||"",previousRole:d.previousRole||"",newRole:d.newRole||"",referenceNo:d.referenceNo||"",meetingDate:d.meetingDate||"",description:d.description||"",supportingDocument:d.supportingDocument||"",remarks:d.remarks||""});setNotice("");window.scrollTo({top:0,behavior:"smooth"});};
 const reset=()=>{setEditingId(null);setF(blank);setNotice("");};
 const save=async e=>{e.preventDefault();if(!f.title.trim()||!f.date){setNotice("Date and Event Title required.");return;}setSaving(true);const data={...f};const ok=editingId?await updateRecord(editingId,"institutionalHistory",data):await add("institutionalHistory",{recordDate:f.date,recordType:f.eventType,status:"active",data});setSaving(false);if(ok){setNotice(editingId?"Institutional history updated successfully.":"Institutional history saved successfully.");reset();}};
 return <SimpleOfficeCard title="🏛️ संस्था इतिहास (Institutional History)" subtitle="2013 से आज तक SSF की master institutional timeline. पुराने records overwrite नहीं होंगे.">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 sm:p-6 border-b"><h3 className="text-xl font-black text-[#002344]">{editingId?"Edit Institutional History":"Add Institutional History"}</h3><p className="text-sm text-zinc-500 mt-1">संस्था गठन, पंजीयन, समिति गठन/पुनर्गठन, महत्वपूर्ण निर्णय, compliance और partnerships का स्थायी रिकॉर्ड।</p></div>
   <form onSubmit={save} className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <input type="date" value={f.date} onChange={e=>set("date",e.target.value)} className={cls} required/>
    <select value={f.eventType} onChange={e=>set("eventType",e.target.value)} className={cls}>{["Institution Formation","Registration","Committee Formation / Reconstitution","Organisational Change","Important Decision","Important Project / Initiative","Compliance / Registration","MoU / Partnership","Other"].map(x=><option key={x}>{x}</option>)}</select>
    <input value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Event Title" className={cls} required/>
    <input value={f.personCommittee} onChange={e=>set("personCommittee",e.target.value)} placeholder="Person / Committee" className={cls}/>
    <input value={f.previousRole} onChange={e=>set("previousRole",e.target.value)} placeholder="Previous Position (if any)" className={cls}/>
    <input value={f.newRole} onChange={e=>set("newRole",e.target.value)} placeholder="New Position (if any)" className={cls}/>
    <input value={f.referenceNo} onChange={e=>set("referenceNo",e.target.value)} placeholder="Resolution / Reference No." className={cls}/>
    <input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} title="Meeting Date" className={cls}/>
    <textarea value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Description / Details" className={cls+" sm:col-span-2 min-h-[100px]"}/>
    <input value={f.supportingDocument} onChange={e=>set("supportingDocument",e.target.value)} placeholder="Supporting Document / File Reference" className={cls}/>
    <textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/>
    <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
     <button type="submit" disabled={saving} className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">{saving?"Saving…":editingId?"Update History":"Save History Event"}</button>
     {editingId&&<button type="button" onClick={reset} className="border px-6 py-3 rounded-xl font-bold">Cancel Edit</button>}
    </div>
   </form>
  </div>
  {notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Permanent Institutional Timeline</h3><p className="text-sm text-zinc-500 mt-1">Existing records are editable. Archive केवल record को active list से हटाता है; hard delete नहीं होता.</p></div>
   <div className="overflow-auto"><table className="w-full text-sm min-w-[1700px]">
    <thead className="bg-zinc-50"><tr>{["Date","Event Type","Event Title","Person / Committee","Previous Position","New Position","Reference","Meeting Date","Description","Supporting Document","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
    <tbody className="divide-y">{existing.map(r=>{const d=r.data||{};return <tr key={r.id}>
     <td className="p-3 whitespace-nowrap">{d.date||r.recordDate||"—"}</td><td className="p-3">{d.eventType||r.recordType||"—"}</td><td className="p-3 font-bold">{d.title||"—"}</td><td className="p-3">{d.personCommittee||"—"}</td><td className="p-3">{d.previousRole||"—"}</td><td className="p-3">{d.newRole||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.meetingDate||"—"}</td><td className="p-3 max-w-[420px]">{d.description||"—"}</td><td className="p-3">{d.supportingDocument||"—"}</td><td className="p-3">{d.remarks||"—"}</td>
     <td className="p-3 sticky right-0 bg-white border-l z-10 whitespace-nowrap"><button type="button" onClick={()=>editRecord(r)} className="px-3 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold hover:bg-red-50">Archive</button></td>
    </tr>;})}{!existing.length&&<tr><td colSpan="12" className="p-10 text-center text-zinc-500">No institutional history records yet.</td></tr>}</tbody>
   </table></div>
  </div>
 </SimpleOfficeCard>;
}

function OfficeHistory({rows,add,updateRecord,archive}){
 const existing=(rows||[]).filter(r=>r.module==="officeHistory"&&r.status!=="deleted").sort((a,b)=>String(a.recordDate||"").localeCompare(String(b.recordDate||"")));
 const blank={memberId:"",fullName:"",eventDate:new Date().toISOString().slice(0,10),changeType:"Appointment",previousRole:"",newRole:"",referenceNo:"",resolutionNo:"",meetingDate:"",details:"",remarks:""};
 const [f,setF]=useState(blank),[editingId,setEditingId]=useState(null),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const editRecord=r=>{const d=r.data||{};setEditingId(r.id);setF({...blank,memberId:d.memberId||"",fullName:d.fullName||d.name||"",eventDate:d.eventDate||r.recordDate||"",changeType:d.changeType||d.action||r.recordType||"Appointment",previousRole:d.previousRole||"",newRole:d.newRole||d.designation||"",referenceNo:d.referenceNo||"",resolutionNo:d.resolutionNo||"",meetingDate:d.meetingDate||"",details:d.details||d.reason||d.responsibilities||"",remarks:d.remarks||""});setNotice("");window.scrollTo({top:0,behavior:"smooth"});};
 const reset=()=>{setEditingId(null);setF({...blank,eventDate:new Date().toISOString().slice(0,10)});};
 const save=async e=>{e.preventDefault();const needsRole=!["Removal","Resignation","Relieving"].includes(f.changeType);if(!f.fullName.trim()||!f.eventDate||(needsRole&&!f.newRole.trim())){setNotice(needsRole?"Full Name, Event Date and New / Current Position required.":"Full Name and Event Date required.");return;}setSaving(true);const data={...f};const ok=editingId?await updateRecord(editingId,"officeHistory",data):await add("officeHistory",{recordDate:f.eventDate,recordType:f.changeType,status:"active",data});setSaving(false);if(ok){setNotice(editingId?"Office History updated successfully.":"Office History saved successfully.");reset();}};
 return <SimpleOfficeCard title="🏛️ प्रबंधकारिणी समिति / Office History" subtitle="किसने कब कौन सा पद संभाला — appointment, role change, resignation और removal का permanent history record.">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 sm:p-6 border-b"><h3 className="text-xl font-black text-[#002344]">{editingId?"Edit Office History":"Add Office History"}</h3><p className="text-sm text-zinc-500 mt-1">Appointment, role change, re-appointment, resignation, removal और relieving का permanent governance history.</p></div>
   <form onSubmit={save} className="p-5 sm:p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID" className={cls}/>
    <input value={f.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Full Name" required className={cls}/>
    <input type="date" value={f.eventDate} onChange={e=>set("eventDate",e.target.value)} className={cls} required/>
    <select value={f.changeType} onChange={e=>set("changeType",e.target.value)} className={cls}>{["Appointment","Role Change / Transfer","Re-appointment","Additional Responsibility","Resignation","Removal","Relieving","Other"].map(x=><option key={x}>{x}</option>)}</select>
    <input value={f.previousRole} onChange={e=>set("previousRole",e.target.value)} placeholder="Previous Position" className={cls}/>
    <input value={f.newRole} onChange={e=>set("newRole",e.target.value)} placeholder="New / Current Position" className={cls} required={!["Removal","Resignation","Relieving"].includes(f.changeType)}/>
    <input value={f.referenceNo} onChange={e=>set("referenceNo",e.target.value)} placeholder="Reference / File No." className={cls}/>
    <input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No." className={cls}/>
    <input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} title="Meeting Date" className={cls}/>
    <textarea value={f.details} onChange={e=>set("details",e.target.value)} placeholder="Details / Reason" className={cls+" sm:col-span-2 min-h-[100px]"}/>
    <textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls+" sm:col-span-2 min-h-[100px]"}/>
    <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
     <button type="submit" disabled={saving} className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">{saving?"Saving…":editingId?"Update Office History":"Save Office History"}</button>
     {editingId&&<button type="button" onClick={reset} className="border px-6 py-3 rounded-xl font-bold">Cancel Edit</button>}
    </div>
   </form>
  </div>
  {notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Permanent Committee / Office Role History</h3><p className="text-sm text-zinc-500 mt-1">Existing records isi register mein editable hain. Archive history ko permanently delete nahi karta.</p></div>
   <div className="overflow-auto"><table className="w-full text-sm min-w-[1500px]">
    <thead className="bg-zinc-50"><tr>{["Date","Member ID","Name","Change Type","Previous Position","New / Current Position","Reference","Resolution","Meeting Date","Details","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
    <tbody className="divide-y">{existing.map(r=>{const d=r.data||{};return <tr key={r.id}>
     <td className="p-3 whitespace-nowrap">{d.eventDate||r.recordDate||"—"}</td><td className="p-3">{d.memberId||"—"}</td><td className="p-3 font-bold">{d.fullName||d.name||"—"}</td><td className="p-3">{d.changeType||d.action||r.recordType||"—"}</td><td className="p-3">{d.previousRole||"—"}</td><td className="p-3 font-bold">{d.newRole||d.designation||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.resolutionNo||"—"}</td><td className="p-3">{d.meetingDate||"—"}</td><td className="p-3 max-w-[420px]">{d.details||d.reason||d.responsibilities||"—"}</td><td className="p-3">{d.remarks||"—"}</td>
     <td className="p-3 sticky right-0 bg-white border-l z-10 whitespace-nowrap"><button type="button" onClick={()=>editRecord(r)} className="px-3 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold hover:bg-red-50">Archive</button></td>
    </tr>;})}{!existing.length&&<tr><td colSpan="12" className="p-10 text-center text-zinc-500">No Office History records yet.</td></tr>}</tbody>
   </table></div>
  </div>
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><b>Historical record:</b> Original documents verify exact dates, reference numbers and resolutions. Approximate dates should be corrected through Edit when source documents are available.</div>
 </SimpleOfficeCard>;
}

function MembershipContributions({rows,add,archive}){
 const existing=(rows||[]).filter(r=>r.module==="membershipContributions"&&r.status!=="deleted"); const [f,setF]=useState({date:new Date().toISOString().slice(0,10),memberId:"",memberName:"",contributionType:"Monthly Membership Fee",amount:"",period:"",receiptNo:"",paymentMode:"Cash",transactionNo:"",purpose:"",remarks:""}); const [notice,setNotice]=useState(""); const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const save=async e=>{e.preventDefault();if(!f.memberName.trim()||!f.amount){setNotice("Member Name and Amount required.");return;}const ok=await add("membershipContributions",{recordDate:f.date,recordType:f.contributionType,status:"active",data:f});if(ok){setF({...f,memberId:"",memberName:"",amount:"",period:"",receiptNo:"",transactionNo:"",purpose:"",remarks:""});setNotice("Membership/contribution payment saved.");}};
 return <SimpleOfficeCard title="💰 Membership & Contribution Register" subtitle="Monthly, annual, lifetime, patron membership और अन्य actual receipts/payments का अलग transaction record."><div className="bg-white border rounded-2xl p-5"><form onSubmit={save} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)} className={cls}/><input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID" className={cls}/><input value={f.memberName} onChange={e=>set("memberName",e.target.value)} placeholder="Member Name" required className={cls}/><select value={f.contributionType} onChange={e=>set("contributionType",e.target.value)} className={cls}><option>Monthly Membership Fee</option><option>Annual Membership Fee</option><option>Lifetime Membership</option><option>Patron Membership</option><option>Other Member Contribution</option></select><input value={f.amount} onChange={e=>set("amount",e.target.value)} type="number" min="0" step="0.01" placeholder="Amount (₹)" required className={cls}/><input value={f.period} onChange={e=>set("period",e.target.value)} placeholder="Membership Period (e.g. Apr-2026)" className={cls}/><input value={f.receiptNo} onChange={e=>set("receiptNo",e.target.value)} placeholder="Receipt No." className={cls}/><select value={f.paymentMode} onChange={e=>set("paymentMode",e.target.value)} className={cls}><option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option><option>Other</option></select><input value={f.transactionNo} onChange={e=>set("transactionNo",e.target.value)} placeholder="Transaction / Cheque No." className={cls}/><input value={f.purpose} onChange={e=>set("purpose",e.target.value)} placeholder="Purpose / Note" className={cls}/><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/><button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save Payment / Contribution</button></form></div>{notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}<div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm min-w-[1300px]"><thead className="bg-zinc-50"><tr>{["Date","Member ID","Member Name","Type","Amount","Period","Receipt No.","Payment Mode","Transaction No.","Purpose","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody className="divide-y">{existing.sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate))).map(r=>{const d=r.data||{};return <tr key={r.id}>{[r.recordDate,d.memberId,d.memberName,d.contributionType||r.recordType,d.amount,d.period,d.receiptNo,d.paymentMode,d.transactionNo,d.purpose,d.remarks].map((v,i)=><td key={i} className="p-3">{v||"—"}</td>)}<td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!existing.length&&<tr><td colSpan="12" className="p-8 text-center text-zinc-500">No membership/contribution transactions yet.</td></tr>}</tbody></table></div></SimpleOfficeCard>;
}

function MeetingResolutions({rows,add,archive}){
 const existing=(rows||[]).filter(r=>r.module==="meetingResolutions"&&r.status!=="deleted"); const [f,setF]=useState({meetingDate:new Date().toISOString().slice(0,10),meetingType:"Managing Committee Meeting",meetingTitle:"",agenda:"",attendance:"",resolutionNo:"",decision:"",details:"",supportingDocument:"",remarks:""}); const [notice,setNotice]=useState(""); const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const save=async e=>{e.preventDefault();if(!f.meetingTitle.trim()){setNotice("Meeting Title required.");return;}const ok=await add("meetingResolutions",{recordDate:f.meetingDate,recordType:f.meetingType,status:"active",data:f});if(ok){setF({...f,meetingTitle:"",agenda:"",attendance:"",resolutionNo:"",decision:"",details:"",supportingDocument:"",remarks:""});setNotice("Meeting / resolution record saved.");}};
 return <SimpleOfficeCard title="📜 Meeting & Resolution Register" subtitle="General Body, Managing Committee और Special Meetings — agenda, attendance, minutes/decision और supporting record."><div className="bg-white border rounded-2xl p-5"><form onSubmit={save} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} className={cls}/><select value={f.meetingType} onChange={e=>set("meetingType",e.target.value)} className={cls}><option>General Body Meeting</option><option>Managing Committee Meeting</option><option>Special Meeting</option><option>Emergency Meeting</option><option>Other</option></select><input value={f.meetingTitle} onChange={e=>set("meetingTitle",e.target.value)} placeholder="Meeting Title" required className={cls}/><input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No." className={cls}/><textarea value={f.agenda} onChange={e=>set("agenda",e.target.value)} placeholder="Agenda" className={cls}/><textarea value={f.attendance} onChange={e=>set("attendance",e.target.value)} placeholder="Attendance / Members Present" className={cls}/><textarea value={f.decision} onChange={e=>set("decision",e.target.value)} placeholder="Decision / Resolution Text" className={cls}/><textarea value={f.details} onChange={e=>set("details",e.target.value)} placeholder="Minutes / Detailed Notes" className={cls}/><input value={f.supportingDocument} onChange={e=>set("supportingDocument",e.target.value)} placeholder="Supporting Document / File Reference" className={cls}/><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/><button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save Meeting / Resolution</button></form></div>{notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}<div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm min-w-[1300px]"><thead className="bg-zinc-50"><tr>{["Meeting Date","Type","Meeting Title","Resolution No.","Agenda","Attendance","Decision","Minutes / Notes","Supporting Document","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody className="divide-y">{existing.sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate))).map(r=>{const d=r.data||{};return <tr key={r.id}>{[r.recordDate,d.meetingType||r.recordType,d.meetingTitle,d.resolutionNo,d.agenda,d.attendance,d.decision,d.details,d.supportingDocument,d.remarks].map((v,i)=><td key={i} className="p-3">{v||"—"}</td>)}<td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!existing.length&&<tr><td colSpan="11" className="p-8 text-center text-zinc-500">No meeting/resolution records yet.</td></tr>}</tbody></table></div></SimpleOfficeCard>;
}
function ManagingCommittee({rows,add,archive}){
 const [f,setF]=useState({
  memberId:"",memberType:"साधारण सदस्य",designation:"Member",customDesignation:"",
  membershipNo:"",fullName:"",fatherHusbandName:"",dob:"",occupation:"",gender:"",
  mobile:"",email:"",address:"",city:"",state:"",pinCode:"",aadhaar:"",pan:"",
  joiningDate:new Date().toISOString().slice(0,10),receiptNo:"",membershipValidTill:"",
  membershipStatus:"Active",membershipFee:"",functionalResponsibility:"",
  status:"Active",effectiveFrom:new Date().toISOString().slice(0,10),validTill:"",
  appointmentDate:"",referenceNo:"",resolutionNo:"",meetingDate:"",
  responsibilities:"",remarks:""
 });
 const [notice,setNotice]=useState("");
  const [saving,setSaving]=useState(false);
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const designations=["President","Vice President","Secretary","Joint Secretary","Treasurer","Member"];
 const committeeRows=(rows||[]).filter(r=>r.module==="managingCommittee" && r.status!=="deleted");
 const timeline=[...committeeRows].sort((a,b)=>String((a.data||{}).effectiveFrom||a.recordDate||"").localeCompare(String((b.data||{}).effectiveFrom||b.recordDate||"")));
 const save=async e=>{
   if(saving)return;
  e.preventDefault();
  if(!f.fullName.trim()||!f.designation){setNotice("Name and designation are required.");return;}
  const role=f.designation==="Other / Custom"?f.customDesignation.trim():f.designation;
   const duplicate=committeeRows.some(r=>{const d=r.data||{};return String(d.fullName||"").trim().toLowerCase()===f.fullName.trim().toLowerCase() && String(d.designation||"").trim()===role && String(d.effectiveFrom||"")===f.effectiveFrom && String(d.membershipNo||"").trim()===f.membershipNo.trim() && String(d.referenceNo||"").trim()===f.referenceNo.trim() && String(d.resolutionNo||"").trim()===f.resolutionNo.trim();});
   if(duplicate){setNotice("Same committee record already exists. Duplicate record save nahi kiya gaya.");return;}
  if(!role){setNotice("Custom designation enter karein.");return;}
  const existingIds=committeeRows.map(r=>String((r.data||{}).memberId||"")).map(x=>{const m=x.match(/SSF-MBR-(\\d+)/i);return m?Number(m[1]):0;});
  const nextMemberId=`SSF-MBR-${String(Math.max(0,...existingIds)+1).padStart(5,"0")}`;
  const memberId=f.memberId.trim()||nextMemberId;
   setSaving(true);
  const recordDate=f.effectiveFrom||new Date().toISOString().slice(0,10);
  const memberRecord={
   fullName:f.fullName.trim(),memberId,
   memberType:f.memberType,membershipNo:f.membershipNo.trim(),
   fatherHusbandName:f.fatherHusbandName.trim(),dob:f.dob,occupation:f.occupation.trim(),gender:f.gender,
   mobile:f.mobile.trim(),email:f.email.trim(),address:f.address.trim(),city:f.city.trim(),
   state:f.state.trim(),pinCode:f.pinCode.trim(),aadhaar:f.aadhaar.trim(),pan:f.pan.trim(),
   joiningDate:f.joiningDate,receiptNo:f.receiptNo.trim(),membershipValidTill:f.membershipValidTill,
   membershipStatus:f.membershipStatus,membershipFee:f.membershipFee,
   designation:role,functionalResponsibility:f.functionalResponsibility.trim(),
   status:f.status,effectiveFrom:f.effectiveFrom,validTill:f.validTill,
   appointmentDate:f.appointmentDate,
   referenceNo:f.referenceNo,resolutionNo:f.resolutionNo,meetingDate:f.meetingDate,
   responsibilities:f.responsibilities,remarks:f.remarks,
   action:"Committee Member Register / Update"
  };
  const ok=await add("managingCommittee",{recordDate,recordType:"Committee Member",status:f.status.toLowerCase(),data:memberRecord});
   if(!ok){setSaving(false);return;}
   setF({memberId:"",memberType:"साधारण सदस्य",designation:"Member",customDesignation:"",membershipNo:"",fullName:"",fatherHusbandName:"",dob:"",occupation:"",gender:"",mobile:"",email:"",address:"",city:"",state:"",pinCode:"",aadhaar:"",pan:"",joiningDate:new Date().toISOString().slice(0,10),receiptNo:"",membershipValidTill:"",membershipStatus:"Active",membershipFee:"",functionalResponsibility:"",status:"Active",effectiveFrom:new Date().toISOString().slice(0,10),validTill:"",appointmentDate:"",referenceNo:"",resolutionNo:"",meetingDate:"",responsibilities:"",remarks:""});
   setNotice("Record saved and form cleared. Historical record delete nahi hota.");
   setSaving(false);
 };
 const actionOrder=async action=>{
  if(!f.fullName.trim()){setNotice("Pehle member select/enter karein.");return;}
  const recordDate=f.effectiveFrom||new Date().toISOString().slice(0,10);
  const actionStatus=(action==="Resignation"||action==="Removal / Membership Cancellation"||action==="Replacement / Relieving")?"revoked":"active";
  await add("managingCommittee",{recordDate,recordType:action,status:actionStatus,data:{
   fullName:f.fullName.trim(),memberId:f.memberId.trim(),memberType:f.memberType,
   membershipNo:f.membershipNo.trim(),designation:f.designation==="Other / Custom"?f.customDesignation:f.designation,
   action,effectiveFrom:f.effectiveFrom,resolutionNo:f.resolutionNo,meetingDate:f.meetingDate,
   referenceNo:f.referenceNo,remarks:f.remarks
  }});
  setNotice(action+" recorded with history preserved.");
 };
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="bg-[#002344] text-white p-6">
    <div className="flex items-center gap-3"><FaUserTie className="text-2xl"/>
     <div><h2 className="text-2xl font-black">प्रबंधकारिणी समिति (Managing Committee)</h2>
      <p className="text-white/70 mt-1">Committee register, designation, term, role history, changes and governance references — without deleting historical records.</p>
     </div>
    </div>
   </div>
   <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
    <div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Total Records</div><div className="text-2xl font-black text-[#002344] mt-1">{committeeRows.length}</div></div>
    <div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Active</div><div className="text-2xl font-black text-emerald-700 mt-1">{committeeRows.filter(r=>String(r.status).toLowerCase()==="active").length}</div></div>
    <div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Role Changes / Actions</div><div className="text-2xl font-black text-[#002344] mt-1">{committeeRows.filter(r=>(r.data||{}).action && (r.data||{}).action!=="Committee Member Register / Update").length}</div></div>
    <div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">History</div><div className="text-2xl font-black text-[#002344] mt-1">Preserved</div></div>
   </div>
  </div>

  {notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}

  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Committee Member Profile / Register</h3><p className="text-sm text-zinc-500 mt-1">Existing Members module ko disturb kiye bina governance-specific record yahan maintain hoga.</p></div>
   <form onSubmit={save} className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID (auto if blank)" className={cls}/>
    <select value={f.memberType} onChange={e=>set("memberType",e.target.value)} className={cls}><option>Founder Member</option><option>संरक्षक सदस्य</option><option>आजीवन सदस्य</option><option>साधारण सदस्य</option><option>सम्माननीय सदस्य</option></select>
    <select value={f.designation} onChange={e=>set("designation",e.target.value)} className={cls}>{designations.map(x=><option key={x}>{x}</option>)}</select>
    {f.designation==="Other / Custom"&&<input value={f.customDesignation} onChange={e=>set("customDesignation",e.target.value)} placeholder="Custom Designation" required className={cls}/>}
    <input value={f.functionalResponsibility} onChange={e=>set("functionalResponsibility",e.target.value)} placeholder="Functional Responsibility" className={cls}/>
    <input value={f.membershipNo} onChange={e=>set("membershipNo",e.target.value)} placeholder="Membership No." className={cls}/>
    <input value={f.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Full Name" required className={cls}/>
    <input value={f.occupation} onChange={e=>set("occupation",e.target.value)} placeholder="Occupation / Profession" className={cls}/>
    <select value={f.gender} onChange={e=>set("gender",e.target.value)} className={cls}><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select>
    <input value={f.fatherHusbandName} onChange={e=>set("fatherHusbandName",e.target.value)} placeholder="Father / Husband Name" className={cls}/>
    <input type="date" value={f.dob} onChange={e=>set("dob",e.target.value)} title="Date of Birth" className={cls}/>
    <input value={f.mobile} onChange={e=>set("mobile",e.target.value)} placeholder="Mobile No." className={cls}/>
    <input value={f.email} onChange={e=>set("email",e.target.value)} placeholder="Email" className={cls}/>
    <input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Address" className={cls}/>
    <input value={f.city} onChange={e=>set("city",e.target.value)} placeholder="City" className={cls}/>
    <input value={f.state} onChange={e=>set("state",e.target.value)} placeholder="State" className={cls}/>
    <input value={f.pinCode} onChange={e=>set("pinCode",e.target.value)} placeholder="PIN Code" className={cls}/>
    <input value={f.aadhaar} onChange={e=>set("aadhaar",e.target.value)} placeholder="Aadhaar (Optional)" className={cls}/>
    <input value={f.pan} onChange={e=>set("pan",e.target.value)} placeholder="PAN (Optional)" className={cls}/>
    <input type="date" value={f.joiningDate} onChange={e=>set("joiningDate",e.target.value)} title="Joining Date / Admission Date" className={cls}/>
    <input value={f.receiptNo} onChange={e=>set("receiptNo",e.target.value)} placeholder="Receipt No." className={cls}/>
    <input type="date" value={f.membershipValidTill} onChange={e=>set("membershipValidTill",e.target.value)} title="Membership End Date — only if membership ended" className={cls}/>
    <select value={f.membershipStatus} onChange={e=>set("membershipStatus",e.target.value)} className={cls}><option>Active</option><option>Inactive</option><option>Expired</option><option>Resigned</option><option>Removed</option></select>
    <input value={f.membershipFee} onChange={e=>set("membershipFee",e.target.value)} placeholder="Membership Fee (₹)" className={cls}/>
    <div className="sm:col-span-2 lg:col-span-4 text-xs text-zinc-500">Membership End Date sirf tab bharein jab membership khatam ho; Active member ke liye blank rakhein.</div>
    <select value={f.status} onChange={e=>set("status",e.target.value)} className={cls} title="Committee Status"><option>Active</option><option>Ended</option><option>Role Changed</option><option>Resigned</option><option>Removed</option></select>
    <input type="date" value={f.effectiveFrom} onChange={e=>set("effectiveFrom",e.target.value)} title="Organization Role Effective From" className={cls}/>
    <input type="date" value={f.validTill} onChange={e=>set("validTill",e.target.value)} title="Organization Role Valid Till" className={cls}/>
    <input type="date" value={f.appointmentDate} onChange={e=>set("appointmentDate",e.target.value)} title="Appointment / Selection Date" className={cls}/>
        <input value={f.referenceNo} onChange={e=>set("referenceNo",e.target.value)} placeholder="Reference / File No." className={cls}/>
    <input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No." className={cls}/>
    <input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} title="Meeting Date" className={cls}/>
    <textarea value={f.responsibilities} onChange={e=>set("responsibilities",e.target.value)} placeholder="Responsibilities / Duties" className={cls+" sm:col-span-2 lg:col-span-2 min-h-[90px]"}/>
    <textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls+" sm:col-span-2 lg:col-span-2 min-h-[90px]"}/>
     <button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold disabled:opacity-50">{saving?"Saving…":"Save Committee Member Record"}</button>
   </form>
  </div>

  <div className="bg-white border rounded-2xl p-5">
   <h3 className="text-xl font-black text-[#002344]">Governance Actions</h3>
   <p className="text-sm text-zinc-500 mt-1">Resignation, role change, responsibility changes and relieving ko history ke saath record karein.</p>
   <div className="flex flex-wrap gap-2 mt-4">
    {["Role Change / Transfer","Additional Responsibility","Responsibility Withdrawal","Resignation","Removal / Membership Cancellation","Replacement / Relieving"].map(action=>
      <button type="button" key={action} onClick={()=>actionOrder(action)} className="border border-[#002344]/20 text-[#002344] px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-50">{action}</button>
    )}
   </div>
   <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-zinc-700">
    <b>Governance workflow:</b> Meeting → Agenda → Attendance → Minutes → Resolution → Approval → Office Order → Committee Register update. Resolution/meeting/reference fields upar available hain.
   </div>
   <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
    <b>Important:</b> Committee member ko simple Delete se remove nahi kiya jayega. Historical records, approvals, resolutions aur audit trail retained rahenge.
   </div>
  </div>

  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Committee Register & Complete History</h3><p className="text-sm text-zinc-500 mt-1">2013 se ab tak har appointment, change aur separation ko chronological history mein record kiya ja sakta hai.</p></div>
   <div className="p-5 bg-blue-50 border-b border-blue-100 text-sm text-zinc-700"><b>Historical record entry:</b> Purane 2013, 2014, 2015… records bhi manually original effective date ke saath enter karein. Agar exact date available nahi hai to jo verified date/period available ho wahi record karein; date invent na karein.</div>
   <div className="p-5 space-y-3">
    {timeline.map(r=>{const d=r.data||{};return <div key={r.id} className="flex gap-3"><div className="w-24 shrink-0 text-xs font-black text-[#002344]">{d.effectiveFrom||r.recordDate||"Date unavailable"}</div><div className="relative flex-1 border-l-2 border-zinc-200 pl-5 pb-3"><div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#002344]"/><div className="bg-zinc-50 border rounded-xl p-4"><div className="font-black text-[#002344]">{d.fullName||"—"} · {d.designation||"—"}</div><div className="text-sm mt-1">{d.action||"Committee Member Register / Update"} · Status: {r.status}</div><div className="text-xs text-zinc-500 mt-2">Resolution: {d.resolutionNo||"—"} · Meeting: {d.meetingDate||"—"} · Reference: {d.referenceNo||"—"}</div></div></div></div>;})}
    {!timeline.length&&<div className="p-8 text-center text-zinc-500">No committee records yet. Existing committee names have not been auto-inserted.</div>}
   </div>
   <div className="overflow-auto border-t">
    <table className="w-full text-sm min-w-[2600px]">
     <thead className="bg-zinc-50"><tr>
      <th className="p-3 text-left">Member ID</th><th className="p-3 text-left">Membership No.</th><th className="p-3 text-left">Member Type</th><th className="p-3 text-left">Full Name</th><th className="p-3 text-left">Father / Husband Name</th><th className="p-3 text-left">Date of Birth</th><th className="p-3 text-left">Gender</th><th className="p-3 text-left">Occupation / Profession</th><th className="p-3 text-left">Mobile No.</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Address</th><th className="p-3 text-left">City</th><th className="p-3 text-left">State</th><th className="p-3 text-left">PIN Code</th><th className="p-3 text-left">PAN (Optional)</th><th className="p-3 text-left">Aadhaar (Optional)</th><th className="p-3 text-left">Joining / Admission Date</th><th className="p-3 text-left">Receipt No.</th><th className="p-3 text-left">Membership End Date</th><th className="p-3 text-left">Membership Status</th><th className="p-3 text-left">Membership Fee (₹)</th><th className="p-3 text-left">Committee Role</th><th className="p-3 text-left">Functional Responsibility</th><th className="p-3 text-left">Committee From</th><th className="p-3 text-left">Committee Till</th><th className="p-3 text-left">Committee Status</th><th className="p-3 text-left">Resolution / Order Ref.</th><th className="p-3 text-left">Action</th>
     </tr></thead>
     <tbody className="divide-y">
      {committeeRows.map(r=>{const d=r.data||{};return <tr key={r.id}>
       <td className="p-3 font-bold">{d.memberId||"—"}</td><td className="p-3">{d.membershipNo||"—"}</td><td className="p-3">{d.memberType||"—"}</td><td className="p-3 font-bold">{d.fullName||"—"}</td><td className="p-3">{d.fatherHusbandName||"—"}</td><td className="p-3">{d.dob||"—"}</td><td className="p-3">{d.gender||"—"}</td><td className="p-3">{d.occupation||"—"}</td><td className="p-3">{d.mobile||d.phone||"—"}</td><td className="p-3">{d.email||"—"}</td><td className="p-3">{d.address||"—"}</td><td className="p-3">{d.city||"—"}</td><td className="p-3">{d.state||"—"}</td><td className="p-3">{d.pinCode||"—"}</td><td className="p-3">{d.pan||"—"}</td><td className="p-3">{d.aadhaar||"—"}</td><td className="p-3">{d.joiningDate||"—"}</td><td className="p-3">{d.receiptNo||"—"}</td><td className="p-3">{d.membershipValidTill||"—"}</td><td className="p-3">{d.membershipStatus||"—"}</td><td className="p-3">{d.membershipFee||"—"}</td><td className="p-3 font-bold">{d.designation||"—"}</td><td className="p-3">{d.functionalResponsibility||d.responsibilities||"—"}</td><td className="p-3">{d.effectiveFrom||"—"}</td><td className="p-3">{d.validTill||"—"}</td><td className="p-3">{d.status||"—"}</td><td className="p-3">{d.resolutionNo||d.referenceNo||"—"}</td><td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold hover:bg-red-50">Archive</button></td>
      </tr>;})}
      {!committeeRows.length&&<tr><td colSpan="28" className="p-8 text-center text-zinc-500">No committee records yet.</td></tr>}
     </tbody>
    </table>
   </div>
  </div>
 </div>;
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