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
   <DownloadCenter active={active} rows={rows} exportRows={exportRows} exportExcel={exportExcel} exportPdf={exportPdf} setActive={setActive} token={token}/>
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
    {active==="separations"&&<SeparationManagement rows={rows} add={add}/>}
    {active==="notifications"&&<NotificationsHub token={token} rows={rows} add={add} archive={archive}/>}
    {active==="reports"&&<Reports token={token} exportRows={exportRows} exportPdf={exportPdf}/>}
    {active==="audit"&&<Audit token={token}/>}
    {active==="users"&&<Users add={add}/>}
    {!["dashboard","reports","audit","users","appointmentLetters","officialDocuments","donorSlips","separations","members","institutionalHistory","officeHistory","membershipContributions","meetings","meetingCalendar","onlineMeetings","meetingResolution","notifications"].includes(active)&&<Register module={active} rows={rows} loading={loading} search={search} setSearch={setSearch} add={add} archive={archive}/>}
   </main>
  </div>
 </div></div>;
}
function NotificationsHub({token,rows,add,archive}){
 const [tab,setTab]=useState("information");
 const [showForm,setShowForm]=useState(false);
 const [members,setMembers]=useState([]);
 useEffect(()=>{
  if(!token)return;
  const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const loadRecipients=async()=>{
   try{
    const mr=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=members",{headers});
    const md=mr.ok?await mr.json():[];
    const memberRows=Array.isArray(md)?md:(Array.isArray(md.records)?md.records:[]);
    if(memberRows.length){setMembers(memberRows);return;}
    const cr=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module=managingCommittee",{headers});
    const cd=cr.ok?await cr.json():[];
    const committeeRows=Array.isArray(cd)?cd:(Array.isArray(cd.records)?cd.records:[]);
    setMembers(committeeRows);
   }catch(_){setMembers([]);}
  };
  loadRecipients();
 },[token]);
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
 const countStage=key=>allRows.filter(r=>(typeMap[key]||[]).includes(String((r.data||{}).noticeStage||""))).length;
 const pending=allRows.filter(r=>["pending","active"].includes(String(r.status||"").toLowerCase())).length;
 const followups=allRows.filter(r=>{const d=r.data||{};return d.followUpDate&&String(r.status||"").toLowerCase()!=="closed"&&String(r.status||"").toLowerCase()!=="archived";}).length;
 const notices=countStage("notice");
 const activeTab=tabs.find(t=>t[0]===tab)||tabs[0];
 const filtered=allRows.filter(r=>(typeMap[tab]||[]).includes(String((r.data||{}).noticeStage||"")));
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

  {showForm&&<div className="bg-white border rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b flex items-center justify-between"><div><div className="font-black text-[#002344]">New Communication / नई सूचना</div><div className="text-xs text-zinc-500 mt-1">{activeTab[1]}</div></div><button type="button" onClick={()=>setShowForm(false)} className="text-zinc-500 hover:text-zinc-900 font-bold">Close</button></div><NotificationForm members={members} types={typeMap[tab]} onSave={async d=>{if(!d){setShowForm(false);return;}const ok=await add("notifications",d);if(ok)setShowForm(false);}}/></div>}

  <div className="bg-zinc-50 border rounded-2xl p-4 sm:p-5">
   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div><h2 className="font-black text-[#002344]">{activeTab[1]}</h2><p className="text-xs text-zinc-500 mt-1">{activeTab[2]}</p></div><div className="text-sm font-bold text-zinc-500">{filtered.length} record(s)</div></div>
   <div className="grid sm:grid-cols-3 gap-3 mt-4">
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">SECTION RECORDS</div><div className="text-xl font-black text-[#002344] mt-1">{filtered.length}</div></div>
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">ACTIVE</div><div className="text-xl font-black text-emerald-600 mt-1">{filtered.filter(r=>String(r.status||"").toLowerCase()==="active").length}</div></div>
    <div className="bg-white border rounded-xl p-3"><div className="text-xs text-zinc-500 font-bold">PENDING</div><div className="text-xl font-black text-amber-600 mt-1">{filtered.filter(r=>String(r.status||"").toLowerCase()==="pending").length}</div></div>
   </div>
  </div>

  <NotificationRegister tab={tab} rows={filtered} add={add} archive={archive} types={typeMap[tab]||[]} members={members}/>
 </div>;
}
function NotificationRegister({tab,rows,add,archive,types,members=[]}){
 const [open,setOpen]=useState(false),[search,setSearch]=useState(""),[status,setStatus]=useState("all");
 const filtered=(rows||[]).filter(r=>{const d=r.data||{},q=search.toLowerCase(),hay=[r.recordId,r.recordDate,d.name,d.role,d.subject,d.details,d.noticeStage,d.channel].join(" ").toLowerCase();return (!q||hay.includes(q))&&(status==="all"||String(r.status||"").toLowerCase()===status);});
 const title=tab==="information"?"Information & Communication / सूचना एवं संचार":tab==="response"?"Response & Participation / प्रतिक्रिया एवं सहभागिता":tab==="followup"?"Reminder & Follow-up / अनुस्मारक एवं अनुवर्ती कार्य":"Notice & Explanation / नोटिस एवं स्पष्टीकरण";
 return <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-5 sm:p-7 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344]">{title}</h2><p className="text-sm text-zinc-500 mt-1">{filtered.length} record(s) · secure database</p></div><div className="flex flex-wrap gap-2 items-center"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search person / subject / ID" className="px-3 py-2.5 border rounded-xl w-56"/><select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="closed">Closed</option><option value="archived">Archived</option></select><button onClick={()=>setOpen(!open)} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus/> Add</button></div></div>{open&&<NotificationForm members={members} types={types} onSave={async d=>{if(!d){setOpen(false);return;}const ok=await add("notifications",d);if(ok)setOpen(false);}}/>}<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Person / Role</th><th className="p-3">Matter</th><th className="p-3">Response / Action</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead><tbody className="divide-y">{filtered.length===0?<tr><td colSpan="7" className="p-10 text-center text-zinc-400">No records yet.</td></tr>:filtered.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td><td className="p-3 whitespace-nowrap">{new Date(r.recordDate).toLocaleDateString("en-IN")}</td><td className="p-3"><b>{d.recipientCount?String(d.recipientCount)+" recipient(s)":(d.name||"—")}</b><div className="text-xs text-zinc-400">{Array.isArray(d.recipients)&&d.recipients.length?d.recipients.slice(0,2).map(x=>x.name).filter(Boolean).join(", ")+(d.recipients.length>2?" + more":""):(d.role||"")}</div></td><td className="p-3 min-w-[260px]"><b>{d.noticeStage||"—"}</b><div className="text-xs text-zinc-400 mt-1">{d.subject||d.details||""}</div></td><td className="p-3">{d.responseStatus||d.responseDetails||d.followUpResult||"—"}</td><td className="p-3">{r.status}</td><td className="p-3 text-right"><button onClick={()=>archive(r.id)} className="text-xs font-bold text-red-600">Archive</button></td></tr>})}</tbody></table></div></div>;
}
function NotificationForm({types,onSave,members=[]}){
 const [f,setF]=useState({date:new Date().toISOString().slice(0,10),selectedMemberIds:[],name:"",role:"",mobile:"",email:"",noticeStage:types[0]||"",subject:"",details:"",channel:"WhatsApp",expectedAction:"",expectedDate:"",responseStatus:"Not Applicable",responseDate:"",responseDetails:"",participationStatus:"Not Applicable",followUpDate:"",followUpResult:"",status:"active",relatedRecordId:"",evidenceRef:""});
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const toggleMember=id=>set("selectedMemberIds",f.selectedMemberIds.includes(id)?f.selectedMemberIds.filter(x=>x!==id):[...f.selectedMemberIds,id]);
 const selected=members.filter(r=>f.selectedMemberIds.includes(r.id)).map(r=>{const d=r.data||{};return {memberId:r.recordId||r.id,name:d.fullName||d.name||"",role:d.designation||d.organizationRole||d.role||"",mobile:d.mobile||d.mobileNo||"",email:d.email||""};});
 const allSelected=members.length>0&&selected.length===members.length;
 const selectAll=()=>set("selectedMemberIds",allSelected?[]:members.map(r=>r.id));
 const recipients=()=>selected.length?selected:[{memberId:"manual",name:f.name,role:f.role,mobile:f.mobile,email:f.email}];
 const message=()=>[f.subject&&("Subject: "+f.subject),f.details,f.expectedAction&&("Expected Action: "+f.expectedAction),f.expectedDate&&("Expected Date: "+f.expectedDate),f.followUpDate&&("Follow-up Date: "+f.followUpDate)].filter(Boolean).join("\n");
 const sendWhatsApp=()=>{const rs=recipients().filter(x=>x.mobile);if(!rs.length){alert("Mobile number is required.");return;}rs.forEach((x,i)=>setTimeout(()=>window.open("https://wa.me/"+String(x.mobile).replace(/\D/g,"")+"?text="+encodeURIComponent(message()),"_blank","noopener,noreferrer"),i*250));};
 const sendEmail=()=>{const rs=recipients().filter(x=>x.email);if(!rs.length){alert("Email address is required.");return;}window.location.href="mailto:"+rs.map(x=>x.email).join(",")+"?subject="+encodeURIComponent(f.subject||"SSF Official Communication")+"&body="+encodeURIComponent(message());};
 const sendBoth=()=>{sendWhatsApp();if(recipients().some(x=>x.email))setTimeout(sendEmail,700);};
 const handleSubmit=e=>{e.preventDefault();const rs=recipients();if(!rs.length||!rs[0].name){alert("Please select member(s) or enter a manual recipient.");return;}if(!rs.some(x=>x.mobile||x.email)){alert("At least one Mobile or Email is required.");return;}onSave({recordDate:f.date,recordType:f.noticeStage,status:f.status,data:{...f,recipients:rs,recipientCount:rs.length,sendAction:"Saved communication record"}});};
 const input=(k,p,req=false)=><input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={p} required={req} className={cls}/>;
 const area=(k,p)=><textarea value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={p} className={cls+" min-h-[90px]"}/>;
 return <form onSubmit={handleSubmit} className="p-5 bg-zinc-50 border-b space-y-4">
  <div className="rounded-2xl border bg-white p-4"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3"><div className="font-black text-[#002344]">Recipients / प्राप्तकर्ता</div>{members.length>0&&<button type="button" onClick={selectAll} className="border px-3 py-2 rounded-lg text-sm font-bold">{allSelected?"Unselect All":"Select All Members"}</button>}</div>
   {members.length>0&&<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">{members.map(r=>{const d=r.data||{},name=d.fullName||d.name||r.recordId,role=d.designation||d.organizationRole||d.role||"";return <label key={r.id} className={"flex items-center gap-3 p-3 rounded-xl border cursor-pointer "+(f.selectedMemberIds.includes(r.id)?"bg-blue-50 border-blue-300":"bg-zinc-50")}><input type="checkbox" checked={f.selectedMemberIds.includes(r.id)} onChange={()=>toggleMember(r.id)}/><span><b>{name}</b><span className="block text-xs text-zinc-500">{role}</span></span></label>})}</div>}
   <div className="text-xs text-zinc-500 mt-3">Existing members select करें. किसी बाहरी व्यक्ति के लिए Manual Recipient भरें.</div>
   <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">{input("name","Manual Name / नाम")}{input("role","Role / Position")}{input("mobile","Manual Mobile / WhatsApp")}{input("email","Manual Email")}</div>
  </div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
   {input("date","Date",true)}<select value={f.noticeStage} onChange={e=>set("noticeStage",e.target.value)} className={cls}>{types.map(x=><option key={x}>{x}</option>)}</select>{input("subject","Subject / Matter",true)}<select value={f.channel} onChange={e=>set("channel",e.target.value)} className={cls}><option>WhatsApp</option><option>Email</option><option>WhatsApp + Email</option><option>Phone</option><option>Meeting</option><option>Letter</option><option>Other</option></select>
   {input("expectedAction","Expected Response / Action")}{input("expectedDate","Expected Date")}<select value={f.responseStatus} onChange={e=>set("responseStatus",e.target.value)} className={cls}><option>Not Applicable</option><option>Response Received</option><option>No Response</option><option>Partial Response</option></select><select value={f.participationStatus} onChange={e=>set("participationStatus",e.target.value)} className={cls}><option>Not Applicable</option><option>Present</option><option>Absent</option><option>Online Not Joined</option><option>Late</option><option>Task Not Completed</option><option>No Response</option></select>
   {input("responseDate","Response / Explanation Date")}{input("followUpDate","Follow-up Date")}{input("relatedRecordId","Related Meeting / Record ID")}{input("evidenceRef","Evidence / Document Reference")}
   <div className="sm:col-span-2 lg:col-span-4">{area("details","Notice / Message / Details")}</div><div className="sm:col-span-2 lg:col-span-4">{area("responseDetails","Response / Explanation / Follow-up Result")}</div>
  </div>
  <div className="flex flex-wrap gap-2 items-center border-t pt-4"><button type="button" onClick={sendWhatsApp} className="bg-green-600 text-white px-4 py-3 rounded-xl font-bold">Send WhatsApp</button><button type="button" onClick={sendEmail} className="bg-[#123B5D] text-white px-4 py-3 rounded-xl font-bold">Send Email</button><button type="button" onClick={sendBoth} className="bg-[#002344] text-white px-4 py-3 rounded-xl font-bold">Send WhatsApp + Email</button><button type="submit" className="border border-[#123B5D] text-[#123B5D] px-5 py-3 rounded-xl font-bold">Save Record</button><button type="button" onClick={()=>onSave(null)} className="border px-5 py-3 rounded-xl font-bold">Cancel</button><span className="text-xs text-zinc-500 w-full">Selected members को एक साथ prepare किया जाएगा; browser/WhatsApp या email app में final Send करना होगा.</span></div>
 </form>;
}