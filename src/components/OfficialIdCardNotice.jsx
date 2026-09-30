import React from "react";

/**
 * Shared portal document guidance. The existing official ID-card generator
 * remains the source of truth; this component only provides a safe, reusable
 * presentation note for portal document sections.
 */
export default function OfficialIdCardNotice({ type = "Member" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Official {type} ID Card</p>
          <p className="mt-1 text-xs text-slate-500">
            Your official ID card is issued after approval and is generated using SSF's existing official card design.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Official
        </span>
      </div>
    </div>
  );
}
