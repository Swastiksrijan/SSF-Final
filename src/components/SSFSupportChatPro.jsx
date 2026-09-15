import { useState } from "react";
import { FaComments, FaTimes, FaWhatsapp, FaArrowRight } from "react-icons/fa";

const CATEGORIES = [
  ["🏢", "संस्था के बारे में", "SSF क्या है?"],
  ["🤝", "Join / Volunteer", "Volunteer कैसे बनें?"],
  ["💰", "Donation", "Donation कैसे करें?"],
  ["📄", "Registration & Documents", "Registration details"],
  ["🎓", "Education & Skills", "SSF के objectives क्या हैं?"],
  ["❤️", "Health & Social Work", "SSF के objectives क्या हैं?"],
  ["🤝", "CSR / Partnership", "CSR partnership"],
  ["📊", "Reports / Transparency", "Annual reports कहाँ हैं?"],
];

function openOldChat(question) {
  const launcher = document.querySelector('[aria-label="Open WhatsApp support"]');
  if (launcher) launcher.click();
  if (!question) return;
  window.setTimeout(() => {
    const buttons = [...document.querySelectorAll('button')];
    const quick = buttons.find((button) => button.textContent?.trim() === question);
    if (quick) quick.click();
  }, 120);
}

export default function SSFSupportChatPro() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{`[aria-label="Open WhatsApp support"]{display:none!important}`}</style>
      <div className="fixed bottom-6 right-4 md:right-6 z-[70] flex flex-col items-end gap-3">
        {open && (
          <div className="w-[min(92vw,390px)] rounded-3xl border border-white/20 bg-[#061d33]/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">SSF Assistant</p>
                  <p className="mt-0.5 text-[10px] text-emerald-300">● Online • Verified information</p>
                </div>
                <FaComments className="text-lg text-[#FFB347]" />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-white/75">विषय चुनें — फिर SSF का verified उत्तर तुरंत खुलेगा।</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CATEGORIES.map(([icon, label, question]) => (
                <button key={label} type="button" onClick={() => openOldChat(question)} className="group min-h-[62px] rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2 text-left text-white transition-all active:scale-[0.98] hover:bg-white/[0.13]">
                  <span className="text-lg">{icon}</span>
                  <span className="mt-1 flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight"><span>{label}</span><FaArrowRight className="shrink-0 text-[9px] text-[#FFB347] opacity-70 group-hover:opacity-100" /></span>
                </button>
              ))}
            </div>
            <button type="button" onClick={() => openOldChat("")} className="mt-2 w-full rounded-2xl bg-white px-3 py-2.5 text-[11px] font-bold text-[#061d33]">💬 अपना सवाल लिखें</button>
            <a href="https://wa.me/919718346691?text=Namaste%20Swastik%20Srijan%20Foundation%20team%2C%20mujhe%20SSF%20ke%20baare%20mein%20jankari%20chahiye." target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-3 py-2.5 text-[11px] font-bold text-white"><FaWhatsapp /> SSF Team से बात करें</a>
          </div>
        )}
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/70 transition-transform hover:scale-105 active:scale-95" aria-label="Open SSF Assistant">
          {open ? <FaTimes className="text-xl" /> : <FaComments className="text-xl" />}
        </button>
      </div>
    </>
  );
}
