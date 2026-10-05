// SSF-IMS bridge to the legacy Digital Office data contract.
// The ported components read rows shaped
//   { id, recordId, module, recordType, recordDate, status, data:{...} }
// and call add/updateRecord/archive/restore. The helpers below are copied from
// SSFDigitalOffice.jsx so the ported screens behave exactly like the old office.
/* eslint-disable react-refresh/only-export-components */
import { useCallback, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import logoImg from '../assets/new-logo.png';
import { LABELS } from './oldOfficeModules';

export const TOKEN_KEY = 'ssf_admin_token';

export const cls = "w-full px-3 py-3 rounded-xl border border-zinc-200 bg-white outline-none focus:ring-2 focus:ring-[#002344]/20";

export function formatOfficeDate(value){ if(!value)return "—";
 const s=String(value);
 const m=s.match(/^(\\d{4})-(\\d{2})-(\\d{2})/);
 if(m)return m[3]+"-"+m[2]+"-"+m[1];
 const d=new Date(value);
 return Number.isNaN(d.getTime())?s:d.toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"});
}

export function SimpleOfficeCard({title,subtitle,children}){return <div className="space-y-5"><div className="bg-[#002344] text-white rounded-2xl p-6"><h2 className="text-2xl font-black">{title}</h2><p className="text-white/70 mt-1">{subtitle}</p></div>{children}</div>}

export const downloadPdf=function(doc,filename){
 try{ doc.save(filename||"ssf-document.pdf"); }
 catch(_e){ try{ const url=doc.output("bloburl"); const a=document.createElement("a"); a.href=url; a.download=filename||"ssf-document.pdf"; document.body.appendChild(a); a.click(); a.remove(); }catch(err){ console.error("PDF download failed",err); } }
};

const actorHeaders = token => ({Authorization:"Bearer "+(token||localStorage.getItem(TOKEN_KEY)||""),"Content-Type":"application/json","X-Office-Actor":"admin","X-Office-Actor-Name":"SSF Admin"});
const apiModule = module => module==="meetingResolution" ? "meetingResolutions" : module;

export async function officeLoad(module, search=""){
  const dataModule=apiModule(module);
  const q=ENDPOINTS.DIGITAL_OFFICE_RECORDS+"?module="+encodeURIComponent(dataModule)+(search?"&search="+encodeURIComponent(search):"");
  const r=await fetch(q,{headers:actorHeaders()});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.message||"Unable to load records.");
  const raw=Array.isArray(d)?d:(Array.isArray(d.records)?d.records:[]);
  return raw.filter(x=>x.status!=="deleted");
}

export async function officeSummary(){
  try{ const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_SUMMARY,{headers:actorHeaders()}); return r.ok?await r.json():null; }catch{ return null; }
}

export async function officeAdd(module,payload){
  const endpoint=module==="donations"?ENDPOINTS.DIGITAL_OFFICE_DONATIONS:module==="expenses"?ENDPOINTS.DIGITAL_OFFICE_EXPENSES:ENDPOINTS.DIGITAL_OFFICE_RECORDS;
  const body=(module==="donations"||module==="expenses")?payload:Object.assign({module:module},payload);
  const r=await fetch(endpoint,{method:"POST",headers:actorHeaders(),body:JSON.stringify(body)});
  const out=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(out.detail?(out.message+" "+out.detail):(out.message||"Save failed."));
  return true;
}

export async function officeUpdate(id,module,data){
  const hasWrap=data&&typeof data.data==="object"&&data.data!==null;
  const inner=hasWrap?data.data:data;
  const body={module:module,data:inner,status:"active",
    recordDate:data.recordDate||data.meetingDate||data.eventDate||data.date||new Date().toISOString().slice(0,10),
    recordType:data.recordType||data.changeType||data.eventType||"Record"};
  const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"PUT",headers:actorHeaders(),body:JSON.stringify(body)});
  const out=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(out.message||"Update failed.");
  return true;
}

export async function officeArchive(id){ const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"DELETE",headers:actorHeaders()}); return r.ok; }
export async function officeRestore(id){ const r=await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS+"/"+id,{method:"PUT",headers:actorHeaders(),body:JSON.stringify({status:"active"})}); return r.ok; }

// ---- export helpers (verbatim from the old office) -------------------------
export function flattenExport(data){
  return (data||[]).map(function(x){
   const nested=x.data&&typeof x.data==="object"?x.data:{};
   const row={ID:x.recordId||"",Module:LABELS[x.module]||x.module||"",Type:x.recordType||"",Date:x.recordDate?formatOfficeDate(x.recordDate):"",Amount:x.amount||"",PaymentMode:x.paymentMode||"",Status:x.status||"",PersonID:x.personId||"",LinkedID:x.linkedRecordId||""};
   Object.entries(nested).forEach(function(entry){
    const key=entry[0], value=entry[1];
    row[key]=value===null||value===undefined?"":(typeof value==="object"?JSON.stringify(value):String(value));
   });
   return row;
  });
}

export function exportRows(data,name){
  const flat=flattenExport(data);
  const headers=Array.from(new Set(flat.reduce(function(all,row){return all.concat(Object.keys(row));},[])));
  if(!headers.length)return;
  const csvEscape=function(value){const s=value===null||value===undefined?"":String(value);return '"'+s.replace(/"/g,'""')+'"';};
  const lines=[headers.map(csvEscape).join(",")];
  flat.forEach(function(row){ lines.push(headers.map(function(h){return csvEscape(row[h]);}).join(",")); });
  const csv="\uFEFF"+lines.join("\r\n")+"\r\n";
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");const url=URL.createObjectURL(blob);
  a.href=url;a.download=name+".csv";document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
}

export function exportExcel(data,name){
  const flat=flattenExport(data);
  const headers=Array.from(new Set(flat.reduce(function(all,row){return all.concat(Object.keys(row));},[])));
  if(!headers.length)return;
  const escXml=function(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");};
  const cell=function(v){const value=v===null||v===undefined?"":String(v);return '<Cell><Data ss:Type="String">'+escXml(value)+'</Data></Cell>';};
  const rowsXml=["<Row>"+headers.map(cell).join("")+"</Row>",...flat.map(function(row){return "<Row>"+headers.map(function(h){return cell(row[h]);}).join("")+"</Row>";})].join("");
  const xml='<?xml version="1.0" encoding="UTF-8"?>'+'<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'+'<Worksheet ss:Name="SSF Digital Office"><Table>'+rowsXml+'</Table></Worksheet></Workbook>';
  const blob=new Blob(["\uFEFF",xml],{type:"application/vnd.ms-excel"});
  const a=document.createElement("a");const url=URL.createObjectURL(blob);
  a.href=url;a.download=name+".xls";document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
}

export function printRecord(r){
  const d=new jsPDF(); const data=r.data||{}; d.setTextColor(0,35,68); d.addImage(logoImg,"PNG",16,9,18,18); d.setFontSize(18); d.text("Swastik Srijan Foundation Samiti",105,18,{align:"center"}); d.setFontSize(11); d.setTextColor(80); d.text((LABELS[r.module]||r.module)+" · "+r.recordId,105,26,{align:"center"});
  let y=42; d.setTextColor(20); d.setFontSize(11); const lines=[]; Object.entries(data).forEach(([k,v])=>{if(v!==null&&v!==undefined&&String(v).trim()!==""){let val=String(v); if(val.length>95) val=val.slice(0,95)+"…"; lines.push([k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase()),val]);}}); lines.forEach(([k,v])=>{d.setFont(undefined,"bold");d.text(k+":",16,y);d.setFont(undefined,"normal");d.text(v,58,y);y+=7;if(y>275){d.addPage();y=20;}}); d.setFontSize(9); d.setTextColor(120); d.text("Computer-generated office record · SSF Digital Office",105,288,{align:"center"}); downloadPdf(d,r.recordId+".pdf");
}

export function exportPdf(data,title){
  const d=new jsPDF();d.addImage(logoImg,"PNG",14,8,18,18);d.setFontSize(16);d.text("Swastik Srijan Foundation Samiti",36,16);d.setFontSize(11);d.text(title,14,32);
  let y=42;
  (data||[]).forEach(function(x,index){
   const nested=x.data&&typeof x.data==="object"?x.data:{};
   const fields=[["Record ID",x.recordId],["Module",LABELS[x.module]||x.module],["Record Type",x.recordType],["Record Date",x.recordDate?formatOfficeDate(x.recordDate):""],["Status",x.status]];
   Object.entries(nested).forEach(function(entry){const key=entry[0],value=entry[1];if(value!==null&&value!==undefined&&String(value).trim()!==""){fields.push([key.replace(/([A-Z])/g," $1").replace(/^./,function(ch){return ch.toUpperCase();}),String(value)]);}});
   d.setFont(undefined,"bold");d.setTextColor(0,35,68);d.text("Record "+(index+1),14,y);y+=7;
   fields.forEach(function(pair){let value=String(pair[1]??"");const wrapped=d.splitTextToSize(value,132);d.setFont(undefined,"bold");d.setTextColor(40);d.text(pair[0]+":",16,y);d.setFont(undefined,"normal");d.text(wrapped,58,y);y+=Math.max(7,wrapped.length*5);if(y>275){d.addPage();y=20;}});
   y+=4;if(y>275){d.addPage();y=20;}
  });
  d.setFontSize(9);d.setTextColor(120);d.text("Computer-generated office record · SSF Digital Office",105,288,{align:"center"});d.save(title.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".pdf");
}

// ---- row hook --------------------------------------------------------------
export function useOfficeRows(module){
  const [rows,setRows]=useState([]);
  const [summary,setSummary]=useState(null);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState("");
  const reload=useCallback(async()=>{
    try{
      const [r,s]=await Promise.all([officeLoad(module).catch(()=>[]),officeSummary()]);
      setRows(r); if(s)setSummary(s);
    }finally{ setLoading(false); }
  },[module]);
  useEffect(()=>{ let alive=true; setLoading(true);
    (async()=>{ const r=await officeLoad(module).catch(()=>[]); if(alive){ setRows(r); setLoading(false); } })();
    return ()=>{ alive=false; };
  },[module]);
  const add=useCallback(async(m,payload)=>{ try{ await officeAdd(m||module,payload); await reload(); return true; }catch(e){ setNotice(e.message||"Save failed."); return false; } },[module,reload]);
  const updateRecord=useCallback(async(id,m,data)=>{ try{ await officeUpdate(id,m||module,data); await reload(); return true; }catch(e){ setNotice(e.message||"Update failed."); return false; } },[module,reload]);
  const archive=useCallback(async(id)=>{ try{ await officeArchive(id); await reload(); return true; }catch(e){ setNotice(e.message||"Archive failed."); return false; } },[module,reload]);
  const restore=useCallback(async(id)=>{ try{ await officeRestore(id); await reload(); return true; }catch(e){ setNotice(e.message||"Restore failed."); return false; } },[module,reload]);
  return { rows, summary, loading, notice, setNotice, reload, add, updateRecord, archive, restore };
}
