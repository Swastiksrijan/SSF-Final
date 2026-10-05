// SSF Digital Office — Bank / Cash Transfer Register (CORE-08).
//
// Records money moving between our own accounts (cash -> bank, bank -> cash,
// one bank account -> another) or between funds/projects. This is a transfer,
// not income or expense, so it must never inflate receipts or payments.
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const TRANSFER_DEF = {
  id: "transfer",
  codeKey: "transfer-register",
  title: "Bank / Cash Transfer Register",
  titleHi: "अंतरण रजिस्टर",
  intro: "Apne hi khaton ke beech paisa bhejna (cash↔bank, bank↔bank) ya nidhi/project ke beech. Ye aay-vyay nahi — sirf transfer hai.",
  dateKey: "date",
  amountKey: "amount",
  fields: [
    { k: "fromAccount", l: "From Account", lHi: "किस खाते से", t: "select", o: ["Cash in Hand", "Bank — UBI", "Bank — MGB", "Petty Cash / Imprest", "Other"] },
    { k: "toAccount", l: "To Account", lHi: "किस खाते में", t: "select", o: ["Bank — UBI", "Bank — MGB", "Cash in Hand", "Petty Cash / Imprest", "Other"] },
    { k: "amount", l: "Amount (₹)", lHi: "राशि (₹)", t: "number", req: true },
    { k: "mode", l: "Mode", lHi: "माध्यम", t: "select", o: ["NEFT / RTGS", "IMPS", "UPI", "Cheque", "Cash Deposit", "Cash Withdrawal", "Other"] },
    { k: "referenceNo", l: "Reference / UTR / Chq No.", lHi: "संदर्भ / यू.टी.आर.", t: "text" },
    { k: "fromFund", l: "From Fund", lHi: "किस निधि से", t: "text" },
    { k: "toFund", l: "To Fund", lHi: "किस निधि में", t: "text" },
    { k: "purpose", l: "Purpose", lHi: "उद्देश्य", t: "text", full: true },
    { k: "authorisedBy", l: "Authorised By", lHi: "अधिकृत", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function TransferRegister({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "transfer", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={TRANSFER_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("transfer", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
