import jsPDF from "jspdf";
import officialLogo from "../assets/new-logo.png";

const QR_CODE_API = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=";
const SIGNATURE_URL = "/images/signature.png";

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = "anonymous";
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

const getImageFormat = (url) => {
  const match = String(url || "").match(/^data:image\/([a-z0-9.+-]+);/i);
  if (match) {
    const type = match[1].toLowerCase();
    return type === "jpg" || type === "jpeg" ? "JPEG" : type === "webp" ? "WEBP" : "PNG";
  }
  return "JPEG";
};

const getRoleLabel = (role, isMember) => {
  if (isMember) return "Member";
  const value = String(role || "Volunteer").trim();
  return value ? value.replace(/\b\w/g, (char) => char.toUpperCase()) : "Volunteer";
};

export const generateIdentityCard = async ({ name, role, date, officialId, certId, photoUrl }) => {
  const normalizedRole = String(role || "volunteer").toLowerCase();
  const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
  const typeLabel = isMember ? "MEMBERSHIP" : "VOLUNTEER";
  const idLabel = isMember ? "MEMBER ID" : "VOLUNTEER ID";
  const roleLabel = getRoleLabel(role, isMember);
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [86, 54] });
  const W = 86; const H = 54;
  const navy = "#002344"; const blue = "#0B3A63"; const gold = "#C5A059"; const cream = "#FBFAF6"; const ink = "#26323D"; const muted = "#697582";

  // FRONT — premium photo-ID design
  doc.setFillColor(cream); doc.rect(0, 0, W, H, "F");
  doc.setFillColor(navy); doc.roundedRect(0, 0, W, 15, 0, 0, "F");
  doc.setFillColor(gold); doc.rect(0, 13.5, W, 1.5, "F");
  doc.setDrawColor(gold); doc.setLineWidth(0.55); doc.roundedRect(2, 2, W - 4, H - 4, 2, 2);
  try {
    const logo = await loadImage(officialLogo);
    const logoW = 9; const logoH = Math.min((logo.height / logo.width) * logoW, 9);
    doc.addImage(logo, "PNG", 5, 2.7, logoW, logoH);
  } catch { /* branding text remains */ }
  doc.setFont("helvetica", "bold"); doc.setTextColor("#FFFFFF"); doc.setFontSize(6.2);
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", 16, 6.6);
  doc.setFontSize(3.8); doc.setTextColor("#DDE7F0");
  doc.text(isMember ? "OFFICIAL MEMBERSHIP IDENTITY CARD" : "OFFICIAL VOLUNTEER IDENTITY CARD", 16, 10.7);
  doc.setFontSize(3.1); doc.setTextColor("#FFFFFF"); doc.text(typeLabel, W - 5, 6.6, { align: "right" });

  const photoX = 5; const photoY = 18; const photoW = 22; const photoH = 27;
  doc.setFillColor("#E8EDF2"); doc.roundedRect(photoX, photoY, photoW, photoH, 1.8, 1.8, "F");
  if (photoUrl) {
    try {
      const photo = await loadImage(photoUrl);
      const sourceRatio = photo.width / photo.height; const boxRatio = photoW / photoH;
      let drawW = photoW; let drawH = photoH; let drawX = photoX; let drawY = photoY;
      if (sourceRatio > boxRatio) { drawW = photoH * sourceRatio; drawX = photoX - (drawW - photoW) / 2; }
      else { drawH = photoW / sourceRatio; drawY = photoY - (drawH - photoH) / 2; }
      doc.addImage(photo, getImageFormat(photoUrl), drawX, drawY, drawW, drawH);
    } catch {
      doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor("#7B8490"); doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
    }
  } else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(5); doc.setTextColor("#7B8490"); doc.text("PHOTO", photoX + photoW / 2, photoY + photoH / 2, { align: "center" });
  }
  doc.setDrawColor(gold); doc.setLineWidth(0.7); doc.roundedRect(photoX, photoY, photoW, photoH, 1.8, 1.8);
  doc.setFillColor(navy); doc.roundedRect(photoX, 42.5, photoW, 2.5, 0.8, 0.8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(3.2); doc.setTextColor("#FFFFFF");
  doc.text(isMember ? "MEMBER" : "VOLUNTEER", photoX + photoW / 2, 44.25, { align: "center" });

  const detailsX = 30;
  doc.setFont("helvetica", "bold"); doc.setTextColor(navy); fitText(doc, String(name || "Member"), 31, 9, 6); doc.text(String(name || "Member"), detailsX, 21.8);
  doc.setFontSize(3.4); doc.setTextColor(muted); doc.text("OFFICIAL IDENTITY", detailsX, 25.2);
  doc.setFillColor("#EEF3F7"); doc.roundedRect(detailsX, 27, 31, 8.2, 1.4, 1.4, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(3.4); doc.setTextColor(muted); doc.text(idLabel, detailsX + 2.2, 30);
  doc.setFontSize(6.1); doc.setTextColor(navy); doc.text(String(officialId || "PENDING"), detailsX + 2.2, 33.3);
  doc.setFontSize(3.6); doc.setTextColor(muted); doc.text("ROLE", detailsX, 39.2);
  doc.setFont("helvetica", "normal"); doc.setTextColor(ink); fitText(doc, roleLabel, 30, 4.7, 3.4); doc.text(roleLabel, detailsX, 42.1);
  doc.setFont("helvetica", "bold"); doc.setFontSize(3.6); doc.setTextColor(muted); doc.text("ISSUED", detailsX, 46.1);
  doc.setFont("helvetica", "normal"); doc.setFontSize(4.1); doc.setTextColor(ink); doc.text(String(date || "—"), detailsX, 48.7);

  const qrBoxX = 64; const qrBoxY = 17.2;
  doc.setFillColor("#FFFFFF"); doc.setDrawColor("#D8DEE5"); doc.setLineWidth(0.35); doc.roundedRect(qrBoxX, qrBoxY, 17, 23.2, 1.5, 1.5, "FD");
  if (verificationUrl) {
    try { const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`); doc.addImage(qr, "PNG", qrBoxX + 1.3, qrBoxY + 1.2, 14.4, 14.4); }
    catch { doc.setFont("helvetica", "bold"); doc.setFontSize(3.6); doc.setTextColor(muted); doc.text("VERIFY ONLINE", qrBoxX + 8.5, qrBoxY + 9, { align: "center" }); }
    doc.setFont("helvetica", "bold"); doc.setFontSize(3.1); doc.setTextColor(blue); doc.text("SCAN TO VERIFY", qrBoxX + 8.5, qrBoxY + 20.3, { align: "center" });
  } else {
    doc.setFont("helvetica", "bold"); doc.setFontSize(3.5); doc.setTextColor(muted); doc.text("VERIFICATION", qrBoxX + 8.5, qrBoxY + 10, { align: "center" }); doc.text("AVAILABLE AFTER ISSUE", qrBoxX + 8.5, qrBoxY + 14, { align: "center" });
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(3.1); doc.setTextColor(muted); doc.text("Valid after official approval", W / 2, 51.4, { align: "center" });

  // BACK — official instructions and signature
  doc.addPage([86, 54], "landscape");
  doc.setFillColor(cream); doc.rect(0, 0, W, H, "F"); doc.setFillColor(navy); doc.rect(0, 0, W, 12.5, "F"); doc.setFillColor(gold); doc.rect(0, 12.5, W, 1.2, "F");
  doc.setDrawColor(gold); doc.setLineWidth(0.55); doc.roundedRect(2, 2, W - 4, H - 4, 2, 2);
  doc.setFont("helvetica", "bold"); doc.setTextColor("#FFFFFF"); doc.setFontSize(6.1); doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", W / 2, 6.5, { align: "center" });
  doc.setFontSize(3.6); doc.setTextColor("#DDE7F0"); doc.text("OFFICIAL ID CARD • REVERSE", W / 2, 10, { align: "center" });
  doc.setFillColor("#EEF3F7"); doc.roundedRect(6, 17, 74, 8.8, 1.8, 1.8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(4.2); doc.setTextColor(navy); doc.text("CARD STATUS", 9, 20.7);
  doc.setFont("helvetica", "normal"); doc.setFontSize(3.8); doc.setTextColor(ink); doc.text("Issued only after official approval by Swastik Srijan Foundation Samiti.", 9, 23.2);
  const notes = ["This card is the property of Swastik Srijan Foundation Samiti.", "It may be withdrawn when the volunteer or membership authorization ends.", "If found, please return this card to the Foundation. Do not alter or misuse it."];
  doc.setFont("helvetica", "normal"); doc.setFontSize(3.8); doc.setTextColor(ink); notes.forEach((note, index) => doc.text(`• ${note}`, 8, 30 + index * 4.4));
  if (certId) { doc.setFont("helvetica", "bold"); doc.setFontSize(3.6); doc.setTextColor(muted); doc.text("CERTIFICATE ID", 8, 44.2); doc.setFont("helvetica", "normal"); doc.setTextColor(navy); doc.setFontSize(4.1); doc.text(String(certId), 8, 47.2); }
  try { const signature = await loadImage(`${SIGNATURE_URL}?v=2`); doc.addImage(signature, "PNG", 62, 36.2, 16, 7.2); } catch { /* no fake signature */ }
  doc.setDrawColor(navy); doc.setLineWidth(0.35); doc.line(57, 45, 80, 45);
  doc.setFont("helvetica", "bold"); doc.setFontSize(3.8); doc.setTextColor(navy); doc.text("Authorized Signatory", 68.5, 48.2, { align: "center" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(3.1); doc.setTextColor(muted); doc.text("Swastik Srijan Foundation Samiti", 68.5, 50.2, { align: "center" });
  doc.save(`SSF_${isMember ? "Member" : "Volunteer"}_ID_${safeFileName(name)}.pdf`);
};

export const generateCertificate = async (name, role, date, certId = null, memberId = null, certificateType = "Participation") => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const cx = W / 2;
  const navy = "#002344";
  const blue = "#0B3A63";
  const gold = "#C5A059";
  const cream = "#FFFDF8";
  const ink = "#30343B";
  const muted = "#66727E";

  const type = String(certificateType || "Participation").trim();
  const normalizedType = type.toLowerCase();
  const normalizedRole = String(role || "").trim();
  const isMember = normalizedRole.toLowerCase() === "member" || normalizedRole.toLowerCase().includes("membership");

  let heading = "CERTIFICATE OF APPRECIATION";
  if (isMember) heading = "CERTIFICATE OF MEMBERSHIP";
  else if (normalizedType.includes("participation")) heading = "CERTIFICATE OF PARTICIPATION";
  else if (normalizedType.includes("experience")) heading = "CERTIFICATE OF EXPERIENCE";
  else if (normalizedType.includes("completion")) heading = "CERTIFICATE OF COMPLETION";
  else if (normalizedType.includes("service")) heading = "CERTIFICATE OF SERVICE";

  const roleLabel = getRoleLabel(normalizedRole || (isMember ? "Member" : "Volunteer"), isMember);
  const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;

  // Premium certificate background and double frame.
  doc.setFillColor(cream);
  doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(navy);
  doc.setLineWidth(1.8);
  doc.rect(7, 7, W - 14, H - 14);
  doc.setDrawColor(gold);
  doc.setLineWidth(0.7);
  doc.rect(11, 11, W - 22, H - 22);

  // Header branding.
  try {
    const logo = await loadImage(officialLogo);
    const logoW = 25;
    const logoH = Math.min((logo.height / logo.width) * logoW, 22);
    doc.addImage(logo, "PNG", cx - logoW / 2, 15, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(navy);
    doc.setFontSize(12);
    doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", cx, 27, { align: "center" });
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(navy);
  doc.setFontSize(8.2);
  doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", cx, 42, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setTextColor(muted);
  doc.setFontSize(5.8);
  doc.text("Registered Non-Profit Organisation • Pan India", cx, 46.5, { align: "center" });

  // Certificate title.
  doc.setFont("times", "bold");
  doc.setTextColor(navy);
  doc.setFontSize(isMember ? 25 : 28);
  doc.text(heading, cx, 62, { align: "center" });
  doc.setDrawColor(gold);
  doc.setLineWidth(0.8);
  doc.line(cx - 48, 66, cx + 48, 66);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("#555555");
  doc.setFontSize(10.5);
  doc.text("This certificate is proudly presented to", cx, 78, { align: "center" });

  // Recipient name is always taken from the selected/entered recipient, never the record title.
  const recipient = String(name || "Recipient").trim() || "Recipient";
  doc.setFont("times", "bolditalic");
  doc.setTextColor(navy);
  fitText(doc, recipient, 215, 31, 17);
  doc.text(recipient, cx, 94, { align: "center" });
  doc.setDrawColor(gold);
  doc.setLineWidth(0.6);
  doc.line(cx - 60, 99, cx + 60, 99);

  let body = `in recognition of valuable contribution as a ${roleLabel} to the activities of Swastik Srijan Foundation Samiti.`;
  if (isMember) body = "in recognition of approved membership and commitment to the mission and values of Swastik Srijan Foundation Samiti.";
  else if (normalizedType.includes("participation")) body = `in recognition of participation as a ${roleLabel} in the activities of Swastik Srijan Foundation Samiti.`;
  else if (normalizedType.includes("completion")) body = `in recognition of successful completion of the assigned activity as a ${roleLabel} with Swastik Srijan Foundation Samiti.`;
  else if (normalizedType.includes("experience")) body = `in recognition of valuable experience and contribution as a ${roleLabel} with Swastik Srijan Foundation Samiti.`;
  else if (normalizedType.includes("service")) body = `in recognition of dedicated service as a ${roleLabel} and valuable contribution to the mission of Swastik Srijan Foundation Samiti.`;
  else if (normalizedRole.toLowerCase().includes("donor")) body = "in sincere gratitude for generous support towards the activities and mission of Swastik Srijan Foundation Samiti.";

  doc.setFont("times", "normal");
  doc.setTextColor(ink);
  doc.setFontSize(11.5);
  const bodyLines = doc.splitTextToSize(body, 205);
  doc.text(bodyLines, cx, 112, { align: "center", lineHeightFactor: 1.35 });

  // Footer information is kept inside the A4 printable area.
  doc.setDrawColor("#D8D2C5");
  doc.setLineWidth(0.35);
  doc.line(25, 137, W - 25, 137);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(navy);
  doc.setFontSize(7.1);
  if (officialId) doc.text(isMember ? "MEMBER ID" : "VOLUNTEER ID", 28, 147);
  if (certId) doc.text("OFFICIAL CERTIFICATE ID", 28, 158);
  doc.text("DATE OF ISSUE", 28, 169);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(ink);
  doc.setFontSize(7.4);
  if (officialId) doc.text(String(officialId), 28, 152);
  if (certId) doc.text(String(certId), 28, 163);
  doc.text(String(date || "—"), 28, 174);

  // Signature area.
  const sigX = 135;
  try {
    const signature = await loadImage(`${SIGNATURE_URL}?v=2`);
    const sigW = 38;
    const sigH = Math.min((signature.height / signature.width) * sigW, 15);
    doc.addImage(signature, "PNG", sigX - sigW / 2, 149, sigW, sigH);
  } catch {}
  doc.setDrawColor("#333333");
  doc.setLineWidth(0.45);
  doc.line(sigX - 28, 168, sigX + 28, 168);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(navy);
  doc.text("Authorized Signatory", sigX, 174, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  doc.setTextColor(muted);
  doc.text("Swastik Srijan Foundation Samiti", sigX, 179, { align: "center" });

  // QR is generated only when an actual certificate ID exists.
  if (verificationUrl) {
    const qrX = 241;
    const qrY = 143;
    try {
      const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
      doc.addImage(qr, "PNG", qrX, qrY, 28, 28);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.2);
      doc.setTextColor(muted);
      doc.text("ONLINE VERIFICATION", qrX + 14, 157, { align: "center" });
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.6);
    doc.setTextColor(blue);
    doc.text("SCAN TO VERIFY", qrX + 14, 175, { align: "center" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.7);
  doc.setTextColor(muted);
  doc.text("This certificate is issued by Swastik Srijan Foundation Samiti after official approval.", cx, 191, { align: "center" });
  if (verificationUrl) doc.text(`Verification ID: ${certId}`, cx, 196, { align: "center" });

  doc.save(`SSF_Certificate_${safeFileName(recipient)}.pdf`);
};

export const generateCertificateAndIdCard = async (name, role, date, certId = null, memberId = null, photoUrl = null, certificateType = "Participation") => {
  const normalizedRole = String(role || "volunteer").toLowerCase(); const isMember = normalizedRole === "member" || normalizedRole.includes("membership"); const officialId = memberId || (isMember ? null : deriveVolunteerId(certId));
  await generateCertificate(name, role, date, certId, memberId, certificateType); await generateIdentityCard({ name, role, date, officialId, certId, photoUrl });
};
