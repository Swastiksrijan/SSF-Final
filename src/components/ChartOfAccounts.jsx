// SSF Digital Office — Chart of Accounts (COA / लेखा-शीर्ष मास्टर).
//
// The head master every register and statement will reference. Built on the
// shared RegisterEngine so it carries bilingual headers + Add/Edit/View/Archive.
import React, { useEffect, useRef } from "react";
import RegisterEngine from "./RegisterEngine";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

export const COA_DEF = {
  id: "chartOfAccounts",
  codeKey: "chart-of-accounts",
  title: "Chart of Accounts",
  titleHi: "लेखा-शीर्ष मास्टर",
  intro: "Har income / expense / asset / liability ka sthir head code. Codes permanent — naye head add honge, purane nahi badlenge.",
  dateKey: "effectiveDate",
  amountKey: null,
  fields: [
    { k: "code", l: "Code", lHi: "कोड", t: "text", req: true },
    { k: "nameEn", l: "Name (English)", lHi: "नाम (अंग्रेज़ी)", t: "text", req: true },
    { k: "nameHi", l: "Name (Hindi)", lHi: "नाम (हिंदी)", t: "text", req: true },
    { k: "type", l: "Type", lHi: "प्रकार", t: "select", o: ["income", "expense", "asset", "liability", "fund"] },
    { k: "group", l: "Group", lHi: "समूह", t: "select", o: ["Income", "Programme", "Administrative", "Non-cash", "Current Asset", "Fixed Asset", "Investment", "Fund", "Liability"] },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Dormant / N.A. Yet", "Future"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function ChartOfAccounts({ rows, add, archive, restore, loading, reload }) {
  const seededRef = useRef(false);
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "chartOfAccounts", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  useEffect(() => {
    if (loading || seededRef.current || !reload) return;
    seededRef.current = true;
    fetch(ENDPOINTS.COA_SEED, { method: "POST", headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (d && d.created) reload(); })
      .catch(() => {});
  }, [loading, reload]);

  return (
    <RegisterEngine
      def={COA_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("chartOfAccounts", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
