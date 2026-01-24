
import { FaWhatsapp, FaHandHoldingHeart, FaUserPlus, FaDonate } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

export default function OfficialOverview() {
    const cards = [
        {
            title: "Established",
            content: ["2013", "Registered under MP Societies Act, 1973"],
        },
        {
            title: "Compliance",
            content: ["NITI Aayog (NGO Darpan)", "CSR 1, 12A & 80G – Provisionally Approved, Final Approval Applied"],
        },
        {
            title: "Presence",
            content: ["All India"],
        },
    ];

    return (
        <section className="py-12 container mx-auto px-6 relative">
            {/* Floating Top Statement - Scrolling Ticker */}
            <div className="absolute top-4 left-4 right-4 md:left-12 md:right-12 mx-auto bg-[#003366] text-white py-2 rounded-t-2xl z-0 shadow-lg border-t border-x border-white/20 overflow-hidden">
                <div className="flex animate-scrollX whitespace-nowrap w-fit">
                    {/* Repeated content for seamless scrolling loop */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-4 px-4">
                            <span className="font-semibold tracking-wide text-sm">
                                Together, we empower communities & transform lives.
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#fb8500]"></span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#004d99] to-[#002344] rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden z-10 mt-6">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#3b82f6] opacity-20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#d90429] opacity-10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-center space-y-8">
                    <div className="space-y-3">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white drop-shadow-md">
                            Swastik Srijan Foundation
                        </h2>
                        <div className="inline-block border-b-2 border-white pb-1">
                            <span className="text-lg md:text-xl font-bold text-white/90 uppercase tracking-wider">
                                [SSF Group – Pan India]
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {cards.map((card, i) => (
                            <div key={i} className="bg-[#001529]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center text-center h-full hover:bg-[#001529]/80 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                                <h3 className="text-[#60a5fa] text-lg font-bold mb-3 uppercase tracking-widest">{card.title}</h3>
                                <div className="space-y-1 text-white/90 text-sm font-medium">
                                    {card.content.map((line, idx) => (
                                        <p key={idx}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <a
                            href="https://chat.whatsapp.com/your-group-link"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 transform bg-[#25D366] text-white hover:bg-[#1ebc57] hover:-translate-y-0.5 shadow-lg shadow-green-900/20 text-sm min-w-[180px] justify-center"
                        >
                            <FaWhatsapp className="text-xl" /> Join WhatsApp
                        </a>

                        <Link
                            to="/Volunteer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 transform bg-[#002344] text-white hover:bg-[#003366] hover:-translate-y-0.5 shadow-lg shadow-blue-900/20 text-sm min-w-[180px] justify-center"
                        >
                            <FaUserPlus className="text-xl" /> Volunteer with Us
                        </Link>

                        <a
                            href="https://pages.razorpay.com/pl_NCiTn7wnBOJFYG/view"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 transform bg-[#fb8500] text-white hover:bg-[#e07600] hover:-translate-y-0.5 shadow-lg shadow-orange-900/20 text-sm min-w-[180px] justify-center"
                        >
                            <FaDonate className="text-xl" /> Support Us
                        </a>

                        <Link
                            to="/Members"
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-200 transform bg-[#d90429] text-white hover:bg-[#b00422] hover:-translate-y-0.5 shadow-lg shadow-red-900/20 text-sm min-w-[180px] justify-center"
                        >
                            <FaHandHoldingHeart className="text-xl" /> Become a Member
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
