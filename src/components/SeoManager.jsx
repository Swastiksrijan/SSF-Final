import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Define SEO metadata for all routes
    const seoData = {
      '/': {
        title: 'Swastik Srijan Foundation | Empowering Lives Across India',
        description: 'Join Swastik Srijan Foundation, a registered NGO in India working for education, health, livelihoods, women empowerment & rural development since 2013.',
        keywords: 'NGO India, Swastik Srijan, education NGO, health NGO, social welfare, donate NGO, volunteer India'
      },
      '/About': {
        title: 'About Swastik Srijan Foundation | Our Mission & Vision',
        description: 'Learn about Swastik Srijan Foundation Samiti - a registered NGO dedicated to grassroots development, education, health, and community empowerment across India since 2013.',
        keywords: 'about NGO, foundation mission, Rewa NGO, Madhya Pradesh NGO, social organization India'
      },
      '/Mission': {
        title: 'Mission & Vision | Swastik Srijan Foundation',
        description: 'Discover our mission to empower communities through education, health, livelihood development, and sustainable social change. Building a stronger Bharat together.',
        keywords: 'NGO mission, social mission India, development goals, community empowerment'
      },
      '/Vision': {
        title: 'Our Vision | Swastik Srijan Foundation',
        description: 'Our vision for a nation built on principles of Seva (service), Satya (truth), and Samarpan (dedication) with grassroots governance and sustainable impact.',
        keywords: 'vision statement, NGO values, sustainable development'
      },
      '/Impact': {
        title: 'Impact Stories & Results | Swastik Srijan Foundation',
        description: 'See the real impact we are creating across India - education, health initiatives, livelihood programs, women empowerment, and rural community development.',
        keywords: 'impact stories, NGO results, social impact, beneficiaries, development outcomes'
      },
      '/GetInvolved': {
        title: 'Join Us | Get Involved With Swastik Srijan Foundation',
        description: 'Multiple ways to participate - Volunteer, become a member, donate, support our mission, or partner for CSR collaboration. Join our nation-building movement today.',
        keywords: 'join NGO, volunteer opportunities, NGO membership, support NGO, CSR partnership'
      },
      '/Volunteer': {
        title: 'Volunteer With Us | Swastik Srijan Foundation',
        description: 'Become a volunteer and contribute your time and skills to create real change. Join our on-ground teams working across India.',
        keywords: 'volunteer opportunities, NGO volunteering, social work, community service'
      },
      '/Internship': {
        title: 'Internship Programs | Swastik Srijan Foundation',
        description: 'Gain hands-on experience with our internship programs. Learn, grow, and contribute to meaningful social impact work.',
        keywords: 'internship, social sector internship, NGO internship, career development'
      },
      '/Members': {
        title: 'Membership | Swastik Srijan Foundation',
        description: 'Become a member of Swastik Srijan Foundation and shape our governance, philosophy, and future direction.',
        keywords: 'NGO membership, member benefits, organizational governance'
      },
      '/Donate': {
        title: 'Donate to Swastik Srijan Foundation | Support Our Mission',
        description: 'Your donation directly supports education, health, livelihoods, and community development. Every contribution creates lasting change across India.',
        keywords: 'donate to NGO, charitable donation, NGO fundraising, support cause'
      },
      '/CSRPartnership': {
        title: 'CSR Partnership | Corporate Social Responsibility',
        description: 'Partner with us for meaningful Corporate Social Responsibility initiatives. Create sustainable impact through strategic collaboration.',
        keywords: 'CSR partnership, corporate social responsibility, business partnership'
      },
      '/Contact': {
        title: 'Contact Us | Swastik Srijan Foundation',
        description: 'Get in touch with Swastik Srijan Foundation. Office in Rewa, Madhya Pradesh. Reach us via email, phone, or contact form.',
        keywords: 'contact NGO, NGO contact information, get in touch'
      },
      '/Blog': {
        title: 'Blog & Articles | Swastik Srijan Foundation',
        description: 'Read articles and stories about education, social welfare, community development, and our work across India.',
        keywords: 'NGO blog, social impact articles, community stories'
      },
      '/Media': {
        title: 'Media Gallery | Swastik Srijan Foundation',
        description: 'Photos and videos from our programs, events, and community impact work. See Swastik Srijan Foundation in action.',
        keywords: 'NGO gallery, impact photos, community videos'
      },
      '/Campaigns': {
        title: 'Active Campaigns | Swastik Srijan Foundation',
        description: 'Join our current campaigns and initiatives making real difference in communities across India.',
        keywords: 'campaigns, social campaigns, community initiatives'
      },
      '/PrivacyPolicy': {
        title: 'Privacy Policy | Swastik Srijan Foundation',
        description: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
        keywords: 'privacy policy, data protection, GDPR compliance'
      },
      '/TermsAndConditions': {
        title: 'Terms & Conditions | Swastik Srijan Foundation',
        description: 'Read our terms and conditions for using Swastik Srijan Foundation website and services.',
        keywords: 'terms of use, website terms, legal terms'
      },
      '/DonationRefundPolicy': {
        title: 'Donation & Refund Policy | Swastik Srijan Foundation',
        description: 'Our transparent policy on donations, refunds, and how your contributions are used for social impact.',
        keywords: 'donation policy, refund policy, transparency'
      },
      '/Transparency': {
        title: 'Transparency & Reports | Swastik Srijan Foundation',
        description: 'Our commitment to transparency - financial reports, impact metrics, and governance information.',
        keywords: 'NGO transparency, annual reports, financial reports'
      }
    };

    const pathname = location.pathname;
    const meta = seoData[pathname] || {
      title: 'Swastik Srijan Foundation | Social Impact Organization',
      description: 'Swastik Srijan Foundation - Working for education, health, livelihood, and community development across India.',
      keywords: 'NGO, social work, community development, India'
    };

    // Update document title
    document.title = meta.title;

    // Update meta description
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', meta.description);
    }

    // Update meta keywords
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) {
      keywordsTag.setAttribute('content', meta.keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://swastiksrijan.in${pathname}`);

    // Update Twitter/X tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default SeoManager;
