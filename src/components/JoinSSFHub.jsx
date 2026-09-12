import { useState } from "react";

const roles = [
  { id: "volunteer", title: "Volunteer for India", icon: "🤝", text: "Serve communities and support SSF activities." },
  { id: "member", title: "Become a Member", icon: "👥", text: "Join the SSF family and participate in its mission." },
  { id: "intern", title: "Join as an Intern", icon: "🎓", text: "Learn, contribute and gain meaningful experience." },
  { id: "movement", title: "Nation-Building Movement", icon: "🇮🇳", text: "Take part in citizen-led nation-building initiatives." },
  { id: "donor", title: "Become a Donor", icon: "💚", text: "Support meaningful work when and how you can." },
  { id: "partner", title: "Partner with the Mission", icon: "🌐", text: "Explore institutional and mission partnerships." },
];

export default function JoinSSFHub() {
  const [selected, setSelected] = useState("");

  const choose = (id) => setSelected(id);
  const selectedRole = roles.find((role) => role.id === selected);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 px-6 py-7 text-white sm:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">JOIN SSF • TAKE PART</span>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Choose how you want to be part of SSF</h2>
            <p className="mt-2 text-sm leading-6 text-white/90 sm:text-base">Select an option below. The form will open right here — you will not be sent to another page.</p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <label htmlFor="ssf-role" className="mb-2 block text-sm font-semibold text-gray-800">Select an opportunity</label>
          <select
            id="ssf-role"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">Choose from six ways to participate…</option>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
          </select>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => choose(role.id)}
                className={`group rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-100 ${selected === role.id ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-gray-200 bg-white"}`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl group-hover:bg-emerald-100">{role.icon}</span>
                  <span>
                    <span className="block font-bold text-gray-900">{role.title}</span>
                    <span className="mt-1 block text-sm leading-5 text-gray-600">{role.text}</span>
                    <span className="mt-3 block text-sm font-semibold text-emerald-700">Open form →</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedRole && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedRole.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">SSF Participation</p>
                  <h3 className="text-lg font-bold text-gray-900">{selectedRole.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">Your selected opportunity is ready. The participation form will appear here without leaving your User Portal.</p>
              <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-white p-4 text-sm text-gray-500">
                Form area — {selectedRole.title}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
