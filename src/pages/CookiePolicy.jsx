import { FaCookieBite, FaShieldAlt, FaGlobe, FaSlidersH, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { Link } from "@tanstack/react-router";

const items = [
    {
        title: "What Are Cookies?",
        icon: FaCookieBite,
        text: "Cookies are small text files that a website may store on your device. Similar browser technologies may also be used for essential session handling, preferences, security and website functionality."
    },
    {
        title: "How We Use Them",
        icon: FaShieldAlt,
        text: "Swastik Srijan Foundation uses cookies or similar technologies only where they are needed to operate, secure or improve the website. Where optional technologies are introduced, their purpose should be explained clearly."
    },
    {
        title: "Essential Functionality",
        icon: FaCheckCircle,
        text: "Some storage or similar technologies may be necessary for features such as secure sessions, language preferences, forms, navigation and other requested website functions. Disabling them may affect parts of the website."
    },
    {
        title: "Analytics & Performance",
        icon: FaGlobe,
        text: "If analytics or performance technologies are enabled on the website, they may help us understand general usage patterns and improve content, accessibility and performance. We do not use this section to claim that a particular analytics provider is active unless it is actually configured."
    },
    {
        title: "Third-Party Services",
        icon: FaShieldAlt,
        text: "Donation, payment, social-media, video or other external services may use their own cookies or similar technologies when you interact with them. Their own privacy and cookie policies apply to those services."
    },
    {
        title: "Your Choices",
        icon: FaSlidersH,
        text: "You can manage cookies through your browser or device settings. Blocking some cookies may affect website functionality. Where optional consent controls are provided, you may use them to manage available choices."
    }
];

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#002344] font-sans">
            <section className="relative overflow-hidden bg-[#002344] pt-36 pb-20 px-5 sm:px-8">
                <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full border border-[#FF6600]/30" />
                <div className="absolute -bottom-36 -left-20 w-80 h-80 rounded-full border border-white/10" />
                <div className="relative max-w-6xl mx-auto rounded-[28px] border border-white/20 p-2 shadow-2xl">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-6 sm:px-10 lg:px-14 py-10 sm:py-12">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6600]/40 bg-[#FF6600]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#ff9a45]">
                                    <FaCookieBite /> Website Policy
                                </div>
                                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                                    Cookie <span className="text-[#FF6600]">Policy</span>
                                </h1>
                                <p className="mt-4 text-lg sm:text-xl text-zinc-200 leading-relaxed">
                                    A clear explanation of cookies and similar technologies used to support a reliable and transparent website experience.
                                </p>
                                <p className="mt-2 text-sm sm:text-base text-zinc-400">कुकी नीति — वेबसाइट पर कुकीज़ और समान तकनीकों के उपयोग की स्पष्ट जानकारी।</p>
                                <div className="mt-7 inline-flex items-center rounded-xl border border-white/10 bg-black/10 px-4 py-2.5 text-xs sm:text-sm text-zinc-300">
                                    Last Updated: <span className="ml-2 font-bold text-white">14 September 2026</span>
                                </div>
                            </div>
                            <div className="shrink-0 flex justify-center">
                                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-[#FF6600]/40 bg-white/[0.06] flex items-center justify-center shadow-2xl">
                                    <div className="absolute inset-3 rounded-full border border-white/10" />
                                    <FaCookieBite className="text-5xl sm:text-6xl text-[#FF6600]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
                <div className="grid lg:grid-cols-[1.5fr_.8fr] gap-8 mb-10">
                    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-7 sm:p-9">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF6600] mb-3">Our approach</p>
                        <h2 className="text-2xl sm:text-3xl font-black mb-4">Simple, useful and transparent</h2>
                        <p className="text-zinc-600 leading-8">
                            We aim to use only the technologies reasonably required for the website experience and to explain their purpose in clear language. This policy should be read together with our Privacy Policy and Terms of Use.
                        </p>
                    </div>
                    <div className="rounded-3xl bg-[#002344] text-white p-7 sm:p-9 shadow-xl">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF6600] mb-3">Related policies</p>
                        <div className="space-y-3">
                            <Link to="/PrivacyPolicy" className="block rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10 transition">Privacy Policy →</Link>
                            <Link to="/TermsAndConditions" className="block rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10 transition">Terms of Use →</Link>
                            <Link to="/Transparency" className="block rounded-xl border border-white/10 px-4 py-3 hover:bg-white/10 transition">Transparency →</Link>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    {items.map(({ title, icon: Icon, text }, index) => (
                        <section key={title} className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-7 sm:p-8 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#002344] text-[#FF6600] flex items-center justify-center shrink-0"><Icon /></div>
                                <div>
                                    <p className="text-xs font-black text-zinc-400 mb-1">0{index + 1}</p>
                                    <h2 className="text-xl font-black mb-3">{title}</h2>
                                    <p className="text-zinc-600 leading-7">{text}</p>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <section className="mt-8 rounded-3xl border border-[#FF6600]/20 bg-[#fff8f0] p-7 sm:p-9">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#FF6600] text-white flex items-center justify-center shrink-0"><FaEnvelope /></div>
                        <div>
                            <h2 className="text-xl font-black mb-2">Questions or privacy requests?</h2>
                            <p className="text-zinc-600 leading-7">For questions about cookies, privacy or website data practices, contact us at <a className="font-bold text-[#002344] hover:text-[#FF6600]" href={`mailto:${CONTACT_INFO.primaryEmail}`}>{CONTACT_INFO.primaryEmail}</a>.</p>
                        </div>
                    </div>
                </section>

                <p className="mt-8 text-xs text-zinc-500 leading-6">
                    This policy may be updated when website functionality, service providers or applicable requirements change. For the latest version, please refer to this page.
                </p>
            </main>
        </div>
    );
}
