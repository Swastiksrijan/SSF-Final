import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { ENDPOINTS } from "../config/api";
import PageHero from "../components/PageHero";

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => setToast({ show: false, type: "", message: "" }), 5000);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const showToast = (type, message) => setToast({ show: true, type, message });
  const hideToast = () => setToast({ show: false, type: "", message: "" });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast("error", "Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(ENDPOINTS.CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to submit right now.");

      showToast("success", "Message successfully submitted!");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      showToast("error", error.message || "Failed to send message. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => showToast("success", `${label} copied to clipboard!`)).catch(() => showToast("error", "Failed to copy. Please copy manually."));
  };

  return (
    <main className="min-h-screen bg-white">
      {toast.show && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 md:top-24 z-50">
          <div className={`flex items-center gap-3 px-4 py-4 md:px-8 md:py-5 rounded-2xl shadow-2xl border ${toast.type === "success" ? "bg-white border-green-500 text-green-900" : "bg-white border-red-500 text-red-900"}`}>
            {toast.type === "success" ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <span className="font-bold text-sm md:text-base">{toast.message}</span>
            <button onClick={hideToast} className="p-1 hover:bg-zinc-100 rounded-full ml-auto"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <PageHero image="/images/real/community-team-group.jpg" title="Connect for Change" subtitle="Reach out to Swastik Srijan Foundation to explore collaborations and partnerships." hindiSubtitle="बदलाव के लिए हमसे जुड़ें - आपके सवाल और सुझाव हमारे लिए महत्वपूर्ण हैं।" />

      <section className="py-12 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-5xl font-black text-[#002344] tracking-tight">Get in Touch</h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">Whether you're an individual, organization, or a supporter interested in joining our mission, our team is here to connect with you.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002344] shrink-0"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Email Support</p>
                  <button onClick={() => copyToClipboard(CONTACT_INFO.primaryEmail, "Email")} className="text-[#002344] text-lg font-semibold hover:text-[#fb8500] break-all text-left">{CONTACT_INFO.primaryEmail}</button>
                  <p className="text-xs text-zinc-400 mt-1">Click to copy</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0"><Phone className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Call Us</p>
                  <a href={`tel:${CONTACT_INFO.phones.primary.replace(/\s+/g, "")}`} className="text-[#002344] text-xl font-semibold hover:text-[#fb8500]">{CONTACT_INFO.phones.primaryFormatted}</a>
                  <p className="text-xs text-zinc-400 mt-1">Mon - Sat, 9:00 AM - 6:00 PM (IST)</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#d90429] shrink-0"><MapPin className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Registered Office</p>
                  <p className="text-[#002344] text-sm md:text-base font-medium leading-relaxed">{CONTACT_INFO.address.fullRegistered}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <p className="font-bold text-[#002344] mb-2">WhatsApp Support 📲</p>
              <p className="text-sm text-zinc-600 leading-relaxed">You are encouraged to send us a message on WhatsApp for faster response.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/Volunteer" className="flex-1 py-4 px-6 bg-[#002344] text-white font-bold rounded-xl text-center hover:bg-[#003366] transition-colors">Join as Volunteer</Link>
              <Link to="/Members" className="flex-1 py-4 px-6 bg-[#fb8500] text-white font-bold rounded-xl text-center hover:bg-[#e07600] transition-colors">Membership <FaArrowRight className="inline ml-2" /></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-5 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-[#002344]">Send us a Message</h3>
              <p className="text-sm text-zinc-400 mt-2">Your message will be securely recorded and sent to our team.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">First Name *</label><input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required className="w-full px-6 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 font-medium" /></div>
                <div className="space-y-2"><label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full px-6 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 font-medium" /></div>
              </div>
              <div className="space-y-2"><label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Email Address *</label><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required className="w-full px-6 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 font-medium" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Mobile Number</label><input name="phone" type="tel" inputMode="numeric" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))} placeholder="Enter mobile number" className="w-full px-6 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 font-medium" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-2">Message *</label><textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder="How can we help you today?" required minLength={10} className="w-full px-6 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 font-medium resize-none" /></div>
              <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-5 text-lg group disabled:opacity-60 disabled:cursor-not-allowed"><span>{isSubmitting ? "Submitting..." : "Send Message"}</span><Send className={`w-5 h-5 inline ml-3 ${isSubmitting ? "animate-pulse" : "group-hover:translate-x-2"}`} /></button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
