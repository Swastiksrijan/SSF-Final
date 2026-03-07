import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { CheckCircle, XCircle, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import PageHero from "../components/PageHero";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "", // "success" or "error"
    message: "",
  });

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const hideToast = () => {
    setToast({ show: false, type: "", message: "" });
  };

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          email: formData.email,
          message: formData.message,
          subject: "Contact Us Inquiry - SSF"
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      showToast("success", "Message successfully submitted!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });

    } catch (error) {
      console.error("emailjs error:", error);
      showToast("error", "Failed to send message. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("success", `${label} copied to clipboard!`);
    }).catch(() => {
      showToast("error", "Failed to copy. Please copy manually.");
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:top-24 z-50 animate-in slide-in-from-top-4 md:slide-in-from-right-10 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-4 md:px-8 md:py-5 rounded-2xl shadow-2xl border ${toast.type === "success"
              ? "bg-white border-green-500 text-green-900"
              : "bg-white border-red-500 text-red-900"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600 shrink-0" />
            )}
            <span className="font-bold text-sm md:text-base">{toast.message}</span>
            <button onClick={hideToast} className="p-1 hover:bg-zinc-100 rounded-full transition-colors ml-auto">
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}
      <PageHero
        image="/images/real/community-team-group.jpg"
        title="Connect for Change"
        subtitle="Reach out to Swastik Srijan Foundation to explore collaborations and partnerships."
        hindiSubtitle="बदलाव के लिए हमसे जुड़ें - आपके सवाल और सुझाव हमारे लिए महत्वपूर्ण हैं।"
      />

      {/* ================= CONTENT ================= */}
      <section className="py-12 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-2xl md:text-5xl font-black text-[#002344] tracking-tight">
                Get in Touch
              </h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Whether you're an individual, organization, or a supporter interested in joining our mission, our team is here to connect with you. Contact us through the provided channels below.
              </p>
            </div>

            <div className="space-y-10">
              {[
                {
                  icon: <Mail className="w-5 h-5" />,
                  label: "Email Support",
                  value: (
                    <div className="space-y-8">
                      {/* General Inquiries */}
                      <div className="group/item">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-2 ml-0.5">General Inquiries 📧</p>
                        <button
                          onClick={() => copyToClipboard(CONTACT_INFO.primaryEmail, "Email")}
                          className="text-[#002344] text-lg sm:text-xl md:text-2xl font-semibold hover:text-[#fb8500] transition-colors flex items-center gap-3 text-left cursor-pointer transition-all duration-300 tracking-tight whitespace-nowrap"
                        >
                          <span className="border-b-[1px] border-zinc-200 group-hover:border-[#fb8500] pb-1">
                            {CONTACT_INFO.primaryEmail}
                          </span>
                        </button>
                      </div>

                      {/* President Contact */}
                      <div className="group/item">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mb-2 ml-0.5">President's Office 📩</p>
                        <button
                          onClick={() => copyToClipboard(CONTACT_INFO.presidentEmail, "Email")}
                          className="text-[#002344] text-lg sm:text-xl md:text-2xl font-semibold hover:text-[#fb8500] transition-colors flex items-center gap-3 text-left cursor-pointer transition-all duration-300 tracking-tight whitespace-nowrap"
                        >
                          <span className="border-b-[1px] border-zinc-200 group-hover:border-[#fb8500] pb-1">
                            {CONTACT_INFO.presidentEmail}
                          </span>
                        </button>
                      </div>

                      {/* Technical / Backup */}
                      <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100/80 mt-2">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between group/alt gap-2 sm:gap-4">
                            <span className="text-xs font-medium text-zinc-500 min-w-[80px]">Backup:</span>
                            <button
                              onClick={() => copyToClipboard(CONTACT_INFO.backupEmail, "Backup Email")}
                              className="text-zinc-600 hover:text-[#fb8500] text-sm font-medium transition-colors cursor-pointer break-all text-left flex-1"
                            >
                              {CONTACT_INFO.backupEmail}
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between group/alt gap-2 sm:gap-4 pt-2 border-t border-zinc-100">
                            <span className="text-xs font-medium text-zinc-500 min-w-[80px]">Tech Support:</span>
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                              <button
                                onClick={() => copyToClipboard(CONTACT_INFO.secondaryEmail, "Technical Email")}
                                className="text-zinc-600 hover:text-[#fb8500] text-sm font-medium transition-colors cursor-pointer break-all text-left"
                              >
                                {CONTACT_INFO.secondaryEmail}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                  sub: "Click any email to copy",
                  color: "bg-blue-50/50 text-[#002344]"
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  label: "Call Us",
                  value: (
                    <a
                      href={`tel:${CONTACT_INFO.phones.primary.replace(/\s+/g, '')}`}
                      className="text-[#002344] text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight hover:text-[#fb8500] transition-all inline-block border-b border-transparent hover:border-[#fb8500] break-words"
                    >
                      {CONTACT_INFO.phones.primaryFormatted}
                    </a>
                  ),
                  sub: "Mon - Sat, 9:00 AM - 6:00 PM (IST)",
                  color: "bg-green-50/50 text-green-600"
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  label: "Registered Office",
                  value: (
                    <p className="text-[#002344] text-sm md:text-lg font-medium leading-relaxed max-w-lg break-words">
                      {CONTACT_INFO.address.fullRegistered}
                    </p>
                  ),
                  sub: "Headquarters & Administrative Office",
                  color: "bg-red-50/50 text-[#d90429]"
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 md:gap-8 group/main">
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${item.color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border border-current opacity-80 transition-all duration-300 group-hover/main:opacity-100 group-hover/main:shadow-lg`}>
                    {React.cloneElement(item.icon, { className: "w-4 h-4 md:w-5 md:h-5" })}
                  </div>
                  <div className="space-y-2 min-w-0 flex-grow pt-1">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] font-serif italic">{item.label}</p>
                    <div className="transition-all duration-300">{item.value}</div>
                    <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 opacity-50 group-hover/main:opacity-80 transition-opacity">
                      <div className="w-1 h-1 rounded-full bg-zinc-300"></div>
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BSNL & WhatsApp Note */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 space-y-4">
              <div className="flex gap-4">
                <span className="text-2xl">📞</span>
                <div className="space-y-1">
                  <p className="font-bold text-[#002344] text-sm md:text-base">Contact Note</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Due to limited network availability on BSNL in some areas, calls may occasionally not connect.
                    <br />
                    <span className="font-serif italic text-zinc-500">BSNL नेटवर्क की सीमित उपलब्धता के कारण कभी-कभी कॉल कनेक्ट नहीं हो पाती।</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📲</span>
                <div className="space-y-1">
                  <p className="font-bold text-[#002344] text-sm md:text-base">WhatsApp Support</p>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    You are encouraged to send us a message on WhatsApp for faster response.
                    <br />
                    <span className="font-serif italic text-zinc-500">कृपया तेज़ और सुनिश्चित संपर्क के लिए WhatsApp पर संदेश भेजें।</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">🇮🇳</span>
                <div className="space-y-1">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    We proudly use BSNL services to support India’s public sector telecom, as a step towards self-reliance and national responsibility.
                    <br />
                    <span className="font-serif italic text-zinc-500">हम भारत की सार्वजनिक दूरसंचार सेवा BSNL को समर्थन देने के उद्देश्य से इसी नेटवर्क का उपयोग करते हैं।</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Inspirational Join Us Text */}
            <div className="space-y-4 border-t border-zinc-100 pt-8">
              <p className="text-base md:text-lg text-[#002344] font-medium leading-relaxed">
                If your thoughts, principles, or goals align with our organization in any way, or if you want to do something meaningful for society, do not hesitate to join us. Contact us today — because change begins with a conversation.
              </p>
              <p className="text-base md:text-lg text-[#fb8500] font-serif italic leading-relaxed">
                यदि आपके विचार, सिद्धांत या उद्देश्य हमारी संस्था से कहीं भी मेल खाते हैं, या आप समाज के लिए कुछ सार्थक करना चाहते हैं, तो हमसे जुड़ने में कोई संकोच न करें। आज ही हमसे संपर्क करें — क्योंकि बदलाव संवाद से शुरू होता है।
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/Volunteer"
                  className="flex-1 py-4 px-6 bg-[#002344] text-white font-bold rounded-xl text-center hover:bg-[#003366] transition-colors shadow-lg"
                >
                  Internal Application
                </Link>
                <a
                  href="https://forms.gle/S6Qc56QE8nLYdDTL9"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-4 px-6 bg-[#fb8500] text-white font-bold rounded-xl text-center hover:bg-[#e07600] transition-colors shadow-lg"
                >
                  Apply via Google Form
                </a>
              </div>
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Member Registration</p>
                <Link to="/Members" className="text-[#002344] font-bold hover:text-[#fb8500] flex items-center gap-2">
                  View Membership Plans & Benefits <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Explore</p>
                <a href="https://swastiksrijan.in/Humanity&Truth" target="_blank" rel="noreferrer" className="text-[#002344] font-bold hover:text-[#fb8500] flex items-center gap-2">
                  Read Humanity & Truth <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-5 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jane"
                    className="w-full px-6 md:px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-4">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can we help you today?"
                  className="w-full px-6 md:px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium resize-none text-sm md:text-base"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-6 text-xl group"
              >
                <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                <Send className={`w-6 h-6 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-2'}`} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>


    </main>
  );
}
