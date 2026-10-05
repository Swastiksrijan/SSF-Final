// SSF Digital Office — Petty Cash / Imprest Register (CORE-07).
//
// Small day-to-day expenses that never touch the main cash book. Each entry
// records whether cash was received into the imprest float or spent from it,
// so the running imprest balance is always visible.
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const PETTY_DEF = {
  id: "pettyCash",
  codeKey: "petty-cash",
  title: "Petty Cash / Imprest Register",
  titleHi: "फुटकर रोकड़ / अग्रिम रजिस्टर",
  intro: "Chhote din-pratidin kharch jo mukhya rokd bahi me nahi jaate. Float (imprest) me praapti aur kharch dono darj karein.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "direction", l: "Direction", lHi: "दिशा", t: "select", o: ["Received into float", "Spent from float"] },
    { k: "particulars", l: "Particulars", lHi: "विवरण", t: "text", req: true, full: true },
    { k: "category", l: "Category", lHi: "श्रेणी", t: "select", o: ["Office", "Stationery", "Postage & Courier", "Tea & Refreshment", "Local Travel", "Repair & Maintenance", "Miscellaneous"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "paymentMode", l: "Mode", lHi: "माध्यम", t: "select", o: ["Cash", "UPI", "Bank"] },
    { k: "imprestHolder", l: "Imprest Holder", lHi: "अग्रिम धारक", t: "text" },
    { k: "voucherNo", l: "Voucher No.", lHi: "वाउचर क्रमांक", t: "text" },
    { k: "billNo", l: "Bill / Receipt No.", lHi: "बिल / रसीद क्रमांक", t: "text" },
    { k: "approvedBy", l: "Approved By", lHi: "स्वीकृत", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function PettyCashRegister({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "pettyCash", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={PETTY_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("pettyCash", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
