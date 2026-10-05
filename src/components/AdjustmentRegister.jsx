// SSF Digital Office — Adjustment / Prior-period Entry Register (CORE-13).
//
// Corrections that come out of an audit or a book-closing: prior-period items,
// reclassifications, rounding and depreciation adjustments. Nothing is ever
// overwritten silently — every correction is a fresh, dated, reason-stated entry.
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const ADJUSTMENT_DEF = {
  id: "adjustment",
  codeKey: "adjustment-register",
  title: "Adjustment / Prior-period Entry Register",
  titleHi: "समायोजन / पूर्व-अवधि प्रविष्टि रजिस्टर",
  intro: "Audit ya year-close se nikli tathya-shuddhi. Kuch bhi chupke se overwrite nahi — har sudhaar ek nayi, tithi-sahit, kaaran-sahit entry hai.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "adjustType", l: "Adjustment Type", lHi: "समायोजन प्रकार", t: "select", o: ["Prior-period Income", "Prior-period Expense", "Reclassification", "Rounding", "Depreciation", "Provision", "Other"] },
    { k: "head", l: "Head / Account", lHi: "शीर्ष / खाता", t: "text", req: true },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "direction", l: "Direction", lHi: "दिशा", t: "select", o: ["Debit", "Credit"] },
    { k: "relatedFy", l: "Related FY", lHi: "संबंधित वित्त वर्ष", t: "text" },
    { k: "referenceNo", l: "Reference / Voucher No.", lHi: "संदर्भ / वाउचर क्रमांक", t: "text" },
    { k: "reason", l: "Reason / Basis", lHi: "कारण / आधार", t: "text", full: true, req: true },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "auditRef", l: "Audit Reference", lHi: "लेखा परीक्षा संदर्भ", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function AdjustmentRegister({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "adjustment", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={ADJUSTMENT_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("adjustment", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
