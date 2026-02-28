import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaTimes, FaUserPlus, FaSignInAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";

const initialSignup = {
    fullName: "",
    email: "",
    phone: "",
    password: ""
};

const initialLogin = {
    email: "",
    password: ""
};

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState("signup");
    const [signupData, setSignupData] = useState(initialSignup);
    const [loginData, setLoginData] = useState(initialLogin);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
            emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
        }
    }, []);

    const adminWhatsAppLink = useMemo(() => {
        const target = CONTACT_INFO.phones.primary.replace(/[^0-9]/g, "");
        const payload = mode === "signup" ? signupData : loginData;
        const text =
            mode === "signup"
                ? `New Signup\\nName: ${payload.fullName}\\nEmail: ${payload.email}\\nPhone: ${payload.phone}`
                : `New Login\\nEmail: ${payload.email}`;
        return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
    }, [mode, signupData, loginData]);

    if (!open) return null;

    const sendEmailNotification = async () => {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_AUTH_TEMPLATE_ID;
        if (!serviceId || !templateId || !import.meta.env.VITE_EMAILJS_PUBLIC_KEY) return;

        const payload = mode === "signup" ? signupData : loginData;
        await emailjs.send(serviceId, templateId, {
            event_type: mode,
            name: payload.fullName || "N/A",
            email: payload.email,
            phone: payload.phone || "N/A",
            admin_email: CONTACT_INFO.primaryEmail
        });
    };

    const persistSession = () => {
        const payload = mode === "signup" ? signupData : loginData;
        const current = {
            id: crypto.randomUUID(),
            mode,
            fullName: payload.fullName || "User",
            email: payload.email,
            phone: payload.phone || "",
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem("ssf_user_session", JSON.stringify(current));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            persistSession();
            await sendEmailNotification();
            setStatus("success");
            setMessage("Account action successful. Admin notification links are ready below.");
        } catch (error) {
            console.error("Auth notify error", error);
            setStatus("error");
            setMessage("Login/Signup saved, but auto-email failed. Please use WhatsApp/email buttons.");
        }
    };

    return (
        <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-100 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900"
                    aria-label="Close auth modal"
                >
                    <FaTimes />
                </button>

                <h3 className="text-2xl font-bold text-[#002344] mb-5">Signup / Login</h3>

                <div className="flex gap-2 bg-zinc-100 rounded-xl p-1 mb-5">
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "signup" ? "bg-white text-[#002344] shadow" : "text-zinc-500"}`}
                        onClick={() => setMode("signup")}
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "login" ? "bg-white text-[#002344] shadow" : "text-zinc-500"}`}
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === "signup" && (
                        <input
                            required
                            placeholder="Full Name"
                            value={signupData.fullName}
                            onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    )}

                    <input
                        required
                        type="email"
                        placeholder="Email"
                        value={mode === "signup" ? signupData.email : loginData.email}
                        onChange={(e) => mode === "signup"
                            ? setSignupData(prev => ({ ...prev, email: e.target.value }))
                            : setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                    />

                    {mode === "signup" && (
                        <input
                            required
                            placeholder="Phone"
                            value={signupData.phone}
                            onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    )}

                    <input
                        required
                        type="password"
                        placeholder="Password"
                        value={mode === "signup" ? signupData.password : loginData.password}
                        onChange={(e) => mode === "signup"
                            ? setSignupData(prev => ({ ...prev, password: e.target.value }))
                            : setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                    />

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full bg-[#FF6600] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        {mode === "signup" ? <FaUserPlus /> : <FaSignInAlt />}
                        {status === "submitting" ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
                    </button>
                </form>

                {message && <p className="mt-3 text-sm text-zinc-600">{message}</p>}

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <a href={adminWhatsAppLink} target="_blank" rel="noreferrer" className="text-center py-2 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaWhatsapp /> WhatsApp
                    </a>
                    <a href={`mailto:${CONTACT_INFO.primaryEmail}?subject=${encodeURIComponent(`New ${mode} alert`)}&body=${encodeURIComponent(message || "New login/signup activity on website.")}`} className="text-center py-2 rounded-xl bg-[#002344] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaEnvelope /> Email
                    </a>
                </div>
            </div>
        </div>
    );
}
