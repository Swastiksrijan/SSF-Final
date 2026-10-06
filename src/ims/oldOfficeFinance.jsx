// Verbatim port of the old SSF Digital Office finance components.
// Copied unchanged from src/pages/SSFDigitalOffice.jsx.
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaBook, FaCertificate, FaIdCard, FaPlus, FaPrint, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import logoImg from "../assets/new-logo.png";
import { ENDPOINTS } from "../config/api";
import { BANK_ACCOUNTS, listBankStatements, getBankStatement, bankStatementRecords } from "../data/bankStatements";
import { CASH_BOOKS, listCashStatements, getCashStatement, cashStatementRecords } from "../data/cashBook";
import { FIN_REGISTERS, FIN_FY_LIST, getFinRegister } from "../data/financialRecords";
import { LABELS } from "./oldOfficeModules";
import { cls, formatOfficeDate, downloadPdf, printRecord, TOKEN_KEY } from "./oldOfficeCore";

const MONEY = new Set(["donations","expenses","contribution","cash","bank","ledger"]);
const SPECIAL_DOCS = new Set(["meetings","mou","certificates","idcards"]);
const fyOf=function(value){
 const s=String(value||"").slice(0,10); const y=Number(s.slice(0,4)), m=Number(s.slice(5,7));
 if(!y||!m) return "";
 const start=m>=4?y:y-1;
 return start+"-"+String((start+1)%100).padStart(2,"0");
};
const ALL_FY=[];
for(let y=2022;y<=2027;y++) ALL_FY.push(y+"-"+String((y+1)%100).padStart(2,"0"));
const lastMonths=function(n){const out=[];const d=new Date();d.setDate(1);for(let i=n-1;i>=0;i--){const x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push(x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0"));}return out;};

// Certificates / ID cards: the old office printed these from the main shell.
// The IMS registry pages do not expose them, so the register falls back to the
// plain record PDF for those two modules.
const printDesignedDocument=async function(r){ printRecord(r); };


function BankBook({ rows, add, archive, updateRecord, token, reload }){
 const accountId=Object.keys(BANK_ACCOUNTS)[0];
 const account=BANK_ACCOUNTS[accountId]||{};
 const statements=useMemo(()=>listBankStatements(accountId),[accountId]);
 const [fy,setFy]=useState("");
 const [search,setSearch]=useState(""),[type,setType]=useState("all");
 const [showAdd,setShowAdd]=useState(false),[editId,setEditId]=useState(null),[form,setForm]=useState({});
 const money=function(v){return "₹"+Number(v||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});};
 const sigOf=function(date,withdrawal,deposit,particulars){return [String(date||"").slice(0,10),withdrawal==null?"":Number(withdrawal),deposit==null?"":Number(deposit),String(particulars||"").trim().toLowerCase()].join("|");};
 const allDbRows=useMemo(()=>(rows||[]).map(r=>({r,fy:fyOf(r.recordDate)})).filter(x=>x.fy),[rows]);
 const dbFor=function(f){return allDbRows.filter(x=>x.fy===f).map(x=>x.r);};
 // Every financial year we know about, newest first: bundled statements + any year with database records.
 const fyList=useMemo(()=>Array.from(new Set([...statements.map(s=>s.fy),...allDbRows.map(x=>x.fy)])).sort().reverse(),[statements,allDbRows]);
 useEffect(()=>{ if(!fyList.includes(fy)) setFy(fyList[0]||""); },[fyList,fy]);
 const statement=useMemo(()=>getBankStatement(accountId,fy),[accountId,fy]);
 const dbRows=useMemo(()=>dbFor(fy),[allDbRows,fy]);
 const entries=useMemo(()=>{
   const extra=dbRows.map(r=>{const d=r.data||{};const dep=Number(d.deposit||(d.direction==="in"?r.amount:0))||null;const wd=Number(d.withdrawal||(d.direction==="out"?r.amount:0))||null;return {key:r.id||r.recordId,dbId:r.id,date:String(r.recordDate||d.date||"").slice(0,10),particulars:d.purpose||d.particulars||d.notes||r.recordType||"",chqNum:d.chqNum||d.referenceNo||"",withdrawal:wd,deposit:dep,source:"Entered"};});
   const dbSig=new Set(extra.map(e=>sigOf(e.date,e.withdrawal,e.deposit,e.particulars)));
   const base=statement?statement.transactions.map((t,i)=>({key:"s"+(i+1),date:t.date,particulars:t.particulars,chqNum:t.chqNum,withdrawal:t.withdrawal,deposit:t.deposit,source:"Statement"})).filter(e=>!dbSig.has(sigOf(e.date,e.withdrawal,e.deposit,e.particulars))):[];
   return base.concat(extra).sort((a,b)=>(a.date<b.date?-1:a.date>b.date?1:0));
 },[statement,dbRows]);
 const opening=statement?statement.openingBalance:0;
 const totals=entries.reduce(function(a,e){a.deposit+=Number(e.deposit||0);a.withdrawal+=Number(e.withdrawal||0);return a;},{deposit:0,withdrawal:0});
 const closing=opening+totals.deposit-totals.withdrawal;
 const balByKey={}; let run=opening; entries.forEach(function(e){ run+=Number(e.deposit||0)-Number(e.withdrawal||0); balByKey[e.key]=run; });
 const chartMonths=useMemo(()=>lastMonths(12),[]);
 const chart=useMemo(()=>{const map={};dbFor(fy).forEach(r=>{const d=r.data||{};const dep=Number(d.deposit||(d.direction==="in"?r.amount:0));const wd=Number(d.withdrawal||(d.direction==="out"?r.amount:0));const mo=String(r.recordDate||"").slice(0,7);if(!mo)return;map[mo]=map[mo]||{deposit:0,withdrawal:0};map[mo].deposit+=dep;map[mo].withdrawal+=wd;});return chartMonths.map(m=>({m,deposit:map[m]?.deposit||0,withdrawal:map[m]?.withdrawal||0}));},[fy,allDbRows,chartMonths]);
 const maxBar=Math.max(1,...chart.map(c=>Math.max(c.deposit,c.withdrawal)));
 const filtered=entries.filter(function(e){
   if(type==="deposit"&&e.deposit==null)return false;
   if(type==="withdrawal"&&e.withdrawal==null)return false;
   if(search&&!(String(e.particulars).toLowerCase().includes(search.toLowerCase())||String(e.chqNum).toLowerCase().includes(search.toLowerCase())))return false;
   return true;
 });
 const startForm=function(){setEditId(null);setForm({date:new Date().toISOString().slice(0,10),particulars:"",deposit:"",withdrawal:"",chqNum:""});setShowAdd(true);};
 const startEdit=function(e){setEditId(e.dbId);setForm({date:e.date,particulars:e.particulars,deposit:e.deposit!=null?String(e.deposit):"",withdrawal:e.withdrawal!=null?String(e.withdrawal):"",chqNum:e.chqNum||""});setShowAdd(true);};
 const submitForm=async function(ev){ev.preventDefault();const dep=Number(form.deposit||0),wd=Number(form.withdrawal||0);
   if(!form.date||(!dep&&!wd)){alert("Date aur Deposit ya Withdrawal me se kam se kam ek amount daalein.");return;}
   const payload={recordDate:form.date,recordType:dep?"Deposit":"Withdrawal",amount:dep||wd,paymentMode:"Bank",direction:dep?"in":"out",data:{category:"Bank Transaction",direction:dep?"in":"out",purpose:form.particulars,particulars:form.particulars,chqNum:form.chqNum||"",referenceNo:form.chqNum||"",deposit:dep||null,withdrawal:wd||null,amount:dep||wd,fy:fyOf(form.date)||fy}};
   let ok; if(editId) ok=await updateRecord(editId,"bank",{...payload,date:form.date,changeType:payload.recordType},true); else ok=await add("bank",payload,true);
   if(ok){setShowAdd(false);setEditId(null);if(typeof reload==="function")await reload();}
 };
 const exportCsv=function(){
   const esc=function(v){return '"'+String(v??"").replace(/"/g,'""')+'"';};
   const lines=[["Date","Particulars","Chq No.","Withdrawal","Deposit","Balance"].map(esc).join(",")];
   lines.push(["","Opening Balance","","","",opening.toFixed(2)].map(esc).join(","));
   entries.forEach(function(e){lines.push([e.date,e.particulars,e.chqNum,e.withdrawal!=null?Number(e.withdrawal).toFixed(2):"",e.deposit!=null?Number(e.deposit).toFixed(2):"",Number(balByKey[e.key]).toFixed(2)].map(esc).join(","));});
   lines.push(["","Total","",totals.withdrawal.toFixed(2),totals.deposit.toFixed(2),closing.toFixed(2)].map(esc).join(","));
   const blob=new Blob(["\uFEFF"+lines.join("\r\n")+"\r\n"],{type:"text/csv;charset=utf-8"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ssf-bank-book-"+fy+".csv";document.body.appendChild(a);a.click();a.remove();
 };
 const printPdf=function(){
   const d=new jsPDF(); d.addImage(logoImg,"PNG",14,8,16,16); d.setTextColor(0,35,68); d.setFontSize(15); d.text("Swastik Srijan Foundation Samiti",36,15); d.setFontSize(10); d.setTextColor(60); d.text(account.bank+" · "+account.branch+" · A/c "+account.accountNumber,14,24); d.setTextColor(0,35,68); d.setFontSize(13); d.text("Bank Book / Statement of Account · FY "+fy,14,33);
   let y=44; const cols=[14,26,96,116,140,164];
   d.setFontSize(9); d.setTextColor(0,35,68); ["Date","Particulars","Chq","Withdrawal","Deposit","Balance"].forEach(function(h,i){d.text(h,cols[i],y);}); y+=5;
   d.setTextColor(30); d.text("Opening Balance",cols[1],y); d.text(opening.toFixed(2),cols[5],y); y+=5;
   entries.forEach(function(e){ const par=d.splitTextToSize(String(e.particulars||""),66)[0]||""; d.text(String(e.date),cols[0],y); d.text(par,cols[1],y); d.text(String(e.chqNum||""),cols[2],y); if(e.withdrawal!=null)d.text(Number(e.withdrawal).toFixed(2),cols[3],y); if(e.deposit!=null)d.text(Number(e.deposit).toFixed(2),cols[4],y); d.text(Number(balByKey[e.key]).toFixed(2),cols[5],y); y+=5; if(y>280){d.addPage();y=20;} });
   d.setFont(undefined,"bold"); d.text("Total",cols[1],y); d.text(totals.withdrawal.toFixed(2),cols[3],y); d.text(totals.deposit.toFixed(2),cols[4],y); d.text("Closing "+closing.toFixed(2),cols[5],y);
   d.setFontSize(8); d.setTextColor(120); d.text("Computer-generated bank book · SSF Digital Office",105,288,{align:"center"});
   downloadPdf(d,"ssf-bank-book-"+fy+".pdf");
 };
 return <div className="space-y-5">
  <div className="bg-[#002344] text-white rounded-2xl p-6">
   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex items-center gap-3"><FaBook className="text-2xl"/><div><h2 className="text-2xl font-black">Bank Book / बैंक बही</h2><p className="text-white/70 mt-1">Financial-year-wise statement · saal ke hisaab se entries</p></div></div>
    <div className="flex flex-wrap gap-2 items-center">
     <select value={fy} onChange={e=>setFy(e.target.value)} className="px-3 py-2.5 rounded-xl text-[#002344] font-bold">{(fyList.length?fyList:[fy].filter(Boolean)).map(f=><option key={f} value={f}>FY {f}</option>)}</select>
     <button type="button" onClick={startForm} className="bg-[#177245] text-white px-4 py-2.5 rounded-xl font-bold">+ Add Entry</button>
    </div>
   </div>
   <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Account / खाता</div><div className="font-black mt-1">{account.accountNumber}</div><div className="text-white/70 text-xs">{account.accountType} · {account.ifsc}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Opening Balance / प्रारंभिक शेष</div><div className="font-black mt-1">{money(opening)}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Total Deposits / कुल जमा</div><div className="font-black mt-1 text-emerald-300">{money(totals.deposit)}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Total Withdrawals / कुल निकासी</div><div className="font-black mt-1 text-red-300">{money(totals.withdrawal)}</div></div>
   </div>
   <div className="mt-3 bg-white/10 rounded-xl p-3 text-sm flex items-center justify-between"><span className="text-white/70 font-bold uppercase text-xs">Closing Balance / अंतिम शेष · FY {fy}</span><span className="font-black text-lg">{money(closing)} Cr</span></div>
  </div>

  <div className="bg-white rounded-2xl border overflow-hidden">
   <div className="p-5 border-b"><h3 className="text-lg font-black text-[#002344]">Year-wise Summary / वर्षवार सारांश</h3><p className="text-sm text-zinc-500 mt-1">Har saal ka opening, deposits, withdrawals aur closing — ek nazar me.</p></div>
   <div className="overflow-x-auto"><table className="w-full text-sm min-w-[820px]">
    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr><th className="p-3 text-left">Financial Year / वित्तीय वर्ष</th><th className="p-3 text-right">Opening / प्रारंभिक</th><th className="p-3 text-right">Deposits / जमा</th><th className="p-3 text-right">Withdrawals / निकासी</th><th className="p-3 text-right">Closing / अंतिम</th><th className="p-3 text-left">Source / स्रोत</th><th className="p-3 text-left">Action / कार्य</th></tr></thead>
    <tbody className="divide-y">
     {fyList.map(function(f){const s2=getBankStatement(accountId,f);const recs=dbFor(f);const stDep=s2?s2.transactions.reduce((a,t)=>a+Number(t.deposit||0),0):0;const stWd=s2?s2.transactions.reduce((a,t)=>a+Number(t.withdrawal||0),0):0;const dbDep=recs.reduce((a,r)=>{const d=r.data||{};return a+Number(d.deposit||(d.direction==="in"?r.amount:0));},0);const dbWd=recs.reduce((a,r)=>{const d=r.data||{};return a+Number(d.withdrawal||(d.direction==="out"?r.amount:0));},0);const dep=stDep+dbDep,wd=stWd+dbWd;const o=s2?s2.openingBalance:0;const c=o+dep-wd;const src=s2&&recs.length?"Statement + Entered":s2?"Statement":recs.length?"Entered":"Empty";return <tr key={f} className={f===fy?"bg-[#f0f6fb] font-bold":""}><td className="p-3 font-black text-[#002344]">FY {f}</td><td className="p-3 text-right">{money(o)}</td><td className="p-3 text-right text-emerald-700">{money(dep)}</td><td className="p-3 text-right text-red-700">{money(wd)}</td><td className="p-3 text-right font-black">{money(c)}</td><td className="p-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-600">{src}</span></td><td className="p-3 text-right"><button type="button" onClick={()=>setFy(f)} className="text-xs font-bold text-[#123B5D] border border-[#123B5D]/20 px-2.5 py-1.5 rounded-lg">{f===fy?"Viewing":"View"}</button></td></tr>;})}
     {!fyList.length&&<tr><td colSpan="7" className="p-8 text-center text-zinc-400">Koi entry nahi. "+ Add Entry" se shuru karein.</td></tr>}
    </tbody>
   </table></div>
  </div>

  <div className="bg-white rounded-2xl border p-5">
   <div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#002344]">Monthly View · FY {fy}</h3><div className="flex gap-4 text-xs font-bold"><span className="text-emerald-700">■ Deposit</span><span className="text-red-600">■ Withdrawal</span></div></div>
   <div className="mt-4 flex items-end gap-2 h-40 overflow-x-auto">
    {chart.map(function(c){return <div key={c.m} className="flex-1 min-w-[34px] flex flex-col items-center justify-end gap-0.5"><div className="flex items-end gap-0.5 h-32"><div className="w-3 bg-emerald-500 rounded-t" style={{height:Math.round((c.deposit/maxBar)*100)+"%",minHeight:c.deposit?3:0}} title={"Deposit "+money(c.deposit)}></div><div className="w-3 bg-red-500 rounded-t" style={{height:Math.round((c.withdrawal/maxBar)*100)+"%",minHeight:c.withdrawal?3:0}} title={"Withdrawal "+money(c.withdrawal)}></div></div><div className="text-[9px] text-zinc-500">{c.m.slice(5)}</div></div>;})}
   </div>
   <p className="text-xs text-zinc-400 mt-2">Sirf Digital Office me darj entries par based (selected year ke month-wise).</p>
  </div>

  <div className="bg-white rounded-2xl border overflow-hidden">
   <div className="p-5 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-3">
    <div><h3 className="text-xl font-black text-[#002344]">Statement of Account · FY {fy}</h3><p className="text-sm text-zinc-500 mt-1">{filtered.length} of {entries.length} entries{statement?" · includes bundled statement":""}</p></div>
    <div className="flex flex-wrap gap-2 items-center">
     <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search particulars / cheque" className="px-3 py-2.5 border rounded-xl w-56"/>
     <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Entries</option><option value="deposit">Deposits</option><option value="withdrawal">Withdrawals</option></select>
     <button type="button" onClick={exportCsv} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">CSV</button>
     <button type="button" onClick={printPdf} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">PDF</button>
    </div>
   </div>
   {showAdd&&<div className="p-5 bg-zinc-50 border-b"><div className="font-black text-[#002344] mb-3">{editId?"Edit Bank Entry / प्रविष्टि संपादित करें":"Add Bank Entry / नई बैंक प्रविष्टि"} · FY {fy}</div>
    <form onSubmit={submitForm} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
     <input type="date" required value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className={cls}/>
     <input value={form.particulars||""} onChange={e=>setForm(f=>({...f,particulars:e.target.value}))} placeholder="Particulars / विवरण" className={cls}/>
     <input type="number" min="0" step="0.01" value={form.deposit||""} onChange={e=>setForm(f=>({...f,deposit:e.target.value}))} placeholder="Deposit (₹)" className={cls}/>
     <input type="number" min="0" step="0.01" value={form.withdrawal||""} onChange={e=>setForm(f=>({...f,withdrawal:e.target.value}))} placeholder="Withdrawal (₹)" className={cls}/>
     <input value={form.chqNum||""} onChange={e=>setForm(f=>({...f,chqNum:e.target.value}))} placeholder="Chq / Ref No." className={cls}/>
     <div className="sm:col-span-2 lg:col-span-5 flex gap-2"><button className="bg-[#002344] text-white px-6 py-3 rounded-xl font-bold">{editId?"Update Entry / अद्यतन करें":"Save Entry / सहेजें"}</button><button type="button" onClick={()=>{setShowAdd(false);setEditId(null);}} className="border px-6 py-3 rounded-xl font-bold">Cancel / रद्द करें</button></div>
    </form></div>}
   <div className="overflow-x-auto"><table className="w-full text-sm min-w-[900px]">
    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr><th className="p-3 text-left">Date / दिनांक</th><th className="p-3 text-left">Particulars / विवरण</th><th className="p-3 text-left">Chq No. / चेक</th><th className="p-3 text-right">Withdrawal / निकासी</th><th className="p-3 text-right">Deposit / जमा</th><th className="p-3 text-right">Balance / शेष</th><th className="p-3 text-left">Source / स्रोत</th><th className="p-3 text-left">Action / कार्य</th></tr></thead>
    <tbody className="divide-y">
     <tr className="bg-[#f7fafc] font-black"><td className="p-3" colSpan="5">Opening Balance / प्रारंभिक शेष</td><td className="p-3 text-right">{money(opening)}</td><td className="p-3" colSpan="2"></td></tr>
     {filtered.map(function(e){return <tr key={e.key}><td className="p-3 whitespace-nowrap">{formatOfficeDate(e.date)}</td><td className="p-3 min-w-[300px]">{e.particulars}</td><td className="p-3">{e.chqNum||"—"}</td><td className="p-3 text-right text-red-700">{e.withdrawal!=null?money(e.withdrawal):""}</td><td className="p-3 text-right text-emerald-700">{e.deposit!=null?money(e.deposit):""}</td><td className="p-3 text-right font-bold">{money(balByKey[e.key])}</td><td className="p-3"><span className={"px-2 py-1 rounded-full text-[10px] font-bold "+(e.source==="Statement"?"bg-zinc-100 text-zinc-600":"bg-emerald-50 text-emerald-700")}>{e.source}</span></td><td className="p-3 text-right whitespace-nowrap">{e.dbId&&<><button onClick={()=>startEdit(e)} className="text-xs font-bold text-[#123B5D] border border-[#123B5D]/20 px-2 py-1 rounded-lg mr-2">Edit / संपादित</button><button onClick={()=>{if(window.confirm("Sirf yahi entry archive hogi - baaki entries safe rahengi. Archive karein?"))archive(e.dbId);}} className="text-xs font-bold text-red-600">Archive / संग्रह</button></>}</td></tr>;})}
     {!filtered.length&&<tr><td colSpan="8" className="p-10 text-center text-zinc-400">FY {fy} me abhi koi entry nahi. "+ Add Entry" se entry karein.</td></tr>}
     <tr className="bg-[#f7fafc] font-black"><td className="p-3" colSpan="3">Total / कुल</td><td className="p-3 text-right text-red-700">{money(totals.withdrawal)}</td><td className="p-3 text-right text-emerald-700">{money(totals.deposit)}</td><td className="p-3 text-right">{money(closing)}</td><td className="p-3 text-xs text-zinc-500" colSpan="2">Closing / अंतिम शेष</td></tr>
    </tbody>
   </table></div>
  </div>
 </div>;
}


function CashBook({ rows, add, archive, updateRecord, token, reload }){
 const [bookId,setBookId]=useState(Object.keys(CASH_BOOKS)[0]);
 const [fy,setFy]=useState("");
 const statements=useMemo(()=>listCashStatements(bookId),[bookId]);
 const dbFy=useMemo(()=>Array.from(new Set((rows||[]).map(r=>fyOf(r.recordDate)).filter(Boolean))),[rows]);
 const fyList=useMemo(()=>Array.from(new Set([...statements.map(s=>s.fy),...dbFy])).sort().reverse(),[statements,dbFy]);
 useEffect(()=>{ if(!fyList.includes(fy)) setFy(fyList[0]||""); },[fyList,fy]);
 const statement=useMemo(()=>getCashStatement(bookId,fy),[bookId,fy]);
 const book=CASH_BOOKS[bookId]||{};
 const [search,setSearch]=useState(""),[type,setType]=useState("all"),[importing,setImporting]=useState(false),[editing,setEditing]=useState(null);
 const money=function(v){return "₹"+Number(v||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});};
 const sigOf=function(date,receipt,payment,particulars){return [String(date||"").slice(0,10),receipt==null?"":Number(receipt),payment==null?"":Number(payment),String(particulars||"").trim().toLowerCase()].join("|");};
 const dbRows=useMemo(()=>(rows||[]).filter(r=>{
   const d=r.data||{};
   if(String(d.fy||"")===String(fy)) return true;
   if(!d.fy&&r.recordDate){ const s=String(r.recordDate).slice(0,10); if(s>=statement?.periodFrom&&s<=statement?.periodTo) return true; }
   return false;
 }),[rows,fy,statement]);
 const entries=useMemo(()=>{
   const extra=dbRows.map(r=>{const d=r.data||{};const receipt=Number(d.receipt||(d.direction==="in"?r.amount:0))||null;const payment=Number(d.payment||(d.direction==="out"?r.amount:0))||null;return {key:r.id||r.recordId,dbId:r.id,raw:r,date:String(r.recordDate||d.date||"").slice(0,10),particulars:d.purpose||d.particulars||d.notes||r.recordType||"",type:d.type||r.recordType||"",category:d.category||"",mode:d.mode||d.paymentMode||"Cash",receipt:receipt,payment:payment,voucherNo:d.voucherNo||d.referenceNo||"",remarks:d.remarks||"",verifiedBy:d.verifiedBy||"",source:"Digital Office"};});
   const dbSig=new Set(extra.map(e=>sigOf(e.date,e.receipt,e.payment,e.particulars)));
   const base=statement?statement.transactions.map((t,i)=>({key:"s"+(i+1),slNo:i+1,date:t.date,particulars:t.particulars,type:t.type,category:t.category,mode:t.mode,receipt:t.receipt||null,payment:t.payment||null,voucherNo:t.voucherNo,remarks:t.remarks,verifiedBy:t.verifiedBy,source:"Cash Book"})).filter(e=>!dbSig.has(sigOf(e.date,e.receipt,e.payment,e.particulars))):[];
   return base.concat(extra).sort((a,b)=>(a.date<b.date?-1:a.date>b.date?1:0));
 },[statement,dbRows]);
 const pendingNew=useMemo(()=>{
   if(!statement)return [];
   const dbSig=new Set(dbRows.map(r=>{const d=r.data||{};const receipt=d.receipt!=null?d.receipt:(d.direction==="in"?r.amount:null);const payment=d.payment!=null?d.payment:(d.direction==="out"?r.amount:null);return sigOf(r.recordDate,receipt,payment,d.purpose||d.particulars);}));
   return cashStatementRecords(bookId,fy).filter(p=>!dbSig.has(sigOf(p.recordDate,p.data.receipt,p.data.payment,p.data.particulars)));
 },[statement,dbRows,bookId,fy]);
 const opening=statement?statement.openingBalance:0;
 let run=opening, minRun=opening, minDate="";
 entries.forEach(function(e){ run+=(Number(e.receipt||0)-Number(e.payment||0)); if(run<minRun){minRun=run;minDate=e.date;} });
 const balanceByKey={}; run=opening; entries.forEach(function(e){ run+=(Number(e.receipt||0)-Number(e.payment||0)); balanceByKey[e.key]=run; });
 const totals=entries.reduce(function(a,e){a.receipt+=Number(e.receipt||0);a.payment+=Number(e.payment||0);return a;},{receipt:0,payment:0});
 const closing=opening+totals.receipt-totals.payment;
 const filtered=entries.filter(function(e){
   if(type==="income"&&e.type!=="Income")return false;
   if(type==="expence"&&e.type!=="Expence")return false;
   if(search){const h=(String(e.particulars)+" "+String(e.category)+" "+String(e.remarks)+" "+String(e.voucherNo)).toLowerCase();if(!h.includes(search.toLowerCase()))return false;}
   return true;
 });
 const importStatement=async function(){
   if(!statement)return;
   if(!pendingNew.length){ alert("All entries for FY "+fy+" are already saved in the Digital Office database."); return; }
   if(!confirm("Import "+pendingNew.length+" cash entr"+(pendingNew.length===1?"y":"ies")+" for FY "+fy+" into the Digital Office database? Already-saved entries are skipped."))return;
   setImporting(true);
   let ok=0,fail=0;
   for(const p of pendingNew){ const r=await add("cash",{recordDate:p.recordDate,recordType:p.recordType,amount:p.amount,paymentMode:p.paymentMode,direction:p.direction,data:p.data},true); if(r)ok++; else fail++; }
   setImporting(false);
   if(typeof reload==="function") await reload();
   alert("Import finished. Saved: "+ok+(fail?("  Failed: "+fail):""));
 };
 const exportCsv=function(){
   const head=["Date","Particulars","Type","Category","Mode","Receipts","Payments","Balance","Voucher No.","Remarks","Verified By"];
   const esc=function(v){return '"'+String(v??"").replace(/"/g,'""')+'"';};
   const lines=[head.map(esc).join(",")];
   lines.push(["","Opening Balance","","","","","",opening.toFixed(2),"","",""].map(esc).join(","));
   entries.forEach(function(e){lines.push([e.date,e.particulars,e.type,e.category,e.mode,e.receipt!=null?Number(e.receipt).toFixed(2):"",e.payment!=null?Number(e.payment).toFixed(2):"",Number(balanceByKey[e.key]).toFixed(2),e.voucherNo,e.remarks,e.verifiedBy].map(esc).join(","));});
   lines.push(["","Total","","","",totals.receipt.toFixed(2),totals.payment.toFixed(2),closing.toFixed(2),"","",""].map(esc).join(","));
   const blob=new Blob(["\uFEFF"+lines.join("\r\n")+"\r\n"],{type:"text/csv;charset=utf-8"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ssf-cash-book-"+fy+".csv";document.body.appendChild(a);a.click();a.remove();
 };
 const printPdf=function(){
   const d=new jsPDF(); d.addImage(logoImg,"PNG",14,8,16,16); d.setTextColor(0,35,68); d.setFontSize(15); d.text("Swastik Srijan Foundation Samiti",36,15); d.setFontSize(10); d.setTextColor(60); d.text((book.name||"SSF Cash Book")+" · FY "+fy,14,24); d.setTextColor(0,35,68); d.setFontSize(13); d.text("Cash Book / रोकड़ बही",14,33); d.setFontSize(9); d.setTextColor(90); d.text("Period: "+formatOfficeDate(statement?.periodFrom)+" to "+formatOfficeDate(statement?.periodTo),14,39);
   let y=48; const cols=[14,26,92,110,128,150,172];
   d.setFontSize(8); d.setTextColor(0,35,68); ["Date","Particulars","Type","Receipts","Payments","Balance","Voucher"].forEach(function(h,i){d.text(h,cols[i],y);}); y+=5;
   d.setTextColor(30); d.text("Opening Balance",cols[1],y); d.text(opening.toFixed(2),cols[5],y); y+=5;
   entries.forEach(function(e){ const par=d.splitTextToSize(String(e.particulars||""),62)[0]||""; d.text(String(e.date),cols[0],y); d.text(par,cols[1],y); d.text(String(e.type||""),cols[2],y); if(e.receipt)d.text(Number(e.receipt).toFixed(2),cols[3],y); if(e.payment)d.text(Number(e.payment).toFixed(2),cols[4],y); d.text(Number(balanceByKey[e.key]).toFixed(2),cols[5],y); d.text(String(e.voucherNo||""),cols[6],y); y+=5; if(y>280){d.addPage();y=20;} });
   d.setFont(undefined,"bold"); d.text("Total",cols[1],y); d.text(totals.receipt.toFixed(2),cols[3],y); d.text(totals.payment.toFixed(2),cols[4],y); d.text("Closing "+closing.toFixed(2),cols[5],y);
   d.setFontSize(8); d.setTextColor(120); d.text("Computer-generated cash book · SSF Digital Office",105,288,{align:"center"});
   downloadPdf(d,"ssf-cash-book-"+fy+".pdf");
 };
 return <div className="space-y-5">
  <div className="bg-[#002344] text-white rounded-2xl p-6">
   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex items-center gap-3"><FaBook className="text-2xl"/><div><h2 className="text-2xl font-black">Cash Book / रोकड़ बही</h2><p className="text-white/70 mt-1">Financial-year-wise cash receipts &amp; payments with running balance · वित्तीय वर्ष अनुसार नकद प्राप्ति एवं भुगतान</p></div></div>
    <div className="flex flex-wrap gap-2 items-center">
     <select value={bookId} onChange={e=>setBookId(e.target.value)} className="px-3 py-2.5 rounded-xl text-[#002344] font-bold">{Object.values(CASH_BOOKS).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select>
     <select value={fy} onChange={e=>setFy(e.target.value)} className="px-3 py-2.5 rounded-xl text-[#002344] font-bold">{(fyList.length?fyList:[fy].filter(Boolean)).map(s=><option key={s} value={s}>FY {s}</option>)}</select>
    </div>
   </div>
   <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Opening Balance / प्रारंभिक शेष</div><div className="font-black mt-1">{money(opening)}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Total Receipts / कुल प्राप्ति</div><div className="font-black mt-1 text-emerald-300">{money(totals.receipt)}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Total Payments / कुल भुगतान</div><div className="font-black mt-1 text-red-300">{money(totals.payment)}</div></div>
    <div className="bg-white/10 rounded-xl p-3"><div className="text-white/60 text-xs font-bold uppercase">Closing Balance / अंतिम शेष</div><div className="font-black mt-1">{money(closing)}</div></div>
   </div>
  </div>

  {minRun<0&&<div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl px-5 py-4 text-sm"><b>Cash shortfall noticed / नकद कमी:</b> By date the running balance goes as low as <b>{money(minRun)}</b> on {formatOfficeDate(minDate)}. This usually means a receipt is missing or the opening balance needs revision — please verify before finalising.</div>}

  <div className="bg-white rounded-2xl border overflow-hidden">
   <div className="p-5 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-3">
    <div><h3 className="text-xl font-black text-[#002344]">Cash Book / रोकड़ बही · FY {fy}</h3><p className="text-sm text-zinc-500 mt-1">{filtered.length} of {entries.length} entries · {dbRows.length} in Digital Office database</p></div>
    <div className="flex flex-wrap gap-2 items-center">
     <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search / खोजें — particulars / category / voucher" className="px-3 py-2.5 border rounded-xl w-60"/>
     <select value={type} onChange={e=>setType(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Entries / सभी</option><option value="income">Receipts (Income) / प्राप्ति</option><option value="expence">Payments (Expence) / भुगतान</option></select>
     {statement&&<button type="button" disabled={importing||!pendingNew.length} onClick={importStatement} title={pendingNew.length?("Save "+pendingNew.length+" remaining entries"):"All entries already saved"} className={"px-4 py-2.5 rounded-xl font-bold disabled:opacity-60 "+(pendingNew.length?"bg-[#177245] text-white":"bg-zinc-100 text-zinc-500")}>{importing?"Importing…":(pendingNew.length?("Import "+pendingNew.length+" Entries / आयात करें"):"All Entries Saved ✓")}</button>}
     <button type="button" onClick={exportCsv} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">CSV</button>
     <button type="button" onClick={printPdf} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">PDF</button>
    </div>
   </div>
   <div className="overflow-x-auto"><table className="w-full text-sm min-w-[1200px]">
    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr><th className="p-3 text-left">Date / दिनांक</th><th className="p-3 text-left">Particulars / विवरण</th><th className="p-3 text-left">Type / प्रकार</th><th className="p-3 text-left">Category / श्रेणी</th><th className="p-3 text-left">Mode / माध्यम</th><th className="p-3 text-right">Receipts / प्राप्ति</th><th className="p-3 text-right">Payments / भुगतान</th><th className="p-3 text-right">Balance / शेष</th><th className="p-3 text-left">Voucher No. / वाउचर</th><th className="p-3 text-left">Remarks / टिप्पणी</th><th className="p-3 text-left">Verified By / सत्यापित</th><th className="p-3 text-left">Source / स्रोत</th><th className="p-3 text-left">Action / कार्य</th></tr></thead>
    <tbody className="divide-y">
     <tr className="bg-[#f7fafc] font-black"><td className="p-3" colSpan="7">Opening Balance / प्रारंभिक शेष</td><td className="p-3 text-right">{money(opening)}</td><td className="p-3" colSpan="5"></td></tr>
     {filtered.map(function(e){return <tr key={e.key}><td className="p-3 whitespace-nowrap">{formatOfficeDate(e.date)}</td><td className="p-3 min-w-[220px]">{e.particulars}</td><td className="p-3"><span className={"px-2 py-1 rounded-full text-[10px] font-bold "+(e.type==="Income"?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-700")}>{e.type||"—"}</span></td><td className="p-3 whitespace-nowrap">{e.category||"—"}</td><td className="p-3">{e.mode||"Cash"}</td><td className="p-3 text-right text-emerald-700">{e.receipt!=null?money(e.receipt):""}</td><td className="p-3 text-right text-red-700">{e.payment!=null?money(e.payment):""}</td><td className="p-3 text-right font-bold">{money(balanceByKey[e.key])}</td><td className="p-3">{e.voucherNo||"—"}</td><td className="p-3 min-w-[150px] text-zinc-500">{e.remarks||"—"}</td><td className="p-3">{e.verifiedBy||"NA"}</td><td className="p-3"><span className={"px-2 py-1 rounded-full text-[10px] font-bold "+(e.source==="Cash Book"?"bg-zinc-100 text-zinc-600":"bg-emerald-50 text-emerald-700")}>{e.source}</span></td><td className="p-3 text-right whitespace-nowrap">{e.dbId&&<><button onClick={()=>setEditing(e)} className="text-xs font-bold text-[#123B5D] border border-[#123B5D]/20 px-2 py-1 rounded-lg mr-2">Edit / संपादित</button><button onClick={()=>{if(window.confirm("Sirf yahi entry archive hogi - baaki entries safe rahengi. Archive karein?"))archive(e.dbId);}} className="text-xs font-bold text-red-600">Archive / संग्रह</button></>}</td></tr>;})}
     {!filtered.length&&<tr><td colSpan="13" className="p-10 text-center text-zinc-400">No entries for FY {fy}.</td></tr>}
     <tr className="bg-[#f7fafc] font-black"><td className="p-3" colSpan="5">Total / कुल</td><td className="p-3 text-right text-emerald-700">{money(totals.receipt)}</td><td className="p-3 text-right text-red-700">{money(totals.payment)}</td><td className="p-3 text-right">{money(closing)}</td><td className="p-3 text-xs text-zinc-500" colSpan="5">Closing / अंतिम शेष</td></tr>
    </tbody>
   </table></div>
   {editing&&<div className="p-5 bg-blue-50 border-t"><div className="font-black text-[#002344] mb-3">Edit Cash Entry / प्रविष्टि संपादित करें · {editing.dbId}</div><RecordForm module="cash" initial={editing.raw||editing} submitLabel="Update Entry / अद्यतन करें" onSave={async d=>{if(!d)return;const prev=(editing.raw&&editing.raw.data)||editing.data||{};const inner=Object.assign({},prev,{purpose:d.data.purpose,category:d.data.category,referenceNo:d.data.referenceNo,notes:d.data.notes,paymentMode:d.data.paymentMode,direction:d.data.direction,type:d.recordType,receipt:d.direction==="in"?(d.amount||null):null,payment:d.direction==="out"?(d.amount||null):null,fy:prev.fy||fy});const ok=await updateRecord(editing.dbId,"cash",{date:d.recordDate,changeType:d.recordType,amount:d.amount,data:inner},true);if(ok){setEditing(null);if(typeof reload==="function")await reload();}}}/><button type="button" onClick={()=>setEditing(null)} className="mt-2 border px-5 py-2 rounded-xl font-bold text-sm">Cancel / रद्द करें</button></div>}
   <div className="p-5 border-t"><div className="font-black text-[#002344] mb-3">Add Cash Entry / रोकड़ प्रविष्टि जोड़ें</div><RecordForm module="cash" onSave={async d=>{d.data=Object.assign({},(d.data||{}),{fy:fyOf(d.recordDate)||fy});const ok=await add("cash",d);return ok;}}/></div>
  </div>
 </div>;
}


// Generic viewer for the official financial-records workbook registers
// (Donation & Contribution, Membership Fee, Expense, Master Voucher, Member,
// Meeting). Renders the workbook columns as-is, with search, CSV and PDF export.

function FinRegister({ regId }){
 const [fy,setFy]=useState(FIN_FY_LIST[0]||"");
 const reg=useMemo(()=>getFinRegister(regId,fy)||FIN_REGISTERS.find(r=>r.id===regId)||null,[regId,fy]);
 const [search,setSearch]=useState("");
 const dateCol=useMemo(()=>reg?reg.columns.findIndex(c=>/date/i.test(c)): -1,[reg]);
 const money=function(v){return "₹"+Number(v||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});};
 const isNum=function(v){return v!==""&&v!==null&&v!==undefined&&!isNaN(Number(v))&&/amount|receipt|payment|balance|withdrawal|deposit/i.test(reg?.columns?.join(" ")||"");};
 const rows=useMemo(()=>{
   if(!reg)return [];
   if(!search)return reg.rows;
   const q=search.toLowerCase();
   return reg.rows.filter(r=>r.some(c=>String(c).toLowerCase().includes(q)));
 },[reg,search]);
 if(!reg) return <div className="bg-white border rounded-2xl p-10 text-center text-zinc-400">Register not found.</div>;
 const isMoneyCol=(c)=>/amount|receipt|payment|balance|withdrawal|deposit/i.test(c);
 const exportCsv=function(){
   const esc=function(v){return '"'+String(v??"").replace(/"/g,'""')+'"';};
   const lines=[reg.columns.map(esc).join(",")];
   rows.forEach(r=>lines.push(r.map(esc).join(",")));
   const blob=new Blob(["\uFEFF"+lines.join("\r\n")+"\r\n"],{type:"text/csv;charset=utf-8"});
   const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="ssf-"+regId+"-"+fy+".csv";document.body.appendChild(a);a.click();a.remove();
 };
 const printPdf=function(){
   const d=new jsPDF({orientation:"landscape"}); d.addImage(logoImg,"PNG",10,7,12,12); d.setTextColor(0,35,68); d.setFontSize(13); d.text("Swastik Srijan Foundation Samiti",26,13); d.setFontSize(9); d.setTextColor(60); d.text(reg.title+" · FY "+fy,26,19);
   let y=28; const maxW=270; const colW=reg.columns.map((c,i)=>Math.max(20,Math.min(60,maxW/reg.columns.length)));
   d.setFontSize(7); d.setTextColor(0,35,68); let x=10; reg.columns.forEach((c,i)=>{d.text(String(c).slice(0,26),x,y);x+=colW[i];}); y+=4;
   d.setTextColor(30);
   rows.forEach(r=>{x=10; r.forEach((v,i)=>{d.text(String(v==null?"":v).slice(0,30),x,y);x+=colW[i];}); y+=4; if(y>195){d.addPage();y=20;}});
   d.setFontSize(7); d.setTextColor(120); d.text("Computer-generated from SSF financial records · SSF Digital Office",148,205,{align:"center"});
   downloadPdf(d,"ssf-"+regId+"-"+fy+".pdf");
 };
 return <div className="space-y-5">
  <div className="bg-[#002344] text-white rounded-2xl p-6">
   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex items-center gap-3"><FaBook className="text-2xl"/><div><h2 className="text-2xl font-black">{reg.title}</h2><p className="text-white/70 mt-1">Official financial records workbook · {reg.rows.length} entries · FY {fy}</p></div></div>
    <div className="flex flex-wrap gap-2 items-center">
     {FIN_FY_LIST.length>1&&<select value={fy} onChange={e=>setFy(e.target.value)} className="px-3 py-2.5 rounded-xl text-[#002344] font-bold">{FIN_FY_LIST.map(f=><option key={f} value={f}>FY {f}</option>)}</select>}
     <span className="bg-white/10 rounded-xl px-3 py-2.5 font-bold">FY {fy}</span>
    </div>
   </div>
  </div>
  <div className="bg-white rounded-2xl border overflow-hidden">
   <div className="p-5 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-3">
    <div><h3 className="text-xl font-black text-[#002344]">{rows.length} of {reg.rows.length} entries</h3><p className="text-sm text-emerald-700 mt-1">🔒 Locked register — entries cannot be edited or deleted here, so no other entry is affected. Correction ke liye Master Voucher me naya voucher banayein.</p></div>
    <div className="flex flex-wrap gap-2 items-center">
     <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search any column" className="px-3 py-2.5 border rounded-xl w-56"/>
     <button type="button" onClick={exportCsv} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">CSV</button>
     <button type="button" onClick={printPdf} className="bg-white border border-zinc-200 text-[#002344] px-4 py-2.5 rounded-xl font-bold">PDF</button>
    </div>
   </div>
   <div className="overflow-x-auto"><table className="w-full text-sm">
    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase"><tr>{reg.columns.map((c,i)=><th key={i} className={"p-3 whitespace-nowrap "+(isMoneyCol(c)?"text-right":"text-left")}>{c}</th>)}</tr></thead>
    <tbody className="divide-y">
     {rows.map((r,ri)=><tr key={ri}>{r.map((v,ci)=><td key={ci} className={"p-3 "+(isMoneyCol(reg.columns[ci])?"text-right font-semibold whitespace-nowrap":"")+ (dateCol===ci?" whitespace-nowrap":"")}>{isMoneyCol(reg.columns[ci])&&v!==""?money(v):(v===""?"—":v)}</td>)}</tr>)}
     {!rows.length&&<tr><td colSpan={reg.columns.length} className="p-10 text-center text-zinc-400">No entries found.</td></tr>}
    </tbody>
   </table></div>
  </div>
 </div>;
}


function Register({module,rows,loading,search,setSearch,add,archive}){
 const [open,setOpen]=useState(false), [status,setStatus]=useState("all"), [from,setFrom]=useState(""), [to,setTo]=useState("");
 const filtered=rows.filter(function(r){const d=String(r.recordDate||"").slice(0,10);return (status==="all"||String(r.status||"").toLowerCase()===status)&&(from===""||d>=from)&&(to===""||d<=to);});
 return <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-5 sm:p-7 border-b flex flex-col xl:flex-row xl:items-center justify-between gap-4"><div><h2 className="text-2xl font-black text-[#002344]">{LABELS[module]}</h2><p className="text-sm text-zinc-500 mt-1">{filtered.length} of {rows.length} record(s) · secure database</p></div><div className="flex gap-2"><div className="relative"><FaSearch className="absolute left-3 top-3 text-zinc-400"/><input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search ID / person" className="pl-9 pr-3 py-2.5 border rounded-xl w-56"/></div><div className="flex flex-wrap gap-2 items-center"><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm" title="From date"/><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm" title="To date"/><select value={status} onChange={e=>setStatus(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="completed">Completed</option><option value="archived">Archived</option></select><button onClick={function(){setOpen(!open);}} className="bg-[#002344] text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2"><FaPlus/> Add</button></div></div></div>
 {open&&<RecordForm module={module} onSave={function(d){add(module,d);setOpen(false);}}/>}
 {loading?<div className="p-10 text-center text-zinc-400">Loading…</div>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Details</th>{MONEY.has(module)&&<th className="p-3">Amount</th>}<th className="p-3">Status</th><th className="p-3"></th></tr></thead><tbody className="divide-y">{filtered.length===0?<tr><td colSpan="6" className="p-10 text-center text-zinc-400">No records yet.</td></tr>:filtered.map(function(r){return <tr key={r.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{r.recordId}</td><td className="p-3 whitespace-nowrap">{formatOfficeDate(r.recordDate)}</td><td className="p-3 min-w-[260px]"><b>{r.data&& (r.data.fullName||r.data.donorName||r.data.name||r.data.payee||r.data.title||r.recordType)||"—"}</b><div className="text-xs text-zinc-400 mt-1">{r.data&&(r.data.purpose||r.data.description||r.data.category||r.data.email||"")}</div></td>{MONEY.has(module)&&<td className="p-3 font-bold">₹{Number(r.amount||0).toLocaleString("en-IN")}</td>}<td className="p-3">{r.status}</td><td className="p-3 text-right whitespace-nowrap">{module==="certificates"&&<button onClick={function(){printDesignedDocument(r,"certificate");}} className="text-xs font-bold text-[#002344] mr-3"><FaCertificate className="inline mr-1"/>Certificate</button>}{module==="idcards"&&<button onClick={function(){printDesignedDocument(r,"idcard");}} className="text-xs font-bold text-[#002344] mr-3"><FaIdCard className="inline mr-1"/>ID Card</button>}{SPECIAL_DOCS.has(module)&&module!=="certificates"&&module!=="idcards"&&<button onClick={function(){printRecord(r);}} className="text-xs font-bold text-[#002344] mr-3"><FaPrint className="inline mr-1"/>PDF</button>}<button onClick={function(){if(window.confirm("Sirf yahi record archive hoga — baaki entries safe rahengi. Archive karein?"))archive(r.id);}} className="text-xs font-bold text-red-600">Archive</button></td></tr>;})}</tbody></table></div>}
 </div>;
}


function RecordForm({module,onSave,initial,submitLabel}){
 const blank={date:new Date().toISOString().slice(0,10),name:"",email:"",phone:"",amount:"",paymentMode:"Cash",purpose:"",category:"General",notes:"",projectId:"",pan:"",address:"",direction:"in",item:"",qty:"",unit:"Nos",source:"",recipient:"",subject:"",referenceNo:"",agenda:"",participants:"",decision:"",actionPoints:"",parties:"",terms:"",startDate:"",endDate:"",role:"",validUntil:"",certificateType:"Participation",memberId:"",sourceRecordId:""};
 const seed=initial?{...blank,date:String(initial.recordDate||"").slice(0,10)||blank.date,amount:initial.amount!=null?String(initial.amount):"",paymentMode:(initial.data&&initial.data.paymentMode)||"Cash",purpose:(initial.data&&initial.data.purpose)||"",category:(initial.data&&initial.data.category)||"General",notes:(initial.data&&initial.data.notes)||"",referenceNo:(initial.data&&(initial.data.referenceNo||initial.data.voucherNo))||"",direction:(initial.data&&initial.data.direction)||"in"}:blank;
 const [f,setF]=useState(seed);
 const [people,setPeople]=useState([]);
 useEffect(()=>{if(module!=="certificates")return; const token=localStorage.getItem(TOKEN_KEY)||""; const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"}; Promise.all(["members","volunteers"].map(m=>fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+m,{headers}).then(r=>r.ok?r.json():[]).catch(()=>[]))).then(([members,volunteers])=>setPeople([...(Array.isArray(members)?members:[]).map(r=>({...r,_source:"Member"})),...(Array.isArray(volunteers)?volunteers:[]).map(r=>({...r,_source:"Volunteer"}))]));},[module]);
 const selectPerson=(id)=>{const r=people.find(x=>String(x.id)===String(id));if(!r)return;const d=r.data||{};const personId=r.personId||d.memberId||d.volunteerId||d.officialId||"";setF(x=>({...x,name:d.fullName||d.name||d.title||"",role:d.role||d.position||(r._source==="Member"?"Member":"Volunteer"),memberId:personId,sourceRecordId:r.recordId||""}));};
 const set=(k,v)=>setF(x=>({...x,[k]:v}));
 const input=(k,ph,req=false)=><input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} required={req} className={cls}/>;
 const area=(k,ph)=><textarea value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} className={cls+" min-h-[92px]"}/>;
 const submit=e=>{e.preventDefault();
   if(module==="donations") return onSave({date:f.date,donorName:f.name,amount:f.amount,paymentMode:f.paymentMode,purpose:f.purpose,paymentStatus:"paid",email:f.email,phone:f.phone,pan:f.pan,address:f.address,notes:f.notes,projectId:f.projectId});
   if(module==="expenses") return onSave({date:f.date,payee:f.name,amount:f.amount,paymentMode:f.paymentMode,category:f.category,purpose:f.purpose,notes:f.notes,projectId:f.projectId});
   if(["cash","bank"].includes(module)){const dir=f.direction;const rt=dir==="in"?"Income":dir==="out"?"Expence":"Opening";const data={purpose:f.purpose,category:f.category,referenceNo:f.referenceNo,notes:f.notes,paymentMode:f.paymentMode,direction:dir,type:rt,amount:f.amount||null,receipt:dir==="in"?(f.amount||null):null,payment:dir==="out"?(f.amount||null):null};return onSave({recordDate:f.date,recordType:rt,amount:f.amount||null,paymentMode:f.paymentMode,direction:dir,data});}
   const data={...f}; onSave({recordDate:f.date,recordType:f.category,amount:f.amount||null,paymentMode:f.paymentMode,direction:f.direction,linkedRecordId:f.sourceRecordId||null,data});
 };
 const money=MONEY.has(module);
 return <form onSubmit={submit} className="p-5 bg-zinc-50 border-b grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {!(["cash","bank","inventory"].includes(module))&&input("name",module==="mou"?"Agreement / MoU title":module==="meetings"?"Meeting title":module==="certificates"?"Recipient Name":"Name / title / person",true)}
  {input("date","Date",true)}
  {money&&module!=="cash"&&module!=="bank"&&input("amount","Amount",true)}
  {["cash","bank"].includes(module)&&f.direction!=="opening"&&input("amount",module==="cash"?"Amount (₹)":"Amount (₹)",true)}
  {money&&<select value={f.paymentMode} onChange={e=>set("paymentMode",e.target.value)} className={cls}><option>Cash</option><option>Bank</option><option>UPI</option><option>Cheque</option><option>Other</option></select>}
  {money&&["cash","bank"].includes(module)&&<select value={f.direction} onChange={e=>set("direction",e.target.value)} className={cls}><option value="opening">Opening Balance / प्रारंभिक शेष</option><option value="in">Money In / प्राप्ति</option><option value="out">Money Out / भुगतान</option></select>}
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
  <button className="sm:col-span-2 lg:col-span-4 bg-[#002344] text-white py-3 rounded-xl font-bold hover:opacity-95">{submitLabel||("Save "+(LABELS[module]||"Record"))}</button>
 </form>;
}





export { BankBook, CashBook, FinRegister, Register, RecordForm };
