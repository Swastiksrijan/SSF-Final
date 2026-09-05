import jsPDF from "jspdf";

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

export const generateMembershipCertificate = async (name, memberId, certId, date) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const centerX = width / 2;
  const navy = "#002344";
  const gold = "#C5A059";
  const cream = "#FDFBF7";

  doc.setFillColor(cream); doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(navy); doc.setLineWidth(3); doc.rect(5, 5, width - 10, height - 10);
  doc.setDrawColor(gold); doc.setLineWidth(1.2); doc.rect(11, 11, width - 22, height - 22);

  try {
    const logo = await loadImage("/images/logo.png");
    const logoWidth = 25;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    doc.addImage(logo, "PNG", centerX - logoWidth / 2, 18, logoWidth, logoHeight);
  } catch {
    doc.setFont("times", "bold"); doc.setFontSize(18); doc.setTextColor(navy);
    doc.text("SWASTIK SRIJAN FOUNDATION", centerX, 32, { align: "center" });
  }

  doc.setFont("times", "bold"); doc.setFontSize(34); doc.setTextColor(navy);
  doc.text("CERTIFICATE OF MEMBERSHIP", centerX, 58, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.setTextColor("#555555");
  doc.text("This certificate is proudly presented to", centerX, 72, { align: "center" });

  doc.setFont("times", "bolditalic"); doc.setFontSize(36); doc.setTextColor(navy);
  doc.text(name, centerX, 91, { align: "center" });
  doc.setDrawColor(gold); doc.setLineWidth(1); doc.line(centerX - 55, 97, centerX + 55, 97);

  doc.setFont("times", "normal"); doc.setFontSize(15); doc.setTextColor("#444444");
  doc.text("in recognition of their approved membership and commitment", centerX, 111, { align: "center" });
  doc.text("to the mission and values of Swastik Srijan Foundation.", centerX, 119, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(navy);
  doc.text(`MEMBER ID: ${memberId || "—"}`, 25, height - 30);
  doc.text(`CERTIFICATE ID: ${certId || "—"}`, 25, height - 23);
  doc.text(`DATE OF ISSUE: ${date}`, width - 25, height - 30, { align: "right" });
  doc.text("Verify: swastiksrijan.in/verify/" + certId, width - 25, height - 23, { align: "right" });

  try {
    const signature = await loadImage("/images/signature.png");
    const sigWidth = 34;
    const sigHeight = (signature.height / signature.width) * sigWidth;
    doc.addImage(signature, "PNG", centerX - sigWidth / 2, height - 52, sigWidth, sigHeight);
  } catch { /* signature is optional */ }
  doc.setDrawColor("#333333"); doc.setLineWidth(0.5); doc.line(centerX - 28, height - 35, centerX + 28, height - 35);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(navy);
  doc.text("Authorized Signatory", centerX, height - 30, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor("#777777");
  doc.text("Swastik Srijan Foundation Samiti", centerX, height - 25, { align: "center" });

  const safeName = String(name || "member").replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`SSF_Membership_Certificate_${safeName}.pdf`);
};
