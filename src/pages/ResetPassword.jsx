import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FaArrowLeft, FaCheckCircle, FaKey } from "react-icons/fa";
import { ENDPOINTS } from "../config/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") || "", []);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!token) return setMessage("This reset link is missing or invalid. Please request a new one.");
    if (password.length < 8) return setMessage("Password must be at least 8 characters.");
    if (password !== confirm) return setMessage("Passwords do not match.");
    setBusy(true);
    try {
      const response = await fetch(ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ token, password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to reset password.");
      setSuccess(true);
      setMessage(result.message || "Password reset successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to reset password.");
    } finally {
      setBusy(false);
    }
  };

  return <main className="min-h-screen bg-[#f6f8fa] pt-32 pb-20 px-4 flex items-start justify-center">
    <section className="w-full max-w-md bg-white rounded-3xl border border-zinc-100 shadow-xl p-7 sm:p-9">
      <div className="w-14 h-14 rounded-2xl bg-[#002344]/5 text-[#002344] flex items-center justify-center text-xl mb-5"><FaKey /></div>
      <p className="text-xs uppercase tracking-widest font-black text-[#FF6600]">Swastik Srijan Foundation</p>
      <h1 className="text-3xl font-black text-[#002344] mt-2">Create New Password</h1>
      {!success ? <form onSubmit={submit} className="space-y-4 mt-6">
        <input required minLength={8} type="password" autoComplete="new-password" placeholder="New Password (minimum 8 characters)" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100" />
        <input required minLength={8} type="password" autoComplete="new-password" placeholder="Confirm New Password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100" />
        <button disabled={busy} className="w-full bg-[#FF6600] text-white font-bold py-3 rounded-xl disabled:opacity-60">{busy ? "Updating..." : "Reset Password"}</button>
      </form> : <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-emerald-800"><FaCheckCircle className="text-xl" /><p className="font-bold mt-2">Password updated successfully.</p><p className="text-sm mt-1">You can now log in with your new password.</p><button type="button" onClick={() => navigate({ to: "/" })} className="mt-4 px-4 py-2.5 rounded-xl bg-[#002344] text-white font-bold">Go to Website</button></div>}
      {message && !success && <p className="mt-4 text-sm font-semibold text-red-600">{message}</p>}
      {!success && <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#002344]"><FaArrowLeft /> Back to Website</Link>}
    </section>
  </main>;
}
