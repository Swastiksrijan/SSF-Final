// Shared factory for thin RegisterEngine wrappers.
//
// A register wrapper only needs to know its `module` key and its `def`; the
// factory wires the versioned PUT (which is what makes Edit audit-versioned).
import React from "react";
import RegisterEngine from "./RegisterEngine";
import { ENDPOINTS } from "../config/api";

const authHeaders = () => {
  const token = localStorage.getItem("ssf_admin_token") || "";
  return { Authorization: "Bearer " + token, "Content-Type": "application/json", "X-Office-Actor": "admin", "X-Office-Actor-Name": "SSF Admin" };
};

export const makeRegister = (module, def) =>
  function Register({ rows, add, archive, restore, loading, reload }) {
    const putRecord = async (id, payload) => {
      const r = await fetch(ENDPOINTS.DIGITAL_OFFICE_RECORDS + "/" + id, {
        method: "PUT", headers: authHeaders(),
        body: JSON.stringify({ module, recordDate: payload.recordDate, recordType: payload.recordType, amount: payload.amount, status: "active", data: payload.data })
      });
      return r.ok;
    };
    return (
      <RegisterEngine
        def={def}
        rows={Array.isArray(rows) ? rows : []}
        loading={loading}
        onAdd={(payload) => add(module, payload)}
        onUpdate={putRecord}
        onArchive={archive}
        onRestore={restore}
        reload={reload}
      />
    );
  };
