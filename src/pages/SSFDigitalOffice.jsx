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
 ["meetings","Meetings / बैठकें",FaCalendarAlt],
 ["members","Members Register / सदस्य रजिस्टर",FaUsers],["institutionalHistory","Institution Profile & Compliance / संस्था परिचय एवं अनुपालन",FaHistory],["officeHistory","Membership History / सदस्यता इतिहास",FaUserTie],["managingCommittee","Managing Committee / प्रबंधकारिणी समिति",FaUserTie],["membershipContributions","Membership & Contribution / सदस्यता व योगदान",FaRupeeSign],["volunteers","Volunteers / स्वयंसेवक",FaUsers],["donors","Donors / दानदाता",FaUsers],
 ["donations","Donations / दान",FaRupeeSign],["expenses","Expenses / व्यय",FaRupeeSign],["contribution","Contributions / योगदान रजिस्टर",FaBook],
 ["cash","Cash Book / रोकड़ बही",FaBook],["bank","Bank Book / बैंक बही",FaBook],["ledger","Ledger / लेजर",FaBalanceScale],
 ["inventory","Stock & Items / स्टॉक व सामग्री",FaBoxes],
 ["inward","Inward Register / आवक रजिस्टर",FaFileAlt],["outward","Outward Register / जावक रजिस्टर",FaFileAlt],
["projects","Projects & Initiatives / परियोजनाएँ व पहल",FaTasks],["events","Events & Camps / कार्यक्रम व शिविर",FaCalendarAlt],
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
  const dataModule=module==="meetingResolution"?"meetingResolutions":module;
  setLoading(true);
  try{
   await refreshSummary();
   if(NO_RECORD_MODULES.has(module)){setRows([]);return;}
   const q=ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+encodeURIComponent(dataModule)+(search?"&search="+encodeURIComponent(search):"");
   const r=await fetch(q,{headers:auth()}); const d=await r.json(); if(!r.ok)throw new Error(d.message||"Unable to load records."); setRows(Array.isArray(d)?d:(Array.isArray(d.records)?d.records:[]));
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
 const restore=async function(id){
  if(!confirm("Restore this archived record?"))return;
  const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"PUT",headers:auth(),body:JSON.stringify({status:"active"})});
  if(r.ok){setNotice("Record restored.");load(active);}
 };
 const updateRecord=async function(id,module,data){
  try{
   const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"PUT",headers:auth(),body:JSON.stringify({module:module,data:data,recordDate:module==="meetingResolutions"?(data.meetingDate||data.date||new Date().toISOString().slice(0,10)):(data.eventDate||data.date||new Date().toISOString().slice(0,10)),recordType:data.changeType||data.eventType||"Record",status:"active"})});
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
   <div className="flex flex-wrap gap-2"><button type="button" onClick={function(){exportRows(rows,"ssf-digital-office-"+active);}} className="bg-white text-[#002344] px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2"><FaDownload/> CSV</button><button type="button" onClick={function(){exportExcel(rows,"ssf-digital-office-"+active);}} className="bg-white text-[#002344] px-4 py-2.5 rounded-xl font-bold">Excel</button><button type="button" onClick={function(){exportPdf(rows,"SSF Digital Office - "+(LABELS[active]||active));}} className="bg-white text-[#002344] px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2"><FaPrint/> PDF</button></div>
  </div></header>
  {notice&&<div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 font-semibold">{notice}</div>}
  <div className="grid lg:grid-cols-[245px_1fr] gap-5">
   <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-auto"><div className="px-4 pt-4 pb-3 border-b border-zinc-200"><div className="flex items-center gap-3"><img src={logoImg} alt="SSF logo" className="h-12 w-12 object-contain rounded-xl bg-white border border-zinc-100 p-1" /><div><div className="text-sm font-black text-[#002344]">SSF Digital Office</div><div className="text-[10px] text-zinc-500 font-semibold">Paperless Office Management</div></div></div></div>{MODULES.map(function(x){var Icon=x[2];return <React.Fragment key={x[0]}><button onClick={function(){setActive(x[0]);}} className={"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-bold mb-1 "+(active===x[0]?"bg-[#123B5D] text-white":"text-zinc-700 hover:bg-zinc-100")}><Icon/><span className="min-w-0 flex-1 leading-tight"><span className={"block text-[15px] sm:text-base font-extrabold "+(active===x[0]?"text-white":"text-[#123B5D]")}>{x[1].split(" / ")[0]}</span><span className={"block text-[14px] sm:text-[15px] font-semibold mt-0.5 "+(active===x[0]?"text-[#FFF8E7]":"text-[#1F7A70]")}>{x[1].split(" / ").slice(1).join(" / ")}</span></span></button></React.Fragment>;})}</aside>
   <main className="min-w-0">
    {active==="dashboard"&&<Dashboard summary={summary}/>}
    
    {active==="meetings"&&<MeetingsHub token={token} rows={rows} add={add} archive={archive} restore={restore} updateRecord={updateRecord}/>}
    {active==="meetingCalendar"&&<MeetingCalendar rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token}/>}
    {active==="onlineMeetings"&&<OnlineMeetings token={token}/>}
    {active==="meetingResolution"&&<MeetingResolutions rows={rows} add={add} archive={archive} restore={restore} token={token}/>} 
    {active==="members"&&<MembersRegister rows={rows} add={add} archive={archive}/>}
    {active==="institutionalHistory"&&<InstitutionalHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="officeHistory"&&<OfficeHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
    {active==="membershipContributions"&&<MembershipContributions rows={rows} add={add} archive={archive}/>}
    
    
    {active==="appointmentLetters"&&<AppointmentLetters rows={rows} add={add}/>}
    {active==="managingCommittee"&&<ManagingCommittee rows={rows} add={add} updateRecord={updateRecord} archive={archive} token={token}/>}
    {active==="officialDocuments"&&<OfficialDocuments rows={rows} add={add}/>}
    {active==="donorSlips"&&<DonorSlips rows={rows} add={add}/>} 
    {active==="separations"&&<SeparationManagement rows={rows} add={add}/>}\n    {active==="notifications"&&<NotificationsHub rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token}/>}
    {active==="reports"&&<Reports token={token} exportRows={exportRows} exportPdf={exportPdf}/>}
    {active==="audit"&&<Audit token={token}/>}
    {active==="users"&&<Users add={add}/>}
    {!["dashboard","reports","audit","users","appointmentLetters","officialDocuments","donorSlips","separations","members","institutionalHistory","officeHistory","membershipContributions","meetings","meetingCalendar","onlineMeetings","meetingResolution","notifications"].includes(active)&&<Register module={active} rows={rows} loading={loading} search={search} setSearch={setSearch} add={add} archive={archive}/>}
   </main>
  </div>
 </div></div>;
}
function NotificationsHub({rows,add,archive,updateRecord,token}){
 const [tab,setTab]=useState("information");
 const [showForm,setShowForm]=useState(false),[members,setMembers]=useState([]); useEffect(()=>{if(!token)return;fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=members",{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"}}).then(r=>r.ok?r.json():[]).then(d=>setMembers(Array.isArray(d)?d:[])).catch(()=>setMembers([]));},[token]);
 const tabs=[
  ["information","Information & Communication / सूचना एवं संचार","Official information, communication & responsibilities","bg-sky-600"],
  ["response","Response & Participation / प्रतिक्रिया एवं सहभागिता","Responses, attendance & participation","bg-emerald-600"],
  ["followup","Reminder & Follow-up / अनुस्मारक एवं अनुवर्ती कार्य","Reminders, pending actions & follow-ups","bg-amber-600"],
  ["notice","Notice & Explanation / नोटिस एवं स्पष्टीकरण","Formal notices, explanations & outcomes","bg-rose-600"]
 ];
 const typeMap={
  information:["Information","Communication","Announcement","Meeting Information","Responsibility / Task","Document / Information Request"],
  response:["Response Received","No Response","Meeting Not Attended","Online Meeting Not Joined","Task Not Responded","Task Not Completed","Non-Participation"],
  followup:["First Reminder","Second Reminder","Final Reminder","Follow-up","Pending Response","Pending Action"],
  notice:["Formal Notice","Explanation Requested","Explanation Received","Explanation Not Received","Further Clarification","Outcome / Decision Reference"]
 };
 const allRows=rows||[];
 const classifySection=r=>{
  const d=r.data||{};
  // These five existing test records were created before the section field was
  // reliable. Their record IDs are the stable fallback for the current data.
  // This changes display classification only; no database records are created/deleted.
  const rid=String(r.recordId||"").trim();
  const legacySections={
   "SSF-NTF-20260926-00001":"information",
   "SSF-NTF-20260926-00002":"response",
   "SSF-NTF-20260926-00003":"notice",
   "SSF-NTF-20260926-00004":"notice",
   "SSF-NTF-20260926-00005":"notice"
  };
  if(legacySections[rid])return legacySections[rid];

  // For every other record, an explicitly saved section is authoritative.
  const explicit=String(d.section||d.communicationSection||"").trim().toLowerCase();
  if(["information","response","followup","notice"].includes(explicit))return explicit;

  const stage=String(d.noticeStage||d.sectionStage||d.communicationStage||d.recordType||"").trim();
  if((typeMap.notice||[]).includes(stage))return "notice";
  if((typeMap.followup||[]).includes(stage))return "followup";
  if((typeMap.response||[]).includes(stage))return "response";
  if((typeMap.information||[]).includes(stage))return "information";
  const text=[d.subject,d.details,d.responseDetails].filter(Boolean).join(" ").toLowerCase();
  if(/formal notice|explanation requested|explanation received|explanation not received|further clarification|outcome|decision reference/.test(text))return "notice";
  if(d.followUpDate||d.followUpResult)return "followup";
  if(d.participationStatus&&d.participationStatus!=="Not Applicable")return "response";
  if(d.responseStatus&&d.responseStatus!=="Not Applicable")return "response";
  return "information";
 };
 const countStage=key=>allRows.filter(r=>classifySection(r)===key).length;
 const pending=allRows.filter(r=>["pending","active"].includes(String(r.status||"").toLowerCase())).length;
 const followups=allRows.filter(r=>{const d=r.data||{};return d.followUpDate&&String(r.status||"").toLowerCase()!=="closed"&&String(r.status||"").toLowerCase()!=="archived";}).length;
 const notices=countStage("notice");
 const activeTab=tabs.find(t=>t[0]===tab)||tabs[0];
 const filtered=allRows.filter(r=>classifySection(r)===tab);
 return <div className="space-y-5">
  <div className="rounded-3xl bg-gradient-to-r from-[#002344] via-[#123B5D] to-[#1b557e] text-white p-5 sm:p-7 shadow-lg">
   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
    <div>
     <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">SSF Digital Office</div>
     <h1 className="text-2xl sm:text-3xl font-black mt-1">Notices, Alerts & Follow-ups</h1>
     <p className="text-sm sm:text-base text-white/80 mt-1">नोटिस, सूचनाएँ एवं अनुवर्ती कार्य</p>
     <p className="text-sm text-white/70 mt-3 max-w-2xl">Information से लेकर response, reminder और formal explanation तक पूरा communication record एक ही जगह रखें।</p>
    </div>
    <button type="button" onClick={()=>setShowForm(true)} className="shrink-0 bg-white text-[#002344] px-5 py-3 rounded-xl font-black shadow hover:bg-zinc-100 transition flex items-center justify-center gap-2"><FaPlus/> New Communication</button>
   </div>
  </div>

  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
   <div className="bg-white border rounded-2xl p-4 shadow-sm"><div className="text-xs font-bold text-zinc-500">TOTAL RECORDS</div><div className="text-3xl font-black text-[#002344] mt-1">{allRows.length}</div><div className="text-xs text-zinc-400 mt-1">सभी communication records</div></div>
   <div className="bg-white border rounded-2xl p-4 shadow-sm"><div className="text-xs font-bold text-zinc-500">ACTIVE / PENDING</div><div className="text-3xl font-black text-amber-600 mt-1">{pending}</div><div className="text-xs text-zinc-400 mt-1">Follow-up required</div></div>
   <div className="bg-white border rounded-2xl p-4 shadow-sm"><div className="text-xs font-bold text-zinc-500">FOLLOW-UPS</div><div className="text-3xl font-black text-sky-700 mt-1">{followups}</div><div className="text-xs text-zinc-400 mt-1">Follow-up date recorded</div></div>
   <div className="bg-white border rounded-2xl p-4 shadow-sm"><div className="text-xs font-bold text-zinc-500">NOTICES / EXPLANATION</div><div className="text-3xl font-black text-rose-600 mt-1">{notices}</div><div className="text-xs text-zinc-400 mt-1">Formal stage records</div></div>
  </div>

  <div className="bg-white border rounded-2xl p-3 shadow-sm">
   <div className="flex flex-wrap gap-2">
    {tabs.map(t=><button key={t[0]} type="button" onClick={()=>setTab(t[0])} className={"flex-1 min-w-[210px] px-4 py-3 rounded-xl text-left transition border "+(tab===t[0]?"bg-[#123B5D] text-white border-[#123B5D] shadow":"bg-zinc-50 text-[#123B5D] border-zinc-200 hover:bg-zinc-100")}>
      <div className="font-black text-sm">{t[1]}</div><div className={"text-xs mt-1 "+(tab===t[0]?"text-white/70":"text-zinc-500")}>{t[2]}</div><div className={"mt-2 text-xs font-bold "+(tab===t[0]?"text-white":"text-zinc-400")}>{countStage(t[0])} record(s)</div>
    </button>)}
   </div>
  </div>

  {showForm&&<div className="bg-white border rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b flex items-center justify-between"><div><div className="font-black text-[#002344]">New Communication / नई सूचना</div><div className="text-xs text-zinc-500 mt-1">{activeTab[1]}</div></div><button type="button" onClick={()=>setShowForm(false)} className="text-zinc-500 hover:text-zinc-900 font-bold">Close</button></div><NotificationForm members={members} section={tab} types={typeMap[tab]} onSave={async d=>{if(!d){setShowForm(false);return;}const ok=await add("notifications",d);if(ok)setShowForm(false);}}/></div>}

  <div className="bg-zinc-50 border rounded-2xl p-4 sm:p-5">
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div><h2 className="font-black text-[#002344]">{activeTab[1]}</h2><p className="text-xs text-zinc-500 mt-1">{activeTab[2]}</p></div><div className="text-sm font-bold text-zinc-500">{filtered.length} record(s)</div></div>
   <div className="grid sm:grid-cols-3 gap-3 mt-4">
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">SECTION RECORDS</div><div className="text-xl font-black text-[#002344] mt-1">{filtered.length}</div></div>
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">ACTIVE</div><div className="text-xl font-black text-emerald-600 mt-1">{filtered.filter(r=>String(r.status||"").toLowerCase()==="active").length}</div></div>
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">PENDING</div><div className="text-xl font-black text-amber-600 mt-1">{filtered.filter(r=>String(r.status||"").toLowerCase()==="pending").length}</div></div>
   </div>
  </div>

  <NotificationRegister tab={tab} rows={filtered} add={add} archive={archive} updateRecord={updateRecord} types={typeMap[tab]||[]} members={members}/>
 </div>;
}
function NotificationRegister({tab,rows,add,archive,updateRecord,types,members=[],hideAdd=false}){
 const [open,setOpen]=useState(false),[search,setSearch]=useState(""),[status,setStatus]=useState("all"),[editing,setEditing]=useState(null);
 const filtered=(rows||[]).filter(r=>{const d=r.data||{},q=search.toLowerCase(),hay=[r.recordId,r.recordDate,d.name,d.role,d.subject,d.details,d.noticeStage,d.channel,d.section,Array.isArray(d.recipients)?d.recipients.map(x=>x.name).join(" "):""].join(" ").toLowerCase();return (!q||hay.includes(q))&&(status==="all"||String(r.status||"").toLowerCase()===status);});
 const title=tab==="information"?"Information & Communication / सूचना एवं संचार":tab==="response"?"Response & Participation / प्रतिक्रिया एवं सहभागिता":tab==="followup"?"Reminder & Follow-up / अनुस्मारक एवं अनुवर्ती कार्य":"Notice & Explanation / नोटिस एवं स्पष्टीकरण";
 const shareRecord=r=>{
  const d=r.data||{};
  const msg=[d.subject&&("Subject: "+d.subject),d.details,d.expectedAction&&("Expected Action: "+d.expectedAction),d.expectedDate&&("Expected Date: "+d.expectedDate),d.responseDetails&&("Response / Explanation: "+d.responseDetails),d.followUpDate&&("Follow-up Date: "+d.followUpDate)].filter(Boolean).join("\n");
  if(navigator.share){navigator.share({title:d.subject||"SSF Official Communication",text:msg}).catch(()=>{});return;}
  const phone=String(d.mobile||d.phone||"").replace(/\D/g,"");
  if(phone){window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer");return;}
  if(d.email){window.location.href="mailto:"+d.email+"?subject="+encodeURIComponent(d.subject||"SSF Official Communication")+"&body="+encodeURIComponent(msg);return;}
  navigator.clipboard?.writeText(msg).then(()=>alert("Communication copied to clipboard.")).catch(()=>alert(msg));
 };
 return <div className="bg-white rounded-2xl border overflow-hidden">
  <div className="p-5 sm:p-7 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344]">{title}</h2><p className="text-sm text-zinc-500 mt-1">{filtered.length} record(s) · secure database</p></div><div className="flex flex-wrap gap-2 items-center"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search person / subject / ID" className="px-3 py-2.5 border rounded-xl w-56"/><select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="closed">Closed</option><option value="archived">Archived</option></select>{!hideAdd&&<button onClick={()=>setOpen(!open)} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus/> Add</button>}</div></div>
  {open&&<NotificationForm members={members} section={tab} types={types} onSave={async d=>{if(!d){setOpen(false);return;}const ok=await add("notifications",d);if(ok)setOpen(false);}}/>}
  {editing&&<div className="border-b"><div className="px-5 py-4 bg-blue-50 border-b font-black text-[#002344]">Edit Communication / सूचना संपादित करें — {editing.recordId}</div><NotificationForm members={members} section={tab} types={types} initial={editing.data||{}} onCancel={()=>setEditing(null)} onSave={async d=>{if(!d){setEditing(null);return;}const ok=await updateRecord(editing.id,"notifications",d);if(ok)setEditing(null);}}/></div>}
  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Person / Role</th><th className="p-3">Matter</th><th className="p-3">Response / Action</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody className="divide-y">{filtered.length===0?<tr><td colSpan="7" className="p-10 text-center text-zinc-400">No records yet.</td></tr>:filtered.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td><td className="p-3 whitespace-nowrap">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3"><b>{d.name||(Array.isArray(d.recipients)&&d.recipients.length?d.recipients.map(x=>x.name).filter(Boolean).join(", "):"—")}</b><div className="text-xs text-zinc-400">{d.role||(Array.isArray(d.recipients)&&d.recipients.length?d.recipients.map(x=>x.role).filter(Boolean).join(", "):"")}</div></td><td className="p-3 min-w-[260px]"><b>{d.noticeStage||"—"}</b><div className="text-xs text-zinc-400 mt-1">{d.subject||d.details||""}</div></td><td className="p-3">{d.responseStatus||d.responseDetails||d.followUpResult||"—"}</td><td className="p-3">{r.status}</td><td className="p-3"><div className="flex flex-wrap gap-2 justify-end"><button onClick={()=>setEditing(r)} className="text-xs font-bold text-[#123B5D] border border-[#123B5D]/20 px-2.5 py-1.5 rounded-lg">Edit</button><button onClick={()=>shareRecord(r)} className="text-xs font-bold text-emerald-700 border border-emerald-200 px-2.5 py-1.5 rounded-lg">Share</button><button onClick={()=>archive(r.id)} className="text-xs font-bold text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg">Archive</button></div></td></tr>})}</tbody></table></div>
 </div>;
}
function NotificationForm({types,onSave,initial={},onCancel,members=[],section=""}){
 const [f,setF]=useState({date:initial.date||new Date().toISOString().slice(0,10),section:initial.section||section,selectedMemberIds:initial.selectedMemberIds||[],name:initial.name||"",role:initial.role||"",noticeStage:initial.noticeStage||types[0]||"",subject:initial.subject||"",details:initial.details||"",channel:initial.channel||"Official WhatsApp Group",expectedAction:initial.expectedAction||"",expectedDate:initial.expectedDate||"",responseStatus:initial.responseStatus||"Not Applicable",responseDate:initial.responseDate||"",responseDetails:initial.responseDetails||"",participationStatus:initial.participationStatus||"Not Applicable",followUpDate:initial.followUpDate||"",followUpResult:initial.followUpResult||"",status:initial.status||"active",relatedRecordId:initial.relatedRecordId||"",evidenceRef:initial.evidenceRef||"",mobile:initial.mobile||initial.phone||"",email:initial.email||""});
 const set=(k,v)=>setF(x=>({...x,[k]:v})); const toggleMember=id=>setF(x=>({...x,selectedMemberIds:x.selectedMemberIds.includes(id)?x.selectedMemberIds.filter(v=>v!==id):[...x.selectedMemberIds,id]})); const selectedMembers=members.filter(r=>f.selectedMemberIds.includes(r.id)); const selectAll=()=>setF(x=>({...x,selectedMemberIds:x.selectedMemberIds.length===members.length?[]:members.map(r=>r.id)})); const input=(k,p,req=false)=><input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={p} required={req} className={cls}/>; const area=(k,p)=><textarea value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={p} className={cls+" min-h-[90px]"}/>;
 return <form onSubmit={e=>{e.preventDefault();onSave({...f,recordDate:f.date,section:section||f.section,communicationSection:section||f.section,noticeStage:f.noticeStage||types[0]||"Information",recordType:f.noticeStage||types[0]||"Record",recipients:selectedMembers.map(r=>{const d=r.data||{};return {memberId:r.recordId||r.id,name:d.fullName||d.name||"",role:d.organizationRole||d.designation||"",mobile:d.phone||d.mobile||d.mobileNo||"",email:d.email||""};})});}} className="p-5 bg-zinc-50 border-b grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><div className="sm:col-span-2 lg:col-span-4 border rounded-xl bg-white p-3"><div className="flex justify-between items-center mb-2"><b>Person / Member</b><button type="button" onClick={selectAll} className="text-xs font-bold text-[#123B5D]">{f.selectedMemberIds.length===members.length&&members.length?"Deselect All":"Select All"}</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">{members.map(r=>{const d=r.data||{};return <label key={r.id} className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer"><input type="checkbox" checked={f.selectedMemberIds.includes(r.id)} onChange={()=>toggleMember(r.id)}/><span><b>{d.fullName||d.name||"Member"}</b><span className="block text-xs text-zinc-500">{d.organizationRole||d.designation||""}</span></span></label>})}</div></div>{input("name","Manual Person / Member (optional)")}{input("role","Role / Position")}{input("date","Date",true)}<select value={f.noticeStage} onChange={e=>set("noticeStage",e.target.value)} className={cls}>{types.map(x=><option key={x}>{x}</option>)}</select>{input("subject","Subject / Matter",true)}<select value={f.channel} onChange={e=>set("channel",e.target.value)} className={cls}><option>Official WhatsApp Group</option><option>WhatsApp</option><option>Email</option><option>Phone</option><option>Meeting</option><option>Letter</option><option>Other</option></select>{input("expectedAction","Expected Response / Action")}{input("expectedDate","Expected Date")}<select value={f.responseStatus} onChange={e=>set("responseStatus",e.target.value)} className={cls}><option>Not Applicable</option><option>Response Received</option><option>No Response</option><option>Partial Response</option></select><select value={f.participationStatus} onChange={e=>set("participationStatus",e.target.value)} className={cls}><option>Not Applicable</option><option>Present</option><option>Absent</option><option>Online Not Joined</option><option>Late</option><option>Task Not Completed</option><option>No Response</option></select>{input("responseDate","Response / Explanation Date")}{input("followUpDate","Follow-up Date")}{input("relatedRecordId","Related Meeting / Record ID")}{input("evidenceRef","Evidence / Document Reference")}{input("mobile","Mobile (optional)")}{input("email","Email (optional)")}{area("details","Notice / Message / Details")} {area("responseDetails","Response / Explanation / Follow-up Result")}<div className="sm:col-span-2 lg:col-span-4 flex gap-2"><button type="submit" className="bg-[#123B5D] text-white px-5 py-3 rounded-xl font-bold">{initial.recordId?"Update Record":"Save Record"}</button><button type="button" onClick={()=>onCancel?onCancel():onSave(null)} className="border px-5 py-3 rounded-xl font-bold">Cancel</button></div></form>;
}

function MeetingsHub({token,rows,add,archive,restore,updateRecord}){
 const [tab,setTab]=useState("calendar");
 const [resolutionRows,setResolutionRows]=useState([]);
 const [calendarRows,setCalendarRows]=useState([]);
 const [onlineRows,setOnlineRows]=useState([]);
 const tabs=[["calendar","Meeting Calendar / बैठक कैलेंडर"],["online","Online Meetings / ऑनलाइन बैठकें"],["resolution","Meeting & Resolution / बैठक व प्रस्ताव"]];
 const headers={Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"};
 const loadMeetingLinkedRows=async()=>{
  try{
   const h={Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"};
   const [cr,or,rr]=await Promise.all(["meetings","onlineMeetings","meetingResolutions"].map(function(m){return fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+m,{headers:h}).then(function(x){return x.ok?x.json():[];});}));
   setCalendarRows(Array.isArray(cr)?cr:[]); setOnlineRows(Array.isArray(or)?or:[]); setResolutionRows(Array.isArray(rr)?rr:[]);
  }catch(e){setCalendarRows([]);setOnlineRows([]);setResolutionRows([]);}
 };
 const loadResolutionRows=async()=>{
  try{
   const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=meetingResolutions",{headers});
   const d=r.ok?await r.json():[];
   setResolutionRows(Array.isArray(d)?d:[]);
  }catch(e){setResolutionRows([]);}
 };
 useEffect(()=>{loadMeetingLinkedRows();},[]);
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl p-3 sm:p-4 shadow-sm">
   <div className="flex flex-col sm:flex-row gap-2 overflow-x-auto">{tabs.map(function(t){return <button key={t[0]} type="button" onClick={function(){setTab(t[0]);loadMeetingLinkedRows();}} className={"shrink-0 min-w-[220px] px-4 py-3 rounded-xl font-bold text-left transition "+(tab===t[0]?"bg-[#123B5D] text-white shadow-sm":"bg-zinc-50 text-[#123B5D] hover:bg-zinc-100")}>{t[1]}</button>;})}</div>
  </div>
  {tab==="calendar"&&<MeetingCalendar rows={calendarRows.concat(onlineRows,resolutionRows)} linkedRows={calendarRows.concat(onlineRows,resolutionRows)} add={add} archive={archive} updateRecord={updateRecord} token={token}/>}
  {tab==="online"&&<OnlineMeetings token={token}/>}
  {tab==="resolution"&&<MeetingResolutions rows={calendarRows.concat(onlineRows,resolutionRows)} add={async function(module,data){const ok=await add(module,data);if(ok)await loadMeetingLinkedRows();return ok;}} archive={archive} restore={restore} token={token}/>}
 </div>;
}
function OnlineMeetings({token}){
 const blank={title:"",type:"Managing Committee",date:new Date().toISOString().slice(0,10),time:"15:15",purpose:"",agenda:""};
 const [form,setForm]=useState(blank),[link,setLink]=useState(""),[members,setMembers]=useState([]),[selected,setSelected]=useState([]),[records,setRecords]=useState([]),[notice,setNotice]=useState(""),[working,setWorking]=useState(false),[googleConnected,setGoogleConnected]=useState(false),[editingId,setEditingId]=useState(null);
 const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"};
 const loadRecords=async()=>{try{const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=onlineMeetings",{headers});const d=r.ok?await r.json():[];setRecords(Array.isArray(d)?d:[]);}catch(e){setRecords([]);}};
 useEffect(()=>{fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=members",{headers}).then(r=>r.ok?r.json():[]).then(d=>setMembers(Array.isArray(d)?d:[])).catch(()=>setMembers([]));fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_STATUS,{headers}).then(r=>r.ok?r.json():{connected:false}).then(d=>setGoogleConnected(Boolean(d.connected))).catch(()=>setGoogleConnected(false));loadRecords();},[]);
 const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
 const selectedEmails=()=>members.filter(r=>selected.includes(r.id)).map(r=>(r.data||{}).email).filter(Boolean);
 const meetingIdForDate=date=>{const key=String(date||"").replace(/-/g,"");const nums=records.map(r=>String((r.data||{}).meetingId||"").match(new RegExp("^SSF-Meeting-"+key+"-(\\d{3,})$","i"))).filter(Boolean).map(m=>Number(m[1])||0);return "SSF-Meeting-"+key+"-"+String(Math.max(0,...nums)+1).padStart(3,"0");};
 const isLocked=r=>{const d=r.data||{};const when=String(d.date||r.recordDate||"")+"T"+String(d.time||"23:59");return new Date(when).getTime()<=Date.now();};
 const saveMeeting=async(meetingLink,delivery={},meetingId,editRecordId)=>{const data={...(form||{}),meetingId,meetingLink,inviteeRecordIds:selected,platform:"Google Meet",delivery,createdBy:"SSF Admin"};const url=editRecordId?ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+editRecordId:ENDPOINTS.DIGITAL_OFFICE_RECORDS;const method=editRecordId?"PUT":"POST";const body=editRecordId?{module:"onlineMeetings",data,recordDate:form.date,recordType:form.type,status:"active"}:{module:"onlineMeetings",recordDate:form.date,recordType:form.type,data};const r=await fetch(url,{method,headers,body:JSON.stringify(body)});const out=await r.json().catch(()=>({}));if(!r.ok)throw new Error(out.message||"Meeting save failed.");};
 const connectGoogle=async()=>{setWorking(true);setNotice("Google authorization page khola ja raha hai…");try{const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_CONNECT_URL,{headers});const out=await r.json();if(!r.ok)throw new Error(out.message||"Google Meet integration is not configured.");window.location.href=out.url;}catch(e){setNotice(e.message||"Unable to start Google authorization.");setWorking(false);}};
 const createMeeting=async()=>{if(!form.title.trim()||!form.date||!form.time){setNotice("Meeting title, date and time required.");return;}if(!googleConnected){await connectGoogle();return;}setWorking(true);setNotice(editingId?"Meeting update ho raha hai…":"Google Meet link banaya ja raha hai…");try{const emails=selectedEmails();const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_GOOGLE_CREATE_MEETING,{method:"POST",headers,body:JSON.stringify({title:form.title,date:form.date,time:form.time,agenda:form.agenda,emails})});const out=await r.json();if(!r.ok)throw new Error(out.message||"Google Meet creation failed.");const meetingLink=out.meetingLink||link;const meetingId=editingId?(records.find(x=>x.id===editingId)?.data?.meetingId||meetingIdForDate(form.date)):meetingIdForDate(form.date);await saveMeeting(meetingLink,{emailed:out.emailed,emailErrors:out.emailErrors||[],addedMembers:out.addedMembers||0},meetingId,editingId);setLink(meetingLink);setEditingId(null);setNotice(out.emailConfigured?("Google Meet link created and record saved. "+out.emailed+" member(s) ko email invitation bhej diya gaya."): "Google Meet link created and record saved. WhatsApp se bhi share kar sakte hain.");await loadRecords();}catch(e){setNotice(e.message||"Unable to create Google Meet.");}finally{setWorking(false);}};
 const editMeeting=r=>{if(isLocked(r)){setNotice("Meeting time pass ho chuka hai. Ab Online Meeting record edit nahi kiya ja sakta.");return;}const d=r.data||{};setEditingId(r.id);setForm({title:d.title||"",type:d.meetingType||r.recordType||"Other",date:d.date||r.recordDate||"",time:d.time||"",purpose:d.purpose||"",agenda:d.agenda||""});setLink(d.meetingLink||"");setSelected(Array.isArray(d.inviteeRecordIds)?d.inviteeRecordIds:[]);setNotice("Pre-meeting edit mode: changes save karne ke baad updated details share karein.");window.scrollTo({top:0,behavior:"smooth"});};
 const cancelEdit=()=>{setEditingId(null);setLink("");setSelected([]);setForm(blank);setNotice("");};
 const meetingMessage=r=>{const d=r?.data||form||{};return ["Swastik Srijan Foundation Samiti","","Online Meeting Details","", "Meeting ID: "+(d.meetingId||"—"),"Meeting Title: "+(d.title||"—"),"Meeting Type: "+(d.meetingType||d.type||"—"),"Date: "+(d.date||"—"),"Time: "+(d.time||"—"),"","Purpose:",d.purpose||"—","","Agenda:",d.agenda||"As per meeting notice","","Google Meet Link:",d.meetingLink||"—"].join("\n");};
 const shareWhatsApp=()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}window.open("https://wa.me/?text="+encodeURIComponent(meetingMessage()),"_blank");};
 const shareGroup=()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}const group="https://chat.whatsapp.com/HFcpYBQpMGlFTGmVzMSXZZ";window.open(group,"_blank");setNotice("SSF WhatsApp Group khol diya gaya. Meeting details Copy karke group me share karein.");};
 const copyMeetingDetails=async(r)=>{const msg=meetingMessage(r);try{await navigator.clipboard.writeText(msg);setNotice("Complete meeting details copied.");}catch(e){setNotice("Copy nahi ho saki. Please manually copy karein.");}};
 const shareEmail=()=>{if(!link){setNotice("Pehle Google Meet create karein.");return;}window.location.href="mailto:?subject="+encodeURIComponent("SSF Online Meeting: "+form.title)+"&body="+encodeURIComponent(meetingMessage());};
 const join=r=>{const url=r?.data?.meetingLink||link;if(url)window.open(url,"_blank");};
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="bg-[#002344] text-white p-6"><div className="flex items-center gap-3"><FaVideo className="text-2xl"/><div><h2 className="text-2xl font-black">Online Meeting / ऑनलाइन बैठक</h2><p className="text-white/70 mt-1">SSF Digital Office se direct Google Meet link create karein aur selected participants ko invitation/share bhejein.</p></div></div></div>
   <div className="p-6 grid md:grid-cols-2 gap-4">
    <div><label className="text-xs font-bold text-zinc-500">Meeting Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Meeting title" className={cls+" mt-1"}/></div>
    <div><label className="text-xs font-bold text-zinc-500">Meeting Type</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className={cls+" mt-1"}><option>Managing Committee</option><option>General Body</option><option>Emergency Meeting</option><option>MoU / Collaboration</option><option>Volunteer</option><option>Member</option><option>Donor</option><option>Project / Program</option><option>Event / Camp</option><option>Training / Workshop</option><option>Internal Office Meeting</option><option>Other</option></select></div>
    <div><label className="text-xs font-bold text-zinc-500">Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className={cls+" mt-1"}/></div>
    <div><label className="text-xs font-bold text-zinc-500">Time</label><input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className={cls+" mt-1"}/></div>
    <div className="md:col-span-2"><label className="text-xs font-bold text-zinc-500">Purpose / Why this meeting</label><textarea value={form.purpose} onChange={e=>setForm({...form,purpose:e.target.value})} className={cls+" mt-1 min-h-[70px]"} placeholder="Why is this meeting being held?"/></div>
    <div className="md:col-span-2"><label className="text-xs font-bold text-zinc-500">Agenda / Discussion Points</label><textarea value={form.agenda} onChange={e=>setForm({...form,agenda:e.target.value})} className={cls+" mt-1 min-h-[100px]"} placeholder="Meeting agenda"/></div>
    <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="font-black text-[#002344]">Google Meet</div><p className="text-xs text-zinc-600 mt-1">{googleConnected?"Google account connected. Ab meeting link directly create hoga.":"Pehli baar sirf Google authorization karna hoga. Uske baad yahin se Google Meet link banega."}</p><div className="flex flex-wrap gap-2 mt-3"><button type="button" disabled={working} onClick={createMeeting} className="bg-[#002344] text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50">{working?"Please wait…":editingId?"Update Meeting & Link":"Create Google Meet & Save Meeting"}</button>{editingId&&<button type="button" onClick={cancelEdit} className="border px-5 py-3 rounded-xl font-bold">Cancel Edit</button>}{link&&<a href={link} target="_blank" rel="noreferrer" className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold">Join Google Meet</a>}</div>{link&&<div className="mt-3 bg-white border rounded-xl p-4 text-sm"><div className="font-black text-[#002344] mb-3">Meeting Details</div><div className="grid sm:grid-cols-2 gap-2 text-zinc-700"><div><b>Meeting ID:</b> {editingId?(records.find(x=>x.id===editingId)?.data?.meetingId||"—"):(records[records.length-1]?.data?.meetingId||"—")}</div><div><b>Meeting Title:</b> {form.title}</div><div><b>Meeting Type:</b> {form.type}</div><div><b>Date:</b> {form.date}</div><div><b>Time:</b> {form.time}</div></div><div className="mt-3"><b>Purpose:</b><div className="text-zinc-600 mt-1">{form.purpose||"—"}</div></div><div className="mt-3"><b>Agenda:</b><div className="text-zinc-600 mt-1 whitespace-pre-wrap">{form.agenda||"As per meeting notice"}</div></div><div className="mt-3 pt-3 border-t break-all"><b>Google Meet Link:</b> {link}</div></div>}</div>
    <div className="md:col-span-2"><div className="font-black text-[#002344] mb-2">Meeting Participants / Meeting Members</div><p className="text-xs text-zinc-500 mb-2">Members with email can be selected; invitation configured email service se bheja jayega.</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-auto">{members.length===0?<div className="text-sm text-zinc-500">No members found.</div>:members.map(r=>{const d=r.data||{};const email=d.email||"";return <label key={r.id} className={"flex items-center gap-2 border rounded-xl p-3 cursor-pointer "+(selected.includes(r.id)?"bg-zinc-100 border-[#002344]":"bg-white")}><input type="checkbox" checked={selected.includes(r.id)} onChange={()=>toggle(r.id)} disabled={!email}/><span><b>{d.fullName||d.name||"Member"}</b><small className="block text-zinc-500">{email||"No email — cannot send invitation"}</small></span></label>;})}</div></div>
    {link&&<div className="md:col-span-2 flex flex-wrap gap-2"><button type="button" onClick={shareWhatsApp} className="border px-5 py-3 rounded-xl font-bold">WhatsApp Share</button><button type="button" onClick={shareGroup} className="border px-5 py-3 rounded-xl font-bold">SSF WhatsApp Group</button><button type="button" onClick={shareEmail} className="border px-5 py-3 rounded-xl font-bold">Email Share</button><button type="button" onClick={()=>copyMeetingDetails()} className="border px-5 py-3 rounded-xl font-bold">Copy Meeting Details</button></div>}
    {notice&&<div className="md:col-span-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 font-semibold">{notice}</div>}
   </div>
  </div>
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><h3 className="text-xl font-black text-[#002344]">Online Meetings / ऑनलाइन बैठकें</h3><p className="text-sm text-zinc-500 mt-1">{records.length} record(s) · secure database · pre-meeting edits only</p></div><div className="text-xs text-zinc-500">Meeting ID format: <b>SSF-Meeting-DDMMYYYY-001</b></div></div></div>
   <div className="overflow-auto"><table className="w-full text-sm min-w-[1100px]"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">Meeting ID</th><th className="p-3 text-left">Date & Time</th><th className="p-3 text-left">Meeting</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Google Meet</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Actions</th></tr></thead><tbody className="divide-y">{records.map(r=>{const d=r.data||{};const locked=isLocked(r);return <tr key={r.id}><td className="p-3 font-bold text-[#002344]">{d.meetingId||r.recordId}</td><td className="p-3">{d.date||r.recordDate||"—"}<br/><span className="text-zinc-500">{d.time||"—"}</span></td><td className="p-3 font-bold">{d.title||"—"}</td><td className="p-3">{d.meetingType||r.recordType||"—"}</td><td className="p-3">{d.meetingLink?<button type="button" onClick={()=>join(r)} className="text-emerald-700 font-bold underline">Join Google Meet</button>:"—"}</td><td className="p-3"><span className={"px-2.5 py-1 rounded-full text-xs font-bold "+(locked?"bg-zinc-100 text-zinc-600":"bg-emerald-50 text-emerald-700")}>{locked?"Locked":"Scheduled"}</span></td><td className="p-3"><div className="flex flex-wrap gap-2"><button type="button" onClick={()=>copyMeetingDetails(r)} className="px-3 py-1.5 rounded-lg border font-bold">Copy</button>{d.meetingLink&&<button type="button" onClick={()=>{setLink(d.meetingLink);setForm({title:d.title||"",type:d.meetingType||r.recordType||"Other",date:d.date||r.recordDate||"",time:d.time||"",purpose:d.purpose||"",agenda:d.agenda||""});}} className="px-3 py-1.5 rounded-lg border font-bold">View</button>}{!locked&&<button type="button" onClick={()=>editMeeting(r)} className="px-3 py-1.5 rounded-lg bg-[#002344] text-white font-bold">Edit</button>}</div></td></tr>})}{!records.length&&<tr><td colSpan="7" className="p-8 text-center text-zinc-500">No online meetings yet.</td></tr>}</tbody></table></div>
  </div>
 </div>;
}
function DownloadCenter({active,rows,exportRows,exportExcel,exportPdf,setActive,token}){
 const [open,setOpen]=useState(false);
 const [target,setTarget]=useState(active==="dashboard" ? "members" : active);
 const [format,setFormat]=useState("pdf");
 const [downloading,setDownloading]=useState(false);
 const available=Object.entries(LABELS).filter(function(x){return x[0]!=="dashboard"&&x[0]!=="audit"&&x[0]!=="users"&&x[0]!=="reports";});
 const meetingOptions=[
  ["meetingCalendar","Meeting Calendar / बैठक कैलेंडर"],
  ["onlineMeetings","Online Meetings / ऑनलाइन बैठकें"],
  ["meetingResolution","Meeting & Resolution / बैठक व प्रस्ताव"]
 ];
 const authHeaders={Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"};
 const dataModuleFor=function(value){
  if(value==="meetingCalendar")return "meetings";
  if(value==="meetingResolution")return "meetingResolutions";
  return value;
 };
 const labelFor=function(value){
  if(value==="meetingCalendar")return "Meeting Calendar / बैठक कैलेंडर";
  if(value==="onlineMeetings")return "Online Meetings / ऑनलाइन बैठकें";
  if(value==="meetingResolution")return "Meeting & Resolution / बैठक व प्रस्ताव";
  return LABELS[value]||"Records";
 };
 const download=async function(){
  if(downloading)return;
  setDownloading(true);
  try{
   const dataModule=dataModuleFor(target);
   let data=target===active ? (rows||[]) : [];
   if(target!==active || ["meetingCalendar","onlineMeetings","meetingResolution"].includes(target)){
    const response=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+encodeURIComponent(dataModule),{headers:authHeaders});
    const out=await response.json().catch(()=>[]);
    if(!response.ok)throw new Error(out.message||"Unable to load records for download.");
    data=Array.isArray(out)?out:[];
   }
   if(!data.length){
    alert("No records available to download for the selected register.");
    return;
   }
   const filename="ssf-"+target+"-"+new Date().toISOString().slice(0,10);
   if(format==="pdf")exportPdf(data,"SSF "+labelFor(target));
   else if(format==="excel")exportExcel(data,filename);
   else exportRows(data,filename);
   setOpen(false);
  }catch(e){
   alert(e.message||"Download failed. Please try again.");
  }finally{
   setDownloading(false);
  }
 };
 useEffect(function(){if(active!=="dashboard")setTarget(active);},[active]);
 return <div className="relative">
  <button type="button" onClick={function(){setOpen(!open);}} className="bg-white text-[#002344] px-4 py-3 rounded-xl font-bold flex items-center gap-2"><FaDownload/> Download / Export</button>
  {open&&<div className="absolute right-0 top-14 z-30 w-[min(92vw,390px)] bg-white text-zinc-800 rounded-2xl shadow-2xl border p-5">
   <div className="font-black text-[#002344] text-lg">What do you want to download?</div>
   <p className="text-xs text-zinc-500 mt-1">Select any register and download its current records directly.</p>
   <label className="block text-xs font-bold text-zinc-500 mt-4 mb-1">Document / Register</label>
   <select value={target} onChange={e=>setTarget(e.target.value)} className={cls}>
    {available.map(function(x){
     if(x[0]!=="meetings")return <option key={x[0]} value={x[0]}>{x[1]}</option>;
     return <optgroup key="meetings-group" label="Meetings / बैठकें">
      {meetingOptions.map(function(opt){return <option key={opt[0]} value={opt[0]}>{opt[1]}</option>;})}
     </optgroup>;
    })}
   </select>
   <label className="block text-xs font-bold text-zinc-500 mt-3 mb-1">Format</label>
   <div className="grid grid-cols-3 gap-2"><button type="button" onClick={()=>setFormat("pdf")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="pdf"?"bg-[#002344] text-white":"bg-white")}>PDF</button><button type="button" onClick={()=>setFormat("excel")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="excel"?"bg-[#002344] text-white":"bg-white")}>Excel</button><button type="button" onClick={()=>setFormat("csv")} className={"px-3 py-3 rounded-xl border font-bold "+(format==="csv"?"bg-[#002344] text-white":"bg-white")}>CSV</button></div>
   <div className="flex gap-2 mt-4"><button type="button" onClick={()=>setOpen(false)} className="flex-1 border px-3 py-2.5 rounded-xl font-bold">Cancel</button><button type="button" disabled={downloading} onClick={download} className="flex-1 bg-[#002344] text-white px-3 py-2.5 rounded-xl font-bold disabled:opacity-40">{downloading?"Preparing…":"Download"}</button></div>
  </div>}
 </div>;
}
function Dashboard({summary}){
 const t=summary&&summary.totals||{},c=summary&&summary.counts||{};
 const cards=[["Members / सदस्य",c.members||0],["Volunteers / स्वयंसेवक",c.volunteers||0],["Donors / दानदाता",c.donors||0],["Beneficiaries / लाभार्थी",c.beneficiaries||0],["Donations / दान","₹"+Number(t.donations||0).toLocaleString("en-IN")],["Expenses / व्यय","₹"+Number(t.expenses||0).toLocaleString("en-IN")],["Cash / रोकड़","₹"+Number(t.cash||0).toLocaleString("en-IN")],["Bank / बैंक","₹"+Number(t.bank||0).toLocaleString("en-IN")],["Stock Balance / स्टॉक शेष",Number(t.stockBalance||0).toLocaleString("en-IN")],["Pending / लंबित",summary?.workflow?.pending||0],["Active MoUs / सक्रिय MoU",summary?.workflow?.activeMous||0],["Upcoming Meetings / आगामी बैठकें",summary?.workflow?.upcomingMeetings||0],["Meeting Calendar / बैठक कैलेंडर",summary?.workflow?.meetingCalendar||0],["Online Meetings / ऑनलाइन बैठकें",summary?.workflow?.onlineMeetings||0],["Meeting & Resolution / बैठक व प्रस्ताव",summary?.workflow?.meetingResolutions||0],["Total Meeting Records / कुल बैठक रिकॉर्ड",summary?.workflow?.totalMeetings||0]];
 return <div className="space-y-5"><div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(function(x,i){return <div key={x[0]} className="bg-white border border-[#D8E3EA] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"><p className="text-xs uppercase tracking-wider text-[#1F7A70] font-bold">{x[0]}</p><p className="text-2xl font-black text-[#123B5D] mt-2">{x[1]}</p><div className="mt-3 h-1 rounded-full bg-[#FFF8E7]"><div className="h-1 rounded-full bg-[#1F7A70]" style={{width:(i%3===0?"72%":i%3===1?"52%":"88%")}}/></div></div>;})}</div>
 <div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-2xl border border-[#D8E3EA] p-6 shadow-sm"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#123B5D] text-white flex items-center justify-center font-black">SSF</div><div><h2 className="text-xl font-black text-[#123B5D]">All Required Office Modules / सभी आवश्यक कार्यालय मॉड्यूल</h2><p className="text-xs text-[#1F7A70] font-bold mt-1">पेपरलेस NGO कार्यालय</p></div></div><p className="text-zinc-500 mt-3">Members / सदस्य, Volunteers / स्वयंसेवक, Donors / दानदाता, Donations / दान, Internship / इंटर्नशिप, Beneficiaries / लाभार्थी, Events/Camps / कार्यक्रम व शिविर, Projects / परियोजनाएँ, Documents / दस्तावेज़, Expenses / व्यय, all registers / सभी रजिस्टर, Reports / रिपोर्ट, Users / उपयोगकर्ता and Audit Trail / ऑडिट ट्रेल.</p><div className="mt-5 grid sm:grid-cols-2 gap-2 text-sm">{["members","volunteers","donors","beneficiaries","internships","donations","contribution","expenses","cash","bank","ledger","inventory","assets","inward","outward","meetings","projects","events","activities","mou","certificates","idcards","documents","officialDocuments","donorSlips","notifications","separations","appointmentLetters","institutionalHistory","officeHistory","managingCommittee","membershipContributions","reports","users","audit"].map(function(id){const x=MODULES.find(function(m){return m[0]===id;});return x?<div key={x[0]} className="bg-[#F5F8FA] border border-[#E3EBF0] rounded-lg px-3 py-2 font-semibold text-[#123B5D]">{x[1]}</div>:null;})}</div><div className="mt-6 border-t border-[#E3EBF0] pt-5"><h3 className="text-lg font-black text-[#123B5D]">Meeting & Resolution Record Format / बैठक एवं प्रस्ताव रिकॉर्ड प्रारूप</h3><p className="text-xs text-[#1F7A70] font-semibold mt-1">Online, Offline और Hybrid — सभी meetings के लिए एक ही official record format</p><div className="mt-3 overflow-x-auto rounded-xl border border-[#D8E3EA]"><table className="w-full min-w-[1100px] text-xs"><thead className="bg-[#123B5D] text-white"><tr>{["Date","Type","Mode","Meeting Title","Venue / Location","Online Meeting Ref. / Link","Resolution No.","Status","Attendance","Minutes / Proceedings","Decision","Action Points","Supporting Document","Remarks"].map(function(h){return <th key={h} className="p-2.5 text-left whitespace-nowrap">{h}</th>;})}</tr></thead><tbody><tr className="bg-[#F5F8FA]"><td className="p-2.5">26-09-2026</td><td className="p-2.5">Managing Committee</td><td className="p-2.5 font-bold text-[#123B5D]">Online</td><td className="p-2.5">Annual Review & Planning Meeting – 2026–27</td><td className="p-2.5">—</td><td className="p-2.5 break-all">https://meet.google.com/xcv-atco-zzc</td><td className="p-2.5">—</td><td className="p-2.5">Not Applicable</td><td className="p-2.5">Not Joined — meeting details prepared</td><td className="p-2.5">Agenda prepared: पिछले वर्ष के कार्य एवं गतिविधियों की समीक्षा; Managing Committee members की सक्रियता एवं जिम्मेदारियाँ; Members/Volunteers participation; 2026–27 programs/projects; Education, Health, Livelihood & Rural Development; 3–6 month action plan; website, records, transparency; resources & partnerships.</td><td className="p-2.5">To be recorded after meeting.</td><td className="p-2.5">To be finalized after meeting.</td><td className="p-2.5">Online Meeting Details / Google Meet reference</td><td className="p-2.5">Official online meeting record linked with Meeting Calendar.</td></tr></tbody></table></div></div></div>
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

function MeetingCalendar({rows,add,archive,token,updateRecord}){
 const blank={
  date:new Date().toISOString().slice(0,10),time:"",meetingTitle:"",meetingType:"Managing Committee Meeting",mode:"Online",
  venue:"",meetingLink:"",platform:"Google Meet",organizerHost:"SSF Admin",purpose:"",agenda:"",
  participants:"",reminder:"1 day before",status:"Scheduled",remarks:""
 };
 const [f,setF]=useState(blank),[saving,setSaving]=useState(false),[editingId,setEditingId]=useState(null),[showForm,setShowForm]=useState(false);
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const calendarRows=(rows||[]).filter(r=>r.module==="meetings"&&r.status!=="archived").sort((a,b)=>String(a.recordDate||"").localeCompare(String(b.recordDate||"")));
 const today=new Date().toISOString().slice(0,10);
 const upcoming=calendarRows.filter(r=>String((r.data||{}).date||r.recordDate||"")>=today&&String((r.data||{}).status||r.status||"").toLowerCase()!=="cancelled");
 const scheduled=calendarRows.filter(r=>String((r.data||{}).status||r.status||"").toLowerCase()==="scheduled");
 const completed=calendarRows.filter(r=>String((r.data||{}).status||r.status||"").toLowerCase()==="completed");
 const submit=async e=>{
  e.preventDefault();
  if(!f.date||!f.time||!f.meetingTitle||!f.meetingType){return;}
  setSaving(true);
  const payload={...f};
  const ok=editingId
   ? await updateRecord(editingId,"meetings",{...payload})
   : await add("meetings",{recordDate:f.date,recordType:f.meetingType,status:f.status.toLowerCase(),data:payload});
  if(ok){setF({...blank,date:new Date().toISOString().slice(0,10)});setEditingId(null);setShowForm(false);}
  setSaving(false);
 };
 const edit=r=>{setF({...blank,...(r.data||{}),date:(r.data||{}).date||r.recordDate||blank.date});setEditingId(r.id);setShowForm(true);window.scrollTo({top:0,behavior:"smooth"});};
 const displayDate=r=>{const d=r.data||{};return d.date||r.recordDate||"—";};
 const displayStatus=r=>String((r.data||{}).status||r.status||"scheduled").replace(/^./,m=>m.toUpperCase());
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="bg-[#002344] text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div><div className="flex items-center gap-3"><FaCalendarAlt className="text-2xl"/><div><h2 className="text-2xl font-black">Meeting Calendar / बैठक कैलेंडर</h2><p className="text-white/70 mt-1">Plan upcoming meetings in one place — when, where, why, who is invited, and reminder/status.</p></div></div></div>
    <button type="button" onClick={()=>{setShowForm(x=>!x);if(showForm){setEditingId(null);setF(blank);}}} className="bg-white text-[#002344] px-4 py-2.5 rounded-xl font-bold shrink-0"><FaPlus className="inline mr-2"/>{showForm?"Close":"Add Meeting"}</button>
   </div>
   <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50">
    {[["Upcoming",upcoming.length],["Scheduled",scheduled.length],["Completed",completed.length],["Total",calendarRows.length]].map(x=><div key={x[0]} className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">{x[0]}</div><div className="text-2xl font-black text-[#002344] mt-1">{x[1]}</div></div>)}
   </div>
  </div>
  {showForm&&<div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">{editingId?"Edit Meeting / बैठक संपादित करें":"Schedule Meeting / बैठक निर्धारित करें"}</h3><p className="text-sm text-zinc-500 mt-1">Calendar planning only. Official attendance, minutes and resolutions belong in Meeting & Resolution Register.</p></div>
   <form onSubmit={submit} className="p-5 space-y-5">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
     <div><label className="text-xs font-bold text-zinc-500">Meeting Date *</label><input type="date" value={f.date} onChange={e=>set("date",e.target.value)} required className={cls}/></div>
     <div><label className="text-xs font-bold text-zinc-500">Meeting Time *</label><input type="time" value={f.time} onChange={e=>set("time",e.target.value)} required className={cls}/></div>
     <div><label className="text-xs font-bold text-zinc-500">Meeting Type *</label><select value={f.meetingType} onChange={e=>set("meetingType",e.target.value)} required className={cls}>{["General Body Meeting","Managing Committee Meeting","Special Meeting","Emergency Meeting","MoU / Collaboration Meeting","Volunteer Meeting","Member Meeting","Donor Meeting","Project / Program Meeting","Event / Camp Meeting","Training / Workshop","Internal Office Meeting","Other"].map(x=><option key={x}>{x}</option>)}</select></div>
     <input value={f.meetingTitle} onChange={e=>set("meetingTitle",e.target.value)} placeholder="Meeting Title *" required className={cls}/>
     <select value={f.mode} onChange={e=>set("mode",e.target.value)} className={cls}><option>Online</option><option>Offline</option><option>Hybrid</option></select>
     <input value={f.venue} onChange={e=>set("venue",e.target.value)} placeholder="Venue / Location" className={cls}/>
     <input value={f.meetingLink} onChange={e=>set("meetingLink",e.target.value)} placeholder="Online Meeting Link (if applicable)" className={cls}/>
     <select value={f.platform} onChange={e=>set("platform",e.target.value)} className={cls}><option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>Other</option><option>Not applicable</option></select>
     <input value={f.organizerHost} onChange={e=>set("organizerHost",e.target.value)} placeholder="Organizer / Host" className={cls}/>
    </div>
    <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.purpose} onChange={e=>set("purpose",e.target.value)} placeholder="Purpose" className={cls+" min-h-[90px]"}/></div>
    <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.agenda} onChange={e=>set("agenda",e.target.value)} placeholder="Agenda" className={cls+" min-h-[90px]"}/></div>
    <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.participants} onChange={e=>set("participants",e.target.value)} placeholder="Participants / Invited Members" className={cls+" min-h-[90px]"}/></div>
    <select value={f.reminder} onChange={e=>set("reminder",e.target.value)} className={cls}><option>1 day before</option><option>2 days before</option><option>1 week before</option><option>On meeting day</option><option>No reminder</option></select>
    <select value={f.status} onChange={e=>set("status",e.target.value)} className={cls}><option>Scheduled</option><option>Pending</option><option>Completed</option><option>Cancelled</option></select>
    <div className="sm:col-span-2 lg:col-span-4"><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls+" min-h-[90px]"}/></div>
    <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2 pt-2"><button type="submit" disabled={saving} className="bg-[#002344] text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50">{saving?(editingId?"Updating…":"Saving…"):(editingId?"Update Meeting":"Save Meeting")}</button>{editingId&&<button type="button" onClick={()=>{setEditingId(null);setF(blank);setShowForm(false);}} className="border px-5 py-3 rounded-xl font-bold">Cancel Edit</button>}</div>
   </form>
  </div>}
  <div className="bg-white border rounded-2xl overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Meeting Schedule / बैठक सूची</h3><p className="text-sm text-zinc-500 mt-1">Upcoming and planned meetings · {calendarRows.length} record(s) · secure database</p></div>
   <div className="overflow-auto"><table className="w-full text-sm min-w-[1500px]"><thead className="bg-zinc-50"><tr>
    <th className="p-3 text-left">Date</th><th className="p-3 text-left">Time</th><th className="p-3 text-left">Meeting Title</th><th className="p-3 text-left">Type</th><th className="p-3 text-left">Mode</th><th className="p-3 text-left">Venue / Meet</th><th className="p-3 text-left">Purpose</th><th className="p-3 text-left">Agenda</th><th className="p-3 text-left">Participants</th><th className="p-3 text-left">Reminder</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Action</th>
   </tr></thead><tbody className="divide-y">{calendarRows.map(r=>{const d=r.data||{};const venue=d.mode==="Online"?(d.meetingLink||"Online"):(d.mode==="Hybrid"?((d.venue||"Venue")+" / "+(d.meetingLink||"Online")):(d.venue||"—"));return <tr key={r.id}>
    <td className="p-3 font-bold whitespace-nowrap">{displayDate(r)}</td><td className="p-3 whitespace-nowrap">{d.time||"—"}</td><td className="p-3 font-bold max-w-[220px]">{d.meetingTitle||"—"}</td><td className="p-3">{d.meetingType||r.recordType||"—"}</td><td className="p-3">{d.mode||"—"}</td><td className="p-3 max-w-[260px] break-all">{venue}</td><td className="p-3 max-w-[260px]">{d.purpose||"—"}</td><td className="p-3">{d.organizerHost||"—"}</td><td className="p-3 max-w-[220px]">{d.participants||"—"}</td><td className="p-3">{d.reminder||"—"}</td><td className="p-3 font-bold">{displayStatus(r)}</td><td className="p-3 whitespace-nowrap"><button type="button" onClick={()=>edit(r)} className="px-3 py-1.5 rounded-lg border border-[#002344]/20 text-[#002344] font-bold mr-2">Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td>
   </tr>})}{!calendarRows.length&&<tr><td colSpan="12" className="p-10 text-center text-zinc-500">No calendar records yet.<br/><span className="text-xs">Add a meeting above to create the schedule.</span></td></tr>}</tbody></table></div>
  </div>
  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
   <h3 className="font-black text-[#002344]">Meeting workflow / बैठक कार्यप्रवाह</h3>
   <p className="text-sm text-zinc-700 mt-2"><b>Meeting Calendar</b> → planning & scheduling &nbsp;•&nbsp; <b>Online Meetings</b> → online meeting details &nbsp;•&nbsp; <b>Meeting & Resolution</b> → attendance, minutes, decisions, resolutions & action points.</p>
  </div>
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
 const existing=(Array.isArray(rows)?rows:[]).filter(r=>r&&r.module==="members"&&r.status!=="deleted");
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
 const allExisting=(rows||[]).filter(r=>r.module==="officeHistory"&&r.status!=="deleted");
 const [query,setQuery]=useState(""),[sortBy,setSortBy]=useState("dateAsc");
 const blank={memberId:"",fullName:"",eventDate:new Date().toISOString().slice(0,10),changeType:"Appointment",previousRole:"",newRole:"",referenceNo:"",resolutionNo:"",meetingDate:"",details:"",remarks:""};
 const [f,setF]=useState(blank),[editingId,setEditingId]=useState(null),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const editRecord=r=>{const d=r.data||{};setEditingId(r.id);setF({...blank,memberId:d.memberId||"",fullName:d.fullName||d.name||"",eventDate:d.eventDate||r.recordDate||"",changeType:d.changeType||d.action||r.recordType||"Appointment",previousRole:d.previousRole||"",newRole:d.newRole||d.designation||"",referenceNo:d.referenceNo||"",resolutionNo:d.resolutionNo||"",meetingDate:d.meetingDate||"",details:d.details||d.reason||d.responsibilities||"",remarks:d.remarks||""});setNotice("");window.scrollTo({top:0,behavior:"smooth"});};
 const reset=()=>{setEditingId(null);setF({...blank,eventDate:new Date().toISOString().slice(0,10)});};
 const save=async e=>{e.preventDefault();const needsRole=!["Removal","Resignation","Relieving"].includes(f.changeType);if(!f.fullName.trim()||!f.eventDate||(needsRole&&!f.newRole.trim())){setNotice(needsRole?"Full Name, Event Date and New / Current Position required.":"Full Name and Event Date required.");return;}setSaving(true);const data={...f};const ok=editingId?await updateRecord(editingId,"officeHistory",data):await add("officeHistory",{recordDate:f.eventDate,recordType:f.changeType,status:"active",data});setSaving(false);if(ok){setNotice(editingId?"Office History updated successfully.":"Office History saved successfully.");reset();}};
 const normalizedQuery=query.trim().toLowerCase();
 const searched=allExisting.filter(r=>{const d=r.data||{};if(!normalizedQuery)return true;return [d.memberId,d.fullName,d.name].some(v=>String(v||"").toLowerCase().includes(normalizedQuery));});
 const sorted=[...searched].sort((a,b)=>{
  const da=a.data||{},db=b.data||{};
  if(sortBy==="name")return String(da.fullName||da.name||"").localeCompare(String(db.fullName||db.name||""));
  if(sortBy==="memberId")return String(da.memberId||"").localeCompare(String(db.memberId||""));
  if(sortBy==="dateDesc")return String(b.data?.eventDate||b.recordDate||"").localeCompare(String(a.data?.eventDate||a.recordDate||""));
  return String(a.data?.eventDate||a.recordDate||"").localeCompare(String(b.data?.eventDate||b.recordDate||""));
 });
 const grouped=[];
 const groupMap=new Map();
 sorted.forEach(r=>{const d=r.data||{};const key=String(d.memberId||"")+"|"+String(d.fullName||d.name||"").trim().toLowerCase();if(!groupMap.has(key)){const g={key,memberId:d.memberId||"",fullName:d.fullName||d.name||"—",records:[]};groupMap.set(key,g);grouped.push(g);}groupMap.get(key).records.push(r);});
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
   <div className="p-5 border-b">
    <h3 className="text-xl font-black text-[#002344]">Permanent Committee / Office Role History</h3>
    <p className="text-sm text-zinc-500 mt-1">Existing records isi register mein editable hain. Archive history ko permanently delete nahi karta.</p>
    <div className="mt-4 grid lg:grid-cols-[1fr_auto] gap-3">
     <div className="relative">
      <FaSearch className="absolute left-3 top-3 text-zinc-400"/>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by Member ID or Name" className="w-full pl-9 pr-10 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20"/>
      {query&&<button type="button" onClick={()=>setQuery("")} className="absolute right-3 top-2.5 text-zinc-400 font-bold text-lg">×</button>}
     </div>
     <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none">
      <option value="dateAsc">Sort: Date — Oldest First</option>
      <option value="dateDesc">Sort: Date — Newest First</option>
      <option value="memberId">Sort: Member ID — A to Z</option>
      <option value="name">Sort: Name — A to Z</option>
     </select>
    </div>
    <div className="mt-3 text-xs text-zinc-500">{searched.length} matching record(s) · {grouped.length} member(s)</div>
   </div>
   <div className="overflow-auto">
    <table className="w-full text-sm min-w-[1500px]">
     <thead className="bg-zinc-50"><tr><th className="p-3 text-left w-12">Sr.</th>{["Date","Member ID","Name","Change Type","Previous Position","New / Current Position","Reference","Resolution","Meeting Date","Details","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead>
     <tbody className="divide-y">
      {grouped.map((g,gi)=><React.Fragment key={g.key}>
       <tr className="bg-blue-50/60"><td className="p-3 font-black text-[#002344]">{gi+1}</td><td className="p-3 font-bold" colSpan="2">{g.memberId||"—"}</td><td className="p-3 font-black" colSpan="9">{g.fullName} <span className="text-xs font-semibold text-zinc-500">· {g.records.length} history record{g.records.length===1?"":"s"}</span></td></tr>
       {g.records.map((r,ri)=>{const d=r.data||{};return <tr key={r.id}>
        <td className="p-3 text-zinc-400">{ri+1}</td>
        <td className="p-3 whitespace-nowrap">{d.eventDate||r.recordDate||"—"}</td><td className="p-3">{d.memberId||"—"}</td><td className="p-3 font-bold">{d.fullName||d.name||"—"}</td><td className="p-3">{d.changeType||d.action||r.recordType||"—"}</td><td className="p-3">{d.previousRole||"—"}</td><td className="p-3 font-bold">{d.newRole||d.designation||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.resolutionNo||"—"}</td><td className="p-3">{d.meetingDate||"—"}</td><td className="p-3 max-w-[420px]">{d.details||d.reason||d.responsibilities||"—"}</td><td className="p-3">{d.remarks||"—"}</td>
        <td className="p-3 sticky right-0 bg-white border-l z-10 whitespace-nowrap"><button type="button" onClick={()=>editRecord(r)} className="px-3 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold hover:bg-red-50">Archive</button></td>
       </tr>;})}
      </React.Fragment>)}
      {!grouped.length&&<tr><td colSpan="13" className="p-10 text-center text-zinc-500">{query?"No matching Name / Member ID found.":"No Office History records yet."}</td></tr>}
     </tbody>
    </table>
   </div>
  </div>
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><b>Historical record:</b> Original documents verify exact dates, reference numbers and resolutions. Approximate dates should be corrected through Edit when source documents are available.</div>
 </SimpleOfficeCard>;
}
function MembershipContributions({rows,add,archive}){
 const existing=(rows||[]).filter(r=>r.module==="membershipContributions"&&r.status!=="deleted"); const [f,setF]=useState({date:new Date().toISOString().slice(0,10),memberId:"",memberName:"",contributionType:"Monthly Membership Fee",amount:"",period:"",receiptNo:"",paymentMode:"Cash",transactionNo:"",purpose:"",remarks:""}); const [notice,setNotice]=useState(""); const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const save=async e=>{e.preventDefault();if(!f.memberName.trim()||!f.amount){setNotice("Member Name and Amount required.");return;}const ok=await add("membershipContributions",{recordDate:f.date,recordType:f.contributionType,status:"active",data:f});if(ok){setF({...f,memberId:"",memberName:"",amount:"",period:"",receiptNo:"",transactionNo:"",purpose:"",remarks:""});setNotice("Membership/contribution payment saved.");}};
 return <SimpleOfficeCard title="💰 Membership & Contribution Register" subtitle="Monthly, annual, lifetime, patron membership और अन्य actual receipts/payments का अलग transaction record."><div className="bg-white border rounded-2xl p-5"><form onSubmit={save} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"><input type="date" value={f.date} onChange={e=>set("date",e.target.value)} className={cls}/><input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID" className={cls}/><input value={f.memberName} onChange={e=>set("memberName",e.target.value)} placeholder="Member Name" required className={cls}/><select value={f.contributionType} onChange={e=>set("contributionType",e.target.value)} className={cls}><option>Monthly Membership Fee</option><option>Annual Membership Fee</option><option>Lifetime Membership</option><option>Patron Membership</option><option>Other Member Contribution</option></select><input value={f.amount} onChange={e=>set("amount",e.target.value)} type="number" min="0" step="0.01" placeholder="Amount (₹)" required className={cls}/><input value={f.period} onChange={e=>set("period",e.target.value)} placeholder="Membership Period (e.g. Apr-2026)" className={cls}/><input value={f.receiptNo} onChange={e=>set("receiptNo",e.target.value)} placeholder="Receipt No." className={cls}/><select value={f.paymentMode} onChange={e=>set("paymentMode",e.target.value)} className={cls}><option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Cheque</option><option>Other</option></select><input value={f.transactionNo} onChange={e=>set("transactionNo",e.target.value)} placeholder="Transaction / Cheque No." className={cls}/><input value={f.purpose} onChange={e=>set("purpose",e.target.value)} placeholder="Purpose / Note" className={cls}/><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls}/><button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold">Save Payment / Contribution</button></form></div>{notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}<div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm min-w-[1300px]"><thead className="bg-zinc-50"><tr>{["Date","Member ID","Member Name","Type","Amount","Period","Receipt No.","Payment Mode","Transaction No.","Purpose","Remarks","Action"].map(h=><th key={h} className="p-3 text-left">{h}</th>)}</tr></thead><tbody className="divide-y">{existing.sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate))).map(r=>{const d=r.data||{};return <tr key={r.id}>{[r.recordDate,d.memberId,d.memberName,d.contributionType||r.recordType,d.amount,d.period,d.receiptNo,d.paymentMode,d.transactionNo,d.purpose,d.remarks].map((v,i)=><td key={i} className="p-3">{v||"—"}</td>)}<td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!existing.length&&<tr><td colSpan="12" className="p-8 text-center text-zinc-500">No membership/contribution transactions yet.</td></tr>}</tbody></table></div></SimpleOfficeCard>;
}

function MeetingResolutions({rows,add,archive,restore,token}){
 const resolutionRows=(rows||[]).filter(r=>r.module==="meetingResolutions"&&r.status!=="deleted");
 const calendarRows=(rows||[]).filter(r=>r.module==="meetings"&&r.status!=="deleted");
 const existing=resolutionRows;
 useEffect(()=>{
  const legacy=calendarRows.find(r=>{
   const d=r.data||{};
   return String(d.meetingTitle||"").trim()==="Annual Review & Planning Meeting – 2026–27" && String(d.date||r.recordDate||"").slice(0,10)==="2026-09-26";
  });
  if(!legacy || resolutionRows.some(r=>String((r.data||{}).meetingTitle||"").trim()==="Annual Review & Planning Meeting – 2026–27")) return;
  const d=legacy.data||{};
  add("meetingResolutions",{
   recordDate:d.date||legacy.recordDate,
   recordType:d.meetingType||"Managing Committee Meeting",
   status:"active",
   data:{
    meetingDate:String(d.date||legacy.recordDate||"").slice(0,10),
    startTime:d.time||"",
    endTime:"",
    meetingType:d.meetingType||"Managing Committee Meeting",
    meetingMode:d.mode||"Online",
    meetingTitle:d.meetingTitle||"",
    purpose:d.purpose||"",
    venue:d.venue||"",
    onlineMeetingId:"",
    onlineMeetingLink:d.meetingLink||"",
    onlinePlatform:d.meetingLink?"Google Meet":"",
    organizer:"",
    presentMembers:d.participants||"",
    absentMembers:"",
    onlineParticipants:"",
    offlineParticipants:"",
    attendance:"",
    attendanceSummary:"",
    attendanceSheetRef:"",
    agenda:d.agenda||"",
    decision:"",
    resolutionNo:"",
    resolutionStatus:"Not Applicable",
    actionPoints:"",
    responsiblePersons:"",
    targetDate:"",
    supportingDocument:"",
    recordingRef:"",
    remarks:"Imported from Meeting Calendar record. Complete the official attendance, minutes, decisions and resolution fields after the meeting."
   }
  });
 },[calendarRows.length,resolutionRows.length]);
 const [archived,setArchived]=useState([]);
 const loadArchived=async()=>{
  try{
   let r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=meetingResolutions&includeArchived=1",{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"}});
   if(!r.ok) r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=meetingResolutions&includeArchived=1",{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"}});
   const d=await r.json(); setArchived(Array.isArray(d)?d.filter(x=>x.status==="deleted"):[]);
  }catch(e){setArchived([]);}
 };
 useEffect(()=>{loadArchived();},[rows]);
 const blank={meetingDate:new Date().toISOString().slice(0,10),startTime:"",endTime:"",meetingType:"Managing Committee Meeting",meetingMode:"Online",meetingTitle:"",purpose:"",venue:"",onlineMeetingId:"",onlineMeetingLink:"",onlinePlatform:"Google Meet",organizer:"",presentMembers:"",absentMembers:"",onlineParticipants:"",offlineParticipants:"",attendance:"",attendanceSummary:"",attendanceSheetRef:"",agenda:"",decision:"",minutes:"",resolutionNo:"",resolutionStatus:"Passed",actionPoints:"",responsiblePersons:"",targetDate:"",supportingDocument:"",recordingRef:"",remarks:""};
 const [f,setF]=useState(blank);
 const [notice,setNotice]=useState(""),[editingId,setEditingId]=useState(null),[saving,setSaving]=useState(false);
 const permanentDelete=async function(id){
  if(!confirm("Permanently delete this archived meeting record? This cannot be undone."))return;
  try{
   const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id+"/permanent",{method:"DELETE",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"}});
   const out=await r.json().catch(()=>({}));
   if(!r.ok)throw new Error(out.message||"Permanent deletion failed.");
   setArchived(x=>x.filter(a=>a.id!==id));
   setNotice("Archived meeting record permanently deleted.");
  }catch(e){setNotice(e.message||"Permanent deletion failed.");}
 };
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const save=async e=>{
  e.preventDefault();
  if(saving)return;
  const title=String(f.meetingTitle||"").trim();
  const date=String(f.meetingDate||"").slice(0,10);
  const start=String(f.startTime||"").trim();
  const onlineId=String(f.onlineMeetingId||"").trim();
  if(!title){setNotice("Meeting Title required.");return;}
  if(!date){setNotice("Meeting Date required.");return;}
  const duplicate=(rows||[]).find(r=>{
   if(editingId&&String(r.id)===String(editingId))return false;
   if(r.module!=="meetingResolutions"||r.status==="deleted")return false;
   const d=r.data||{};
   const sameTitle=String(d.meetingTitle||"").trim().toLowerCase()===title.toLowerCase();
   const sameDate=String(d.meetingDate||r.recordDate||"").slice(0,10)===date;
   const savedStart=String(d.startTime||"").trim();
   const savedOnlineId=String(d.onlineMeetingId||"").trim();
   const sameTime=start?savedStart===start:!savedStart;
   const sameOnlineId=onlineId&&savedOnlineId?onlineId===savedOnlineId:false;
   return sameTitle&&sameDate&&(sameOnlineId||sameTime);
  });
  if(!editingId&&duplicate){setNotice("Duplicate meeting prevented. This meeting is already saved.");return;}
  setSaving(true);
  try{
   const payload={...f,date:f.meetingDate};
   const ok=editingId?await updateRecord(editingId,"meetingResolutions",payload):await add("meetingResolutions",{recordDate:f.meetingDate,recordType:f.meetingType,status:"active",data:payload});
   if(ok){setEditingId(null);setF({...blank,meetingDate:f.meetingDate});setNotice("Official meeting / resolution record saved.");}
  }finally{setSaving(false);}
 };
 const editRecord=r=>{const d=r.data||{};const date=String(d.meetingDate||r.recordDate||"").slice(0,10);setEditingId(r.id);setF({...blank,...d,meetingDate:date});setNotice("");window.scrollTo({top:0,behavior:"smooth"});};
 return <SimpleOfficeCard title="📜 Meeting & Resolution Register" subtitle="Online, Offline और Hybrid — सभी meetings के लिए एक ही complete official record format.">
  <div className="bg-white border rounded-2xl p-5">
   <div className="bg-[#FFF8E7] border border-[#E8D39A] rounded-xl p-4 mb-4 text-sm text-[#123B5D]"><b>Official Record:</b> Meeting mode के अनुसार Online / Offline / Hybrid details भरें. Meeting complete होने के बाद attendance, minutes, decisions और resolutions finalize करें.</div>
   <form onSubmit={save} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} className={cls} placeholder="Meeting Date"/>
    <input type="time" value={f.startTime} onChange={e=>set("startTime",e.target.value)} className={cls} placeholder="Start Time"/>
    <input type="time" value={f.endTime} onChange={e=>set("endTime",e.target.value)} className={cls} placeholder="End Time"/>
    <select value={f.meetingType} onChange={e=>set("meetingType",e.target.value)} className={cls}><option>General Body Meeting</option><option>Managing Committee Meeting</option><option>Special Meeting</option><option>Emergency Meeting</option><option>MoU / Collaboration Meeting</option><option>Project / Program Meeting</option><option>Other</option></select>
    <select value={f.meetingMode} onChange={e=>set("meetingMode",e.target.value)} className={cls}><option>Online</option><option>Offline</option><option>Hybrid</option></select>
    <input value={f.meetingTitle} onChange={e=>set("meetingTitle",e.target.value)} placeholder="Meeting Title" required className={cls}/>
    <input value={f.purpose} onChange={e=>set("purpose",e.target.value)} placeholder="Purpose / उद्देश्य" className={cls}/>
    {(f.meetingMode==="Offline"||f.meetingMode==="Hybrid")&&<input value={f.venue} onChange={e=>set("venue",e.target.value)} placeholder="Venue / Location" className={cls}/>}
    {(f.meetingMode==="Online"||f.meetingMode==="Hybrid")&&<><input value={f.onlineMeetingId} onChange={e=>set("onlineMeetingId",e.target.value)} placeholder="Online Meeting ID / Reference" className={cls}/><input value={f.onlineMeetingLink} onChange={e=>set("onlineMeetingLink",e.target.value)} placeholder="Online Meeting Ref. / Link" className={cls}/><select value={f.onlinePlatform} onChange={e=>set("onlinePlatform",e.target.value)} className={cls}><option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>Other</option></select></>}
    <input value={f.organizer} onChange={e=>set("organizer",e.target.value)} placeholder="Organizer / Host" className={cls}/>
    <textarea value={f.presentMembers} onChange={e=>set("presentMembers",e.target.value)} placeholder="Present Members" className={cls+" min-h-[80px]"}/>
    <textarea value={f.absentMembers} onChange={e=>set("absentMembers",e.target.value)} placeholder="Absent Members" className={cls+" min-h-[80px]"}/>
    {(f.meetingMode==="Online"||f.meetingMode==="Hybrid")&&<textarea value={f.onlineParticipants} onChange={e=>set("onlineParticipants",e.target.value)} placeholder="Online Participants / उपस्थित ऑनलाइन सदस्य" className={cls+" min-h-[80px]"}/>}
    {(f.meetingMode==="Offline"||f.meetingMode==="Hybrid")&&<textarea value={f.offlineParticipants} onChange={e=>set("offlineParticipants",e.target.value)} placeholder="Offline Participants / उपस्थित भौतिक सदस्य" className={cls+" min-h-[80px]"}/>}
    <textarea value={f.attendance} onChange={e=>set("attendance",e.target.value)} placeholder="Attendance Details" className={cls+" min-h-[80px]"}/>
    <input value={f.attendanceSummary} onChange={e=>set("attendanceSummary",e.target.value)} placeholder="Attendance Summary" className={cls}/>
    {(f.meetingMode==="Offline"||f.meetingMode==="Hybrid")&&<input value={f.attendanceSheetRef} onChange={e=>set("attendanceSheetRef",e.target.value)} placeholder="Attendance Sheet / Signature Ref." className={cls}/>}
    <textarea value={f.agenda} onChange={e=>set("agenda",e.target.value)} placeholder="Agenda / मुख्य एजेंडा" className={cls+" min-h-[100px]"}/>
    <textarea value={f.minutes} onChange={e=>set("minutes",e.target.value)} placeholder="Minutes / Proceedings / कार्यवाही" className={cls+" min-h-[110px]"}/>
    <textarea value={f.decision} onChange={e=>set("decision",e.target.value)} placeholder="Decisions / निर्णय" className={cls+" min-h-[100px]"}/>
    <input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No. (if applicable)" className={cls}/>
    <select value={f.resolutionStatus} onChange={e=>set("resolutionStatus",e.target.value)} className={cls}><option>Passed</option><option>Not Passed</option><option>Deferred</option><option>Not Applicable</option></select>
    <textarea value={f.actionPoints} onChange={e=>set("actionPoints",e.target.value)} placeholder="Action Points / जिम्मेदारी एवं अगला कार्य" className={cls+" min-h-[92px]"}/>
    <textarea value={f.responsiblePersons} onChange={e=>set("responsiblePersons",e.target.value)} placeholder="Responsible Person(s)" className={cls+" min-h-[80px]"}/>
    <input type="date" value={f.targetDate} onChange={e=>set("targetDate",e.target.value)} className={cls} placeholder="Target Date"/>
    <input value={f.supportingDocument} onChange={e=>set("supportingDocument",e.target.value)} placeholder="Supporting Document / File Reference" className={cls}/>
    {(f.meetingMode==="Online"||f.meetingMode==="Hybrid")&&<input value={f.recordingRef} onChange={e=>set("recordingRef",e.target.value)} placeholder="Recording / Online Reference" className={cls}/>}
    <textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls+" min-h-[80px]"}/>
    <button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-4 bg-[#123B5D] hover:bg-[#17665D] text-white py-3 rounded-xl font-bold transition disabled:opacity-50">{saving?"Saving…":editingId?"Update Official Meeting Record":"Save Official Meeting Record"}</button>
   </form>
  </div>
  {notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <div className="bg-[#FFF8E7] border border-[#E8D39A] rounded-2xl p-4">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div><div className="font-bold text-[#123B5D]">Archived Records / आर्काइव रिकॉर्ड</div><div className="text-sm text-[#1F7A70]">Archive किए गए meeting records यहाँ से वापस लाएँ.</div></div>
    <button type="button" onClick={loadArchived} className="px-4 py-2 rounded-lg bg-[#123B5D] text-white font-bold">Refresh Archived / आर्काइव रिफ्रेश</button>
   </div>
   <div className="mt-3 text-sm font-semibold">Found: {archived.length}</div>
   {archived.length>0&&<div className="mt-3 space-y-2">{archived.map(r=>{const d=r.data||{};return <div key={r.id} className="bg-white border rounded-xl p-3 flex flex-wrap items-center justify-between gap-3"><div><b>{d.meetingTitle||"Meeting Record"}</b><div className="text-sm text-zinc-600">{r.recordDate||d.meetingDate||"—"} · ID: {r.id}</div></div><div className="flex gap-2 flex-wrap">
 <button type="button" onClick={async()=>{if(restore){await restore(r.id);setArchived(x=>x.filter(a=>a.id!==r.id));}}} className="px-4 py-2 rounded-lg border border-[#1F7A70] text-[#1F7A70] font-bold">Restore / वापस लाएँ</button>
 <button type="button" onClick={()=>permanentDelete(r.id)} className="px-4 py-2 rounded-lg border border-red-200 text-red-700 font-bold">Delete Permanently / स्थायी रूप से हटाएँ</button>
</div></div>})}</div>}
  </div>
  <div className="bg-white border rounded-2xl overflow-auto"><table className="w-full text-sm min-w-[3200px]"><thead className="bg-zinc-50"><tr>{["Meeting Date","Time","Type","Mode","Meeting Title","Purpose","Venue / Location","Online Meeting ID","Online Ref. / Link","Platform","Organizer / Host","Present Members","Absent Members","Online Participants","Offline Participants","Attendance","Attendance Summary","Attendance Sheet / Signature Ref.","Agenda","Minutes / Proceedings","Decisions","Resolution No.","Resolution Status","Action Points","Responsible Person(s)","Target Date","Supporting Document","Recording / Online Ref.","Remarks","Action"].map(h=><th key={h} className="p-3 text-left whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y">
   {existing.sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate))).map(r=>{const d=r.data||{};return <tr key={r.id}>{[String(d.meetingDate||r.recordDate||"").slice(0,10),[d.startTime,d.endTime].filter(Boolean).join(" – "),d.meetingType||r.recordType,d.meetingMode,d.meetingTitle,d.purpose,d.venue,d.onlineMeetingId,d.onlineMeetingLink,d.onlinePlatform,d.organizer,d.presentMembers,d.absentMembers,d.onlineParticipants,d.offlineParticipants,d.attendance,d.attendanceSummary,d.attendanceSheetRef,d.agenda,d.minutes||d.details,d.decision,d.resolutionNo,d.resolutionStatus,d.actionPoints,d.responsiblePersons,d.targetDate,d.supportingDocument,d.recordingRef,d.remarks].map((v,i)=><td key={i} className="p-3 align-top max-w-[320px] whitespace-pre-wrap">{v||"—"}</td>)}<td className="p-3 align-top whitespace-nowrap"><button type="button" onClick={()=>editRecord(r)} className="px-3 py-1.5 rounded-lg border border-[#1F7A70] text-[#1F7A70] font-bold mr-2">Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}
   {!existing.length&&<tr><td colSpan="30" className="p-8 text-center text-zinc-500">No official meeting/resolution records yet.</td></tr>}
  </tbody></table></div>
 </SimpleOfficeCard>;
}

function ManagingCommittee({rows,add,archive,token}){
 const blank={memberId:"",memberType:"General Member",designation:"Member",customDesignation:"",fullName:"",fatherHusbandName:"",dob:"",occupation:"",gender:"",mobile:"",email:"",address:"",city:"",state:"",pinCode:"",aadhaar:"",pan:"",joiningDate:"",functionalResponsibility:"",status:"Active",effectiveFrom:"",validTill:"",appointmentDate:"",referenceNo:"",resolutionNo:"",meetingDate:"",responsibilities:"",remarks:""};
 const [f,setF]=useState(blank),[notice,setNotice]=useState(""),[saving,setSaving]=useState(false),[syncing,setSyncing]=useState(false);
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const designations=["President","Vice President","Secretary","Joint Secretary","Treasurer","Executive Committee Member","Member","Other / Custom"];
 const committeeRows=(rows||[]).filter(r=>r.module==="managingCommittee"&&r.status!=="deleted");
 const initialCommittee=[
  {memberId:"SSF-MBR-00001",memberType:"Founder Member",designation:"President",functionalResponsibility:"Chief Executive & External Relations",fullName:"Ramesh Pandey",occupation:"Farmer & Social Worker",gender:"Male",fatherHusbandName:"Mr. Babu Lal Pandey",mobile:"9718346691",email:"rameshpandey335@gmail.com",address:"Ward 1, Village Dadar, P.O. Rahat",city:"Rewa",state:"Madhya Pradesh",pinCode:"486446",aadhaar:"981164434991",pan:"BDHPP6053K",joiningDate:"2013-12-30",effectiveFrom:"2013-12-30",appointmentDate:"2013-12-30"},
  {memberId:"SSF-MBR-00014",memberType:"General Member",designation:"Vice President",functionalResponsibility:"Project Planning & Monitoring",fullName:"Preeti Shukla",occupation:"Homemaker & Student",gender:"Female",fatherHusbandName:"Mr. Deepak Shukla",mobile:"8085897964",email:"preetipandeydadar@gmail.com",address:"134/7, Gram Maidani, Shiva ji Nagar",city:"Rewa",state:"Madhya Pradesh",pinCode:"486001",aadhaar:"782500521163",pan:"ELVPP0526G",joiningDate:"2021-04-30",effectiveFrom:"2021-04-30",appointmentDate:"2021-04-30"},
  {memberId:"SSF-MBR-00002",memberType:"Founder Member",designation:"Secretary",functionalResponsibility:"Administration & Legal Compliance",fullName:"Amit Kumar Pandey",occupation:"Farmer & Business Owner",gender:"Male",fatherHusbandName:"Late. Ramji Pandey",mobile:"9009255202",email:"amitp203@gmail.com",address:"Village Dadar, Bankuiya road, P.O. Rahat",city:"Rewa",state:"Madhya Pradesh",pinCode:"486446",aadhaar:"254933650240",pan:"AWJPP7678Q",joiningDate:"2013-12-30",effectiveFrom:"2013-12-30",appointmentDate:"2013-12-30"},
  {memberId:"SSF-MBR-00003",memberType:"Founder Member",designation:"Treasurer",functionalResponsibility:"Finance & Accounts In-charge",fullName:"Divya Sharma",occupation:"Homemaker & Social Worker",gender:"Female",fatherHusbandName:"Mr. Abhimanyu Pandey",mobile:"9827263231",email:"divsharma067@gmail.com",address:"Village Dadar, Bankuiya road, P.O. Rahat",city:"Rewa",state:"Madhya Pradesh",pinCode:"486446",aadhaar:"847779690547",pan:"CXVPS7861P",joiningDate:"2013-12-30",effectiveFrom:"2013-12-30",appointmentDate:"2013-12-30"},
  {memberId:"SSF-MBR-00004",memberType:"Founder Member",designation:"Joint Secretary",functionalResponsibility:"IT, MIS & Digital Records",fullName:"Kiran Pandey",occupation:"Homemaker & Social Worker",gender:"Female",fatherHusbandName:"Mr. SriRam Pandey",mobile:"9993495877",email:"kiranpandey1729@gmail.com",address:"26/282, Ambedkar Nagar, Pokhri tola",city:"Rewa",state:"Madhya Pradesh",pinCode:"486005",aadhaar:"226523721653",pan:"CSVPP1024L",joiningDate:"2013-12-30",effectiveFrom:"2013-12-30",appointmentDate:"2013-12-30"},
  {memberId:"SSF-MBR-00015",memberType:"General Member",designation:"Executive Committee Member",functionalResponsibility:"Documentation Head (Admin In-charge)",fullName:"Sandeep Tripathi",occupation:"Teacher & Social Worker",gender:"Male",fatherHusbandName:"Mr. Indrabhan Tripathi",mobile:"7697851754",email:"tri.sandeep22@gmail.com",address:"Village Balha, Post Nayagaon",city:"Satna",state:"Madhya Pradesh",pinCode:"485221",aadhaar:"207987862530",pan:"BHUPT9347P",joiningDate:"2025-05-10",effectiveFrom:"2025-05-10",appointmentDate:"2025-05-10"},
  {memberId:"SSF-MBR-00016",memberType:"General Member",designation:"Member",functionalResponsibility:"Field Coordinator",fullName:"Prameesh Singh",occupation:"Fitness Trainer",gender:"Male",fatherHusbandName:"Mr. Yogendra Singh",mobile:"9144796001",email:"prameeshs321@gmail.com",address:"Village Khaira, Khaira",city:"Rewa",state:"Madhya Pradesh",pinCode:"486441",aadhaar:"515405012638",pan:"LCOPS6802F",joiningDate:"2025-05-10",effectiveFrom:"2025-05-10",appointmentDate:"2025-05-10"},
  {memberId:"SSF-MBR-00017",memberType:"General Member",designation:"Member",functionalResponsibility:"Volunteer Coordinator",fullName:"Rishi Kumar Pandey",occupation:"Private Employee",gender:"Male",fatherHusbandName:"Mr. Ganga Prasad",mobile:"7987707912",email:"rishisatna01@gmail.com",address:"Village-Post Kyoti",city:"Rewa",state:"Madhya Pradesh",pinCode:"486117",aadhaar:"343406596410",pan:"EZHPP3692D",joiningDate:"2025-05-10",effectiveFrom:"2025-05-10",appointmentDate:"2025-05-10"},
  {memberId:"SSF-MBR-00018",memberType:"General Member",designation:"Member",functionalResponsibility:"Media & Communication Coordinator",fullName:"Ritesh Kumar Tiwari",occupation:"Private Employee",gender:"Male",fatherHusbandName:"Mr. Ramchandra Tiwari",mobile:"8422819534",email:"riteshtiwari9082@gmail.com",address:"Village Jagannathpur, Sant Ravidas Nagar",city:"Bhadohi",state:"Uttar Pradesh",pinCode:"221303",aadhaar:"362732535435",pan:"AUVPT3345G",joiningDate:"2025-05-10",effectiveFrom:"2025-05-10",appointmentDate:"2025-05-10"}
 ];
 const seedCommitteeRecords=async()=>{if(!token||syncing)return;setSyncing(true);try{const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=managingCommittee",{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"}});if(!r.ok)throw new Error("Managing Committee records load failed.");const payload=await r.json();const existing=Array.isArray(payload)?payload:[];const existingIds=new Set(existing.map(x=>String((x.data||{}).memberId||"").trim()).filter(Boolean));let added=0;for(const member of initialCommittee){if(existingIds.has(member.memberId))continue;const data={...member,status:"Active",responsibilities:member.functionalResponsibility,referenceNo:"",resolutionNo:"",meetingDate:"",validTill:"",remarks:"Initial Managing Committee register entry",action:"Committee Member Register / Update"};const out=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS,{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"},body:JSON.stringify({module:"managingCommittee",recordDate:member.effectiveFrom,recordType:"Committee Member",status:"active",data})});const saved=await out.json().catch(()=>({}));if(!out.ok)throw new Error(saved.message||saved.detail||"Committee record save failed.");existingIds.add(member.memberId);added++;}const fresh=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=managingCommittee",{headers:{Authorization:"Bearer "+token,"Content-Type":"application/json"}});const freshRows=await fresh.json().catch(()=>[]);window.dispatchEvent(new CustomEvent("ssf-digital-office-refresh",{detail:{module:"managingCommittee",rows:Array.isArray(freshRows)?freshRows:[]}}));setNotice(added?added+" Managing Committee member record(s) added successfully.":"Managing Committee records already present; no duplicate entries added.");}catch(e){setNotice(e.message||"Managing Committee records could not be created.");}finally{setSyncing(false);}};
 useEffect(()=>{if(token)seedCommitteeRecords();},[token]);
 const timeline=[...committeeRows].sort((a,b)=>String((a.data||{}).effectiveFrom||a.recordDate||"").localeCompare(String((b.data||{}).effectiveFrom||b.recordDate||"")));
 const save=async e=>{e.preventDefault();if(saving)return;if(!f.fullName.trim()||!f.designation){setNotice("Name and designation are required.");return;}const role=f.designation==="Other / Custom"?f.customDesignation.trim():f.designation;if(!role){setNotice("Custom designation enter karein.");return;}const supplied=f.memberId.trim();if(supplied&&committeeRows.some(r=>String((r.data||{}).memberId||"").trim().toLowerCase()===supplied.toLowerCase())){setNotice("This Member ID already exists. Duplicate ID save nahi kiya gaya.");return;}const ids=committeeRows.map(r=>{const m=String((r.data||{}).memberId||"").match(/SSF-MBR-(\\d+)/i);return m?Number(m[1]):0;});const memberId=supplied||`SSF-MBR-${String(Math.max(0,...ids)+1).padStart(5,"0")}`;setSaving(true);const data={...f,designation:role,memberId,action:"Committee Member Register / Update"};delete data.customDesignation;const ok=await add("managingCommittee",{recordDate:f.effectiveFrom||new Date().toISOString().slice(0,10),recordType:"Committee Member",status:f.status.toLowerCase(),data});if(ok){setF(blank);setNotice("Committee member record saved. Future details can be added through Edit/update.");}setSaving(false);};
 const actionOrder=async action=>{if(!f.fullName.trim()||!f.memberId.trim()){setNotice("Member ID and name required.");return;}const status=["Resignation","Removal / Membership Cancellation","Replacement / Relieving"].includes(action)?"revoked":"active";await add("managingCommittee",{recordDate:f.effectiveFrom||new Date().toISOString().slice(0,10),recordType:action,status,data:{memberId:f.memberId.trim(),fullName:f.fullName.trim(),memberType:f.memberType,designation:f.designation==="Other / Custom"?f.customDesignation:f.designation,action,effectiveFrom:f.effectiveFrom,resolutionNo:f.resolutionNo,meetingDate:f.meetingDate,referenceNo:f.referenceNo,remarks:f.remarks}});setNotice(action+" recorded with history preserved.");};
 return <div className="space-y-5">
  <div className="bg-white border rounded-2xl overflow-hidden"><div className="bg-[#002344] text-white p-6"><div className="flex items-center gap-3"><FaUserTie className="text-2xl"/><div><h2 className="text-2xl font-black">प्रबंधकारिणी समिति (Managing Committee)</h2><p className="text-white/70 mt-1">Committee register, designation, term, role history, changes and governance references — without deleting historical records.</p></div></div></div><div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-50"><div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Total Records</div><div className="text-2xl font-black text-[#002344] mt-1">{committeeRows.length}</div></div><div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Active</div><div className="text-2xl font-black text-emerald-700 mt-1">{committeeRows.filter(r=>String(r.status).toLowerCase()==="active").length}</div></div><div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">Role Changes / Actions</div><div className="text-2xl font-black text-[#002344] mt-1">{committeeRows.filter(r=>(r.data||{}).action&&(r.data||{}).action!=="Committee Member Register / Update").length}</div></div><div className="bg-white border rounded-xl p-4"><div className="text-xs text-zinc-500 font-bold">History</div><div className="text-2xl font-black text-[#002344] mt-1">Preserved</div></div></div></div>
  {notice&&<div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
  <div className="bg-white border rounded-2xl overflow-hidden"><div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Committee Member Profile / Register</h3><p className="text-sm text-zinc-500 mt-1">Governance profile only. Membership fees, receipts and membership validity are maintained in Membership & Contribution Register.</p></div>
   <form onSubmit={save} className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <input value={f.memberId} onChange={e=>set("memberId",e.target.value)} placeholder="Member ID (auto if blank)" className={cls}/><select value={f.memberType} onChange={e=>set("memberType",e.target.value)} className={cls}><option>Founder Member</option><option>General Member</option><option>संरक्षक सदस्य</option><option>आजीवन सदस्य</option><option>साधारण सदस्य</option><option>सम्माननीय सदस्य</option></select><select value={f.designation} onChange={e=>set("designation",e.target.value)} className={cls}>{designations.map(x=><option key={x}>{x}</option>)}</select>{f.designation==="Other / Custom"&&<input value={f.customDesignation} onChange={e=>set("customDesignation",e.target.value)} placeholder="Custom Designation" required className={cls}/>}<input value={f.functionalResponsibility} onChange={e=>set("functionalResponsibility",e.target.value)} placeholder="Functional Responsibility" className={cls}/><input value={f.fullName} onChange={e=>set("fullName",e.target.value)} placeholder="Full Name" required className={cls}/><input value={f.occupation} onChange={e=>set("occupation",e.target.value)} placeholder="Occupation / Profession" className={cls}/><select value={f.gender} onChange={e=>set("gender",e.target.value)} className={cls}><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select><input value={f.fatherHusbandName} onChange={e=>set("fatherHusbandName",e.target.value)} placeholder="Father / Husband Name" className={cls}/><input type="date" value={f.dob} onChange={e=>set("dob",e.target.value)} title="Date of Birth" className={cls}/><input value={f.mobile} onChange={e=>set("mobile",e.target.value)} placeholder="Mobile No." className={cls}/><input value={f.email} onChange={e=>set("email",e.target.value)} placeholder="Email" className={cls}/><input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Address" className={cls}/><input value={f.city} onChange={e=>set("city",e.target.value)} placeholder="City" className={cls}/><input value={f.state} onChange={e=>set("state",e.target.value)} placeholder="State" className={cls}/><input value={f.pinCode} onChange={e=>set("pinCode",e.target.value)} placeholder="PIN Code" className={cls}/><input value={f.aadhaar} onChange={e=>set("aadhaar",e.target.value)} placeholder="Aadhaar (Optional)" className={cls}/><input value={f.pan} onChange={e=>set("pan",e.target.value)} placeholder="PAN (Optional)" className={cls}/><input type="date" value={f.joiningDate} onChange={e=>set("joiningDate",e.target.value)} title="Joining / Admission Date" className={cls}/><select value={f.status} onChange={e=>set("status",e.target.value)} className={cls}><option>Active</option><option>Ended</option><option>Role Changed</option><option>Resigned</option><option>Removed</option></select><input type="date" value={f.effectiveFrom} onChange={e=>set("effectiveFrom",e.target.value)} title="Committee Effective From" className={cls}/><input type="date" value={f.validTill} onChange={e=>set("validTill",e.target.value)} title="Committee Valid Till" className={cls}/><input type="date" value={f.appointmentDate} onChange={e=>set("appointmentDate",e.target.value)} title="Appointment / Selection Date" className={cls}/><input value={f.referenceNo} onChange={e=>set("referenceNo",e.target.value)} placeholder="Reference / File No." className={cls}/><input value={f.resolutionNo} onChange={e=>set("resolutionNo",e.target.value)} placeholder="Resolution No." className={cls}/><input type="date" value={f.meetingDate} onChange={e=>set("meetingDate",e.target.value)} title="Meeting Date" className={cls}/><textarea value={f.responsibilities} onChange={e=>set("responsibilities",e.target.value)} placeholder="Responsibilities / Duties" className={cls+" sm:col-span-2 lg:col-span-2 min-h-[90px]"}/><textarea value={f.remarks} onChange={e=>set("remarks",e.target.value)} placeholder="Remarks" className={cls+" sm:col-span-2 lg:col-span-2 min-h-[90px]"}/><button type="submit" disabled={saving} className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold disabled:opacity-50">{saving?"Saving…":"Save Committee Member Record"}</button>
   </form></div>
  <div className="bg-white border rounded-2xl p-5"><h3 className="text-xl font-black text-[#002344]">Governance Actions</h3><p className="text-sm text-zinc-500 mt-1">Role change, responsibility changes, resignation, removal and relieving are recorded as separate historical actions.</p><div className="flex flex-wrap gap-2 mt-4">{["Role Change / Transfer","Additional Responsibility","Responsibility Withdrawal","Resignation","Removal / Membership Cancellation","Replacement / Relieving"].map(action=><button type="button" key={action} onClick={()=>actionOrder(action)} className="border border-[#002344]/20 text-[#002344] px-4 py-2.5 rounded-xl font-bold hover:bg-zinc-50">{action}</button>)}</div><div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-zinc-700"><b>Governance workflow:</b> Meeting → Agenda → Attendance → Minutes → Resolution → Approval → Office Order → Committee Register update.</div><div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900"><b>Important:</b> Committee members are not deleted as simple records; historical governance actions remain preserved.</div></div>
  <div className="bg-white border rounded-2xl overflow-hidden"><div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">Committee Register & Complete History</h3><p className="text-sm text-zinc-500 mt-1">Appointment, role change and separation history can be maintained chronologically.</p></div><div className="p-5 space-y-3">{timeline.map(r=>{const d=r.data||{};return <div key={r.id} className="flex gap-3"><div className="w-24 shrink-0 text-xs font-black text-[#002344]">{d.effectiveFrom||r.recordDate||"Date unavailable"}</div><div className="relative flex-1 border-l-2 border-zinc-200 pl-5 pb-3"><div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#002344]"/><div className="bg-zinc-50 border rounded-xl p-4"><div className="font-black text-[#002344]">{d.fullName||"—"} · {d.designation||"—"}</div><div className="text-sm mt-1">{d.action||"Committee Member Register / Update"} · Status: {r.status}</div><div className="text-xs text-zinc-500 mt-2">Resolution: {d.resolutionNo||"—"} · Meeting: {d.meetingDate||"—"} · Reference: {d.referenceNo||"—"}</div></div></div></div>})}{!timeline.length&&<div className="p-8 text-center text-zinc-500">No committee records yet.</div>}</div>
   <div className="overflow-auto border-t"><table className="w-full text-sm min-w-[2500px]"><thead className="bg-zinc-50"><tr><th className="p-3 text-left">Member ID</th><th className="p-3 text-left">Member Type</th><th className="p-3 text-left">Organization Role</th><th className="p-3 text-left">Functional Responsibility</th><th className="p-3 text-left">Full Name</th><th className="p-3 text-left">Occupation / Profession</th><th className="p-3 text-left">Gender</th><th className="p-3 text-left">Father / Husband Name</th><th className="p-3 text-left">Mobile No.</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Address</th><th className="p-3 text-left">City</th><th className="p-3 text-left">State</th><th className="p-3 text-left">PIN Code</th><th className="p-3 text-left">Aadhaar (Optional)</th><th className="p-3 text-left">PAN (Optional)</th><th className="p-3 text-left">Joining / Admission Date</th><th className="p-3 text-left">Committee From</th><th className="p-3 text-left">Committee Till</th><th className="p-3 text-left">Committee Status</th><th className="p-3 text-left">Appointment / Selection Date</th><th className="p-3 text-left">Reference / File No.</th><th className="p-3 text-left">Resolution No.</th><th className="p-3 text-left">Meeting Date</th><th className="p-3 text-left">Responsibilities / Duties</th><th className="p-3 text-left">Action / Role History</th><th className="p-3 text-left">Remarks</th><th className="p-3 text-left">Action</th></tr></thead><tbody className="divide-y">{committeeRows.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 font-bold">{d.memberId||"—"}</td><td className="p-3">{d.memberType||"—"}</td><td className="p-3 font-bold">{d.designation||"—"}</td><td className="p-3">{d.functionalResponsibility||"—"}</td><td className="p-3 font-bold">{d.fullName||"—"}</td><td className="p-3">{d.occupation||"—"}</td><td className="p-3">{d.gender||"—"}</td><td className="p-3">{d.fatherHusbandName||"—"}</td><td className="p-3">{d.mobile||"—"}</td><td className="p-3">{d.email||"—"}</td><td className="p-3">{d.address||"—"}</td><td className="p-3">{d.city||"—"}</td><td className="p-3">{d.state||"—"}</td><td className="p-3">{d.pinCode||"—"}</td><td className="p-3">{d.aadhaar||"—"}</td><td className="p-3">{d.pan||"—"}</td><td className="p-3">{d.joiningDate||"—"}</td><td className="p-3">{d.effectiveFrom||"—"}</td><td className="p-3">{d.validTill||"—"}</td><td className="p-3">{d.status||"—"}</td><td className="p-3">{d.appointmentDate||"—"}</td><td className="p-3">{d.referenceNo||"—"}</td><td className="p-3">{d.resolutionNo||"—"}</td><td className="p-3">{d.meetingDate||"—"}</td><td className="p-3">{d.responsibilities||"—"}</td><td className="p-3">{d.action||"Committee Member Register / Update"}</td><td className="p-3">{d.remarks||"—"}</td><td className="p-3"><button type="button" onClick={()=>archive(r.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 font-bold hover:bg-red-50">Archive</button></td></tr>})}{!committeeRows.length&&<tr><td colSpan="28" className="p-8 text-center text-zinc-500">No committee records yet.</td></tr>}</tbody></table></div>
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
{/* deployment sync marker: SSF Digital Office archived-record permanent delete UI */}
