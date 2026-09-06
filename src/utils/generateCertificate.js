import jsPDF from "jspdf";
import officialLogo from "../assets/new-logo.png";

const QR_CODE_API = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=";
const SIGNATURE_URL = "/images/signature.png";

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  // Do not force crossOrigin for same-origin public assets. The previous
  // Anonymous setting could make the official signature fail to load.
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`Unable to load image: ${url}`));
  img.src = url;
});

const safeFileName = (value) => String(value || "recipient")
  .trim()
  .replace(/[^a-z0-9]+/gi, "_")
  .replace(/^_+|_+$/g, "")
  .toLowerCase() || "recipient";

const fitText = (doc, text, maxWidth, maxSize, minSize = 18) => {
  let size = maxSize;
  doc.setFontSize(size);
  while (size > minSize && doc.getTextWidth(String(text)) > maxWidth) {
    size -= 1;
    doc.setFontSize(size);
  }
  return size;
};

const deriveVolunteerId = (certId) => {
  const value = String(certId || "");
  const current = value.match(/^SSF-VCERT-(\d{4})-(\d{4})$/);
  if (current) return `SSF-VOL-${current[1]}-${current[2]}`;
  const legacy = value.match(/^SSF-VOL-(\d{4})-(\d{4})$/);
  if (legacy) return `SSF-VOL-${legacy[1]}-${legacy[2]}`;
  return null;
};

const getRoleLabel = (role, isMember) => {
  if (isMember) return "Member";
  const value = String(role || "Volunteer").trim();
  if (!value) return "Volunteer";
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const generateIdentityCard = async ({ name, role, date, officialId, certId }) => {
  const normalizedRole = String(role || "volunteer").toLowerCase();
  const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const label = isMember ? "MEMBER ID" : "VOLUNTEER ID";
  const title = isMember ? "OFFICIAL MEMBERSHIP ID CARD" : "OFFICIAL VOLUNTEER ID CARD";
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [86, 54] });
  const width = 86;
  const height = 54;
  const navy = "#002344";
  const gold = "#C5A059";
  const light = "#F8FAFC";
  const roleLabel = getRoleLabel(role, isMember);

  doc.setFillColor(light);
  doc.rect(0, 0, width, height, "F");
  doc.setFillColor(navy);
  doc.rect(0, 0, width, 13, "F");
  doc.setDrawColor(gold);
  doc.setLineWidth(0.8);
  doc.rect(2.2, 2.2, width - 4.4, height - 4.4);

  try {
    const logo = await loadImage(officialLogo);
    const logoWidth = 8.5;
    const logoHeight = Math.min((logo.height / logo.width) * logoWidth, 8);
    doc.addImage(logo, "PNG", 5, 2.3, logoWidth, logoHeight);
  } catch {
    // The organization name below remains the branding fallback.
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(7.1);
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", 15, 6.8);
  doc.setFontSize(4.6);
  doc.text(title, 15, 10.3);

  doc.setTextColor(navy);
  doc.setFont("helvetica", "bold");
  fitText(doc, String(name || "Member"), 55, 9.5, 6.5);
  doc.text(String(name || "Member"), 5, 21.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.3);
  doc.setTextColor("#555555");
  doc.text(`${label}:`, 5, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(navy);
  doc.text(String(officialId || "Pending"), 5, 33.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.2);
  doc.setTextColor("#555555");
  doc.text(`Role: ${roleLabel}`, 5, 39);
  doc.text(`Issued: ${date || "—"}`, 5, 43.5);
  if (certId) doc.text(`Certificate: ${certId}`, 5, 47.7);

  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", 65.2, 16.5, 15.5, 15.5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.1);
      doc.setTextColor("#555555");
      doc.text("SCAN TO VERIFY", 72.95, 34.4, { align: "center" });
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.1);
      doc.setTextColor("#777777");
      doc.text("VERIFY ONLINE", 72.95, 25, { align: "center" });
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(4.1);
  doc.setTextColor("#777777");
  doc.text("Issued only after official approval", width / 2, 51.5, { align: "center" });

  doc.save(`SSF_${isMember ? "Member" : "Volunteer"}_ID_${safeFileName(name)}.pdf`);
};

export const generateCertificate = async (name, role, date, certId = null, memberId = null) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const centerX = width / 2;
  const normalizedRole = String(role || "volunteer").toLowerCase();
  const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const navy = "#002344";
  const gold = "#C5A059";
  const ink = "#30343B";
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  const roleLabel = getRoleLabel(role, isMember);

  // Clean, print-safe certificate background and double border.
  doc.setFillColor("#FFFDF8");
  doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(navy);
  doc.setLineWidth(1.8);
  doc.rect(6, 6, width - 12, height - 12);
  doc.setDrawColor(gold);
  doc.setLineWidth(0.7);
  doc.rect(10, 10, width - 20, height - 20);

  // Header branding.
  try {
    const logo = await loadImage(officialLogo);
    const logoWidth = 24;
    const logoHeight = Math.min((logo.height / logo.width) * logoWidth, 22);
    doc.addImage(logo, "PNG", centerX - logoWidth / 2, 14, logoWidth, logoHeight);
  } catch {
    doc.setFont("times", "bold");
    doc.setFontSize(17);
    doc.setTextColor(navy);
    doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", centerX, 28, { align: "center" });
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(navy);
  doc.setFontSize(8);
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", centerX, 40, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor("#666666");
  doc.text("Rewa, Madhya Pradesh • Serving Communities Across India", centerX, 44.5, { align: "center" });

  // Main title.
  doc.setFont("times", "bold");
  doc.setTextColor(navy);
  doc.setFontSize(isMember ? 27 : 30);
  doc.text(isMember ? "CERTIFICATE OF MEMBERSHIP" : "CERTIFICATE OF APPRECIATION", centerX, 60, { align: "center" });
  doc.setDrawColor(gold);
  doc.setLineWidth(0.8);
  doc.line(centerX - 50, 64, centerX + 50, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor("#555555");
  doc.text("This certificate is proudly presented to", centerX, 76, { align: "center" });

  // Recipient name with dynamic sizing so long names never run into the border.
  doc.setFont("times", "bolditalic");
  doc.setTextColor(navy);
  fitText(doc, String(name || "Recipient"), 215, 31, 19);
  doc.text(String(name || "Recipient"), centerX, 91, { align: "center" });
  doc.setDrawColor(gold);
  doc.setLineWidth(0.6);
  doc.line(centerX - 58, 96, centerX + 58, 96);

  const body = isMember
    ? "in recognition of their approved membership and commitment to the mission and values of Swastik Srijan Foundation Samiti."
    : normalizedRole.includes("volunteer")
      ? `in recognition of dedicated service as a ${roleLabel} and valuable contribution to the mission of Swastik Srijan Foundation Samiti.`
      : normalizedRole === "donor"
        ? "in sincere gratitude for generous support that helps the Foundation create positive social impact."
        : `in recognition of valuable contribution as a ${roleLabel}.`;

  doc.setFont("times", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(ink);
  const bodyLines = doc.splitTextToSize(body, 205);
  doc.text(bodyLines, centerX, 108, { align: "center", lineHeightFactor: 1.35 });

  // Bottom information area is deliberately separated from the QR/signature.
  const footerTop = 137;
  doc.setDrawColor("#D8D2C5");
  doc.setLineWidth(0.35);
  doc.line(25, footerTop, width - 25, footerTop);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(navy);
  if (officialId) doc.text(`${isMember ? "MEMBER" : "VOLUNTEER"} ID`, 27, 148);
  if (certId) doc.text("OFFICIAL CERTIFICATE ID", 27, 158);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(ink);
  if (officialId) doc.text(String(officialId), 27, 153);
  if (certId) doc.text(String(certId), 27, 163);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(navy);
  doc.text("DATE OF ISSUE", 27, 173);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(ink);
  doc.text(String(date || "—"), 27, 178);

  // Official signature: public/images/signature.png exists in the repository.
  // Use it from the same origin so it loads reliably in Vercel production.
  const signatureX = 128;
  try {
    const signature = await loadImage(`${SIGNATURE_URL}?v=1`);
    const sigWidth = 38;
    const naturalHeight = (signature.height / signature.width) * sigWidth;
    const sigHeight = Math.min(naturalHeight, 18);
    doc.addImage(signature, "PNG", signatureX - sigWidth / 2, 149, sigWidth, sigHeight);
  } catch {
    // Never fake a signature. The authorized-signatory line remains visible.
  }
  doc.setDrawColor("#333333");
  doc.setLineWidth(0.45);
  doc.line(signatureX - 28, 168, signatureX + 28, 168);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(navy);
  doc.text("Authorized Signatory", signatureX, 174, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor("#666666");
  doc.text("Swastik Srijan Foundation Samiti", signatureX, 179, { align: "center" });

  // Verification QR occupies its own area and no longer overlaps certificate IDs.
  const qrX = 244;
  const qrY = 144;
  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", qrX, qrY, 28, 28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.7);
      doc.setTextColor("#555555");
      doc.text("SCAN TO VERIFY", qrX + 14, 176, { align: "center" });
    } catch {
      // The human-readable verification URL below remains available.
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.setTextColor("#666666");
    doc.text(`Verify: ${verificationUrl}`, centerX, 190, { align: "center" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor("#888888");
  doc.text("This document is issued by Swastik Srijan Foundation Samiti after official approval and may be verified online.", centerX, 196, { align: "center" });

  doc.save(`SSF_Certificate_${safeFileName(name)}.pdf`);
};

// Kept as a convenience for existing callers that expect one action to issue both documents.
export const generateCertificateAndIdCard = async (name, role, date, certId = null, memberId = null) => {
  const normalizedRole = String(role || "volunteer").toLowerCase();
  const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  await generateCertificate(name, role, date, certId, memberId);
  await generateIdentityCard({ name, role, date, officialId, certId });
};
