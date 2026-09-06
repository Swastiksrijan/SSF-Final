import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Route-level SEO metadata for public pages. Private/admin routes intentionally fall back to noindex below.
    const seoData = {
      '/': {
        title: 'Swastik Srijan Foundation | Empowering Lives Across India',
        description: 'Join Swastik Srijan Foundation, a registered NGO in India working for education, health, livelihoods, women empowerment & rural development since 2013.',
        keywords: 'NGO India, Swastik Srijan, education NGO, health NGO, social welfare, donate NGO, volunteer India'
      },
      '/About': { title: 'About Swastik Srijan Foundation | Our Mission & Vision', description: 'Learn about Swastik Srijan Foundation Samiti - a registered NGO dedicated to grassroots development, education, health, and community empowerment across India since 2013.', keywords: 'about NGO, foundation mission, Rewa NGO, Madhya Pradesh NGO, social organization India' },
      '/Mission': { title: 'Mission & Vision | Swastik Srijan Foundation', description: 'Discover our mission to empower communities through education, health, livelihood development, and sustainable social change. Building a stronger Bharat together.', keywords: 'NGO mission, social mission India, development goals, community empowerment' },
      '/Vision': { title: 'Our Vision | Swastik Srijan Foundation', description: 'Our vision for a nation built on principles of Seva (service), Satya (truth), and Samarpan (dedication) with grassroots governance and sustainable impact.', keywords: 'vision statement, NGO values, sustainable development' },
      '/Objectives': { title: 'Objectives | Swastik Srijan Foundation', description: 'Explore the objectives and areas of work of Swastik Srijan Foundation Samiti across education, health, livelihoods, women empowerment, environment and social welfare.', keywords: 'NGO objectives, social welfare objectives, foundation activities, Rewa NGO' },
      '/Team': { title: 'Our Team & Leadership | Swastik Srijan Foundation', description: 'Meet the leadership and team behind Swastik Srijan Foundation Samiti and our commitment to accountable social development.', keywords: 'NGO team, NGO leadership, Swastik Srijan Foundation team' },
      '/Journey': { title: 'Our Journey Since 2013 | Swastik Srijan Foundation', description: 'Explore the journey, milestones and social initiatives of Swastik Srijan Foundation Samiti since its establishment in 2013.', keywords: 'NGO journey, NGO history, Swastik Srijan Foundation history, social impact India' },
      '/Humanity&Truth': { title: 'Humanity & Truth | Swastik Srijan Foundation', description: 'Read the values and public-interest philosophy that guide Swastik Srijan Foundation in service, integrity and community development.', keywords: 'humanity, truth, seva, NGO values, social responsibility' },
      '/Impact': { title: 'Impact Stories & Results | Swastik Srijan Foundation', description: 'See the real impact we are creating across India - education, health initiatives, livelihood programs, women empowerment, and rural community development.', keywords: 'impact stories, NGO results, social impact, beneficiaries, development outcomes' },
      '/GetInvolved': { title: 'Join Us | Get Involved With Swastik Srijan Foundation', description: 'Multiple ways to participate - Volunteer, become a member, donate, support our mission, or partner for CSR collaboration. Join our nation-building movement today.', keywords: 'join NGO, volunteer opportunities, NGO membership, support NGO, CSR partnership' },
      '/Volunteer': { title: 'Volunteer With Us | Swastik Srijan Foundation', description: 'Become a volunteer and contribute your time and skills to create real change. Join our on-ground teams working across India.', keywords: 'volunteer opportunities, NGO volunteering, social work, community service' },
      '/Internship': { title: 'Internship Programs | Swastik Srijan Foundation', description: 'Gain hands-on experience with our internship programs. Learn, grow, and contribute to meaningful social impact work.', keywords: 'internship, social sector internship, NGO internship, career development' },
      '/Members': { title: 'Membership | Swastik Srijan Foundation', description: 'Become a member of Swastik Srijan Foundation and shape our governance, philosophy, and future direction.', keywords: 'NGO membership, member benefits, organizational governance' },
      '/Donate': { title: 'Donate to Swastik Srijan Foundation | Support Our Mission', description: 'Your donation directly supports education, health, livelihoods, and community development. Every contribution creates lasting change across India.', keywords: 'donate to NGO, charitable donation, NGO fundraising, support cause' },
      '/Donor': { title: 'Become a Donor | Swastik Srijan Foundation', description: 'Support Swastik Srijan Foundation through transparent giving and help strengthen education, health and community development initiatives.', keywords: 'NGO donor, donate to NGO India, charitable giving' },
      '/CSRPartnership': { title: 'CSR Partnership | Corporate Social Responsibility', description: 'Partner with us for meaningful Corporate Social Responsibility initiatives. Create sustainable impact through strategic collaboration.', keywords: 'CSR partnership, corporate social responsibility, business partnership' },
      '/PartnerWithUs': { title: 'Partner With Us | Swastik Srijan Foundation', description: 'Explore partnership opportunities with Swastik Srijan Foundation for institutions, NGOs, healthcare organizations, companies and community initiatives.', keywords: 'NGO partnership, institutional partnership, healthcare partnership, NGO collaboration' },
      '/Contact': { title: 'Contact Us | Swastik Srijan Foundation', description: 'Get in touch with Swastik Srijan Foundation. Office in Rewa, Madhya Pradesh. Reach us via email, phone, or contact form.', keywords: 'contact NGO, NGO contact information, get in touch' },
      '/Blog': { title: 'Blog & Articles | Swastik Srijan Foundation', description: 'Read articles and stories about education, social welfare, community development, and our work across India.', keywords: 'NGO blog, social impact articles, community stories' },
      '/Media': { title: 'Media Gallery | Swastik Srijan Foundation', description: 'Photos and videos from our programs, events, and community impact work. See Swastik Srijan Foundation in action.', keywords: 'NGO gallery, impact photos, community videos' },
      '/Campaigns': { title: 'Active Campaigns | Swastik Srijan Foundation', description: 'Join our current campaigns and initiatives making real difference in communities across India.', keywords: 'campaigns, social campaigns, community initiatives' },
      '/UpcomingProjects': { title: 'Upcoming Projects | Swastik Srijan Foundation', description: 'Discover upcoming projects and planned initiatives of Swastik Srijan Foundation across education, health, livelihoods and community development.', keywords: 'upcoming NGO projects, social development projects, NGO initiatives' },
      '/LearningHub': { title: 'SSF Learning Hub | Swastik Srijan Foundation', description: 'Access learning, training and educational resources from Swastik Srijan Foundation to support skills, knowledge and community development.', keywords: 'NGO learning hub, education resources, social learning India' },
      '/PrivacyPolicy': { title: 'Privacy Policy | Swastik Srijan Foundation', description: 'Our privacy policy outlines how we collect, use, and protect your personal information.', keywords: 'privacy policy, data protection, GDPR compliance' },
      '/TermsAndConditions': { title: 'Terms & Conditions | Swastik Srijan Foundation', description: 'Read our terms and conditions for using Swastik Srijan Foundation website and services.', keywords: 'terms of use, website terms, legal terms' },
      '/DonationRefundPolicy': { title: 'Donation & Refund Policy | Swastik Srijan Foundation', description: 'Our transparent policy on donations, refunds, and how your contributions are used for social impact.', keywords: 'donation policy, refund policy, transparency' },
      '/CookiePolicy': { title: 'Cookie Policy | Swastik Srijan Foundation', description: 'Learn how Swastik Srijan Foundation uses cookies and similar technologies on its website.', keywords: 'cookie policy, website cookies, privacy' },
      '/Transparency': { title: 'Transparency & Reports | Swastik Srijan Foundation', description: 'Our commitment to transparency - financial reports, impact metrics, and governance information.', keywords: 'NGO transparency, annual reports, financial reports' },
      '/RegistrationDetails': { title: 'Registration & Compliance | Swastik Srijan Foundation', description: 'View registration, legal and compliance information for Swastik Srijan Foundation Samiti.', keywords: 'NGO registration, NGO compliance, registration details, Swastik Srijan Foundation' }
    };

    const pathname = location.pathname;
    const isPrivate = pathname.startsWith('/admin') || pathname.startsWith('/Admin') || pathname.startsWith('/UserPortal') || pathname.startsWith('/MemberDashboard');
    const meta = seoData[pathname] || {
      title: 'Swastik Srijan Foundation | Social Impact Organization',
      description: 'Swastik Srijan Foundation - Working for education, health, livelihood, and community development across India.',
      keywords: 'NGO, social work, community development, India'
    };

    document.title = meta.title;

    const setMeta = (selector, content) => {
      const tag = document.querySelector(selector);
      if (tag) tag.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[name="keywords"]', meta.keywords);
    setMeta('meta[property="og:title"]', meta.title);
    setMeta('meta[property="og:description"]', meta.description);
    setMeta('meta[property="og:url"]', `https://swastiksrijan.in${pathname}`);
    setMeta('meta[name="twitter:title"]', meta.title);
    setMeta('meta[name="twitter:description"]', meta.description);

    // Private account/admin screens should never be indexed.
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (!robotsTag) {
      robotsTag = document.createElement('meta');
      robotsTag.setAttribute('name', 'robots');
      document.head.appendChild(robotsTag);
    }
    robotsTag.setAttribute('content', isPrivate ? 'noindex,nofollow,noarchive' : 'index,follow,max-image-preview:large');

    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
