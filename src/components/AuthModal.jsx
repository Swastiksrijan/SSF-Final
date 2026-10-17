import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import emailjs from "@emailjs/browser";
import { FaTimes, FaUserPlus, FaSignInAlt, FaWhatsapp, FaEnvelope, FaArrowLeft, FaKey } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { ENDPOINTS } from "../config/api";
import { Alert, Field, Input, SubmitButton } from "./forms/FormUI";
import { writeSession } from "../utils/userSession";
const initialSignup = { fullName: "", email: "", phone: "", password: "" };
const initialLogin = { email: "", password: "" };
const initialForgot = { email: "" };

export default function AuthModal({ open, onClose, onAuthSuccess, initialMode = "signup", stayOnSuccess = false }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);
    const [signupData, setSignupData] = useState(initialSignup);
    const [loginData, setLoginData] = useState(initialLogin);
    const [forgotData, setForgotData] = useState(initialForgot);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (open) {
            setMode(initialMode);
            setStatus("idle");
            setMessage("");
        }
    }, [open, initialMode]);

    useEffect(() => {
        if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    }, []);

    const adminWhatsAppLink = useMemo(() => {
        const target = CONTACT_INFO.phones.primary.replace(/[^0-9]/g, "");
        const payload = mode === "signup" ? signupData : loginData;
        const text = mode === "signup"
            ? `New Signup\nName: ${payload.fullName}\nEmail: ${payload.email}\nPhone: ${payload.phone}`
            : `New Login\nEmail: ${payload.email}`;
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

    const persistSession = (user, token) => writeSession({
        ...user,
        token: token || user.token || "",
        memberType: user.memberType === "website_signup" ? "general" : user.memberType,
        loggedInAt: new Date().toISOString()
    });

    const handleForgot = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");
        try {
            const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email: forgotData.email.trim().toLowerCase() })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to process password reset.");
            setStatus("success");
            setMessage(result.message || "If an account exists for this email, a reset link has been sent.");
        } catch (error) {
            setStatus("error");
            setMessage(error.message || "Unable to process password reset.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        setStatus("submitting");
        setMessage("");
        try {
            const payload = mode === "signup"
                ? { fullName: signupData.fullName.trim(), email: signupData.email.trim().toLowerCase(), confirmEmail: signupData.email.trim().toLowerCase(), phone: signupData.phone.trim(), password: signupData.password, memberType: "website_signup", message: "Signup from website" }
                : { email: loginData.email.trim().toLowerCase(), password: loginData.password };
            const endpoint = mode === "signup" ? ENDPOINTS.MEMBER_SIGNUP : ENDPOINTS.MEMBER_LOGIN;
            let response;
            try {
                response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
            } catch {
                throw new Error("Account service is temporarily unavailable. Please wait a moment and try again.");
            }
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.message || "Unable to complete the request. Please try again.");
            if (!result.user) throw new Error("The server did not return a valid account session.");
            const session = persistSession(result.user, result.token);
            await sendEmailNotification().catch((err) => console.warn("Email notify failed:", err));
            setStatus("success");
            setMessage(mode === "signup" ? "Account created successfully. You are now signed in." : "Login successful. Welcome back.");
            if (onAuthSuccess) onAuthSuccess(session);
            onClose?.();
            if (!stayOnSuccess) navigate({ to: returnTo && returnTo !== "/" ? returnTo : "/UserPortal" });
        } catch (error) {
            console.error("Auth error", error);
            setStatus("error");
            setMessage(error.message || "Unable to connect to the account service.");
        }
    };

    const showLogin = () => { setMode("login"); setStatus("idle"); setMessage(""); };

    return (
        <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-zinc-100 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-900" aria-label="Close auth modal"><FaTimes /></button>
                <h3 id="auth-title" className="text-2xl font-bold text-[#12345A] mb-5">{mode === "signup" ? "Join SSF" : mode === "login" ? "Welcome Back" : "Reset Password"}</h3>

                {mode !== "forgot" && <div className="flex gap-2 bg-zinc-100 rounded-xl p-1 mb-5">
                    <button type="button" className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "signup" ? "bg-white text-[#12345A] shadow" : "text-zinc-500"}`} onClick={() => { setMode("signup"); setStatus("idle"); setMessage(""); }}>Join SSF</button>
                    <button type="button" className={`flex-1 py-2 rounded-lg font-semibold text-sm ${mode === "login" ? "bg-white text-[#12345A] shadow" : "text-zinc-500"}`} onClick={showLogin}>Login</button>
                </div>}

                {mode === "forgot" ? <form onSubmit={handleForgot} className="ssf-form">
                    <p className="text-sm text-zinc-500 leading-relaxed">Enter the email address registered with your SSF account. We will send a secure password reset link.</p>
                    <Field label="Registered Email" required><Input required type="email" autoComplete="email" placeholder="you@example.com" value={forgotData.email} onChange={(e) => setForgotData({ email: e.target.value })} /></Field>
                    <SubmitButton busy={status === "submitting"} busyLabel="Sending…"><FaKey /> Send Reset Link</SubmitButton>
                    <button type="button" onClick={showLogin} className="w-full py-2 text-sm font-bold text-[#12345A] inline-flex items-center justify-center gap-2"><FaArrowLeft /> Back to Login</button>
                </form> : <form onSubmit={handleSubmit} className="ssf-form">
                    {mode === "signup" && <Field label="Full Name" required><Input required autoComplete="name" placeholder="Your full name" value={signupData.fullName} onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))} /></Field>}
                    <Field label="Email" required><Input required type="email" autoComplete="email" placeholder="you@example.com" value={mode === "signup" ? signupData.email : loginData.email} onChange={(e) => mode === "signup" ? setSignupData(prev => ({ ...prev, email: e.target.value })) : setLoginData(prev => ({ ...prev, email: e.target.value }))} /></Field>
                    {mode === "signup" && <Field label="Mobile Number" required><Input required autoComplete="tel" inputMode="numeric" placeholder="Enter mobile number" value={signupData.phone} onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9 +()-]/g, "") }))} /></Field>}
                    <Field label="Password" required hint={mode === "signup" ? "Minimum 8 characters" : undefined}><Input required minLength={8} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? "Minimum 8 characters" : "Your password"} value={mode === "signup" ? signupData.password : loginData.password} onChange={(e) => mode === "signup" ? setSignupData(prev => ({ ...prev, password: e.target.value })) : setLoginData(prev => ({ ...prev, password: e.target.value }))} /></Field>
                    {mode === "login" && <button type="button" onClick={() => { setMode("forgot"); setStatus("idle"); setMessage(""); }} className="text-sm font-bold text-[#176447] hover:underline self-start">Forgot Password?</button>}
                    <SubmitButton busy={status === "submitting"} busyLabel="Please wait…">{mode === "signup" ? <><FaUserPlus /> Create Account</> : <><FaSignInAlt /> Login</>}</SubmitButton>
                </form>}

                {message && <Alert tone={status === "error" ? "error" : "success"}>{message}</Alert>}
                {mode !== "forgot" && <div className="grid grid-cols-2 gap-3 mt-4">
                    <a href={adminWhatsAppLink} target="_blank" rel="noreferrer" className="text-center py-2 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2"><FaWhatsapp /> WhatsApp</a>
                    <a href={`mailto:${CONTACT_INFO.primaryEmail}?subject=${encodeURIComponent(`New ${mode} alert`)}&body=${encodeURIComponent(message || "New login/signup activity on website.")}`} className="text-center py-2 rounded-xl bg-[#12345A] text-white font-semibold text-sm flex items-center justify-center gap-2"><FaEnvelope /> Email</a>
                </div>}
            </div>
        </div>
    );
}
