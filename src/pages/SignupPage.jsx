import AuthModal from "../components/AuthModal";

/* Standalone signup/login page so a shared link can open the account form
   directly instead of dropping the visitor on the home page. */
export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EAF0F6] via-white to-[#EAF0F6] px-4 py-10 md:py-16">
      <div className="mx-auto max-w-md">
        <header className="mb-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#176447]">Swastik Srijan Foundation</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#12345A] md:text-4xl">Join SSF</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Create your account to get your digital ID card, certificates and profile as a Member, Volunteer or Donor.
          </p>
        </header>
        <AuthModal open variant="inline" initialMode="signup" />
      </div>
    </main>
  );
}
