import React from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaFileInvoice,
  FaHandHoldingHeart,
  FaInfoCircle,
  FaLock,
  FaMoneyBillWave,
  FaReceipt,
  FaShieldAlt,
  FaUndoAlt,
} from "react-icons/fa";

const sections = [
  {
    icon: FaHandHoldingHeart,
    title: "Donation Refund Policy",
    text: "Donations made to Swastik Srijan Foundation Samiti are voluntary and are generally non-refundable once successfully processed. A refund may be considered where a duplicate transaction, technical error, incorrect payment, or other exceptional circumstance is verified.",
  },
  {
    icon: FaCreditCard,
    title: "Duplicate or Incorrect Payment",
    text: "If the same donation is charged more than once, the donor may contact us with the transaction references. Where an incorrect or duplicate payment is verified, appropriate corrective action will be taken through the applicable payment or banking channel.",
  },
  {
    icon: FaUndoAlt,
    title: "Refund Request Process",
    text: "Refund requests should include the donor name, transaction date, amount, transaction/reference ID, payment method, and a brief explanation of the issue. We may request additional information needed to verify the transaction. Requests are reviewed after verification and are not automatically approved.",
  },
  {
    icon: FaClock,
    title: "Verification & Processing",
    text: "Once a request is received, the transaction details may be checked against our records and, where applicable, the payment provider or bank. Any approved refund will be processed through the appropriate channel as soon as reasonably practicable after verification. Actual credit time may depend on the payment provider or bank.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Membership Fee Policy",
    text: "Membership fees paid to the Foundation are generally non-refundable after successful registration, except in exceptional circumstances approved by the management after review of the relevant facts.",
  },
  {
    icon: FaCheckCircle,
    title: "Training & Program Fees",
    text: "Fees paid for training programs, workshops, registrations, or other activities will be governed by the specific cancellation, participation, or refund terms communicated at the time of registration.",
  },
  {
    icon: FaReceipt,
    title: "Donation Receipts & Tax Documentation",
    text: "Where applicable, the Foundation may issue donation receipts or other supporting documentation based on the information available in its records and the requirements applicable to the donation. Tax deduction eligibility is subject to applicable law and the donor's eligibility; no particular tax benefit is guaranteed by this policy.",
  },
  {
    icon: FaShieldAlt,
    title: "Payment & Security",
    text: "Donors should use only the official donation channels and should never share an OTP, UPI PIN, card PIN, CVV, password, or banking credentials with any person claiming to represent the Foundation. If an unauthorized transaction is suspected, contact the relevant bank or payment provider promptly and inform the Foundation with the transaction details.",
  },
  {
    icon: FaInfoCircle,
    title: "Cancellation & Exceptions",
    text: "A successful donation cannot ordinarily be cancelled simply because the donor changes their mind. Exceptional cases may be reviewed individually by the Foundation. Approval of a refund will depend on the facts, transaction status, available records, and any applicable payment-provider or legal requirements.",
  },
];

export default function RefundAndCancellation() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Coded hero: no external image required; the frame keeps text safely inside on mobile. */}
      <section className="relative overflow-hidden px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-orange-400/30 bg-gradient-to-br from-[#0d2138] via-[#091827] to-[#07111f] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.38)] sm:rounded-[34px] sm:p-3">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 px-5 py-12 sm:rounded-[27px] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.45fr_0.55fr]">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-5 shadow-2xl backdrop-blur-md sm:p-7 lg:p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                  <FaHandHoldingHeart /> Donor Care & Transparency
                </div>
                <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  Donation <span className="text-orange-400">&</span> Refund Policy
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                  Clear guidance on donations, refunds, cancellations, receipts, and payment-related requests.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  दान, रिफंड, रद्दीकरण और भुगतान संबंधी अनुरोधों के लिए स्पष्ट नीति।
                </p>
                <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold text-slate-200">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Voluntary Donations</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Verified Requests</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Transparent Process</span>
                </div>
              </div>

              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full border border-orange-400/30 bg-white/[0.035] shadow-[0_0_70px_rgba(249,115,22,0.12)] sm:h-60 sm:w-60">
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white/10 bg-[#0b1b2d] shadow-2xl sm:h-44 sm:w-44">
                  <FaShieldAlt className="text-4xl text-orange-400" />
                  <span className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-slate-300">Trust & Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            [FaLock, "Safe Transactions", "Use official payment channels and keep payment credentials private."],
            [FaReceipt, "Clear Records", "Keep your transaction/reference ID for any future request."],
            [FaFileInvoice, "Proper Documentation", "Receipts and supporting documents are handled according to applicable requirements."],
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-lg transition hover:-translate-y-1 hover:border-orange-400/30">
              <Icon className="mb-4 text-2xl text-orange-400" />
              <h2 className="font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-orange-400/20 bg-orange-400/[0.06] p-5 sm:p-6">
          <div className="flex gap-3">
            <FaInfoCircle className="mt-1 shrink-0 text-orange-400" />
            <p className="text-sm leading-7 text-slate-300">
              <strong className="text-white">Important:</strong> A refund is not automatic merely because a request is submitted. Every request is subject to transaction verification and the circumstances of the case.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="group rounded-2xl border border-white/10 bg-[#0b1929]/90 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-orange-400/30">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/10 text-orange-400 transition group-hover:bg-orange-400/15">
                  <Icon />
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-orange-300/70">Policy {String(index + 1).padStart(2, "0")}</div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0c1c2e] to-[#0a1725] p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Need help with a transaction?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Please contact us with the transaction/reference details so the request can be reviewed.</p>
            </div>
            <a href="mailto:info@swastiksrijan.in" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400">
              Contact Support
            </a>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5 text-sm leading-7 text-slate-400">
            <strong className="text-white">Swastik Srijan Foundation Samiti</strong><br />
            Email: info@swastiksrijan.in<br />
            Website: swastiksrijan.in
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs leading-6 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Last Updated: 14 September 2026</span>
          <span>Effective upon publication • Subject to applicable law and policy updates</span>
        </div>
      </section>
    </main>
  );
}
