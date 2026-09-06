import jsPDF from "jspdf";
import officialLogo from "../assets/new-logo.png";

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

const QR_CODE_API = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=";

const deriveVolunteerId = (certId) => {
  const value = String(certId || "");
  const current = value.match(/^SSF-VCERT-(\d{4})-(\d{4})$/);
  if (current) return `SSF-VOL-${current[1]}-${current[2]}`;
  const legacy = value.match(/^SSF-VOL-(\d{4})-(\d{4})$/);
  if (legacy) return `SSF-VOL-${legacy[1]}-${legacy[2]}`;
  return null;
};

const generateIdentityCard = async ({ name, role, date, officialId, certId }) => {
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

  doc.setFillColor("#FFFFFF"); doc.rect(0, 0, width, height, "F");
  doc.setFillColor(navy); doc.rect(0, 0, width, 13, "F");
  doc.setDrawColor(gold); doc.setLineWidth(0.8); doc.rect(2.5, 2.5, width - 5, height - 5);

  try {
    const logo = await loadImage(officialLogo);
    const logoWidth = 9;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    doc.addImage(logo, "PNG", 5, 2, logoWidth, Math.min(logoHeight, 8));
  } catch { /* text branding remains */ }

  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor("#FFFFFF");
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", 16, 7);
  doc.setFontSize(5.2); doc.text(title, 16, 10.5);

  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(navy);
  doc.text(String(name || "Member"), 5, 23);
  doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor("#555555");
  doc.text(`${label}:`, 5, 30);
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(navy);
  doc.text(String(officialId || "Pending"), 5, 35);

  doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor("#555555");
  doc.text(`Role: ${isMember ? "Member" : String(role || "Volunteer")}`, 5, 41);
  doc.text(`Issued: ${date}`, 5, 45);
  if (certId) doc.text(`Certificate: ${certId}`, 5, 49);

  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", 65, 16, 16, 16);
      doc.setFont("helvetica", "bold"); doc.setFontSize(4.5); doc.setTextColor("#555555");
      doc.text("SCAN TO VERIFY", 73, 34, { align: "center" });
    } catch { /* printed certificate ID remains */ }
  }

  doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor("#777777");
  doc.text("This ID card is issued only after official approval.", width / 2, 52, { align: "center" });

  const safeName = String(name || "recipient").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`SSF_${isMember ? "Member" : "Volunteer"}_ID_${safeName}.pdf`);
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
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;

  doc.setFillColor("#FDFBF7"); doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(navy); doc.setLineWidth(3); doc.rect(5, 5, width - 10, height - 10);
  doc.setDrawColor(gold); doc.setLineWidth(1.2); doc.rect(11, 11, width - 22, height - 22);

  try {
    const logo = await loadImage(officialLogo);
    const logoWidth = 25;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    doc.addImage(logo, "PNG", centerX - logoWidth / 2, 18, logoWidth, logoHeight);
  } catch {
    doc.setFont("times", "bold"); doc.setFontSize(18); doc.setTextColor(navy);
    doc.text("SWASTIK SRIJAN FOUNDATION", centerX, 32, { align: "center" });
  }

  doc.setFont("times", "bold"); doc.setFontSize(isMember ? 32 : 38); doc.setTextColor(navy);
  doc.text(isMember ? "CERTIFICATE OF MEMBERSHIP" : "CERTIFICATE OF APPRECIATION", centerX, 58, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor("#555555");
  doc.text("This certificate is proudly presented to", centerX, 72, { align: "center" });
  doc.setFont("times", "bolditalic"); doc.setFontSize(36); doc.setTextColor(navy);
  doc.text(String(name || "Recipient"), centerX, 91, { align: "center" });
  doc.setDrawColor(gold); doc.setLineWidth(1); doc.line(centerX - 55, 97, centerX + 55, 97);

  const body = isMember
    ? "in recognition of their approved membership and commitment to the mission and values of Swastik Srijan Foundation."
    : normalizedRole.includes("volunteer")
      ? `in recognition of dedicated service as a ${String(role).toUpperCase()} and valuable contribution to the mission of Swastik Srijan Foundation.`
      : normalizedRole === "donor"
        ? "in sincere gratitude for generous support that helps the Foundation create positive social impact."
        : `in recognition of valuable contribution as a ${String(role || "participant").toUpperCase()}.`;
  doc.setFont("times", "normal"); doc.setFontSize(15); doc.setTextColor("#444444");
  doc.text(doc.splitTextToSize(body, 185), centerX, 111, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(navy);
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  if (officialId) doc.text(`${isMember ? "MEMBER" : "VOLUNTEER"} ID: ${officialId}`, 25, height - 35);
  if (certId) doc.text(`OFFICIAL CERTIFICATE ID: ${certId}`, 25, height - 27);
  doc.text(`DATE OF ISSUE: ${date}`, width - 25, height - 35, { align: "right" });

  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", width - 48, height - 64, 25, 25);
      doc.setFontSize(6.5); doc.setTextColor("#555555");
      doc.text("SCAN TO VERIFY", width - 35.5, height - 36, { align: "center" });
    } catch { /* printed verification URL remains */ }
    doc.setFontSize(7.5); doc.text(`Verify: ${verificationUrl}`, centerX, height - 19, { align: "center" });
  }

  try {
    const signature = await loadImage("/images/signature.png");
    const sigWidth = 34;
    const sigHeight = (signature.height / signature.width) * sigWidth;
    doc.addImage(signature, "PNG", centerX - sigWidth / 2, height - 51, sigWidth, sigHeight);
  } catch { /* optional */ }
  doc.setDrawColor("#333333"); doc.setLineWidth(0.5); doc.line(centerX - 28, height - 34, centerX + 28, height - 34);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text("Authorized Signatory", centerX, height - 29, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor("#777777");
  doc.text("Swastik Srijan Foundation Samiti", centerX, height - 24, { align: "center" });

  const safeName = String(name || "recipient").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`SSF_Certificate_${safeName}.pdf`);
  await generateIdentityCard({ name, role, date, officialId, certId });
};
