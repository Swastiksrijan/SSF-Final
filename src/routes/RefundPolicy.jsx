
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/RefundPolicy")({
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <div className="w-full bg-white pt-24 pb-20 font-sans text-zinc-800">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-[#002344]">Refund Policy</h1>
        <div className="prose lg:prose-xl text-zinc-600">
          <p className="mb-4">
            Swastik Srijan Foundation takes the utmost care to process donations as per the instructions given by our donors, online and offline. However, in case of an unlikely event of an erroneous donation or if the donor would like to cancel his/her donation, the Foundation will respond to the donor within 7 working days of receiving a valid request for refund from the donor.
          </p>
          <p className="mb-4">
            The timely refund of the donation will depend upon the type of credit card/banking instrument used during the transaction. The donor will have to send the Foundation a written request for a refund within 2 days of making the donation to Swastik Srijan Foundation's official email address.
          </p>
          <p className="mb-4">
            <strong>Proof of deduction</strong> of the donation amount must be included in the email. Start your email subject with "Refund Request".
          </p>
        </div>
      </div>
    </div>
  );
}
