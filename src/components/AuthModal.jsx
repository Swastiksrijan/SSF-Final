import { useEffect, useState } from "react";
import { FaTimes, FaUserPlus, FaSignInAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { ENDPOINTS } from "../config/api";

const initialSignup = { fullName: "", email: "", phone: "", password: "" };
const initialLogin = { email: "", password: "" };

export default function AuthModal({ open, onClose }) {
    const [mode, setMode] = useState("signup");
    const [signupData, setSignupData] = useState(initialSignup);
    const [loginData, setLoginData] = useState(initialLogin);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!open) return;
        setStatus("idle");
        setMessage("");
    }, [open, mode]);

    if (!open) return null;

    const adminWhatsAppLink = `https://wa.me/${CONTACT_INFO.phones.primary.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        mode === "signup" ? "I want to create an account on Swastik Srijan Foundation website." : "I need help with my website login."
    )}`;

    const persistSession = (user) => {
        localStorage.setItem("ssf_user_session", JSON.stringify({
            ...user,
            loggedInAt: new Date().toISOString()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const payload = mode === "signup"
                ? {
                    fullName: signupData.fullName.trim(),
                    email: signupData.email.trim().toLowerCase(),
                    confirmEmail: signupData.email.trim().toLowerCase(),
                    phone: signupData.phone.trim(),
                    password: signupData.password,
                    memberType: "website_signup",
                    message: "Signup from website"
                }
                : {
                    email: loginData.email.trim().toLowerCase(),
                    password: loginData.password
                };

            const response = await fetch(mode === "signup" ? ENDPOINTS.MEMBER_SIGNUP : ENDPOINTS.MEMBER_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to complete the request. Please try again.");

            if (!result.user) throw new Error("The server did not return a valid account session.");
            persistSession(result.user);

            setStatus("success");
            setMessage(mode === "signup"
                ? "Account created successfully. You are now signed in."
                : "Login successful. Welcome back.");
        } catch (error) {
            console.error("Auth error", error);
            setStatus("error");
            setMessage(error.message || "Unable to connect to the account service.");
        }
    };

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setStatus("idle");
        setMessage("");
    };

    return (
        <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-100 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900" aria-label="Close signup and login">
                    <FaTimes />
                </button>

                <h3 id="auth-title" className="text-2xl font-bold text-[#002344] mb-5">Signup / Login</h3>

                <div className="flex gap-2 bg-zinc-100 rounded-xl p-1 mb-5">
                    <button type="button" className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "signup" ? "bg-white text-[#002344] shadow" : "text-zinc-500"}`} onClick={() => switchMode("signup")}>
                        Sign Up
                    </button>
                    <button type="button" className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "login" ? "bg-white text-[#002344] shadow" : "text-zinc-500"}`} onClick={() => switchMode("login")}>
                        Login
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {mode === "signup" && (
                        <>
                            <input required autoComplete="name" placeholder="Full Name" value={signupData.fullName} onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))} className="w-full px-4 py-3 bg-zinc-50 rounded-xl" />
                            <input required autoComplete="tel" placeholder="Phone" value={signupData.phone} onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 bg-zinc-50 rounded-xl" />
                        </>
                    )}

                    <input required type="email" autoComplete="email" placeholder="Email" value={mode === "signup" ? signupData.email : loginData.email} onChange={(e) => mode === "signup" ? setSignupData(prev => ({ ...prev, email: e.target.value })) : setLoginData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 bg-zinc-50 rounded-xl" />

                    <input required minLength={8} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? "Password (minimum 8 characters)" : "Password"} value={mode === "signup" ? signupData.password : loginData.password} onChange={(e) => mode === "signup" ? setSignupData(prev => ({ ...prev, password: e.target.value })) : setLoginData(prev => ({ ...prev, password: e.target.value }))} className="w-full px-4 py-3 bg-zinc-50 rounded-xl" />

                    <button type="submit" disabled={status === "submitting"} className="w-full bg-[#FF6600] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                        {mode === "signup" ? <FaUserPlus /> : <FaSignInAlt />}
                        {status === "submitting" ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
                    </button>
                </form>

                {message && (
                    <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`} role="status" aria-live="polite">
                        {message}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <a href={adminWhatsAppLink} target="_blank" rel="noreferrer" className="text-center py-2 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaWhatsapp /> WhatsApp Help
                    </a>
                    <a href={`mailto:${CONTACT_INFO.primaryEmail}?subject=${encodeURIComponent("Website account help")}`} className="text-center py-2 rounded-xl bg-[#002344] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaEnvelope /> Email Help
                    </a>
                </div>
            </div>
        </div>
    );
}
