import React from "react";
import {
  FaShieldAlt,
  FaHandHoldingHeart,
  FaReceipt,
  FaExchangeAlt,
  FaLock,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

const sections = [
  {
    icon: FaHandHoldingHeart,
    title: "Donation Refund Policy",
    text: "Donations to Swastik Srijan Foundation Samiti are voluntary contributions and are generally non-refundable after successful processing. Refunds may be considered for verified duplicate transactions, technical errors, or other exceptional circumstances approved after review.",
  },
  {
    icon: FaExchangeAlt,
    title: "Duplicate or Incorrect Payment",
    text: "If your account is debited more than once for the same donation, or a payment has been affected by a technical error, please contact us with the transaction details. We will verify the payment and take appropriate action where a refund is justified.",
  },
  {
    icon: FaReceipt,
    title: "Refund Request",
    text: "Please provide the donor name, transaction/reference ID, transaction date, amount, payment method, and a brief reason for the request. Supporting payment evidence may be requested for verification.",
  },
  {
    icon: FaCheckCircle,
    title: "Verification & Processing",
    text: "Every request is reviewed against our transaction records. If approved, the refund will normally be sent back through the original payment method, subject to payment-provider and banking procedures. The actual time taken may vary by the relevant provider.",
  },
];

export default function RefundAndCancellation() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Premium coded hero — no news-cutting image; donation/refund context is clearer and more professional. */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-orange-400/40 bg-slate-950 p-2 shadow-2xl">
          <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-xl backdrop-blur-md sm:p-8 lg:p-10">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-200">
                  <FaShieldAlt /> Secure Giving & Financial Clarity
                </div>
                <div className="mb-4 h-1.5 w-16 rounded-full bg-orange-400" />
                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  Donation <span className="text-orange-400">&</span> Refund Policy
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  Clear guidelines for donations, payment errors, refund requests and cancellations.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  दान, भुगतान संबंधी त्रुटियों, रिफंड अनुरोध और रद्दीकरण के लिए स्पष्ट नीति।
                </p>
                <div className="mt-7 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200">Voluntary Giving</span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200">Verified Transactions</span>
                  <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200">Transparent Process</span>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-sm items-center justify-center">
                <div className="relative flex aspect-square w-64 items-center justify-center rounded-full border border-orange-300/30 bg-white/[0.06] shadow-[0_0_80px_rgba(249,115,22,0.12)] backdrop-blur-md sm:w-72">
                  <div className="absolute inset-5 rounded-full border border-dashed border-orange-300/25" />
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-orange-300/30 bg-orange-400/10 text-orange-300 shadow-2xl sm:h-36 sm:w-36">
                    <FaHandHoldingHeart className="text-6xl sm:text-7xl" />
                  </div>
                  <div className="absolute bottom-7 right-5 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs font-semibold text-white shadow-lg">
                    <FaLock className="mr-2 inline text-orange-300" /> Trust & Care
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Swastik Srijan Foundation Samiti</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">A clear and responsible refund process</h2>
              <p className="mt-2 max-w-3xl leading-7 text-slate-600">We aim to handle payment-related concerns fairly, transparently and only after the relevant transaction has been verified.</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-slate-950 px-5 py-4 text-sm text-white">
              <div className="font-semibold">Last Updated</div>
              <div className="mt-1 text-orange-300">14 September 2026</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Icon className="text-xl" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Membership Fee Policy</h2>
            <p className="mt-3 leading-7 text-slate-600">Membership fees are generally non-refundable after successful registration, except where an exceptional case is reviewed and approved by the Foundation management.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Training & Program Fees</h2>
            <p className="mt-3 leading-7 text-slate-600">Fees for training, workshops or other programmes are governed by the specific terms communicated at registration. Any applicable cancellation or refund conditions will be stated with the programme information.</p>
          </article>
        </div>

        <section className="mt-6 rounded-3xl border border-orange-200 bg-orange-50/70 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Donation Receipts & Tax Documentation</h2>
          <p className="mt-3 leading-7 text-slate-700">Where applicable, donation receipts or other supporting documents are issued based on the information provided by the donor and the requirements of applicable law. Any tax benefit is subject to applicable provisions and donor eligibility; this policy does not guarantee a tax deduction.</p>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">Cancellation & Exceptional Cases</h2>
              <p className="mt-3 leading-7 text-slate-300">Donation cancellation is generally not available after successful processing. Verified duplicate payments, technical errors and other genuine exceptional cases may be reviewed individually.</p>
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment Safety</h2>
              <p className="mt-3 leading-7 text-slate-300">Please do not share your OTP, PIN, CVV, password or banking credentials with anyone claiming to represent the Foundation. For a suspicious transaction, contact your bank/payment provider promptly and also inform us.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">Need help with a transaction?</h2>
            <p className="mt-2 text-slate-600">Please keep your transaction/reference number ready so our team can verify the request.</p>
          </div>
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Foundation</p>
              <p className="mt-2 font-bold text-slate-900">Swastik Srijan Foundation Samiti</p>
              <p className="mt-1 text-slate-600">Rewa, Madhya Pradesh, India</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Refund / Support</p>
              <a href="mailto:info@swastiksrijan.in" className="mt-2 inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700">
                <FaEnvelope /> info@swastiksrijan.in
              </a>
              <p className="mt-2 text-slate-600">Website: swastiksrijan.in</p>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm leading-6 text-slate-500">
          This policy should be read together with the Foundation's Terms of Use and Privacy Policy. The Foundation may update this policy when its processes or applicable requirements change.
        </div>
      </main>
    </div>
  );
}
