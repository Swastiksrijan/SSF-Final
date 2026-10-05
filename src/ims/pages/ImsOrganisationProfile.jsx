// SSF-IMS Institution Profile & Compliance.
// The InstitutionalHistory component below is the EXACT component from the old
// SSF Digital Office (src/pages/SSFDigitalOffice.jsx, function InstitutionalHistory) —
// same JSX, same classes, same 10-section sidebar, tabs, colours and data shape
// (record.module / record.data.*). The only additions are: the ImsLayout wrapper,
// the imports it needs, and a thin adapter that maps the new backend to the old
// record contract. Bilingual (English + Hindi already in the component).
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import ImsLayout from '../ImsLayout';
import { useLang } from '../LangContext';
import { ims } from '../api';
import { API_BASE_URL, ENDPOINTS } from '../../config/api';

const TOKEN_KEY = 'ssf_admin_token';
const cls = "w-full px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20";

const formatOfficeDate=function(value){ if(!value)return "—";
 const s=String(value);
 const m=s.match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
 if(m)return m[3]+"-"+m[2]+"-"+m[1];
 const d=new Date(value);
 return Number.isNaN(d.getTime())?s:d.toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"});
};

function SimpleOfficeCard({title,subtitle,children}){return <div className="space-y-5"><div className="bg-[#002344] text-white rounded-2xl p-6"><h2 className="text-2xl font-black">{title}</h2><p className="text-white/70 mt-1">{subtitle}</p></div>{children}</div>}

// The old component carries a member-photo helper that was never reachable from
// this section; these stubs keep that dead code harmless without editing the
// verbatim function body.
const token = (typeof localStorage !== 'undefined' && localStorage.getItem(TOKEN_KEY)) || "";
const editId = null;
const photoFile = null;
const setPhotoFile = () => {};
const setPhotoPreview = () => {};
const setPhotoOverrides = () => {};

// ---- adapter: new backend <-> old record contract --------------------------
function toOldRecord(r){
  const d=(r.data&&typeof r.data==="object"&&Object.keys(r.data).length)?r.data:{};
  return { id:r.id, recordId:r.recordId, module:"institutionalHistory", recordType:r.recordType,
    recordDate:r.recordDate, status:r.status, data:{ section:r.section||d.section||"", sectionName:r.sectionName||d.sectionName||"", ...d } };
}
const imsInstRows=async()=>{
  const d=await ims.list("institutionalHistory",{limit:500});
  return (d.records||[]).map(toOldRecord);
};
const imsInstAdd=async(module,payload)=>{
  try{ await ims.create("institutionalHistory",{recordDate:payload.recordDate,recordType:payload.recordType,status:payload.status,data:payload.data},true); return true; }
  catch{ return false; }
};
const imsInstUpdate=async(id,module,data)=>{
  try{ await ims.update("institutionalHistory",id,{recordDate:data.recordDate,recordType:data.recordType,data:data}); return true; }
  catch{ return false; }
};
const imsInstArchive=async(id)=>{
  try{ await ims.archive("institutionalHistory",id); return true; }catch{ return false; }
};

// ===========================================================================
// InstitutionalHistory — copied verbatim from SSFDigitalOffice.jsx
// ===========================================================================
function InstitutionalHistory({rows,add,updateRecord,archive}) {
 const seed={
  profile:{organizationName:"Swastik Srijan Foundation Samiti",shortName:"SSF",registrationNumber:"05/22/03/11448/13",registrationDate:"30-12-2013",registrationAct:"MP Society Act 1973",organizationType:"Society",operationalScope:"Pan India",address:"Ward No. 1, Dadar, Post Rahat, Dist. Rewa",city:"Rewa",state:"Madhya Pradesh",pinCode:"486446",mobile:"9718346691",email:"swastiksrijanfoundation@gmail.com",website:"www.swastiksrijan.in"},
  objectives:{vision:"An inclusive, educated, healthy, self-reliant and harmonious society where every person can live with dignity, equal opportunity and the ability to participate in sustainable development.",mission:"To work across India for education, health and well-being, livelihood and self-reliance, women and child empowerment, rural development, environmental protection and social awareness through community participation, capacity building, lawful partnerships and transparent organisational practices.",objectives:"Promote education and skill development; improve health, nutrition and well-being; support women, children, elderly persons and persons with disabilities; strengthen rural development, livelihoods, agriculture and self-reliance; promote environmental and natural-resource conservation; encourage social harmony, ethical values, equality and responsible citizenship; support lawful government and institutional programmes aligned with the Foundation's objectives.",coreValues:"Humanity & Truth; Equality & Dignity; Social Harmony; Responsibility; Transparency; Community Participation; Service with Integrity",areasOfWork:"Education & Skill Development; Health, Nutrition & Wellness; Women & Child Welfare; Rural Development & Livelihood; Agriculture, Organic Farming & Animal Welfare; Environment, Tree Plantation & Natural Resource Conservation; Disability Support & Rehabilitation; Youth & Community Development; Social Awareness, Ethical Values & Social Harmony",targetBeneficiaries:"Children; women; elderly persons; persons with disabilities; farmers; rural and economically disadvantaged communities; tribal, backward, remote and underserved communities; youth; families and other persons needing lawful social support.",statesDistricts:"All India / Pan India"},
  legal:{registrationNumber:"05/22/03/11448/13",registrationDate:"30-12-2013",registrationAct:"Madhya Pradesh Societies Registration Act, 1973",district:"Rewa",state:"Madhya Pradesh",pan:"AAKAS7123H",governingDocument:"Memorandum / Rules & Regulations (Niyamavali) of Swastik Srijan Foundation Samiti",amendmentHistory:"To be updated from registered amendment records, if any."},
  tax:{pan:"AAKAS7123H",twelveAB:"AAKAS7123H25BP01",twelveABStatus:"Available / Registered",eightyG:"AAKAS7123HF20231",eightyGStatus:"Provisional / final status to be updated from current certificate/order",assessmentYear:"2025-26",incomeTaxFiling:"To be updated from filed return / acknowledgement records",effectiveDates:"To be updated from respective registration / approval documents"},
  darpan:{ngoDarpanId:"MP/2017/0169529",darpanStatus:"Active",csr1Number:"CSR00093974",csrStatus:"Registered",mcaCsrRecords:"CSR-1 registered. No CSR funding received by the Foundation is to be recorded unless supported by actual documents."},
  governance:{president:"Ramesh Pandey",secretary:"Amit Kumar Pandey",treasurer:"Divya Sharma",vicePresident:"Preeti Shukla",jointSecretary:"Kiran Pandey",members:"Sandeep Tripathi; Prameesh Singh; Rishi Kumar Pandey; Ritesh Kumar Tiwari",rolesTenure:"Governing Body structure as per registered Niyamavali: President, Vice President, Secretary, Treasurer, Joint Secretary and Members. Committee tenure and appointment references should be updated from approved resolutions/records."},
  finance:{financialYear:"2025-26",bankName:"Union Bank of India",branch:"Transport Nagar, Rewa",accountNumber:"481401010036579",ifsc:"UBIN0548146",upi:"9718346691@ptyes",auditorName:"CA Kapil Tiwari",auditorContact:"8527067812",booksStatus:"Audited accounts and supporting records are maintained as available. FY 2025-26 internal reconciliation / record completion can be updated here with audit references."},
  government:{udyam:"UDYAM-MP-38-0042763",msmeType:"Micro (2025-26), Services",udyogAadhaar:"MP38D0003317",esic:"81000588360001399",epfo:"MPJBP3643700000",digitalIndia:"REG2025070722444819",ncsEmployerId:"F7900E570628",ncsOrganizationId:"P20G74-0022474929830",lin:"1-2984-2321-4",mpJanAbhiyan:"NV2022REW0004",startupRegistration:"OI-0825-9266HS"},
  calendar:{complianceName:"Annual statutory / regulatory filings and renewals",authority:"Registrar / Income Tax / NGO Darpan / MCA or other applicable authority",dueDate:"",financialYear:"2025-26",status:"Pending — update each compliance item with its actual due date and filing acknowledgement",filingDate:"",acknowledgement:"",responsiblePerson:"Secretary / authorised compliance person",remarks:"Create separate calendar records for each applicable filing, renewal, notice or compliance event."},
  history:{date:new Date().toISOString().slice(0,10),eventType:"Institution Formation / Compliance Record",title:"Swastik Srijan Foundation Samiti — Institutional Profile",referenceNo:"05/22/03/11448/13",description:"Registered on 30-12-2013 under the Madhya Pradesh Societies Registration Act, 1973. Institutional profile and compliance records are maintained in SSF Digital Office.",supportingDocument:"Registered Rules / Niyamavali; Registration Certificate; statutory certificates and filings",remarks:"Add future amendments, registrations, notices, renewals, certificates and compliance events here with their source documents."}
 };
 const labels=[
  ["profile","🏢 Organization Profile / संस्था परिचय"],
  ["objectives","🎯 Objectives & Areas of Work / उद्देश्य एवं कार्यक्षेत्र"],
  ["legal","⚖️ Legal Registration & Identity / कानूनी पंजीकरण"],
  ["tax","🧾 Tax & Exemption / कर एवं छूट अनुपालन"],
  ["darpan","🏛️ NGO Darpan & CSR / NGO दर्पण एवं CSR"],
  ["governance","👥 Governance & Office Bearers / शासन एवं पदाधिकारी"],
  ["finance","🏦 Financial & Banking Profile / वित्तीय एवं बैंकिंग विवरण"],
  ["government","🏛️ Government & Institutional Registrations / शासकीय एवं संस्थागत पंजीकरण"],
  ["calendar","📅 Compliance Calendar / अनुपालन कैलेंडर"],
  ["history","📁 Documents & Compliance History / दस्तावेज़ एवं अनुपालन इतिहास"]
 ];
 const existing=(rows||[]).filter(r=>r.module==="institutionalHistory"&&r.status!=="deleted");
 const multiRecordTabs=new Set(["calendar","history"]);
 const [tab,setTab]=useState("profile"),[editingId,setEditingId]=useState(null),[form,setForm]=useState(seed.profile),[saving,setSaving]=useState(false),[notice,setNotice]=useState("");
 const sectionRows=existing.filter(r=>(r.data||{}).section===tab);
 useEffect(()=>{
  if(multiRecordTabs.has(tab)){
   if(!editingId)setForm({...seed[tab]});
  }else{
   const r=sectionRows[0];
   if(r){setEditingId(r.id);setForm({...seed[tab],...(r.data||{})});}
   else{setEditingId(null);setForm({...seed[tab]});}
  }
  setNotice("");
 },[tab,rows]);
 const set=(k,v)=>setForm(x=>({...x,[k]:v}));
 const photoSrc=p=>p?(String(p).startsWith("http")?String(p):API_BASE_URL+String(p)):"";
 const choosePhoto=e=>{const f=e.target.files?.[0];if(!f)return;if(!["image/jpeg","image/png","image/webp"].includes(f.type)){setNotice("Photo must be JPG, PNG or WebP.");e.target.value="";return;}if(f.size>2*1024*1024){setNotice("Photo must be 2MB or smaller.");e.target.value="";return;}setPhotoFile(f);setPhotoPreview(URL.createObjectURL(f));};
 const clearPhoto=()=>{setPhotoFile(null);setPhotoPreview("");};
 const savePhoto=async()=>{
  if(!editId||!photoFile||saving)return;
  setSaving(true);
  try{
   const fd=new FormData();
   fd.append("profilePhoto",photoFile);
   fd.append("memberId",String(form.memberId||""));
   fd.append("fullName",String(form.fullName||""));
   fd.append("sourceModule","managingCommittee");
   fd.append("recordId",String(editId));
   const pr=await fetch(ENDPOINTS.DIGITAL_OFFICE_MEMBER_PHOTO,{method:"POST",headers:{Authorization:`Bearer ${token}`,"X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"},body:fd});
   const pj=await pr.json().catch(()=>({}));
   if(!pr.ok)throw new Error(pj.message||"Photo upload failed.");
   const saved=pj.photoUrl||"";
   if(saved&&form.memberId)setPhotoOverrides(x=>({...x,[String(form.memberId)]:saved}));
   setPhotoFile(null);
   setPhotoPreview(saved);
   setNotice("Photo saved successfully. Refresh/reload ke baad bhi photo rahegi.");
  }catch(e){
   setNotice(e.message||"Photo save failed.");
  }finally{
   setSaving(false);
  }
 };
 const resetSectionForm=()=>{setEditingId(null);setForm({...seed[tab]});};
 const save=async e=>{
  e.preventDefault();
  setSaving(true);
  const data={section:tab,sectionName:labels.find(x=>x[0]===tab)?.[1]||tab,...form};
  const isMulti=multiRecordTabs.has(tab);
  const ok=editingId
   ? await updateRecord(editingId,"institutionalHistory",data)
   : await add("institutionalHistory",{recordDate:form.date||new Date().toISOString().slice(0,10),recordType:tab==="calendar"?(form.complianceName||"Compliance Calendar"):(form.eventType||"Compliance History"),status:"active",data});
  setSaving(false);
  if(ok){
   setNotice(editingId?"Record updated successfully.":"Record saved successfully.");
   if(isMulti)resetSectionForm();
  }
 };
 const field=(key,label,wide=false,type="text")=><div className={wide?"sm:col-span-2 lg:col-span-4":"sm:col-span-1"}><label className="block text-sm font-bold text-[#123B5D] mb-1">{label}</label>{type==="textarea"?<textarea value={form[key]??""} onChange={e=>set(key,e.target.value)} className={cls+" min-h-[95px]"} />:<input type={type} value={form[key]??""} onChange={e=>set(key,e.target.value)} className={cls}/>}</div>;
 const renderFields=()=>{
  if(tab==="profile")return <>{field("organizationName","Organization Name")}{field("shortName","Short Name")}{field("registrationNumber","Registration Number")}{field("registrationDate","Registration Date")}{field("registrationAct","Registration Act")}{field("organizationType","Organization Type")}{field("operationalScope","Operational Scope")}{field("address","Address",true)}{field("city","City")}{field("state","State")}{field("pinCode","PIN Code")}{field("mobile","Mobile Number")}{field("email","Email")}{field("website","Website")}</>;
  if(tab==="objectives")return <>{field("vision","Vision / दृष्टि",true,"textarea")}{field("mission","Mission / मिशन",true,"textarea")}{field("coreValues","Core Values / मूल मूल्य",true,"textarea")}{field("objectives","Core Objectives / मुख्य उद्देश्य",true,"textarea")}{field("areasOfWork","Areas of Work / कार्यक्षेत्र",true,"textarea")}{field("targetBeneficiaries","Target Beneficiaries / लक्षित समूह",true,"textarea")}{field("statesDistricts","States / Districts / Operational Area",true,"textarea")}</>;
  if(tab==="legal")return <>{field("registrationNumber","Registration Number")}{field("registrationDate","Registration Date")}{field("registrationAct","Registration Act")}{field("district","District")}{field("state","State")}{field("pan","PAN Number")}{field("governingDocument","Governing Document / Rules / Memorandum",true)}{field("amendmentHistory","Amendment History",true,"textarea")}</>;
  if(tab==="tax")return <>{field("pan","PAN Number")}{field("twelveAB","12AB Registration No.")}{field("twelveABStatus","12AB Status")}{field("eightyG","80G Registration No.")}{field("eightyGStatus","80G Status")}{field("assessmentYear","Assessment Year")}{field("effectiveDates","Effective / Valid Dates")}{field("incomeTaxFiling","Income-tax Filing / Acknowledgement",true)}</>;
  if(tab==="darpan")return <>{field("ngoDarpanId","NGO DARPAN ID")}{field("darpanStatus","DARPAN Status")}{field("csr1Number","CSR-1 Registration No.")}{field("csrStatus","CSR Status")}{field("mcaCsrRecords","MCA / CSR Records & Remarks",true,"textarea")}</>;
  if(tab==="governance")return <>{field("president","President")}{field("vicePresident","Vice President")}{field("secretary","Secretary")}{field("jointSecretary","Joint Secretary")}{field("treasurer","Treasurer")}{field("members","Other Governing Body Members",true,"textarea")}{field("rolesTenure","Roles / Tenure / Appointment Reference",true,"textarea")}</>;
  if(tab==="finance")return <>{field("financialYear","Financial Year")}{field("bankName","Bank Name")}{field("branch","Branch")}{field("accountNumber","Account Number")}{field("ifsc","IFSC Code")}{field("upi","UPI ID")}{field("auditorName","Auditor / CA")}{field("auditorContact","Auditor / CA Contact")}{field("booksStatus","Books of Accounts / Audit Status",true,"textarea")}</>;
  if(tab==="government")return <>{field("udyam","MSME (Udyam Registration)")}{field("msmeType","MSME Type")}{field("udyogAadhaar","Udyog Aadhaar No.")}{field("esic","ESIC No.")}{field("epfo","EPFO No.")}{field("digitalIndia","Digital India Registration")}{field("ncsEmployerId","NCS Employer ID")}{field("ncsOrganizationId","NCS Organization ID [SSF GROUP]")}{field("lin","LIN")}{field("mpJanAbhiyan","MP Jan Abhiyan Parishad")}{field("startupRegistration","Startup Registration")}</>;
  if(tab==="calendar")return <>{field("complianceName","Compliance / Return Name")}{field("authority","Authority")}{field("dueDate","Due Date","", "date")}{field("financialYear","Financial Year")}{field("status","Status")}{field("filingDate","Filing Date","","date")}{field("acknowledgement","Acknowledgement No.")}{field("responsiblePerson","Responsible Person")}{field("remarks","Remarks",true,"textarea")}</>;
  return <>{field("date","Date","","date")}{field("eventType","Document / Compliance Event Type")}{field("title","Document / Event Title")}{field("referenceNo","Document / Reference No.")}{field("description","Description / Details",true,"textarea")}{field("supportingDocument","Supporting Document / File Reference",true)}{field("remarks","Remarks",true,"textarea")}</>;
 };
 return <SimpleOfficeCard title="🏛️ Institution Profile & Compliance / संस्था परिचय एवं अनुपालन" subtitle="SSF Digital Office — master organisational profile, statutory registrations, governance, finance and compliance records.">
  <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5">
   <div className="bg-zinc-50 border rounded-2xl p-3 h-fit">{labels.map(([id,label])=><button key={id} type="button" onClick={()=>setTab(id)} className={"w-full text-left px-3 py-3 rounded-xl mb-1 font-bold "+(tab===id?"bg-[#123B5D] text-white":"text-[#123B5D] hover:bg-white")}>{label}</button>)}</div>
   <div className="min-w-0">
    <div className="bg-white border rounded-2xl overflow-hidden">
     <div className="p-5 border-b"><h3 className="text-xl font-black text-[#002344]">{labels.find(x=>x[0]===tab)?.[1]}</h3><p className="text-sm text-zinc-500 mt-1">{multiRecordTabs.has(tab)?"Multiple records are supported here. Use Save Record for a new entry and Edit to update an existing entry.":"Existing saved section data will be loaded here; unrelated Digital Office records are untouched."}</p></div>
     <form onSubmit={save} className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{renderFields()}<div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-2 pt-2"><button disabled={saving} className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">{saving?(editingId?"Updating…":"Saving…"):(editingId?"Update Record":"Save Record")}</button></div></form>
    </div>
    {notice&&<div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 font-semibold">{notice}</div>}
    <div className="mt-5 bg-white border rounded-2xl overflow-hidden"><div className="p-5 border-b"><h3 className="text-lg font-black text-[#002344]">Saved Records — {labels.find(x=>x[0]===tab)?.[1]}</h3><p className="text-sm text-zinc-500 mt-1">All saved fields are shown below. Scroll horizontally on smaller screens to view the complete record.</p></div><div className="overflow-auto"><table className="w-full text-sm min-w-[1200px]"><thead className="bg-zinc-50"><tr><th className="p-3 text-left whitespace-nowrap">Record ID</th><th className="p-3 text-left whitespace-nowrap">Record Date</th>{Object.keys(seed[tab]||{}).map(key=><th key={key} className="p-3 text-left whitespace-nowrap">{key.replace(/([A-Z])/g," $1").replace(/^./,function(ch){return ch.toUpperCase();})}</th>)}<th className="p-3 text-left whitespace-nowrap">Status</th><th className="p-3 text-left whitespace-nowrap">Action</th></tr></thead><tbody className="divide-y">{sectionRows.map(r=>{const d=r.data||{};return <tr key={r.id}><td className="p-3 align-top font-bold whitespace-nowrap">{r.recordId||r.id}</td><td className="p-3 align-top whitespace-nowrap">{formatOfficeDate(r.recordDate)}</td>{Object.keys(seed[tab]||{}).map(key=>{const value=d[key];const isDate=key==="date"||key==="dueDate"||key==="filingDate"||key==="registrationDate";return <td key={key} className="p-3 align-top min-w-[160px] max-w-[360px] whitespace-pre-wrap break-words">{value===null||value===undefined||String(value)===""?"—":isDate?formatOfficeDate(value):String(value)}</td>;})}<td className="p-3 align-top whitespace-nowrap">{r.status||"active"}</td><td className="p-3 align-top whitespace-nowrap"><button type="button" onClick={()=>{
 const recordSection=(r.data||{}).section||tab;
 setTab(recordSection);
 setEditingId(r.id);
 setForm({...seed[recordSection],...(r.data||{})});
 setNotice("Editing saved record.");
 window.scrollTo({top:0,behavior:"smooth"});
}} className="px-3 py-2 rounded-lg border border-[#123B5D] text-[#123B5D] font-bold mr-2">✏️ Edit</button><button type="button" onClick={()=>archive(r.id)} className="px-3 py-2 rounded-lg border border-red-200 text-red-700 font-bold">Archive</button></td></tr>})}{!sectionRows.length&&<tr><td colSpan={Object.keys(seed[tab]||{}).length+4} className="p-8 text-center text-zinc-500">No saved record yet. The form above is pre-filled with the details currently supplied for SSF.</td></tr>}</tbody></table></div></div>
   </div>
  </div>
 </SimpleOfficeCard>;
}


export function ImsOrganisationProfile(_props){
  const { lang } = useLang();
  const [rows,setRows]=useState(null);
  const reload=async()=>{ const r=await imsInstRows().catch(()=>[]); setRows(r); };
  useEffect(()=>{ let a=true; (async()=>{ const r=await imsInstRows().catch(()=>[]); if(a) setRows(r); })(); return ()=>{a=false}; },[]);
  const add=async(module,payload)=>{ const ok=await imsInstAdd(module,payload); if(ok) await reload(); return ok; };
  const updateRecord=async(id,module,data)=>{ const ok=await imsInstUpdate(id,module,data); if(ok) await reload(); return ok; };
  const archive=async(id)=>{ const ok=await imsInstArchive(id); if(ok) await reload(); return ok; };
  return (
    <ImsLayout active="org_profile">
      <div className="p-1">
        {rows===null ? <div className="p-10 text-center text-slate-500">{lang==='hi'?'लोड हो रहा है…':'Loading…'}</div> : <InstitutionalHistory rows={rows} add={add} updateRecord={updateRecord} archive={archive}/>}
      </div>
    </ImsLayout>
  );
}
