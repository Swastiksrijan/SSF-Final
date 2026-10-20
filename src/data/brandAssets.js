// SSF brand asset library — one place for every official logo, seal, signature,
// certificate and pledge badge, so any page can use them without hunting through
// the public folder.
//
// Everything lives under `public/brand/` (served at `/brand/...`) except the two
// pieces the letterhead renderer imports as modules (`src/assets/brand/`), because
// Vite must inline those into the PDF build.
//
//   public/brand/logo/          SSF logos — round mark, wordmark, horizontal, banner
//   public/brand/seals/         Sanstha seal / mohar (registration, president, sanstha)
//   public/brand/signatures/    Scanned signatory signatures (transparent PNG)
//   public/brand/certificates/  Awards / appreciation certificates to named people
//   public/brand/badges/        Government pledge & participation certificates
//   public/brand/promo/         Infographics, posters and campaign artwork
//
// Usage:  import { BRAND, CERTS, BADGES, CERTIFICATE_WALL, PLEDGE_WALL } from '../data/brandAssets';

const B = '/brand';

export const BRAND = {
  logoRound: `${B}/logo/ssf-logo-round.png`,
  logoWordmark: `${B}/logo/ssf-logo-wordmark.png`,
  logoHorizontal: `${B}/logo/ssf-logo-horizontal.jpg`,
  logoBanner: `${B}/logo/ssf-banner-wordmark.png`,
  favicon: `${B}/logo/ssf-favicon-512.png`,

  // NOTE: no seal* / signature* keys here on purpose. The organisation seal and
  // the scanned signature authenticate paper the Foundation issues; republishing
  // them (they would sit at a plain, guessable /brand/... URL) is a forgery kit.
  // The letterhead engine imports its own bundled copies from src/assets/brand/.

  donationCertificate: `${B}/promo/donation-certificate.png`,
  legalWorkAreas: `${B}/promo/legal-work-areas.png`,
  focusWheel: `${B}/promo/focus-areas-wheel.png`,
  focusWheelAlt: `${B}/promo/focus-areas-wheel-alt.png`,
  governingBody: `${B}/promo/governing-body.png`,
  humanityAndTruth: `${B}/promo/humanity-and-truth.jpg`,
  healthCampPoster: `${B}/promo/health-camp-poster.png`,
};

/** Awards / appreciation certificates issued to named individuals. */
export const CERTS = [
  { src: `${B}/certificates/certificate-naitik-pandey-youth-humanitarian.jpg`, name: 'Naitik Pandey', award: 'Exceptional Youth Humanitarian', en: 'Youth humanitarian recognition', hi: 'युवा मानवतावादी सम्मान' },
  { src: `${B}/certificates/certificate-siddhesh-ghag-web-developer.jpg`, name: 'Siddhesh Ghag', award: 'Web Developer — voluntary service', en: 'Voluntary service recognition', hi: 'स्वयंसेवी सेवा सम्मान' },
  { src: `${B}/certificates/certificate-ayushi-tyagi-education-volunteer.jpg`, name: 'Ayushi Tyagi', award: 'Education & Learning Volunteer', en: 'Volunteer recognition', hi: 'स्वयंसेवक सम्मान' },
  { src: `${B}/certificates/certificate-ruchi-gupta-volunteer-2024.jpg`, name: 'Ruchi Gupta', award: 'Volunteer 2024', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-vaishnavi-singh-volunteer-2024.jpg`, name: 'Vaishnavi Singh', award: 'Volunteer 2024', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-seeta-patel-voluntary-service.jpg`, name: 'Seeta Patel', award: 'Voluntary service', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-amrita-sinha-voluntary-service.jpg`, name: 'Amrita Sinha', award: 'Voluntary service', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-amit-rai-voluntary-service.jpg`, name: 'Amit Rai', award: 'Voluntary service', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-pankaj-tiwari-voluntary-service.jpg`, name: 'Pankaj Tiwari', award: 'Voluntary service', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-sanjay-pandey-voluntary-service.jpg`, name: 'Sanjay Pandey', award: 'Voluntary service', en: 'Certificate of appreciation', hi: 'प्रशंसा प्रमाण-पत्र' },
  { src: `${B}/certificates/certificate-special-recognition-award.jpg`, name: 'Special Recognition Award', award: 'SSF Special Recognition', en: 'Special recognition', hi: 'विशेष सम्मान' },
  { src: `${B}/certificates/certificate-special-recognition-2026.jpg`, name: 'Special Recognition 2026', award: 'SSF Special Recognition', en: 'Special recognition', hi: 'विशेष सम्मान' },
];

/** Government / institutional pledge and participation certificates. */
export const BADGES = [
  { src: `${B}/badges/integrity-anti-corruption-pledge.jpg`, en: 'Integrity & Anti-Corruption Pledge', hi: 'सत्यनिष्ठा एवं भ्रष्टाचार-मुक्त pledge' },
  { src: `${B}/badges/lifestyle-for-environment-pledge.jpg`, en: 'Lifestyle for Environment (LiFE)', hi: 'पर्यावरण अनुकूल जीवनशैली' },
  { src: `${B}/badges/investor-protection-pledge.jpg`, en: 'Investor Protection Pledge', hi: 'निवेशक संरक्षण संकल्प' },
  { src: `${B}/badges/catch-the-rain-pledge.jpg`, en: 'Catch the Rain', hi: 'कैच द रेन' },
  { src: `${B}/badges/anti-dowry-pledge-ncw.jpg`, en: 'Anti-Dowry Pledge (NCW)', hi: 'दहेज-मुक्ति संकल्प' },
  { src: `${B}/badges/mujh-mein-hain-gandhi-pledge.jpg`, en: 'Mujh Mein Hai Gandhi', hi: 'मुझ में हैं गांधी' },
  { src: `${B}/badges/anti-littering-pledge.jpg`, en: 'Anti-Littering Pledge', hi: 'कचरा-मुक्ति संकल्प' },
  { src: `${B}/badges/agriculture-farmers-welfare-pledge.jpg`, en: 'Agriculture & Farmers Welfare', hi: 'कृषि एवं किसान कल्याण' },
  { src: `${B}/badges/youth-affairs-and-sports-pledge.jpg`, en: 'Youth Affairs & Sports', hi: 'युवा कार्यक्रम एवं खेल' },
  { src: `${B}/badges/environment-positive-change-pledge.jpg`, en: 'Environment — Positive Change', hi: 'पर्यावरण — सकारात्मक बदलाव' },
  { src: `${B}/badges/organ-donation-pledge.jpg`, en: 'Organ Donation Pledge', hi: 'अंगदान संकल्प' },
  { src: `${B}/badges/fit-india-pledge.jpg`, en: 'Fit India Pledge', hi: 'फिट इंडिया संकल्प' },
  { src: `${B}/badges/reading-pledge.jpg`, en: 'Reading Pledge', hi: 'वाचन संकल्प' },
  { src: `${B}/badges/responsible-citizen-disaster-preparedness.jpg`, en: 'Responsible Citizen — Disaster Preparedness', hi: 'जिम्मेदार नागरिक — आपदा तैयारी' },
  { src: `${B}/badges/good-nutrition-pledge.jpg`, en: 'Good Nutrition Pledge', hi: 'सुपोषण संकल्प' },
  { src: `${B}/badges/rabies-elimination-pledge.jpg`, en: 'Rabies Elimination Pledge', hi: 'रेबीज़ उन्मूलन संकल्प' },
  { src: `${B}/badges/khadi-mahotsav-participation.jpg`, en: 'Khadi Mahotsav Participation', hi: 'खादी महोत्सव सहभागिता' },
  { src: `${B}/badges/national-pledge-20.jpg`, en: 'National Pledge', hi: 'राष्ट्रीय संकल्प' },
  { src: `${B}/badges/energy-conservation-appreciation.jpg`, en: 'Energy Conservation', hi: 'ऊर्जा संरक्षण' },
  { src: `${B}/badges/water-conservation-pledge.jpg`, en: 'Water Conservation Pledge', hi: 'जल संरक्षण संकल्प' },
  { src: `${B}/badges/incredible-india-pledge.jpg`, en: 'Incredible India Pledge', hi: 'अतुल्य भारत संकल्प' },
  { src: `${B}/badges/road-safety-pledge-2024.jpg`, en: 'Road Safety Pledge 2024', hi: 'सड़क सुरक्षा संकल्प 2024' },
  { src: `${B}/badges/law-and-justice-pledge.jpg`, en: 'Law & Justice Pledge', hi: 'विधि एवं न्याय संकल्प' },
  { src: `${B}/badges/womens-rights-pledge.jpg`, en: "Women's Rights Pledge", hi: 'महिला अधिकार संकल्प' },
  { src: `${B}/badges/textiles-ministry-pledge.jpg`, en: 'Ministry of Textiles Pledge', hi: 'वस्त्र मंत्रालय संकल्प' },
  { src: `${B}/badges/world-food-india-pledge.jpg`, en: 'World Food India Pledge', hi: 'विश्व खाद्य भारत संकल्प' },
  { src: `${B}/badges/quality-india-pledge.jpg`, en: 'Quality India Pledge', hi: 'गुणवत्ता भारत संकल्प' },
  { src: `${B}/badges/rashtrapati-bhavan-e-pledge.jpg`, en: 'Rashtrapati Bhavan e-Pledge', hi: 'राष्ट्रपति भवन ई-संकल्प' },
  { src: `${B}/badges/sports-participation-certificate.jpg`, en: 'Sports Participation', hi: 'खेल सहभागिता' },
  { src: `${B}/badges/family-welfare-pledge.jpg`, en: 'Family Welfare Pledge', hi: 'परिवार कल्याण संकल्प' },
  { src: `${B}/badges/senior-citizens-pledge.jpg`, en: 'Senior Citizens Pledge', hi: 'वरिष्ठ नागरिक संकल्प' },
  { src: `${B}/badges/legal-adoption-pledge-cara.jpg`, en: 'Legal Adoption Pledge (CARA)', hi: 'वैध दत्तक ग्रहण संकल्प' },
  { src: `${B}/badges/bharat-vikas-pledge-gujarat.jpg`, en: 'Bharat Vikas Pledge', hi: 'भारत विकास संकल्प' },
  { src: `${B}/badges/blood-donation-pledge.jpg`, en: 'Blood Donation Pledge', hi: 'रक्तदान संकल्प' },
  { src: `${B}/badges/fuel-conservation-pledge-2023.jpg`, en: 'Fuel Conservation Pledge 2023', hi: 'ईंधन संरक्षण संकल्प 2023' },
  { src: `${B}/badges/natural-gas-conservation-pledge.jpg`, en: 'Natural Gas Conservation Pledge', hi: 'प्राकृतिक गैस संरक्षण संकल्प' },
  { src: `${B}/badges/cyber-security-pledge.jpg`, en: 'Cyber Security Pledge', hi: 'साइबर सुरक्षा संकल्प' },
  { src: `${B}/badges/puneet-sankalp-pledge-unep.jpg`, en: 'Puneet Sankalp (UNEP)', hi: 'पुनीत संकल्प' },
  { src: `${B}/badges/save-the-marine-life-pledge.jpg`, en: 'Save the Marine Life Pledge', hi: 'समुद्री जीवन संरक्षण संकल्प' },
  { src: `${B}/badges/uttam-poshan-uttam-jeevan-pledge.jpg`, en: 'Uttam Poshan Uttam Jeevan', hi: 'उत्तम पोषण उत्तम जीवन' },
  { src: `${B}/badges/environment-ministry-pledge.jpg`, en: 'Environment Ministry Pledge', hi: 'पर्यावरण मंत्रालय संकल्प' },
  { src: `${B}/badges/shoonya-zero-pollution-mobility-pledge.jpg`, en: 'Shoonya — Zero Pollution Mobility', hi: 'शून्य प्रदूषण गतिशीलता' },
  { src: `${B}/badges/womens-day-cyber-safety-pledge.jpg`, en: "Women's Day Cyber Safety", hi: 'महिला दिवस साइबर सुरक्षा' },
  { src: `${B}/badges/swachh-bharat-grameen-pledge.jpg`, en: 'Swachh Bharat Grameen Pledge', hi: 'स्वच्छ भारत ग्रामीण संकल्प' },
  { src: `${B}/badges/tb-mukt-bharat-pledge.jpg`, en: 'TB Mukt Bharat Pledge', hi: 'टीबी मुक्त भारत संकल्प' },
  { src: `${B}/badges/data-privacy-pledge.jpg`, en: 'Data Privacy Pledge', hi: 'डेटा गोपनीयता संकल्प' },
  { src: `${B}/badges/agriculture-farmers-welfare-pledge-2.jpg`, en: 'Agriculture & Farmers Welfare (2)', hi: 'कृषि एवं किसान कल्याण (2)' },
];

/**
 * A curated, home-page-sized slice of the certificate wall — the strongest
 * recognitions, shown as one "chalak" (a horizontally scrolling band).
 */
export const CERTIFICATE_WALL = [
  CERTS[0], CERTS[1], CERTS[2], CERTS[10],
  CERTS[3], CERTS[4], CERTS[5], CERTS[6],
];

/** A curated slice of pledge badges for the home page band. */
export const PLEDGE_WALL = [
  BADGES[0], BADGES[1], BADGES[2], BADGES[4],
  BADGES[9], BADGES[10], BADGES[11], BADGES[21],
  BADGES[31], BADGES[36], BADGES[40], BADGES[44],
];

/** The formal credentials shown as trust chips. */
export const CREDENTIALS = [
  { en: 'Registered Society', hi: 'पंजीकृत संस्था', note: 'Regn. No. 05/22/03/11448/13', since: '2013' },
  { en: '12AB Registered', hi: '12AB पंजीकृत', note: 'Income Tax exemption' },
  { en: '80G Provisional', hi: '80G अस्थायी', note: 'Final approval applied' },
  { en: 'CSR-1 Registered', hi: 'CSR-1 पंजीकृत', note: 'CSR eligibility' },
  { en: 'NGO Darpan', hi: 'एनजीओ दर्पण', note: 'NITI Aayog' },
  { en: 'Govt. Pledges', hi: 'शासकीय संकल्प', note: `${BADGES.length}+ national campaigns` },
];

export const CERT_COUNT = CERTS.length;
export const BADGE_COUNT = BADGES.length;
