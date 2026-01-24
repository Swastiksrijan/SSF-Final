import { useEffect } from "react";

export default function MemorandumAndRules() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-zinc-50 font-inria">
      <div className="max-w-4xl mx-auto pt-32 pb-20 px-4 space-y-12">

        {/* ================= HEADER ================= */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-zinc-900">
            Memorandum & Rules
          </h1>
          <p className="text-zinc-600">
            Governance framework of Swastik Srijan Foundation
          </p>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-10">

          {/* 1 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">1. Introduction</h2>
            <p className="text-zinc-600 leading-relaxed">
              Swastik Srijan Foundation (SSF) is a legally registered non-profit
              organization under the Madhya Pradesh Societies Registration Act,
              1973. The Memorandum of Association (MoA) and Rules & Regulations
              define the framework, governance, and operational principles of the
              foundation.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              <strong>Purpose:</strong> Ensure transparency, legal compliance,
              and clarity of organizational objectives.
            </p>
          </section>

          {/* 2 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">2. Objectives of the Foundation</h2>
            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
              <li>Promote education and skill development across India.</li>
              <li>Advance health and wellness initiatives for all age groups.</li>
              <li>Support women, children, elderly, and marginalized communities.</li>
              <li>Foster environmental sustainability and biodiversity conservation.</li>
              <li>Encourage cultural, spiritual, and holistic development.</li>
              <li>Strengthen social welfare and rural development programs.</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">3. Membership Rules</h2>
            <p className="text-zinc-600 leading-relaxed">
              <strong>Categories:</strong> Patron, Lifetime, Ordinary, Honorary.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              <strong>Eligibility:</strong> Individuals committed to the
              foundation’s mission and values.
            </p>
            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
              <li>Attend General Body meetings.</li>
              <li>Participate in foundation programs.</li>
              <li>Follow ethical conduct and organizational policies.</li>
            </ul>
            <p className="text-zinc-600 leading-relaxed">
              Membership may be terminated for non-compliance, unethical
              behavior, or voluntary resignation.
            </p>
          </section>

          {/* 4 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">4. Governing Body & Management</h2>
            <p className="text-zinc-600 leading-relaxed">
              <strong>Executive Committee:</strong> President, Vice-President,
              Secretary, Joint Secretary, Treasurer, and Members.
            </p>
            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
              <li>Ensure ethical governance.</li>
              <li>Approve programs and initiatives.</li>
              <li>Manage finances and resources transparently.</li>
              <li>Maintain institutional continuity.</li>
            </ul>
          </section>

          {/* 5 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">5. Meetings & Decision-Making</h2>
            <ul className="list-disc ml-5 text-zinc-600 space-y-1">
              <li>Annual General Meeting (AGM) held once every year.</li>
              <li>Special meetings may be called by the Executive Committee.</li>
              <li>Decisions taken by majority voting with quorum.</li>
              <li>Minutes of meetings are officially recorded.</li>
            </ul>
          </section>

          {/* 6 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">6. Amendments & Policy-Making</h2>
            <p className="text-zinc-600 leading-relaxed">
              Amendments to the Memorandum & Rules require approval of the
              General Body and must comply with the Madhya Pradesh Societies
              Registration Act.
            </p>
          </section>

          {/* 7 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">
              7. Institutional Continuity & Succession
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              Succession planning ensures smooth leadership transition without
              disrupting governance or programs.
            </p>
          </section>

          {/* 8 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">8. Legal Compliance</h2>
            <p className="text-zinc-600 leading-relaxed">
              SSF complies with all applicable Indian laws for NGOs, including
              audits, annual filings, and regulatory reporting.
            </p>
          </section>

          {/* 9 */}
          <section className="space-y-2">
            <h2 className="text-xl font-bold">9. Conclusion</h2>
            <p className="text-zinc-600 leading-relaxed">
              The Memorandum & Rules ensure accountability, transparency, ethical
              conduct, and sustainable impact for the communities served.
            </p>
          </section>

          <p className="text-sm text-zinc-500 italic">
            📄 Note: Full legal text (PDF) can be made available for download on
            the website.
          </p>
        </div>
      </div>
    </div>
  );
}
