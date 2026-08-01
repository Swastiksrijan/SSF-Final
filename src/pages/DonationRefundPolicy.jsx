import React from "react";
import PageHero from "../components/PageHero";
import { CONTACT_INFO } from "../config/contact";

export default function DonationRefundPolicy() {
  return (
    <div className="w-full bg-zinc-50 font-inria">

      <PageHero
        image="/images/real/academy-board-compliance.jpg"
        title="Donation & Refund Policy"
        subtitle="Guidelines on donations, refund requests, and how we handle exceptional cases."
        hindiSubtitle="दान और धन-वापसी नीति"
      />

      <div className="max-w-5xl mx-auto py-16 px-4">

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border-l-8 border-[#003366]">
          <h2 className="text-3xl font-bold mb-6 text-zinc-900">Donation & Refund Policy</h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Swastik Srijan Foundation Samiti ("the Foundation") is an Indian registered non-profit organisation committed to transparency, responsible use of funds, and compliance with applicable laws. This Donation & Refund Policy explains our approach to donations and the limited circumstances under which refund requests will be considered.
          </p>
        </div>

        <div className="space-y-8">

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">1. Voluntary Donations</h3>
            <p className="text-zinc-600">
              All donations made to Swastik Srijan Foundation are voluntary. Donors may choose the amount and purpose of their contribution where options are provided during the donation process. By donating, the donor acknowledges that the donation is made willingly to support the Foundation's charitable activities.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">2. General Refund Principles</h3>
            <p className="text-zinc-600">
              Donations are generally non-refundable because funds are allocated and applied to charitable programmes, administrative costs, and commitments made on behalf of beneficiaries. Once a donation is successfully processed, it is treated as final in most circumstances.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">3. Exceptional Refund Cases</h3>
            <p className="text-zinc-600 mb-2">
              We will consider refund requests only in exceptional situations, for example:
            </p>
            <ul className="list-disc pl-5 text-zinc-600 space-y-2">
              <li>Duplicate transactions where the donor was charged more than once for the same donation.</li>
              <li>Technical or payment gateway errors that result in an incorrect amount being charged.</li>
            </ul>
            <p className="text-zinc-600 mt-3">
              Each request will be assessed on its merits. The Foundation reserves the right to approve or reject refund requests after verification.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">4. Refund Process & Verification</h3>
            <p className="text-zinc-600">
              To request a refund, please contact the Foundation with full transaction details (transaction ID, date, amount, payment method, and any supporting proofs). The Foundation will verify the claim and, if approved, refund the amount to the original payment method. Refunds may take additional time depending on the donor's bank or payment provider.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">5. Foundation Discretion</h3>
            <p className="text-zinc-600">
              The Foundation reserves the right to approve or reject refund requests after due verification. Approval is discretionary and will depend on the nature of the request and the evidence provided.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">6. Contact for Refund-Related Queries</h3>
            <p className="text-zinc-600 mb-2">
              For refund enquiries or to submit a refund request, please contact us at:
            </p>

            <p className="text-zinc-600">
              Email: <a href={`mailto:${CONTACT_INFO.primaryEmail}`} className="text-[#003366] underline">{CONTACT_INFO.primaryEmail}</a>
              <br /> Phone: <a href={`tel:${CONTACT_INFO.phones.primary}`} className="text-[#003366] underline">{CONTACT_INFO.phones.primary}</a>
            </p>

            <p className="text-zinc-500 mt-4 text-sm">
              Please include "Refund Request" in your email subject and attach any transaction receipts or proofs. We will acknowledge receipt and aim to respond within 7 working days.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-3 text-[#002344]">7. Updates to this Policy</h3>
            <p className="text-zinc-600">
              The Foundation may update this policy from time to time. The latest version published on the website will apply to donations made after the effective date.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
