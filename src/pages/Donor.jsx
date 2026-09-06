import { FaHeart, FaShieldAlt, FaHandHoldingHeart } from "react-icons/fa";
import PageHero from "../components/PageHero";
import DonorForm from "../components/DonorForm";

export default function Donor() {
  return (
    <div className="w-full bg-white font-sans text-zinc-900 overflow-hidden">
      <PageHero
        image="/images/uploads/donate-hero.jpg"
        title="Become a Donor"
        subtitle="Support meaningful work in education, health, livelihood, women empowerment and community welfare."
        hindiSubtitle="दाता बनें • सेवा और सामाजिक परिवर्तन में अपना योगदान दें"
      />

      <section className="py-16 px-4 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6600] flex items-center justify-center mb-5"><FaHeart size={22} /></div>
            <h2 className="text-xl font-bold text-[#002344]">Make an Impact</h2>
            <p className="mt-2 text-zinc-600">Your contribution can help strengthen grassroots initiatives and community development.</p>
          </div>
          <div className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#002344] flex items-center justify-center mb-5"><FaHandHoldingHeart size={22} /></div>
            <h2 className="text-xl font-bold text-[#002344]">Register Your Donation</h2>
            <p className="mt-2 text-zinc-600">After donating, submit your details below so the Foundation can maintain your donor record and support receipt processing.</p>
          </div>
          <div className="bg-white rounded-3xl border border-zinc-200 p-7 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5"><FaShieldAlt size={22} /></div>
            <h2 className="text-xl font-bold text-[#002344]">Secure & Transparent</h2>
            <p className="mt-2 text-zinc-600">Your submitted donor information is used for donation records and receipt support.</p>
          </div>
        </div>
      </section>

      <DonorForm />
    </div>
  );
}
