import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBook, FaChartLine, FaDownload, FaPlus, FaSearch, FaUsers, FaFileAlt, FaRupeeSign, FaCalendarAlt, FaTasks, FaUserShield, FaHistory, FaBoxes, FaIdCard, FaCertificate, FaHandshake, FaBalanceScale, FaPrint, FaVideo, FaUserTie } from "react-icons/fa";
import jsPDF from "jspdf";
import { ENDPOINTS } from "../config/api";
import logoImg from "../assets/new-logo.png";
import { generateCertificate, generateIdentityCard } from "../utils/generateCertificate";

const TOKEN_KEY = "ssf_admin_token";
const MODULES = [
 ["dashboard","Dashboard / डैशबोर्ड",FaChartLine],
 ["onlineMeetings","Online Meetings / ऑनलाइन बैठकें",FaVideo],
 ["members","Members Register / सदस्य रजिस्टर",FaUsers],["institutionalHistory","Institution Profile & Compliance / संस्था परिचय एवं अनुपालन",FaHistory],["officeHistory","Membership History / सदस्यता इतिहास",FaUserTie],["managingCommittee","Managing Committee / प्रबंधकारिणी समिति",FaUserTie],["membershipContributions","Membership & Contribution / सदस्यता व योगदान",FaRupeeSign],["meetingResolutions","Meeting & Resolution / बैठक व प्रस्ताव",FaCalendarAlt],["volunteers","Volunteers / स्वयंसेवक",FaUsers],["donors","Donors / दानदाता",FaUsers],
 ["donations","Donations / दान",FaRupeeSign],["expenses","Expenses / व्यय",FaRupeeSign],["contribution","Contributions / योगदान रजिस्टर",FaBook],
 ["cash","Cash Book / रोकड़ बही",FaBook],["bank","Bank Book / बैंक बही",FaBook],["ledger","Ledger / लेजर",FaBalanceScale],
 ["inventory","Stock & Items / स्टॉक व सामग्री",FaBoxes],
 ["inward","Inward Register / आवक रजिस्टर",FaFileAlt],["outward","Outward Register / जावक रजिस्टर",FaFileAlt],
 ["meetings","Meeting Calendar / बैठक कैलेंडर",FaCalendarAlt],["projects","Projects & Initiatives / परियोजनाएँ व पहल",FaTasks],["events","Events & Camps / कार्यक्रम व शिविर",FaCalendarAlt],
 ["mou","MoU & Agreements / समझौते",FaHandshake],["documents","Documents & Records / दस्तावेज़ एवं अभिलेख",FaFileAlt],["officialDocuments","Statutory & Official Documents / वैधानिक एवं आधिकारिक दस्तावेज़",FaFileAlt],["donorSlips","Donor Slips & Receipts / दान रसीदें",FaFileAlt],["separations","Role Changes & Separation / पद परिवर्तन व पृथक्करण",FaFileAlt],["appointmentLetters","Appointment Letters / नियुक्ति पत्र",FaUserTie],
 
 ["certificates","Certificates / प्रमाणपत्र",FaCertificate],["idcards","ID Cards / पहचान पत्र",FaIdCard],
 ["beneficiaries","Beneficiaries / लाभार्थी",FaUsers],["internships","Internship Applications / इंटर्नशिप आवेदन",FaTasks],["activities","Volunteer Activities / स्वयंसेवी गतिविधियाँ",FaTasks],
 ["assets","Assets & Equipment / संपत्ति व उपकरण",FaBoxes],["notifications","Notices, Alerts & Follow-ups / नोटिस, सूचनाएँ एवं अनुवर्ती कार्य",FaTasks],
 ["reports","Reports & Statements / रिपोर्ट एवं विवरण",FaChartLine],["users","Users & Permissions / उपयोगकर्ता व अनुमतियाँ",FaUserShield],["audit","Audit Trail / ऑडिट ट्रेल",FaHistory]
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
 useEffect(function(){
  const refreshHandler=function(e){
   if(e.detail&&e.detail.module==="managingCommittee"&&Array.isArray(e.detail.rows))setRows(e.detail.rows);
  };
  window.addEventListener("ssf-digital-office-refresh",refreshHandler);
  return function(){window.removeEventListener("ssf-digital-office-refresh",refreshHandler);};
 },[]);

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
   Object.entries(nested).forEach(function(entry){
    const key=entry[0], value=entry[1];
    row[key]=value===null||value===undefined?"":(typeof value==="object"?JSON.stringify(value):String(value));
   });
   return row;
  });
 };
 const getExportHeaders=function(flat){
  return Array.from(new Set(flat.reduce(function(all,row){return all.concat(Object.keys(row));},[])));
 };
 const csvEscape=function(value){
  const s=value===null||value===undefined?"":String(value);
  return '"'+s.replace(/"/g,'""')+'"';
 };
 const exportRows=function(data,name){
  const flat=flattenExport(data);
  const headers=getExportHeaders(flat);
  if(!headers.length)return;
  const lines=[];
  lines.push(headers.map(csvEscape).join(","));
  flat.forEach(function(row){
   lines.push(headers.map(function(h){return csvEscape(row[h]);}).join(","));
  });
  const csv="\\uFEFF"+lines.join("\\r\\n")+"\\r\\n";
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");
  const url=URL.createObjectURL(blob);
  a.href=url;a.download=name+".csv";document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
 };
 const exportExcel=function(data,name){
  const flat=flattenExport(data);
  const headers=getExportHeaders(flat);
  if(!headers.length)return;
  const escXml=function(v){
   return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
  };
  const cell=function(v){
   const value=v===null||v===undefined?"":String(v);
   return '<Cell><Data ss:Type="String">'+escXml(value)+'</Data></Cell>';
  };
  const rowsXml=[
   "<Row>"+headers.map(cell).join("")+"</Row>",
   ...flat.map(function(row){return "<Row>"+headers.map(function(h){return cell(row[h]);}).join("")+"</Row>";})
  ].join("");
  const xml='<?xml version="1.0" encoding="UTF-8"?>'
   +'<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
   +'<Worksheet ss:Name="SSF Digital Office"><Table>'+rowsXml+'</Table></Worksheet></Workbook>';
  const blob=new Blob(["\\uFEFF",xml],{type:"application/vnd.ms-excel"});
  const a=document.createElement("a");const url=URL.createObjectURL(blob);
  a.href=url;a.download=name+".xls";document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
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
   <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-auto"><div className="px-4 pt-4 pb-3 border-b border-zinc-200"><div className="flex items-center gap-3"><img src={logoImg} alt="SSF logo" className="h-12 w-12 object-contain rounded-xl bg-white border border-zinc-100 p-1" /><div><div className="text-sm font-black text-[#002344]">SSF Digital Office</div><div className="text-[10px] text-zinc-500 font-semibold">Paperless Office Management</div></div></div></div>{MODULES.map(function(x){var Icon=x[2];return <button key={x[0]} onClick={function(){setActive(x[0]);}} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold mb-1 "+(active===x[0]?"bg-[#123B5D] text-white":"text-zinc-700 hover:bg-zinc-100")}><Icon/><span className="min-w-0 flex-1 leading-tight"><span className={"block text-[15px] sm:text-base font-extrabold "+(active===x[0]?"text-white":"text-[#123B5D]")}>{x[1].split(" / ")[0]}</span><span className={"block text-[14px] sm:text-[15px] font-semibold mt-0.5 "+(active===x[0]?"text-[#FFF8E7]":"text-[#1F7A70]")}>{x[1].split(" / ").slice(1).join(" / ")}</span></span></button>;})}</aside>
   <main className="min-w-0">
    {active==="dashboard"&&<Dashboard summary={summary}/>}
    {active==="onlineMeetings"&&<OnlineMeetings token={token}/>}
    {active==="members"&&<MembersRegister rows={rows} add={add} archive={archive}/>}
    {active==="institutionalHistory"&&<InstitutionalHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="officeHistory"&&<OfficeHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="membershipContributions"&&<MembershipContributions rows={rows} add={add} archive={archive}/>}
    {active==="meetingResolutions"&&<MeetingResolutions rows={rows} add={add} archive={archive}/>}
    {active==="appointmentLetters"&&<AppointmentLetters rows={rows} add={add}/>}
    {active==="managingCommittee"&&<ManagingCommittee rows={rows} add={add} updateRecord={updateRecord} archive={archive} token={token}/>}
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
 ].join("
");
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
 const cards=[["Members / सदस्य",c.members||0],["Volunteers / स्वयंसेवक",c.volunteers||0],["Donors / दानदाता",c.donors||0],["Beneficiaries / लाभार्थी",c.beneficiaries||0],["Donations / दान","₹"+Number(t.donations||0).toLocaleString("en-IN")],["Expenses / व्यय","₹"+Number(t.expenses||0).toLocaleString("en-IN")],["Cash / रोकड़","₹"+Number(t.cash||0).toLocaleString("en-IN")],["Bank / बैंक","₹"+Number(t.bank||0).toLocaleString("en-IN")],["Stock Balance / स्टॉक शेष",Number(t.stockBalance||0).toLocaleString("en-IN")],["Pending / लंबित",summary?.workflow?.pending||0],["Active MoUs / सक्रिय MoU",summary?.workflow?.activeMous||0],["Upcoming Meetings / आगामी बैठकें",summary?.workflow?.upcomingMeetings||0]];
 return <div className="space-y-5"><div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(function(x,i){return <div key={x[0]} className="bg-white border border-[#D8E3EA] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><p className="text-xs uppercase tracking-wider text-[#1F7A70] font-bold">{x[0]}</p><p className="text-2xl font-black text-[#123B5D] mt-2">{x[1]}</p><div className="mt-3 h-1 rounded-full bg-[#FFF8E7]"><div className="h-1 rounded-full bg-[#1F7A70]" style={{width:(i%3===0?"72%":i%3===1?"52%":"88%")}}/></div></div>;})}</div>
 <div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-2xl border border-[#D8E3EA] p-6 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-black">SSF</div><div><h2 className="text-xl font-black text-[#123B5D]">All Required Office Modules / सभी आवश्यक कार्यालय मॉड्यूल</h2><p className="text-xs text-[#1F7A70] font-bold mt-1">पेपरलेस NGO कार्यालय</p></div></div><p className="text-zinc-500 mt-3">Members / सदस्य, Volunteers / स्वयंसेवक, Donors / दानदाता, Donations / दान, Internship / इंटर्नशिप, Beneficiaries / लाभार्थी, Events/Camps / कार्यक्रम व शिविर, Projects / परियोजनाएँ, Documents / दस्तावेज़, Expenses / व्यय, all registers / सभी रजिस्टर, Reports / रिपोर्ट, Users / उपयोगकर्ता and Audit Trail / ऑडिट ट्रेल.</p><div className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">{MODULES.filter(function(x){return x[0]!=="dashboard";}).map(function(x){return <div key={x[0]} className="bg-[#F5F8FA] border border-[#E3EBF0] rounded-lg px-3 py-2 font-semibold text-[#123B5D]">{x[1]}</div>;})}</div></div>
 <div className="bg-[#123B5D] rounded-2xl border border-[#123B5D] p-6 shadow-sm text-white"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-black">Automatic Financial Linking / स्वचालित वित्तीय लिंकिंग</h2><p className="text-sm text-[#D8EDE9] mt-1">एक ही database transaction में linked records</p></div><div className="px-3 py-1 rounded-full bg-[#FFF8E7] text-[#123B5D] text-xs font-black">LIVE</div></div><p className="text-[#D8EDE9] mt-4">Donation and expense workflows write linked contribution, cash/bank and ledger records in one database transaction. / दान व व्यय प्रक्रिया एक ही database transaction में जुड़े contribution, cash/bank और ledger records दर्ज करती है.</p><div className="mt-5 space-y-2 text-sm font-bold text-white"><p>Donation / दान → Donor / दानदाता → Contribution / योगदान → Cash/Bank / रोकड़-बैंक → Ledger / लेजर → Receipt / रसीद</p><p>Expense / व्यय → Expense Register / व्यय रजिस्टर → Cash/Bank / रोकड़-बैंक → Ledger / लेजर</p><p>Create/update/archive / बनाना-संशोधित-संग्रहीत → Audit Trail / ऑडिट ट्रेल</p></div><div className="mt-5 bg-[#FFF8E7] border border-[#E8D39A] rounded-xl p-4 text-sm text-[#5A4510]"><strong>Compliance / अनुपालन:</strong> final statutory/tax treatment, 80G particulars and audit requirements must be verified with SSF's CA/tax advisor.</div></div></div></div>;
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
  responsibilities:"• Work in accordance with the objectives, rules and approved plans of Swastik Srijan Foundation Samiti.
• Support assigned programmes, projects, meetings, camps and community activities.
• Coordinate with members, volunteers, beneficiaries and relevant stakeholders as required.
• Maintain timely activity information, attendance, photographs and other assigned records.
• Submit activity/progress updates and communicate important issues to the competent authority.
• Protect organisational records, confidentiality, reputation and resources.
• Do not make financial commitments, sign agreements or represent the Foundation beyond the authority assigned.",
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