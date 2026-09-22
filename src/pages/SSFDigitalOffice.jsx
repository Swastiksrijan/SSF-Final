import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FaArrowLeft, FaBook, FaChartLine, FaDownload, FaPlus, FaSave, FaTrash } from "react-icons/fa";

const KEY = "ssf_digital_office_v1";

const emptyData = {
  members: [],
  volunteers: [],
  donors: [],
  donations: [],
  expenses: [],
  cash: [],
  bank: [],
};

const loadData = () => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? { ...emptyData, ...JSON.parse(saved) } : emptyData;
  } catch {
    return emptyData;
  }
};

const makeId = (prefix) => `${prefix}-${new Date().toISOString().slice(0,10).replaceAll("-", "")}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

export default function SSFDigitalOffice() {
  const [data, setData] = useState(loadData);
  const [active, setActive] = useState("dashboard");
  const [notice, setNotice] = useState("");

  const save = (next) => {
    setData(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setNotice("Saved on this device.");
    setTimeout(() => setNotice(""), 1800);
  };

  const totals = useMemo(() => ({
    donations: data.donations.reduce((s, x) => s + Number(x.amount || 0), 0),
    expenses: data.expenses.reduce((s, x) => s + Number(x.amount || 0), 0),
  }), [data]);

  const addEntry = (type, fields) => {
    const idMap = { members: "MEM", volunteers: "VOL", donors: "DON", donations: "DNT", expenses: "EXP", cash: "CSH", bank: "BNK" };
    const entry = { id: makeId(idMap[type]), createdAt: new Date().toISOString(), ...fields };
    save({ ...data, [type]: [entry, ...data[type]] });
  };

  const removeEntry = (type, id) => save({ ...data, [type]: data[type].filter(x => x.id !== id) });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ssf-digital-office-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const modules = [
    ["members", "Members", "Member Register"],
    ["volunteers", "Volunteers", "Volunteer Register"],
    ["donors", "Donors", "Donor Register"],
    ["donations", "Donations", "Contribution / Donation Register"],
    ["expenses", "Expenses", "Expense Register"],
    ["cash", "Cash Book", "Cash Book"],
    ["bank", "Bank Book", "Bank Book"],
  ];

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-[#002344] text-white rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <Link to="/AdminPortal" className="inline-flex items-center gap-2 text-white/70 text-sm font-semibold mb-4"><FaArrowLeft /> Admin Portal</Link>
            <p className="text-xs uppercase tracking-[.2em] text-orange-300 font-bold">SSF Digital Office · Version 1</p>
            <h1 className="text-3xl sm:text-4xl font-black mt-2">Paperless NGO Management</h1>
            <p className="text-white/70 mt-2 max-w-2xl">One entry can become the source record for registers and reports. This first module is designed for simple digital recordkeeping.</p>
          </div>
          <button onClick={exportJson} className="inline-flex items-center justify-center gap-2 bg-white text-[#002344] px-5 py-3 rounded-xl font-bold"><FaDownload /> Backup Data</button>
        </header>

        {notice && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl font-semibold">{notice}</div>}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Members" value={data.members.length} />
          <Stat label="Volunteers" value={data.volunteers.length} />
          <Stat label="Donors" value={data.donors.length} />
          <Stat label="Donations" value={`₹${totals.donations.toLocaleString("en-IN")}`} />
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white rounded-2xl border border-zinc-200 p-3 h-fit">
            <button onClick={() => setActive("dashboard")} className={navClass(active === "dashboard")}> <FaChartLine /> Dashboard</button>
            {modules.map(([key, label]) => <button key={key} onClick={() => setActive(key)} className={navClass(active === key)}><FaBook /> {label}</button>)}
          </aside>

          <main className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-7">
            {active === "dashboard" ? <Dashboard data={data} totals={totals} /> : <Register type={active} rows={data[active]} onAdd={addEntry} onRemove={removeEntry} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="bg-white rounded-2xl border border-zinc-200 p-5"><p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">{label}</p><p className="text-2xl font-black text-[#002344] mt-2">{value}</p></div>;
}

function navClass(selected) {
  return `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold mb-1 ${selected ? "bg-[#002344] text-white" : "text-zinc-700 hover:bg-zinc-100"}`;
}

function Dashboard({ data, totals }) {
  return <div className="space-y-6">
    <div><h2 className="text-2xl font-black text-[#002344]">Digital Registers</h2><p className="text-zinc-500 mt-1">Start entering records. Data is currently stored in this browser and can be backed up as JSON.</p></div>
    <div className="grid sm:grid-cols-2 gap-4">
      <Summary title="Total Donations" value={`₹${totals.donations.toLocaleString("en-IN")}`} />
      <Summary title="Total Expenses" value={`₹${totals.expenses.toLocaleString("en-IN")}`} />
      <Summary title="Cash Entries" value={data.cash.length} />
      <Summary title="Bank Entries" value={data.bank.length} />
    </div>
    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-sm text-amber-900"><strong>Important:</strong> Version 1 is a local recordkeeping prototype. It does not yet replace a secure server database, accounting controls, audit trail, or statutory records.</div>
  </div>;
}

function Summary({ title, value }) {
  return <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-5"><p className="text-sm text-zinc-500">{title}</p><p className="text-xl font-black text-[#002344] mt-1">{value}</p></div>;
}

function Register({ type, rows, onAdd, onRemove }) {
  const labels = { members: "Member Register", volunteers: "Volunteer Register", donors: "Donor Register", donations: "Donation Register", expenses: "Expense Register", cash: "Cash Book", bank: "Bank Book" };
  const money = ["donations", "expenses", "cash", "bank"].includes(type);
  const [form, setForm] = useState(money ? { name: "", amount: "", mode: "Cash", note: "" } : { name: "", email: "", phone: "", note: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(type, form);
    setForm(money ? { name: "", amount: "", mode: "Cash", note: "" } : { name: "", email: "", phone: "", note: "" });
  };

  return <div className="space-y-6">
    <div><h2 className="text-2xl font-black text-[#002344]">{labels[type]}</h2><p className="text-zinc-500 mt-1">{rows.length} record(s)</p></div>
    <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
      <input className="field" placeholder="Name / Party" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      {money ? <input className="field" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /> : <input className="field" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />}
      {money ? <select className="field" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}><option>Cash</option><option>Bank</option><option>UPI</option><option>Other</option></select> : <input className="field" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />}
      <input className="field" placeholder="Note / Purpose" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
      <button className="sm:col-span-2 lg:col-span-4 inline-flex items-center justify-center gap-2 bg-[#002344] text-white px-4 py-3 rounded-xl font-bold"><FaPlus /> Add Record</button>
    </form>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm"><thead><tr className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider"><th className="p-3">ID</th><th className="p-3">Name</th>{money && <th className="p-3">Amount</th>}<th className="p-3">Date</th><th className="p-3">Note</th><th className="p-3"></th></tr></thead>
        <tbody className="divide-y divide-zinc-100">{rows.length === 0 ? <tr><td colSpan={money ? 6 : 5} className="p-8 text-center text-zinc-400">No records yet.</td></tr> : rows.map(row => <tr key={row.id}><td className="p-3 font-bold text-[#002344] whitespace-nowrap">{row.id}</td><td className="p-3 font-semibold">{row.name}</td>{money && <td className="p-3">₹{Number(row.amount || 0).toLocaleString("en-IN")}</td>}<td className="p-3 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString("en-IN")}</td><td className="p-3 text-zinc-500">{row.note || "—"}</td><td className="p-3 text-right"><button onClick={() => onRemove(type, row.id)} className="text-red-600 p-2" title="Delete"><FaTrash /></button></td></tr>)}</tbody>
      </table>
    </div>
  </div>;
}
