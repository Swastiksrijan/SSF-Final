import jsPDF from 'jspdf';

export const generateCertificate = async (name, role, date, certId = null) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    // Colors
    const darkBlue = '#003366';
    const gold = '#C5A059'; // More metallic gold
    const textDark = '#1a1a1a';
    const borderBg = '#FDFBF7'; // Cream background for premium feel

    // Dimensions
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const centerX = width / 2;

    // --- 1. Background Fill ---
    doc.setFillColor(borderBg);
    doc.rect(0, 0, width, height, 'F');

    // --- 2. Ornate Border Pattern ---
    // Outer heavy border
    doc.setDrawColor(darkBlue);
    doc.setLineWidth(3);
    doc.rect(5, 5, width - 10, height - 10);

    // Inner thin border
    doc.setDrawColor(darkBlue);
    doc.setLineWidth(0.5);
    doc.rect(8, 8, width - 16, height - 16);

    // Corner Accents (Triangles)
    const cornerSize = 25;
    doc.setFillColor(darkBlue);

    // Top-Left
    doc.triangle(5, 5, 5 + cornerSize, 5, 5, 5 + cornerSize, 'F');
    // Top-Right
    doc.triangle(width - 5, 5, width - 5 - cornerSize, 5, width - 5, 5 + cornerSize, 'F');
    // Bottom-Left
    doc.triangle(5, height - 5, 5 + cornerSize, height - 5, 5, height - 5 - cornerSize, 'F');
    // Bottom-Right
    doc.triangle(width - 5, height - 5, width - 5 - cornerSize, height - 5, width - 5, height - 5 - cornerSize, 'F');

    // Gold inner frame
    doc.setDrawColor(gold);
    doc.setLineWidth(1.5);
    doc.rect(12, 12, width - 24, height - 24);

    // --- 3. Header Section ---
    try {
        const logoUrl = '/images/logo.png'; // Make sure this path is correct
        const logoImg = await loadImage(logoUrl);
        const logoWidth = 28;
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        doc.addImage(logoImg, 'PNG', centerX - (logoWidth / 2), 20, logoWidth, logoHeight);
    } catch (e) {
        // Fallback text if image fails
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.setTextColor(darkBlue);
        doc.text("SWASTIK SRIJAN FOUNDATION", centerX, 35, { align: 'center' });
    }

    // "Certificate of Appreciation"
    doc.setFont("times", "bold"); // Times looks more formal
    doc.setFontSize(42);
    doc.setTextColor(darkBlue);
    doc.text("CERTIFICATE", centerX, 65, { align: 'center' });

    doc.setFont("times", "italic");
    doc.setFontSize(24);
    doc.setTextColor(gold);
    doc.text("OF APPRECIATION", centerX, 75, { align: 'center' });

    // --- 4. Recipient Section ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(textDark);
    doc.text("PROUDLY PRESENTED TO", centerX, 95, { align: 'center' });

    // Name 
    doc.setFont("times", "bolditalic");
    doc.setFontSize(48);
    doc.setTextColor(darkBlue);
    doc.text(name, centerX, 115, { align: 'center' });

    // Decorative line under name
    doc.setDrawColor(gold);
    doc.setLineWidth(1);
    doc.line(centerX - 50, 120, centerX + 50, 120);

    // --- 5. Body Text ---
    let roleText = "";
    const lowerRole = role.toLowerCase();

    if (lowerRole.includes('volunteer')) {
        roleText = `In recognition of your selfless service and dedication as a ${role.toUpperCase()}. Your contribution has made a significant impact on our mission.`;
    } else if (lowerRole === 'donor') {
        roleText = "In sincere gratitude for your generous DONATION. Your support empowers us to bring positive change where it is needed most.";
    } else if (lowerRole === 'member') {
        roleText = "Acknowledging your commitment as an esteemed MEMBER of our community. Together, we are building a better future.";
    } else {
        roleText = `In recognition of your valuable contribution as a ${role.toUpperCase()}.`;
    }

    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor('#555555');
    // Split text to fit width
    const splitText = doc.splitTextToSize(roleText, 180);
    doc.text(splitText, centerX, 135, { align: 'center' });

    // --- 6. Signatures ---
    const sigY = height - 35; // Moved down slightly

    // Left Signature (Official Signature Image)
    try {
        const sigUrl = '/images/signature.png';
        const sigImg = await loadImage(sigUrl);
        const sigWidth = 35; // Made smaller
        const sigHeight = (sigImg.height / sigImg.width) * sigWidth;
        // Positioned clearly in the bottom left corner above the line
        doc.addImage(sigImg, 'PNG', 30, sigY - sigHeight - 5, sigWidth, sigHeight);

        // Add signature line and name below the image
        doc.setDrawColor(textDark);
        doc.setLineWidth(0.5);
        doc.line(25, sigY, 70, sigY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(darkBlue);
        doc.text("Amit Kumar Pandey", 47.5, sigY + 5, { align: 'center' });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor('#777777');
        doc.text("Secretary, SSF", 47.5, sigY + 9, { align: 'center' });
    } catch (e) {
        // Fallback if signature image fails
        doc.setDrawColor(textDark);
        doc.setLineWidth(0.5);
        doc.line(25, sigY, 70, sigY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(darkBlue);
        doc.text("Amit Kumar Pandey", 47.5, sigY + 5, { align: 'center' });
    }

    // Badge/Seal Simulation in Center (Gold Circle)
    doc.setFillColor(gold);
    doc.circle(centerX, sigY - 5, 12, 'F');
    doc.setDrawColor('#fff');
    doc.circle(centerX, sigY - 5, 10, 'S');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor('#ffffff');
    doc.text("OFFICIAL", centerX, sigY - 6, { align: 'center' });
    doc.text("SEAL", centerX, sigY - 2, { align: 'center' });

    // Right Signature (Date)
    doc.setDrawColor(textDark);
    doc.line(width - 90, sigY, width - 40, sigY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(darkBlue);
    doc.text(date, width - 65, sigY + 6, { align: 'center' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor('#777777');
    doc.text("Date of Issue", width - 65, sigY + 11, { align: 'center' });

    // --- 7. Legal Disclaimer Footer ---
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor('#999999');
    const disclaimerEN = "This certificate is scanned from an original physically signed document. Original copy is available with the organization.";
    doc.text(disclaimerEN, centerX, height - 12, { align: 'center' });

    // Footer ID
    const displayID = certId ? `OFFICIAL ID: ${certId}` : `ID: SSF-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor('#aaaaaa');
    doc.text(displayID, 15, height - 7);

    if (certId) {
        doc.setFontSize(7);
        doc.text(`Verify at: swastiksrijan.org/verify/${certId}`, centerX, height - 8, { align: 'center' });
    }

    doc.text("www.swastiksrijan.in", width - 15, height - 7, { align: 'right' });

    // Save
    const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`SSF_Certificate_${safeName}.pdf`);
};

// Helper
const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Crucial for some hosting
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};
