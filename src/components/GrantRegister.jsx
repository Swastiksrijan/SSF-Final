// SSF Digital Office — Grant Register (INCM-06, domestic).
//
// Domestic institutional grants: the agreement, amount sanctioned vs received,
// the balance, and the utilisation-certificate (UC) due date. Foreign/FCRA
// grants have their own register (INCM-08, kept dormant for now).
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const GRANT_DEF = {
  id: "grant",
  codeKey: "grant-register",
  title: "Grant Register (Domestic)",
  titleHi: "अनुदान रजिस्टर (घरेलू)",
  intro: "Sansthaanugat anudaan — sanctioned vs praapt rashi, shesh aur UC (उपयोग प्रमाणपत्र) due date.",
  dateKey: "date",
  amountKey: "receivedAmount",
  fields: [
    { k: "grantor", l: "Grantor / Funder", lHi: "अनुदानकर्ता", t: "text", req: true },
    { k: "grantType", l: "Grant Type", lHi: "अनुदान प्रकार", t: "select", o: ["Government", "Corporate / CSR", "Trust / Foundation", "Individual", "International (FCRA)"] },
    { k: "agreementNo", l: "Agreement No.", lHi: "करार क्रमांक", t: "text" },
    { k: "project", l: "Project / Programme", lHi: "परियोजना", t: "select", o: ["Education", "Environment", "Yoga & Wellness", "Skill & Livelihood", "Health", "General", "Other"] },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text", full: true },
    { k: "sanctionedAmount", l: "Sanctioned (₹)", lHi: "स्वीकृत राशि (₹)", t: "number" },
    { k: "receivedAmount", l: "Received (₹)", lHi: "प्राप्त राशि (₹)", t: "number", req: true },
    { k: "balanceAmount", l: "Balance (₹)", lHi: "शेष (₹)", t: "number" },
    { k: "fund", l: "Fund", lHi: "निधि", t: "select", o: ["Restricted", "Unrestricted / General"] },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Bank", "Cheque", "UPI", "Other"] },
    { k: "ucDueDate", l: "UC Due Date", lHi: "उपयोग प्रमाणपत्र देय", t: "date" },
    { k: "ucStatus", l: "UC Status", lHi: "उपयोग प्रमाणपत्र स्थिति", t: "select", o: ["Pending", "Submitted", "Accepted"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function GrantRegister({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "grant", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={GRANT_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("grant", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
