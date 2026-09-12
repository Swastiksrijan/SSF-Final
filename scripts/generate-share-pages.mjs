import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html not found. Run vite build before generating share pages.');
}

const site = 'https://swastiksrijan.in';
const homeImage = '/images/hero-main.jpg';

const pages = {
  '/': ['Swastik Srijan Foundation | Empowering Lives Across India', 'Join Swastik Srijan Foundation, a registered NGO in India working for education, health, livelihoods, women empowerment and rural development since 2013.', '/images/hero-main.jpg'],
  '/About': ['About Swastik Srijan Foundation | Our Mission & Vision', 'Learn about Swastik Srijan Foundation Samiti and its work in education, health and community empowerment across India since 2013.', '/images/uploads/footer-gallery-1.jpg?v=20260913'],
  '/Mission': ['Mission & Vision | Swastik Srijan Foundation', 'Discover our mission to empower communities through education, health, livelihood development and sustainable social change.', '/images/uploads/mission_vision.jpeg'],
  '/Vision': ['Our Vision | Swastik Srijan Foundation', 'Our vision for a nation built on service, truth, dedication and sustainable community development.', '/images/uploads/vision-mission-goals.jpg'],
  '/Objectives': ['Objectives | Swastik Srijan Foundation', 'Explore the objectives and areas of work of Swastik Srijan Foundation across education, health, livelihoods, women empowerment, environment and social welfare.', '/images/uploads/objective-hero-v2.png'],
  '/Team': ['Our Team & Leadership | Swastik Srijan Foundation', 'Meet the leadership and team behind Swastik Srijan Foundation and our commitment to accountable social development.', '/images/uploads/MeetOurTeam.jpeg'],
  '/Journey': ['Our Journey Since 2013 | Swastik Srijan Foundation', 'Explore the journey, milestones and social initiatives of Swastik Srijan Foundation since its establishment in 2013.', '/images/real/journey-seeds.jpg'],
  '/Humanity&Truth': ['Humanity & Truth | Swastik Srijan Foundation', 'Read the values and public-interest philosophy that guide Swastik Srijan Foundation in service, integrity and community development.', '/images/real/mural_humanity_first.jpg'],
  '/Impact': ['Impact Stories & Results | Swastik Srijan Foundation', 'See the impact created through education, health initiatives, livelihoods, women empowerment and rural community development.', '/images/uploads/footer-gallery-3.jpg?v=20260913'],
  '/OurInitiatives': ['Our Initiatives & Impact | Swastik Srijan Foundation', 'Explore Swastik Srijan Foundation initiatives across education, health awareness, skills, women empowerment, environment, rural development and social awareness.', '/images/real/foundation_banner.jpg'],
  '/GetInvolved': ['Join Us | Get Involved With Swastik Srijan Foundation', 'Volunteer, become a member, donate, support our mission or partner with us for social impact.', '/images/uploads/get-involved-banner.jpg'],
  '/Volunteer': ['Volunteer With Us | Swastik Srijan Foundation', 'Become a volunteer and contribute your time and skills to create meaningful social change.', '/images/volunteers.png'],
  '/Internship': ['Internship Programs | Swastik Srijan Foundation', 'Gain hands-on experience while contributing to meaningful social impact work.', '/images/ssf-youth-career.png'],
  '/Members': ['Membership | Swastik Srijan Foundation', 'Become a member of Swastik Srijan Foundation and contribute to our governance, philosophy and future direction.', '/images/uploads/members-group.jpg'],
  '/Donate': ['Donate to Swastik Srijan Foundation | Support Our Mission', 'Support education, health, livelihoods and community development through Swastik Srijan Foundation.', '/images/uploads/donate-hero.jpg'],
  '/Donor': ['Become a Donor | Swastik Srijan Foundation', 'Support transparent giving and help strengthen education, health and community development initiatives.', '/images/real/direct-relief-women.jpg'],
  '/CSRPartnership': ['CSR Partnership | Corporate Social Responsibility', 'Partner with Swastik Srijan Foundation for meaningful CSR initiatives and sustainable community impact.', '/images/csr-hero.png'],
  '/PartnerWithUs': ['Partner With Us | Swastik Srijan Foundation', 'Explore partnership opportunities for institutions, NGOs, healthcare organizations, companies and community initiatives.', '/images/uploads/csr-unity.jpg'],
  '/Contact': ['Contact Us | Swastik Srijan Foundation', 'Get in touch with Swastik Srijan Foundation to explore collaborations, volunteering and community initiatives.', '/images/real/community-team-group.jpg'],
  '/Blog': ['Blog & Impact Stories | Swastik Srijan Foundation', 'Read real stories about education, health, community support, volunteering and social impact across India.', '/images/real/news_media_1.jpg'],
  '/Media': ['Media Gallery | Swastik Srijan Foundation', 'Photos and videos from our programs, events and community impact work.', '/images/gallery.png'],
  '/Campaigns': ['Active Campaigns | Swastik Srijan Foundation', 'Join current campaigns and initiatives making a difference in communities across India.', '/images/uploads/childhood-hero.webp'],
  '/UpcomingProjects': ['Upcoming Projects | Swastik Srijan Foundation', 'Discover planned initiatives across education, health, livelihoods and community development.', '/images/real/dreams-taking-flight.png'],
  '/LearningHub': ['SSF Learning Hub | Swastik Srijan Foundation', 'Access learning, training and educational resources from Swastik Srijan Foundation.', '/images/learningHub.png'],
  '/SkillPrograms': ['Skill Development Programs | Swastik Srijan Foundation', 'Explore skill development, livelihood and women empowerment programs supporting sustainable community progress.', '/images/real/women_empowerment_tailoring.jpg'],
  '/PrivacyPolicy': ['Privacy Policy | Swastik Srijan Foundation', 'Learn how Swastik Srijan Foundation collects, uses and protects personal information.', '/images/real/integrity-pledge.jpg'],
  '/TermsAndConditions': ['Terms & Conditions | Swastik Srijan Foundation', 'Read the terms and conditions for using the Swastik Srijan Foundation website and services.', '/images/real/academy-board-compliance.jpg'],
  '/DonationRefundPolicy': ['Donation & Refund Policy | Swastik Srijan Foundation', 'Read our transparent policy on donations, refunds and contribution handling.', '/images/real/online-food-support-clipping.jpg'],
  '/CookiePolicy': ['Cookie Policy | Swastik Srijan Foundation', 'Learn how Swastik Srijan Foundation uses cookies and similar technologies.', '/images/real/awareness-poster-viewing.jpg'],
  '/Transparency': ['Transparency & Reports | Swastik Srijan Foundation', 'Our commitment to transparency through reports, impact information and governance details.', '/images/real/ncw_pledge_certificate.jpg'],
  '/RegistrationDetails': ['Registration & Compliance | Swastik Srijan Foundation', 'View registration, legal and compliance information for Swastik Srijan Foundation Samiti.', '/images/uploads/ngo-darpan.jpg']
};

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const source = fs.readFileSync(indexPath, 'utf8');

function buildHtml(route, [title, description, image]) {
  const url = `${site}${route === '/' ? '/' : route}`;
  const absoluteImage = `${site}${image}`;
  let html = source;

  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`);
  html = html.replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${absoluteImage}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${absoluteImage}" />`);

  return html;
}

for (const [route, data] of Object.entries(pages)) {
  if (route === '/') continue;
  const targetDir = path.join(distDir, route.slice(1));
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml(route, data));
}

fs.writeFileSync(indexPath, buildHtml('/', pages['/']));
console.log(`Generated ${Object.keys(pages).length} static route pages with route-specific social preview metadata.`);
console.log(`Home fallback image: ${site}${homeImage}`);
