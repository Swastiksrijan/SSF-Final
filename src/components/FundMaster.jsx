// SSF Digital Office — Fund / Project Master (MSTR-02).
//
// Every rupee in the books belongs to a fund. This master defines those funds
// (general/unrestricted, restricted, corpus, project-wise) so income and
// expenditure registers can be tagged and a fund-utilisation view is possible.
// Built on the shared RegisterEngine (bilingual + versioned Edit + archive).
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

export const FUND_DEF = {
  id: "fundMaster",
  codeKey: "fund-master",
  title: "Fund / Project Master",
  titleHi: "निधि / परियोजना मास्टर",
  intro: "Har nidhi ka sthir code — General, Corpus, Restricted, project-wise. Register entries isi fund par tag honge.",
  dateKey: "date",
  amountKey: "openingBalance",
  fields: [
    { k: "fundCode", l: "Fund Code", lHi: "निधि कोड", t: "text", req: true },
    { k: "fundNameEn", l: "Fund Name (English)", lHi: "निधि नाम (अंग्रेज़ी)", t: "text", req: true },
    { k: "fundNameHi", l: "Fund Name (Hindi)", lHi: "निधि नाम (हिंदी)", t: "text", req: true },
    { k: "fundType", l: "Fund Type", lHi: "निधि प्रकार", t: "select", o: ["Unrestricted / General", "Restricted", "Corpus / Endowment", "Project / Programme"] },
    { k: "project", l: "Project / Programme", lHi: "परियोजना", t: "select", o: ["None", "Education", "Environment", "Yoga & Wellness", "Skill & Livelihood", "Health", "Other"] },
    { k: "donor", l: "Donor / Grantor", lHi: "दानदाता / अनुदानकर्ता", t: "text" },
    { k: "openingBalance", l: "Opening Balance (₹)", lHi: "प्रारंभिक शेष (₹)", t: "number" },
    { k: "status", l: "Status", lHi: "स्थिति", t: "select", o: ["Active", "Dormant / N.A. Yet", "Future", "Closed"] },
    { k: "remarks", l: "Remarks", lHi: "टिप्पणी", t: "text", full: true }
  ]
};

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export default function FundMaster({ rows, add, archive, restore, loading, reload }) {
  const data = Array.isArray(rows) ? rows : [];

  const putRecord = async (id, payload) => {
    const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
      method: "PUT", headers: authHeaders(),
      body: JSON.stringify({ module: "fundMaster", recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
    });
    return r.ok;
  };

  return (
    <RegisterEngine
      def={FUND_DEF}
      rows={data}
      loading={loading}
      onAdd={(payload) => add("fundMaster", payload)}
      onUpdate={putRecord}
      onArchive={archive}
      onRestore={restore}
      reload={reload}
    />
  );
}
