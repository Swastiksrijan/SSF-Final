import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaTimes, FaUserPlus, FaSignInAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { CONTACT_INFO } from "../config/contact";
import { ENDPOINTS } from "../config/api";

const initialSignup = {
    fullName: "",
    email: "",
    phone: "",
    password: ""
};

const initialLogin = {
    identifier: "",
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

    const notificationEmail = CONTACT_INFO.backupEmail || CONTACT_INFO.primaryEmail;

    const detailsText = useMemo(() => {
        if (mode === "signup") {
            return [
                "New Signup Request",
                `Name: ${signupData.fullName || "N/A"}`,
                `Email: ${signupData.email || "N/A"}`,
                `Phone: ${signupData.phone || "N/A"}`,
            ].join("\n");
        }

        return [
            "New Login Request",
            `User: ${loginData.identifier || "N/A"}`,
        ].join("\n");
    }, [mode, signupData, loginData]);

    const adminWhatsAppLink = useMemo(() => {
        const target = CONTACT_INFO.phones.primary.replace(/[^0-9]/g, "");
        return `https://wa.me/${target}?text=${encodeURIComponent(detailsText)}`;
    }, [detailsText]);

    const emailLink = useMemo(() => {
        const subject = mode === "signup" ? "New Signup Request" : "New Login Request";
        return `mailto:${notificationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(detailsText)}`;
    }, [mode, notificationEmail, detailsText]);

    if (!open) return null;

    const sendEmailNotification = async () => {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_AUTH_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            return false;
        }

        await emailjs.send(serviceId, templateId, {
            event_type: mode,
            name: signupData.fullName || "N/A",
            email: mode === "signup" ? signupData.email : loginData.identifier,
            phone: signupData.phone || "N/A",
            login_identifier: loginData.identifier || "N/A",
            admin_email: notificationEmail,
            details: detailsText,
        });

        return true;
    };

    const persistSession = (backendData) => {
        const current = {
            id: crypto.randomUUID(),
            mode,
            fullName: backendData?.fullName || signupData.fullName || "User",
            email: backendData?.email || signupData.email || loginData.identifier,
            phone: backendData?.phone || signupData.phone || "",
            loggedInAt: new Date().toISOString()
        };

        localStorage.setItem("ssf_user_session", JSON.stringify(current));
    };

    const submitToBackend = async () => {
        const payload =
            mode === "signup"
                ? {
                    mode,
                    fullName: signupData.fullName.trim(),
                    email: signupData.email.trim(),
                    phone: signupData.phone.trim(),
                    password: signupData.password,
                }
                : {
                    mode,
                    identifier: loginData.identifier.trim(),
                    password: loginData.password,
                };

        console.log("[AuthModal] Submitting auth payload", payload);

        const response = await fetch(ENDPOINTS.AUTH_SUBMIT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        console.log("[AuthModal] Backend response", result);

        if (!response.ok || result.status !== "success") {
            throw new Error(result.message || "Unable to submit auth form.");
        }

        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const result = await submitToBackend();
            persistSession(result.data);
            const emailSent = await sendEmailNotification();
            setStatus("success");
            setMessage(
                emailSent
                    ? `${result.message} Notification sent to ${notificationEmail}.`
                    : `${result.message} If needed, use WhatsApp/Email buttons to notify ${notificationEmail}.`
            );
        } catch (error) {
            console.error("[AuthModal] Submit failed", error);
            setStatus("error");
            setMessage(error.message || "Submit failed. Please try again.");
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
                            onChange={(e) => setSignupData((prev) => ({ ...prev, fullName: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    )}

                    {mode === "signup" ? (
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={signupData.email}
                            onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    ) : (
                        <input
                            required
                            type="text"
                            placeholder="Email / Username / Phone"
                            value={loginData.identifier}
                            onChange={(e) => setLoginData((prev) => ({ ...prev, identifier: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    )}

                    {mode === "signup" && (
                        <input
                            required
                            placeholder="Phone"
                            value={signupData.phone}
                            onChange={(e) => setSignupData((prev) => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                        />
                    )}

                    <input
                        type="password"
                        required={mode === "login"}
                        placeholder={mode === "signup" ? "Password (optional)" : "Password"}
                        value={mode === "signup" ? signupData.password : loginData.password}
                        onChange={(e) =>
                            mode === "signup"
                                ? setSignupData((prev) => ({ ...prev, password: e.target.value }))
                                : setLoginData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        className="w-full px-4 py-3 bg-zinc-50 rounded-xl"
                    />

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full bg-[#FF6600] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        {mode === "signup" ? <FaUserPlus /> : <FaSignInAlt />}
                        {status === "submitting" ? "Please wait..." : mode === "signup" ? "Signup" : "Login"}
                    </button>
                </form>

                {message && (
                    <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-zinc-600"}`}>
                        {message}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <a href={adminWhatsAppLink} target="_blank" rel="noreferrer" className="text-center py-2 rounded-xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaWhatsapp /> WhatsApp
                    </a>
                    <a href={emailLink} className="text-center py-2 rounded-xl bg-[#002344] text-white font-semibold text-sm flex items-center justify-center gap-2">
                        <FaEnvelope /> Email
                    </a>
                </div>
            </div>
        </div>
    );
}
