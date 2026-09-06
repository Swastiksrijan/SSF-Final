import jsPDF from "jspdf";
import officialLogo from "../assets/new-logo.png";

const QR_CODE_API = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=";
const SIGNATURE_URL = "/images/signature.png";

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`Unable to load image: ${url}`));
  img.src = url;
});

const safeFileName = (value) => String(value || "recipient").trim().replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase() || "recipient";

const fitText = (doc, text, maxWidth, maxSize, minSize = 18) => {
  let size = maxSize;
  doc.setFontSize(size);
  while (size > minSize && doc.getTextWidth(String(text)) > maxWidth) { size -= 1; doc.setFontSize(size); }
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
  return value ? value.replace(/\b\w/g, (char) => char.toUpperCase()) : "Volunteer";
};

export const generateIdentityCard = async ({ name, role, date, officialId, certId, photoUrl }) => {
  const normalizedRole = String(role || "volunteer").toLowerCase();
  const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const cardType = isMember ? "MEMBERSHIP" : "VOLUNTEER";
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

  // FRONT
  doc.setFillColor(light); doc.rect(0, 0, width, height, "F");
  doc.setFillColor(navy); doc.rect(0, 0, width, 14, "F");
  doc.setDrawColor(gold); doc.setLineWidth(0.8); doc.rect(2.2, 2.2, width - 4.4, height - 4.4);
  try {
    const logo = await loadImage(officialLogo);
    const logoWidth = 8.5; const logoHeight = Math.min((logo.height / logo.width) * logoWidth, 8);
    doc.addImage(logo, "PNG", 5, 2.5, logoWidth, logoHeight);
  } catch { /* branding text remains */ }
  doc.setFont("helvetica", "bold"); doc.setTextColor("#FFFFFF"); doc.setFontSize(6.8);
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", 15, 6.7);
  doc.setFontSize(4.5); doc.text(title, 15, 10.8);

  // Passport-size photo area.
  const photoX = 5; const photoY = 18; const photoW = 23; const photoH = 27;
  doc.setFillColor("#E5E7EB"); doc.roundedRect(photoX, photoY, photoW, photoH, 1.2, 1.2, "F");
  doc.setDrawColor("#B8BEC7"); doc.setLineWidth(0.35); doc.roundedRect(photoX, photoY, photoW, photoH, 1.2, 1.2);
  if (photoUrl) {
    try {
      const photo = await loadImage(photoUrl);
      const sourceRatio = photo.width / photo.height; const boxRatio = photoW / photoH;
      let drawW = photoW; let drawH = photoH; let drawX = photoX; let drawY = photoY;
      if (sourceRatio > boxRatio) { drawW = photoH * sourceRatio; drawX = photoX - (drawW - photoW) / 2; }
      else { drawH = photoW / sourceRatio; drawY = photoY - (drawH - photoH) / 2; }
      doc.addImage(photo, "JPEG", drawX, drawY, drawW, drawH);
      doc.setDrawColor(gold); doc.setLineWidth(0.6); doc.roundedRect(photoX, photoY, photoW, photoH, 1.2, 1.2);
    } catch {
      doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor("#777777");
      doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
    }
  } else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor("#777777");
    doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
  }

  const detailsX = 31;
  doc.setTextColor(navy); doc.setFont("helvetica", "bold");
  fitText(doc, String(name || "Member"), 46, 8.8, 6.2); doc.text(String(name || "Member"), detailsX, 22.5);
  doc.setFont("helvetica", "normal"); doc.setFontSize(4.8); doc.setTextColor("#666666"); doc.text(cardType, detailsX, 26.2);
  doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor("#555555"); doc.text(`${label}:`, detailsX, 31);
  doc.setFontSize(7); doc.setTextColor(navy); doc.text(String(officialId || "Pending"), detailsX, 35.2);
  doc.setFont("helvetica", "normal"); doc.setFontSize(4.8); doc.setTextColor("#555555");
  doc.text(`Role: ${roleLabel}`, detailsX, 40);
  doc.text(`Issued: ${date || "—"}`, detailsX, 44.2);

  if (verificationUrl) {
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", 66.5, 17.5, 14.5, 14.5);
      doc.setFont("helvetica", "bold"); doc.setFontSize(3.8); doc.setTextColor("#555555"); doc.text("SCAN TO VERIFY", 73.75, 34, { align: "center" });
    } catch {
      doc.setFont("helvetica", "bold"); doc.setFontSize(4); doc.setTextColor("#777777"); doc.text("VERIFY ONLINE", 73.75, 25, { align: "center" });
    }
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(3.8); doc.setTextColor("#777777");
  doc.text("Valid only after official approval", width / 2, 50.7, { align: "center" });

  // BACK
  doc.addPage([86, 54], "landscape");
  doc.setFillColor("#FFFFFF"); doc.rect(0, 0, width, height, "F");
  doc.setFillColor(navy); doc.rect(0, 0, width, 12, "F");
  doc.setDrawColor(gold); doc.setLineWidth(0.8); doc.rect(2.2, 2.2, width - 4.4, height - 4.4);
  doc.setFont("helvetica", "bold"); doc.setTextColor("#FFFFFF"); doc.setFontSize(6.2); doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", width / 2, 7.3, { align: "center" });
  doc.setFontSize(4.2); doc.text("OFFICIAL ID CARD • BACK", width / 2, 10.2, { align: "center" });
  doc.setTextColor(navy); doc.setFont("helvetica", "bold"); doc.setFontSize(5.4); doc.text("IMPORTANT", 7, 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(4.5); doc.setTextColor("#444444");
  const notes = [
    "This card is the official identity card issued after approval by the Foundation.",
    "It remains the property of Swastik Srijan Foundation Samiti and may be withdrawn when authorization ends.",
    "If found, please return it to the Foundation. Do not alter, transfer or misuse this card."
  ];
  notes.forEach((text, index) => doc.text(doc.splitTextToSize(`• ${text}`, 72), 7, 23 + index * 7, { lineHeightFactor: 1.15 }));
  if (certId) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(4.7); doc.setTextColor(navy); doc.text("CERTIFICATE ID", 7, 44);
    doc.setFont("helvetica", "normal"); doc.setTextColor("#444444"); doc.text(String(certId), 7, 48);
  }
  try {
    const signature = await loadImage(`${SIGNATURE_URL}?v=1`);
    doc.addImage(signature, "PNG", 62, 37, 17, 8);
  } catch { /* never fake a signature */ }
  doc.setDrawColor("#333333"); doc.setLineWidth(0.35); doc.line(57, 46, 80, 46);
  doc.setFont("helvetica", "bold"); doc.setFontSize(4.2); doc.setTextColor(navy); doc.text("Authorized Signatory", 68.5, 50, { align: "center" });

  doc.save(`SSF_${isMember ? "Member" : "Volunteer"}_ID_${safeFileName(name)}.pdf`);
};

export const generateCertificate = async (name, role, date, certId = null, memberId = null) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const width = doc.internal.pageSize.getWidth(); const height = doc.internal.pageSize.getHeight(); const centerX = width / 2;
  const normalizedRole = String(role || "volunteer").toLowerCase(); const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const navy = "#002344"; const gold = "#C5A059"; const ink = "#30343B";
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId)); const roleLabel = getRoleLabel(role, isMember);
  doc.setFillColor("#FFFDF8"); doc.rect(0, 0, width, height, "F");
  doc.setDrawColor(navy); doc.setLineWidth(1.8); doc.rect(6, 6, width - 12, height - 12);
  doc.setDrawColor(gold); doc.setLineWidth(0.7); doc.rect(10, 10, width - 20, height - 20);
  try { const logo = await loadImage(officialLogo); const logoWidth = 24; const logoHeight = Math.min((logo.height / logo.width) * logoWidth, 22); doc.addImage(logo, "PNG", centerX - logoWidth / 2, 14, logoWidth, logoHeight); }
  catch { doc.setFont("times", "bold"); doc.setFontSize(17); doc.setTextColor(navy); doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", centerX, 28, { align: "center" }); }
  doc.setFont("helvetica", "bold"); doc.setTextColor(navy); doc.setFontSize(8); doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", centerX, 40, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(5.8); doc.setTextColor("#666666"); doc.text("Rewa, Madhya Pradesh • Serving Communities Across India", centerX, 44.5, { align: "center" });
  doc.setFont("times", "bold"); doc.setTextColor(navy); doc.setFontSize(isMember ? 27 : 30); doc.text(isMember ? "CERTIFICATE OF MEMBERSHIP" : "CERTIFICATE OF APPRECIATION", centerX, 60, { align: "center" });
  doc.setDrawColor(gold); doc.setLineWidth(0.8); doc.line(centerX - 50, 64, centerX + 50, 64);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor("#555555"); doc.text("This certificate is proudly presented to", centerX, 76, { align: "center" });
  doc.setFont("times", "bolditalic"); doc.setTextColor(navy); fitText(doc, String(name || "Recipient"), 215, 31, 19); doc.text(String(name || "Recipient"), centerX, 91, { align: "center" });
  doc.setDrawColor(gold); doc.setLineWidth(0.6); doc.line(centerX - 58, 96, centerX + 58, 96);
  const body = isMember ? "in recognition of their approved membership and commitment to the mission and values of Swastik Srijan Foundation Samiti." : normalizedRole.includes("volunteer") ? `in recognition of dedicated service as a ${roleLabel} and valuable contribution to the mission of Swastik Srijan Foundation Samiti.` : normalizedRole === "donor" ? "in sincere gratitude for generous support that helps the Foundation create positive social impact." : `in recognition of valuable contribution as a ${roleLabel}.`;
  doc.setFont("times", "normal"); doc.setFontSize(11.5); doc.setTextColor(ink); doc.text(doc.splitTextToSize(body, 205), centerX, 108, { align: "center", lineHeightFactor: 1.35 });
  const footerTop = 137; doc.setDrawColor("#D8D2C5"); doc.setLineWidth(0.35); doc.line(25, footerTop, width - 25, footerTop);
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.2); doc.setTextColor(navy); if (officialId) doc.text(`${isMember ? "MEMBER" : "VOLUNTEER"} ID`, 27, 148); if (certId) doc.text("OFFICIAL CERTIFICATE ID", 27, 158);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(ink); if (officialId) doc.text(String(officialId), 27, 153); if (certId) doc.text(String(certId), 27, 163);
  doc.setFont("helvetica", "bold"); doc.setFontSize(7.2); doc.setTextColor(navy); doc.text("DATE OF ISSUE", 27, 173); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(ink); doc.text(String(date || "—"), 27, 178);
  const signatureX = 128;
  try { const signature = await loadImage(`${SIGNATURE_URL}?v=1`); const sigWidth = 38; const naturalHeight = (signature.height / signature.width) * sigWidth; const sigHeight = Math.min(naturalHeight, 18); doc.addImage(signature, "PNG", signatureX - sigWidth / 2, 149, sigWidth, sigHeight); } catch { /* never fake a signature */ }
  doc.setDrawColor("#333333"); doc.setLineWidth(0.45); doc.line(signatureX - 28, 168, signatureX + 28, 168); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(navy); doc.text("Authorized Signatory", signatureX, 174, { align: "center" }); doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor("#666666"); doc.text("Swastik Srijan Foundation Samiti", signatureX, 179, { align: "center" });
  const qrX = 244; const qrY = 144;
  if (verificationUrl) { try { const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`); doc.addImage(qr, "PNG", qrX, qrY, 28, 28); doc.setFont("helvetica", "bold"); doc.setFontSize(5.7); doc.setTextColor("#555555"); doc.text("SCAN TO VERIFY", qrX + 14, 176, { align: "center" }); } catch {} doc.setFont("helvetica", "normal"); doc.setFontSize(5.8); doc.setTextColor("#666666"); doc.text(`Verify: ${verificationUrl}`, centerX, 190, { align: "center" }); }
  doc.setFont("helvetica", "normal"); doc.setFontSize(5.8); doc.setTextColor("#888888"); doc.text("This document is issued by Swastik Srijan Foundation Samiti after official approval and may be verified online.", centerX, 196, { align: "center" });
  doc.save(`SSF_Certificate_${safeFileName(name)}.pdf`);
};

export const generateCertificateAndIdCard = async (name, role, date, certId = null, memberId = null, photoUrl = null) => {
  const normalizedRole = String(role || "volunteer").toLowerCase(); const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  await generateCertificate(name, role, date, certId, memberId);
  await generateIdentityCard({ name, role, date, officialId, certId, photoUrl });
};
