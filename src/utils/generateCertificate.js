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
  if (memberId) doc.text(`MEMBER ID: ${memberId}`, 25, height - 35);
  if (certId) doc.text(`OFFICIAL CERTIFICATE ID: ${certId}`, 25, height - 27);
  doc.text(`DATE OF ISSUE: ${date}`, width - 25, height - 35, { align: "right" });

  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", width - 48, height - 64, 25, 25);
      doc.setFontSize(6.5);
      doc.setTextColor("#555555");
      doc.text("SCAN TO VERIFY", width - 35.5, height - 36, { align: "center" });
    } catch {
      // The printed verification URL remains available if QR generation is unavailable.
    }
    doc.setFontSize(7.5);
    doc.text(`Verify: ${verificationUrl}`, centerX, height - 19, { align: "center" });
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
};
