import { useState } from "react";
import { FaUsers, FaHandsHelping, FaHeart, FaHandshake, FaCheckCircle } from "react-icons/fa";
import MemberForm from "../components/MemberForm";
import VolunteerForm from "../components/VolunteerForm";
import DonorForm from "../components/DonorForm";
import GetInvolvedInterestForm from "../components/GetInvolvedInterestForm";

const OPTIONS = [
  { id: "member", label: "Member", hindi: "सदस्य बनें", icon: FaUsers, tone: "blue" },
  { id: "volunteer", label: "Volunteer", hindi: "स्वयंसेवक बनें", icon: FaHandsHelping, tone: "green" },
  { id: "donor", label: "Donor", hindi: "सहयोगी / दाता बनें", icon: FaHeart, tone: "emerald" },
  { id: "partner", label: "Partner", hindi: "साथी / सहयोगी संस्था बनें", icon: FaHandshake, tone: "navy" },
];

export default function JoinFormPage() {
  const [active, setActive] = useState("member");

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6fbff] via-white to-[#f5faf7] text-[#17202a] px-4 py-8 md:py-14">
      <div className="max-w-6xl mx-auto">
        <header className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-[#168a5a] text-xs md:text-sm font-black tracking-[.14em] uppercase">
            <FaCheckCircle /> Swastik Srijan Foundation
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-[#06284a]">
            Swastik Srijan Foundation से जुड़िए
          </h1>
          <p className="mt-4 text-base md:text-xl leading-relaxed text-slate-600">
            आपका पहला कदम यहीं से शुरू होता है। अपनी भूमिका चुनिए और नीचे दिया गया form भरिए।
          </p>
        </header>

        <section className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-xl p-4 md:p-7">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {OPTIONS.map(({ id, label, hindi, icon: Icon, tone }) => {
              const selected = active === id;
              const iconClass =
                tone === "green" || tone === "emerald"
                  ? "text-[#168a5a] bg-emerald-50"
                  : tone === "navy"
                    ? "text-[#06284a] bg-blue-50"
                    : "text-[#0b4f86] bg-blue-50";
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  aria-pressed={selected}
                  className={"text-left rounded-2xl border-2 p-4 md:p-5 transition-all " + (selected ? "border-[#168a5a] bg-[#f2fbf6] shadow-md" : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white")}
                >
                  <span className={"w-11 h-11 rounded-xl flex items-center justify-center text-lg " + iconClass}>
                    <Icon />
                  </span>
                  <span className="block mt-3 font-black text-[#06284a]">{label}</span>
                  <span className="block mt-1 text-xs md:text-sm text-slate-500">{hindi}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-7">
            {active === "member" && <MemberForm />}
            {active === "volunteer" && <VolunteerForm />}
            {active === "donor" && <DonorForm />}
            {active === "partner" && <GetInvolvedInterestForm type="partner" />}
          </div>
        </section>

        <p className="text-center mt-7 text-sm text-slate-500">
          Member • Volunteer • Donor • Partner — अपनी भूमिका चुनिए, फिर form submit कीजिए।
        </p>
      </div>
    </main>
  );
}
