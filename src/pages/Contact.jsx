import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { CheckCircle, XCircle, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import OptimizedImage from "../components/OptimizedImage";
import { CONTACT_INFO } from "../config/contact";

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
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          message: formData.message,
        }
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

  return (
    <main className="min-h-screen bg-white">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-10 duration-300">
          <div
            className={`flex items-center gap-4 px-8 py-5 rounded-2xl shadow-2xl border ${toast.type === "success"
              ? "bg-white border-green-500 text-green-900"
              : "bg-white border-red-500 text-red-900"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <span className="font-bold">{toast.message}</span>
            <button onClick={hideToast} className="p-1 hover:bg-zinc-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section className="bg-[#001529] text-white pt-32 md:pt-48 pb-24 px-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fb8500] opacity-[0.05] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#fb8500] font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Connect for <span className="text-[#fb8500]">Change</span>
            </h1>
            <p className="text-xl md:text-2xl font-serif mt-2">
              Reach Out to Swastik Srijan Foundation
            </p>
            <p className="text-zinc-400 mt-8 text-lg leading-relaxed max-w-3xl mx-auto">
              We welcome your inquiries, collaborations, and feedback. Feel free to reach out to us for any information or to explore potential partnerships. Swastik Srijan Foundation values open communication and believes in the power of collective efforts to bring about positive change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#002344]">
                Get in Touch
              </h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Whether you're an individual, organization, or a supporter interested in joining our mission, our team is here to connect with you. Contact us through the provided channels below.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  icon: <Mail />,
                  label: "Email Us",
                  value: CONTACT_INFO.primaryEmail,
                  sub: (
                    <div className="space-y-1">
                      <p>Technical issue in info@swastiksrijan.org / .in</p>
                      <p className="text-zinc-400 text-sm">[Temp. Tech-issue]</p>
                    </div>
                  ),
                  color: "bg-blue-50 text-[#002344]"
                },
                {
                  icon: <Phone />,
                  label: "Call Us",
                  value: CONTACT_INFO.phones.primaryFormatted,
                  sub: "Mon-Sat, 9am - 6pm",
                  color: "bg-green-50 text-green-600"
                },
                {
                  icon: <MapPin />,
                  label: "Registered Office",
                  value: CONTACT_INFO.address.fullRegistered,
                  sub: "Headquarters",
                  color: "bg-red-50 text-[#d90429]"
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className={`w-16 h-16 ${item.color} rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xl md:text-2xl font-serif font-bold text-[#002344] break-words">{item.value}</p>
                    <div className="text-zinc-500 font-medium">{item.sub}</div>
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
              <p className="text-lg text-[#002344] font-medium leading-relaxed">
                If your thoughts, principles, or goals align with our organization in any way, or if you want to do something meaningful for society, do not hesitate to join us. Contact us today — because change begins with a conversation.
              </p>
              <p className="text-lg text-[#fb8500] font-serif italic leading-relaxed">
                यदि आपके विचार, सिद्धांत या उद्देश्य हमारी संस्था से कहीं भी मेल खाते हैं, या आप समाज के लिए कुछ सार्थक करना चाहते हैं, तो हमसे जुड़ने में कोई संकोच न करें। आज ही हमसे संपर्क करें — क्योंकि बदलाव संवाद से शुरू होता है।
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://forms.gle/fwKiuDNnjiYdzPTR9"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 px-6 bg-[#002344] text-white font-bold rounded-xl text-center hover:bg-[#003366] transition-colors shadow-lg shadow-[#002344]/20"
              >
                Become Our Volunteer
              </a>
              <a
                href="https://forms.gle/jDUEBYPUXcocvn716"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 px-6 bg-white border-2 border-[#002344] text-[#002344] font-bold rounded-xl text-center hover:bg-[#f0f4f8] transition-colors"
              >
                Become Our Member
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-zinc-100"
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
                    className="w-full px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium"
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
                  className="w-full px-8 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-4 focus:ring-[#fb8500]/10 transition-all font-medium resize-none"
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
