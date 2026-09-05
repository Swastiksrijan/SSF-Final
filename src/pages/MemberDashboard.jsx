import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaArrowRight } from "react-icons/fa";

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ssf_user_session");
      if (!saved) {
        navigate({ to: "/" });
        return;
      }
      setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("ssf_user_session");
      navigate({ to: "/" });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ssf_user_session");
    window.dispatchEvent(new CustomEvent("ssf-auth-changed", { detail: null }));
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b border-zinc-100 pb-7">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#002344] text-white flex items-center justify-center text-2xl">
                <FaUserCircle />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500">Welcome back</p>
                <h1 className="text-2xl sm:text-3xl font-black text-[#002344]">{user.fullName || "Member"}</h1>
                <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-[#002344] font-bold hover:bg-zinc-50">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs uppercase tracking-wider font-bold text-zinc-400">Account Type</p>
              <p className="mt-2 font-bold text-[#002344]">Website Member</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs uppercase tracking-wider font-bold text-zinc-400">Account Status</p>
              <p className="mt-2 font-bold text-[#002344] capitalize">{user.status || "pending"}</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-100 p-6">
            <h2 className="text-xl font-black text-[#002344]">Swastik Srijan Foundation</h2>
            <p className="mt-2 text-zinc-600 leading-relaxed">Your website account is active. You can continue exploring our programmes, initiatives and ways to get involved.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link to="/GetInvolved" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF6600] text-white font-bold">Get Involved <FaArrowRight /></Link>
              <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#002344] text-white font-bold">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
