// "Registered. Recognised. Accountable." — the Foundation's formal credentials
// on the home page: the statutory registrations, the sanstha seal, the
// authorised signature and the count of government pledge certificates held.
// The seal and signature are shown as real artefacts, not icons, because a
// visitor deciding whether to trust an NGO looks for exactly those marks.
import { Link } from "@tanstack/react-router";
import { FaArrowRight, FaCheckCircle, FaFileSignature, FaStamp, FaShieldAlt } from "react-icons/fa";
import { BRAND, CREDENTIALS, BADGE_COUNT, CERT_COUNT } from "../data/brandAssets";
import RecognitionBand from "./RecognitionBand";

export default function TrustCredentials() {
  return (
    <section className="border-y border-[#EAF0F6] bg-white px-5 py-16 md:px-8 md:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#12345A]">Registered · Recognised · Accountable</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#12345A] md:text-4xl">
              Credentials you can verify, not just read.
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Swastik Srijan Foundation Samiti is a registered society. Its registration number, statutory
              approvals and the organisation seal appear on every official letter, certificate and receipt
              the Foundation issues.
            </p>
            <p className="mt-3 font-hindi leading-relaxed text-slate-600">
              संस्था का पंजीकरण क्रमांक, शासकीय अनुमोदन एवं संस्था मोहर प्रत्येक आधिकारिक पत्र, प्रमाण-पत्र
              और रसीद पर अंकित होती है।
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {CREDENTIALS.map((c) => (
                <li key={c.en} className="flex items-start gap-3 rounded-2xl border border-[#EAF0F6] bg-[#FAF9F5] p-4">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-[#176447]" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-[#12345A]">{c.en}</span>
                    <span className="block text-[11px] font-semibold text-[#176447]">{c.hi}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{c.note}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/Transparency" className="inline-flex items-center gap-2 rounded-full bg-[#12345A] px-6 py-3 font-bold text-white transition hover:bg-[#176447]">
                <FaShieldAlt /> Transparency Centre
              </Link>
              <Link to="/VerifyDocument" className="inline-flex items-center gap-2 rounded-full border border-[#12345A] px-6 py-3 font-bold text-[#12345A] transition hover:bg-[#EAF0F6]">
                Verify a document <FaArrowRight />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#EAF0F6] bg-[#FAF9F5] p-6 shadow-[0_30px_60px_-45px_rgba(18,52,90,0.6)] md:p-8">
              <div className="grid grid-cols-2 gap-4">
                <figure className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <img src={BRAND.sealSanstha} alt="Swastik Srijan Foundation official seal (mohar)" loading="lazy" className="h-24 w-24 object-contain md:h-28 md:w-28" />
                  <figcaption className="mt-3">
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#176447]"><FaStamp className="mr-1 inline" />Official seal</span>
                    <span className="mt-1 block text-xs font-bold text-[#12345A]">संस्था मोहर</span>
                  </figcaption>
                </figure>
                <figure className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <img src={BRAND.signatureSecretary} alt="Authorised signature of Amit Kumar Pandey, Secretary, Swastik Srijan Foundation" loading="lazy" className="h-16 w-auto object-contain md:h-20" />
                  <figcaption className="mt-3">
                    <span className="block text-[11px] font-black uppercase tracking-[0.14em] text-[#176447]"><FaFileSignature className="mr-1 inline" />Authorised signatory</span>
                    <span className="mt-1 block text-xs font-bold text-[#12345A]">Amit Kumar Pandey · Secretary</span>
                    <span className="block text-[11px] text-slate-500">अधिकृत हस्ताक्षरकर्ता</span>
                  </figcaption>
                </figure>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[[`${CERT_COUNT}`, 'Recognition certificates', 'सम्मान प्रमाण-पत्र'], [`${BADGE_COUNT}+`, 'Government pledges', 'शासकीय संकल्प'], ['2013', 'Serving since', 'स्थापना वर्ष']].map(([v, en, hi]) => (
                  <div key={en} className="rounded-2xl bg-[#12345A] p-4 text-center text-white">
                    <p className="font-serif text-2xl font-bold text-[#F7A814]">{v}</p>
                    <p className="mt-1 text-[11px] font-bold leading-tight">{en}</p>
                    <p className="text-[10px] leading-tight text-slate-300">{hi}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
                The seal and signature above are the marks used on the Foundation&apos;s official stationery.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#12345A]">Recognitions &amp; Pledges · सम्मान एवं संकल्प</p>
              <h3 className="mt-2 font-serif text-2xl text-[#12345A] md:text-3xl">Certificates, seals and national pledges.</h3>
            </div>
            <Link to="/Transparency" className="inline-flex items-center gap-2 text-sm font-bold text-[#12345A] hover:text-[#176447]">
              See all records <FaArrowRight />
            </Link>
          </div>
          <RecognitionBand />
        </div>
      </div>
    </section>
  );
}
