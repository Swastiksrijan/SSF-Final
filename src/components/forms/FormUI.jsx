// Shared SSF form primitives.
//
// Every form on the site (public pages, Join SSF / Get Involved modals and the
// logged-in User Portal) renders through these components so labels, spacing,
// focus rings, validation and upload styling stay identical everywhere. The
// matching class names live in `src/index.css` under "SSF UNIFIED FORM SYSTEM".
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaUpload } from "react-icons/fa";

export function Field({ label, required, hint, error, children, className = "" }) {
  return (
    <label className={`ssf-field ${className}`.trim()}>
      {label && (
        <span className="ssf-label">
          {label}
          {required && <span className="ssf-req" aria-hidden="true">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="ssf-hint">{hint}</span>}
      {error && <span className="ssf-hint" style={{ color: "#B91C1C", fontWeight: 600 }}>{error}</span>}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={`ssf-input ${className}`.trim()} {...props} />;
}

export function Select({ children, className = "", ...props }) {
  return <select className={`ssf-select ${className}`.trim()} {...props}>{children}</select>;
}

export function Textarea({ className = "", rows = 5, ...props }) {
  return <textarea rows={rows} className={`ssf-textarea ${className}`.trim()} {...props} />;
}

export function FileField({ label, required, hint, accept, onChange, id, className = "" }) {
  return (
    <Field label={label} required={required} hint={hint} className={className}>
      <span className="relative flex items-center">
        <FaUpload className="absolute left-4 text-[#176447] pointer-events-none" aria-hidden="true" />
        <input id={id} type="file" accept={accept} onChange={onChange} className="ssf-file pl-11" />
      </span>
    </Field>
  );
}

export function FormNote({ children, tone = "info" }) {
  return <div className={`ssf-form-note ${tone === "warn" ? "ssf-alert-error" : ""}`.trim()}>{children}</div>;
}

export function Alert({ children, tone = "error" }) {
  const Icon = tone === "success" ? FaCheckCircle : FaExclamationCircle;
  return (
    <div className={`ssf-alert ssf-alert-${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
      <Icon className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ children, busy, busyLabel = "Submitting…", ...props }) {
  return (
    <button type="submit" className="ssf-submit" disabled={busy} {...props}>
      {busy ? <><FaSpinner className="animate-spin" aria-hidden="true" /> {busyLabel}</> : children}
    </button>
  );
}

export function FormHead({ eyebrow, title, subtitle, icon: Icon }) {
  return (
    <div className="ssf-form-head flex items-start gap-3">
      {Icon && <span className="w-11 h-11 shrink-0 rounded-2xl bg-[#EAF0F6] text-[#176447] flex items-center justify-center text-lg"><Icon /></span>}
      <div className="min-w-0">
        {eyebrow && <p className="ssf-eyebrow">{eyebrow}</p>}
        <h2 className="ssf-form-title">{title}</h2>
        {subtitle && <p className="ssf-form-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

export function SuccessPanel({ title, children, reference, actions }) {
  return (
    <div className="ssf-success">
      <div className="ssf-success-icon"><FaCheckCircle aria-hidden="true" /></div>
      <h3 className="text-2xl font-black text-[#12345A]">{title}</h3>
      {children && <p className="text-sm text-[#26343D] mt-2 max-w-md mx-auto leading-relaxed">{children}</p>}
      {reference && <p className="text-sm text-[#617389] mt-2">Reference: <strong className="text-[#12345A]">{reference}</strong></p>}
      {actions && <div className="flex flex-wrap justify-center gap-3 mt-6">{actions}</div>}
    </div>
  );
}
