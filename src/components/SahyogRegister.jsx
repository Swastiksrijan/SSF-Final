// SSF Digital Office — Sahyog Register (INCM-04).
//
// Founder / Office-Bearer / IT / Auditor / well-wisher support given to the
// organisation without a receipt: cash, advance, rent, fee, utility, service,
// goods or space. This is NOT a loan — it is voluntary contribution/sahyog, and
// recording it (name + mode + purpose) is what protects the organisation.
//
// In-kind sahyog is recorded with the dual-entry convention (INC-180 income +
// matching expense) so the year's activity shows gross, net effect nil.
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const SAHYOG_DEF = {
  id: "sahyog",
  codeKey: "sahyog-register",
  title: "Sahyog Register — Founder & Well-wisher Support",
  titleHi: "सहयोग रजिस्टर — संस्थापक एवं शुभचिंतक सहयोग",
  intro: "Founder / shubhchintak dwara diya gaya sahyog (cash ya in-kind). Ye loan nahi — voluntary contribution hai; record rakhna hi suraksha hai.",
  dateKey: "date",
  amountKey: "amountValue",
  fields: [
    { k: "sahyogKarta", l: "Sahyog Karta", lHi: "सहयोग कर्ता", t: "select", o: ["Founder", "Office Bearer", "IT Department", "Auditor", "Well-wisher", "Volunteer", "Other"] },
    { k: "name", l: "Name", lHi: "नाम", t: "text", req: true },
    { k: "sahyogType", l: "Sahyog Type", lHi: "सहयोग प्रकार", t: "select", o: ["Cash", "Advance", "Rent", "Fee", "Utility", "Service", "Goods", "Space"] },
    { k: "description", l: "Description", lHi: "विवरण", t: "text", full: true },
    { k: "amountValue", l: "Amount / Value (₹)", lHi: "राशि / मूल्य (₹)", t: "number", req: true },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Cash", "UPI", "Bank", "In-kind"] },
    { k: "inFavourOf", l: "In favour of", lHi: "किसके पक्ष में", t: "select", o: ["SSF (General)", "Project", "Office", "Programme"] },
    { k: "fund", l: "Fund", lHi: "निधि", t: "select", o: ["Unrestricted", "Restricted"] },
    { k: "receiptNo", l: "Receipt No. (optional)", lHi: "रसीद क्रमांक (वैकल्पिक)", t: "text" },
    { k: "adjustment", l: "Adjustment", lHi: "समायोजन", t: "select", o: ["No", "Yes — Adjusted"] },
    { k: "balance", l: "Balance", lHi: "शेष", t: "number" },
    { k: "voucherRef", l: "Voucher Ref", lHi: "वाउचर संदर्भ", t: "text" },
    { k: "verifiedBy", l: "Verified By", lHi: "सत्यापित", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function SahyogRegister({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "sahyog", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={SAHYOG_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("sahyog", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
