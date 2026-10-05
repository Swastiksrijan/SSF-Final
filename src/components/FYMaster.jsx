// SSF Digital Office — Financial Year Master + Opening Balance (वित्तीय वर्ष मास्टर).
//
// The FY spine of the MIS: one row per financial year with its opening balances
// (carried from the previous audited year's closing), closing balances, general
// fund roll-forward and lock state. Seeded from the canonical audited dataset.
import React, { useEffect, useRef } from "react";
import RegisterEngine from "./RegisterEngine";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

export const FY_DEF = {
  id: "fyMaster",
  codeKey: "fy-master",
  title: "Financial Year Master",
  titleHi: "वित्तीय वर्ष मास्टर",
  intro: "Har FY ka opening / closing balance, general fund aur lock state. Pichle saal ka closing agle saal ka opening banta hai.",
  dateKey: "effectiveDate",
  amountKey: null,
  fields: [
    { k: "fy", l: "Financial Year", lHi: "वित्तीय वर्ष", t: "text", req: true },
    { k: "openingCash", l: "Opening Cash", lHi: "प्रारंभिक नकद", t: "number" },
    { k: "openingBank", l: "Opening Bank", lHi: "प्रारंभिक बैंक", t: "number" },
    { k: "openingTotal", l: "Opening Total", lHi: "प्रारंभिक कुल", t: "number" },
    { k: "closingCash", l: "Closing Cash", lHi: "अंतिम नकद", t: "number" },
    { k: "closingBank", l: "Closing Bank", lHi: "अंतिम बैंक", t: "number" },
    { k: "closingTotal", l: "Closing Total", lHi: "अंतिम कुल", t: "number" },
    { k: "generalFundOpening", l: "General Fund (Opening)", lHi: "सामान्य निधि (प्रारंभिक)", t: "number" },
    { k: "generalFundClosing", l: "General Fund (Closing)", lHi: "सामान्य निधि (अंतिम)", t: "number" },
    { k: "fyStatus", l: "FY Status", lHi: "वर्ष स्थिति", t: "select", o: ["Audited", "Books", "Provisional", "Pending"] },
    { k: "lockState", l: "Lock State", lHi: "लॉक स्थिति", t: "select", o: ["Open", "Locked"] },
    { k: "auditor", l: "Auditor", lHi: "लेखा परीक्षक", t: "text" },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function FYMaster({ rows, add, archive, restore, loading, reload }) {
  const seededRef = useRef(false);
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "fyMaster", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  useEffect(() => {
    if (loading || seededRef.current || !reload) return;
    seededRef.current = true;
    fetch(ENDPOINTS.FY_MASTER_SEED, { method: "POST", headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (d && d.created) reload(); })
      .catch(() => {});
  }, [loading, reload]);

  return (
    <RegisterEngine
      def={FY_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("fyMaster", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
