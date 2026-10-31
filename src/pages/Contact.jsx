import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FaArrowRight } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { ENDPOINTS } from "../config/api";
import PageHero from "../components/PageHero";
import { Field, Input, Textarea, SubmitButton } from "../components/forms/FormUI";

export default function Contact() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", enquiryType: "General enquiry", organisation: "", message: "" });
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
        body: JSON.stringify({ ...formData, message: `Enquiry type: ${formData.enquiryType}\nOrganisation: ${formData.organisation || "Not provided"}\n\n${formData.message}` }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to submit right now.");

      showToast("success", "Message successfully submitted!");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", enquiryType: "General enquiry", organisation: "", message: "" });
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

      <PageHero image="/images/real/community-education-meeting.jpg" title="Connect for Change" subtitle="Reach out to Swastik Srijan Foundation to explore collaborations and partnerships." hindiSubtitle="बदलाव के लिए हमसे जुड़ें - आपके सवाल और सुझाव हमारे लिए महत्वपूर्ण हैं।" />

      <section className="py-12 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-5xl font-black text-[#12345A] tracking-tight">Get in Touch</h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">Whether you're an individual, organization, or a supporter interested in joining our mission, our team is here to connect with you.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#12345A] shrink-0"><Mail className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Email Support</p>
                  <button onClick={() => copyToClipboard(CONTACT_INFO.primaryEmail, "Email")} className="text-[#12345A] text-lg font-semibold hover:text-[#176447] break-all text-left">{CONTACT_INFO.primaryEmail}</button>
                  <p className="text-xs text-zinc-400 mt-1">Click to copy</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0"><Phone className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Call Us</p>
                  <a href={`tel:${CONTACT_INFO.phones.primary.replace(/\s+/g, "")}`} className="text-[#12345A] text-xl font-semibold hover:text-[#176447]">{CONTACT_INFO.phones.primaryFormatted}</a>
                  <p className="text-xs text-zinc-400 mt-1">Mon - Sat, 9:00 AM - 6:00 PM (IST)</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#A73800] shrink-0"><MapPin className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">Registered Office</p>
                  <p className="text-[#12345A] text-sm md:text-base font-medium leading-relaxed">{CONTACT_INFO.address.fullRegistered}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
              <p className="font-bold text-[#12345A] mb-2">WhatsApp Support 📲</p>
              <p className="text-sm text-zinc-600 leading-relaxed">You are encouraged to send us a message on WhatsApp for faster response.</p><a href={CONTACT_INFO.social.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#176447] px-5 py-3 text-sm font-bold text-white">WhatsApp the Foundation</a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/Volunteer" className="flex-1 py-4 px-6 bg-[#12345A] text-white font-bold rounded-xl text-center hover:bg-[#12345A] transition-colors">Join as Volunteer</Link>
              <Link to="/Members" className="flex-1 py-4 px-6 bg-[#176447] text-white font-bold rounded-xl text-center hover:bg-[#176447] transition-colors">Membership <FaArrowRight className="inline ml-2" /></Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-5 sm:p-10 md:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-black text-[#12345A]">Send us a Message</h3>
              <p className="text-sm text-zinc-400 mt-2">Your message will be securely recorded and sent to our team.</p>
            </div>
            <form onSubmit={handleSubmit} className="ssf-form">
              <div className="ssf-form-grid ssf-form-grid-2">
                <Field label="First Name" required><Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" /></Field>
                <Field label="Last Name"><Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" /></Field>
              </div>
              <Field label="Email Address" required><Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" /></Field>
              <Field label="Mobile Number"><Input name="phone" type="tel" inputMode="numeric" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }))} placeholder="Enter mobile number" /></Field>
              <Field label="Enquiry Type"><select name="enquiryType" value={formData.enquiryType} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#12345A] focus:border-[#176447] focus:outline-none"><option>General enquiry</option><option>CSR / Corporate funding</option><option>Government grant / institutional project</option><option>Individual donation / recurring support</option><option>Machinery / production unit / equipment</option><option>Raw material / workspace / vehicle / in-kind support</option><option>Business partnership / buyer / purchase order</option><option>NGO / academic / institutional partnership</option><option>Volunteer / professional expertise</option></select></Field>
              <Field label="Company / Organisation (optional)"><Input name="organisation" value={formData.organisation} onChange={handleChange} placeholder="Company, institution or organisation name" /></Field>
              <Field label="Message" required><Textarea name="message" value={formData.message} onChange={handleChange} rows={5} minLength={10} placeholder="How can we help you today?" /></Field>
              <SubmitButton busy={isSubmitting} busyLabel="Submitting…"><span>Send Message</span><Send className="w-5 h-5" /></SubmitButton>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
