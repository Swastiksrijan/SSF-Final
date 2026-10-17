// Shared visual pieces for the logged-in dashboards (user portal + admin).
// Keeping them in one file means the two dashboards cannot drift apart in
// spacing, colour or focus behaviour.
import { FaCheckCircle, FaCircle, FaExclamationCircle, FaInfoCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";

const STATUS_TONES = {
  approved: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  paid: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  completed: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  selected: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  offline: { chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  pending: { chip: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  submitted: { chip: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  new: { chip: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  reviewed: { chip: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  contacted: { chip: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  changes_requested: { chip: "bg-amber-50 text-amber-800 ring-amber-300", dot: "bg-amber-500" },
  rejected: { chip: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
  failed: { chip: "bg-red-50 text-red-700 ring-red-200", dot: "bg-red-500" },
  not_required: { chip: "bg-zinc-100 text-zinc-600 ring-zinc-200", dot: "bg-zinc-400" },
};

const STATUS_LABELS = {
  approved: "Approved", paid: "Paid", completed: "Completed", selected: "Selected",
  offline: "Received", pending: "Under review", submitted: "Under review", new: "Under review",
  reviewed: "Reviewed", contacted: "Contacted", changes_requested: "Correction needed",
  rejected: "Not approved", failed: "Failed", not_required: "Not required", closed: "Closed",
};

export const statusLabel = (value) => {
  const key = String(value || "pending").trim().toLowerCase();
  return STATUS_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export function StatusChip({ status, className = "" }) {
  const key = String(status || "pending").trim().toLowerCase();
  const tone = STATUS_TONES[key] || STATUS_TONES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide ring-1 ${tone.chip} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {statusLabel(key)}
    </span>
  );
}

// A compact KPI tile used across both dashboards.
export function StatCard({ label, value, hint, icon: Icon, tone = "navy", onClick }) {
  const tones = {
    navy: "bg-[#12345A] text-white",
    green: "bg-[#176447] text-white",
    gold: "bg-[#F7A814] text-[#12345A]",
    white: "bg-white text-[#12345A]",
  };
  const shell = `text-left rounded-2xl p-5 shadow-sm border transition ${onClick ? "hover:-translate-y-0.5 hover:shadow-md cursor-pointer" : ""} ${tone === "white" ? "border-[#D8E1EA]" : "border-transparent"} ${tones[tone] || tones.navy}`;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${tone === "white" ? "text-zinc-400" : "opacity-70"}`}>{label}</p>
        {Icon && <Icon className={tone === "white" ? "text-[#176447]" : "opacity-80"} />}
      </div>
      <p className="text-2xl font-black mt-2 leading-none">{value}</p>
      {hint && <p className={`text-[11px] mt-1.5 ${tone === "white" ? "text-zinc-500" : "opacity-70"}`}>{hint}</p>}
    </>
  );
  return onClick ? <button type="button" onClick={onClick} className={shell}>{body}</button> : <div className={shell}>{body}</div>;
}

export function SectionCard({ title, subtitle, eyebrow, actions, children, className = "" }) {
  return (
    <section className={`bg-white rounded-3xl border border-[#EAF0F6] shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="p-5 md:p-6 border-b border-[#EAF0F6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#176447]">{eyebrow}</p>}
            {title && <h2 className="text-lg md:text-xl font-black text-[#12345A] mt-0.5">{title}</h2>}
            {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export function EmptyState({ title, children, icon: Icon = FaInfoCircle }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D8E1EA] bg-[#FAFBFC] p-8 text-center">
      <Icon className="text-2xl text-[#B9C7D6] mx-auto" />
      <p className="font-black text-[#12345A] mt-3">{title}</p>
      {children && <div className="text-sm text-zinc-500 mt-1 max-w-lg mx-auto">{children}</div>}
    </div>
  );
}

const ALERT_TONES = {
  info: { shell: "bg-[#EAF0F6] border-[#D8E1EA] text-[#12345A]", Icon: FaInfoCircle },
  success: { shell: "bg-emerald-50 border-emerald-200 text-emerald-800", Icon: FaCheckCircle },
  warning: { shell: "bg-amber-50 border-amber-200 text-amber-900", Icon: FaExclamationCircle },
  error: { shell: "bg-red-50 border-red-200 text-red-700", Icon: FaTimesCircle },
  loading: { shell: "bg-[#EAF0F6] border-[#D8E1EA] text-[#12345A]", Icon: FaSpinner },
};

export function InlineAlert({ tone = "info", children, className = "" }) {
  const { shell, Icon } = ALERT_TONES[tone] || ALERT_TONES.info;
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold ${shell} ${className}`}>
      <Icon className={tone === "loading" ? "mt-0.5 animate-spin" : "mt-0.5"} />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

export function Timeline({ items }) {
  if (!items?.length) return null;
  return (
    <ol className="relative border-l-2 border-[#EAF0F6] ml-2 space-y-5">
      {items.map((item, index) => (
        <li key={item.key || index} className="pl-5 relative">
          <span className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${item.done ? "bg-[#176447]" : "bg-[#D8E1EA]"}`} />
          <p className="text-sm font-black text-[#12345A]">{item.title}</p>
          {item.detail && <p className="text-xs text-zinc-500 mt-0.5">{item.detail}</p>}
          {item.at && <p className="text-[11px] text-zinc-400 mt-1">{item.at}</p>}
        </li>
      ))}
    </ol>
  );
}

export function ProgressRing({ value = 0, size = 76, label }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EAF0F6" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#176447" strokeWidth="6" strokeLinecap="round" strokeDasharray={dash + " " + circumference} />
      </svg>
      <span className="absolute text-sm font-black text-[#12345A]">{label ?? `${pct}%`}</span>
    </div>
  );
}

export function Chip({ children, tone = "zinc" }) {
  const tones = {
    zinc: "bg-zinc-100 text-zinc-600",
    navy: "bg-[#EAF0F6] text-[#12345A]",
    green: "bg-emerald-50 text-emerald-700",
    gold: "bg-[#FEF3DA] text-[#8A5A00]",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone] || tones.zinc}`}>{children}</span>;
}

export const Dot = FaCircle;
