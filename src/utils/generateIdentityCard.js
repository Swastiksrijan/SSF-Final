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

const fitText = (doc, text, maxWidth, maxSize, minSize = 5.5) => {
    let size = maxSize;
    doc.setFontSize(size);
    while (size > minSize && doc.getTextWidth(String(text)) > maxWidth) {
        size -= 0.25;
        doc.setFontSize(size);
    }
    return size;
};

const getRoleLabel = (role, isMember) => {
    if (isMember) return "Member";
    const value = String(role || "Volunteer").trim();
    return value ? value.replace(/\b\w/g, (char) => char.toUpperCase()) : "Volunteer";
};

const addPhoto = async (doc, photoUrl, x, y, w, h, gold) => {
    doc.setFillColor("#E8EDF2");
    doc.roundedRect(x, y, w, h, 1.8, 1.8, "F");
    if (!photoUrl) return false;
    try {
        const photo = await loadImage(photoUrl);
        const sourceRatio = photo.width / photo.height;
        const boxRatio = w / h;
        let drawW = w;
        let drawH = h;
        let drawX = x;
        let drawY = y;
        if (sourceRatio > boxRatio) {
            drawW = h * sourceRatio;
            drawX = x - (drawW - w) / 2;
        } else {
            drawH = w / sourceRatio;
            drawY = y - (drawH - h) / 2;
        }
        doc.addImage(photo, "JPEG", drawX, drawY, drawW, drawH);
        doc.setDrawColor(gold);
        doc.setLineWidth(0.7);
        doc.roundedRect(x, y, w, h, 1.8, 1.8);
        return true;
    } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5);
        doc.setTextColor("#7B8490");
        doc.text("PHOTO", x + w / 2, y + h / 2, { align: "center" });
        return false;
    }
};

export const generateIdentityCard = async ({ name, role, date, officialId, certId, photoUrl }) => {
    const normalizedRole = String(role || "volunteer").toLowerCase();
    const isMember = normalizedRole === "member" || normalizedRole.includes("membership");
    const typeLabel = isMember ? "MEMBERSHIP" : "VOLUNTEER";
    const idLabel = isMember ? "MEMBER ID" : "VOLUNTEER ID";
    const roleLabel = getRoleLabel(role, isMember);
    const verificationUrl = certId ? `https://swastiksrijan.in/verify/${encodeURIComponent(certId)}` : null;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [86, 54] });
    const W = 86;
    const H = 54;
    const navy = "#002344";
    const blue = "#0B3A63";
    const gold = "#C5A059";
    const cream = "#FBFAF6";
    const ink = "#26323D";
    const muted = "#697582";

    // FRONT — premium photo-ID layout
    doc.setFillColor(cream);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(navy);
    doc.roundedRect(0, 0, W, 15, 0, 0, "F");
    doc.setFillColor(gold);
    doc.rect(0, 13.5, W, 1.5, "F");
    doc.setDrawColor(gold);
    doc.setLineWidth(0.55);
    doc.roundedRect(2, 2, W - 4, H - 4, 2, 2);

    try {
        const logo = await loadImage(officialLogo);
        const logoW = 9;
        const logoH = Math.min((logo.height / logo.width) * logoW, 9);
        doc.addImage(logo, "PNG", 5, 2.7, logoW, logoH);
    } catch { /* keep text branding */ }

    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(6.2);
    doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", 16, 6.6);
    doc.setFontSize(3.8);
    doc.setTextColor("#DDE7F0");
    doc.text(isMember ? "OFFICIAL MEMBERSHIP IDENTITY CARD" : "OFFICIAL VOLUNTEER IDENTITY CARD", 16, 10.7);
    doc.setFontSize(3.1);
    doc.setTextColor("#FFFFFF");
    doc.text(typeLabel, W - 5, 6.6, { align: "right" });

    const photoX = 5;
    const photoY = 18;
    const photoW = 22;
    const photoH = 27;
    await addPhoto(doc, photoUrl, photoX, photoY, photoW, photoH, gold);

    // Photo caption strip
    doc.setFillColor(navy);
    doc.roundedRect(photoX, 42.5, photoW, 2.5, 0.8, 0.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.2);
    doc.setTextColor("#FFFFFF");
    doc.text(isMember ? "MEMBER" : "VOLUNTEER", photoX + photoW / 2, 44.25, { align: "center" });

    // Identity details
    const dx = 30;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(navy);
    fitText(doc, String(name || "Member"), 31, 9, 6);
    doc.text(String(name || "Member"), dx, 21.8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.4);
    doc.setTextColor(muted);
    doc.text("OFFICIAL IDENTITY", dx, 25.2);

    doc.setFillColor("#EEF3F7");
    doc.roundedRect(dx, 27, 31, 8.2, 1.4, 1.4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.4);
    doc.setTextColor(muted);
    doc.text(idLabel, dx + 2.2, 30);
    doc.setFontSize(6.1);
    doc.setTextColor(navy);
    doc.text(String(officialId || "PENDING"), dx + 2.2, 33.3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.6);
    doc.setTextColor(muted);
    doc.text("ROLE", dx, 39.2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(ink);
    fitText(doc, roleLabel, 30, 4.7, 3.4);
    doc.text(roleLabel, dx, 42.1);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.6);
    doc.setTextColor(muted);
    doc.text("ISSUED", dx, 46.1);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(ink);
    doc.setFontSize(4.1);
    doc.text(String(date || "—"), dx, 48.7);

    // QR verification panel
    const qrBoxX = 64;
    const qrBoxY = 17.2;
    const qrBox = 17;
    doc.setFillColor("#FFFFFF");
    doc.setDrawColor("#D8DEE5");
    doc.setLineWidth(0.35);
    doc.roundedRect(qrBoxX, qrBoxY, qrBox, 23.2, 1.5, 1.5, "FD");
    if (verificationUrl) {
        try {
            const qr = await loadImage(`${QR_CODE_API}${encodeURIComponent(verificationUrl)}`);
            doc.addImage(qr, "PNG", qrBoxX + 1.3, qrBoxY + 1.2, 14.4, 14.4);
        } catch {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(3.6);
            doc.setTextColor(muted);
            doc.text("VERIFY ONLINE", qrBoxX + 8.5, qrBoxY + 9, { align: "center" });
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(3.1);
        doc.setTextColor(blue);
        doc.text("SCAN TO VERIFY", qrBoxX + 8.5, qrBoxY + 20.3, { align: "center" });
    } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(3.5);
        doc.setTextColor(muted);
        doc.text("VERIFICATION", qrBoxX + 8.5, qrBoxY + 10, { align: "center" });
        doc.text("AVAILABLE AFTER ISSUE", qrBoxX + 8.5, qrBoxY + 14, { align: "center" });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.1);
    doc.setTextColor(muted);
    doc.text("Valid after official approval", W / 2, 51.4, { align: "center" });

    // BACK — official instructions and signature
    doc.addPage([86, 54], "landscape");
    doc.setFillColor(cream);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(navy);
    doc.rect(0, 0, W, 12.5, "F");
    doc.setFillColor(gold);
    doc.rect(0, 12.5, W, 1.2, "F");
    doc.setDrawColor(gold);
    doc.setLineWidth(0.55);
    doc.roundedRect(2, 2, W - 4, H - 4, 2, 2);

    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(6.1);
    doc.text("SWASTIK SRIJAN FOUNDATION SAMITI", W / 2, 6.5, { align: "center" });
    doc.setFontSize(3.6);
    doc.setTextColor("#DDE7F0");
    doc.text("OFFICIAL ID CARD • REVERSE", W / 2, 10, { align: "center" });

    doc.setFillColor("#EEF3F7");
    doc.roundedRect(6, 17, 74, 8.8, 1.8, 1.8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.2);
    doc.setTextColor(navy);
    doc.text("CARD STATUS", 9, 20.7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.8);
    doc.setTextColor(ink);
    doc.text("Issued only after official approval by Swastik Srijan Foundation Samiti.", 9, 23.2);

    const notes = [
        "This card is the property of Swastik Srijan Foundation Samiti.",
        "It may be withdrawn when the volunteer or membership authorization ends.",
        "If found, please return this card to the Foundation. Do not alter or misuse it."
    ];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.8);
    doc.setTextColor(ink);
    notes.forEach((note, index) => {
        doc.text(`• ${note}`, 8, 30 + index * 4.4);
    });

    if (certId) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(3.6);
        doc.setTextColor(muted);
        doc.text("CERTIFICATE ID", 8, 44.2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(navy);
        doc.setFontSize(4.1);
        doc.text(String(certId), 8, 47.2);
    }

    try {
        const signature = await loadImage(`${SIGNATURE_URL}?v=2`);
        doc.addImage(signature, "PNG", 62, 36.2, 16, 7.2);
    } catch { /* no fake signature */ }
    doc.setDrawColor(navy);
    doc.setLineWidth(0.35);
    doc.line(57, 45, 80, 45);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(3.8);
    doc.setTextColor(navy);
    doc.text("Authorized Signatory", 68.5, 48.2, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(3.1);
    doc.setTextColor(muted);
    doc.text("Swastik Srijan Foundation Samiti", 68.5, 50.2, { align: "center" });

    doc.save(`SSF_${isMember ? "Member" : "Volunteer"}_ID_${safeFileName(name)}.pdf`);
};
