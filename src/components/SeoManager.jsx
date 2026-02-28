import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const SITE_URL = "https://swastiksrijan.in";
const DEFAULT_IMAGE = `${SITE_URL}/images/home-logo.png`;

const seoByPath = {
  "/": {
    title: "Swastik Srijan Foundation | Donate, Volunteer & Build Rural India",
    description:
      "Support Swastik Srijan Foundation (est. 2013) to drive education, health, livelihoods, and community development across India. Donate, volunteer, and partner for CSR impact.",
  },
  "/Donate": {
    title: "Donate to Swastik Srijan Foundation | NGO Donation for India",
    description:
      "Make an NGO donation to support education, health, and rural development projects. Your contribution helps children, youth, and families across India.",
  },
  "/CSRPartnership": {
    title: "CSR Partnership with Swastik Srijan Foundation",
    description:
      "Partner with Swastik Srijan Foundation for CSR projects in education, skilling, women empowerment, and sustainable rural impact across India.",
  },
  "/Impact": {
    title: "Impact Stories | Swastik Srijan Foundation",
    description:
      "Explore real impact stories, campaigns, and field outcomes delivered by Swastik Srijan Foundation in underserved communities.",
  },
  "/GetInvolved": {
    title: "Get Involved | Volunteer, Internship & Membership",
    description:
      "Join Swastik Srijan Foundation through volunteering, internships, and membership opportunities to create measurable social impact.",
  },
  "/Contact": {
    title: "Contact Swastik Srijan Foundation",
    description:
      "Connect with Swastik Srijan Foundation for donations, collaborations, volunteering, media, and partnerships.",
  },
};

function ensureMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}='${key}']`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function ensureCanonical(url) {
  let link = document.head.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export default function SeoManager() {
  const { location } = useRouterState();
  const path = location.pathname;

  useEffect(() => {
    const seo = seoByPath[path] || {
      title: "Swastik Srijan Foundation | Education, Health & Community Development",
      description:
        "Swastik Srijan Foundation is a registered NGO working on education, health, livelihoods, and community empowerment across India.",
    };

    const canonical = `${SITE_URL}${path || "/"}`;

    document.title = seo.title;
    ensureCanonical(canonical);

    ensureMeta("name", "description", seo.description);
    ensureMeta("name", "robots", "index, follow, max-image-preview:large");
    ensureMeta("name", "keywords", "NGO India, donate NGO, CSR projects, rural education, health support, Swastik Srijan Foundation");

    ensureMeta("property", "og:type", "website");
    ensureMeta("property", "og:site_name", "Swastik Srijan Foundation");
    ensureMeta("property", "og:title", seo.title);
    ensureMeta("property", "og:description", seo.description);
    ensureMeta("property", "og:url", canonical);
    ensureMeta("property", "og:image", DEFAULT_IMAGE);

    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", seo.title);
    ensureMeta("name", "twitter:description", seo.description);
    ensureMeta("name", "twitter:image", DEFAULT_IMAGE);
  }, [path]);

  return null;
}
