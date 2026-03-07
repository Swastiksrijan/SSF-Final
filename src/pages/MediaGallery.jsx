import { useState, useEffect } from "react";
import { FaEye, FaTimes, FaFilter, FaCamera } from "react-icons/fa";

// Image generation logic removed to prevent duplicates


const ALL_IMAGES = [
  {
    id: "new_upload_01",
    src: "/images/classroom-session.png",
    category: "Education",
    year: "2024",
    alt: "Classroom interactive session with students",
    aspect: "horizontal"
  },
  {
    id: "new_upload_02",
    src: "/images/village-outreach.png",
    category: "Events",
    year: "2024",
    alt: "Village outreach and community engagement",
    aspect: "horizontal"
  },
  {
    id: "new_upload_03_poster",
    src: "/images/sthaniya-yojana-portal.png",
    category: "Events",
    year: "2024",
    alt: "Poster campaign for Local Planning Portal awareness",
    aspect: "vertical"
  },
  {
    id: "new_upload_04",
    src: "/images/women-learning-session.png",
    category: "Women Empowerment",
    year: "2024",
    alt: "Women's interactive learning and discussion session",
    aspect: "horizontal"
  },
  {
    id: "new_upload_05",
    src: "/images/community-meeting.jpg",
    category: "Women Empowerment",
    year: "2024",
    alt: "Village community meeting and SHG discussion",
    aspect: "horizontal"
  },
  {
    id: "riya_edu",
    src: "/images/riya-education.png",
    category: "Education",
    year: "2024",
    alt: "Riya and other children participating in education session",
    aspect: "horizontal"
  },
  {
    id: "prot_eco",
    src: "/images/protection-ecosystem.png",
    category: "Events",
    year: "2024",
    alt: "Children awareness and protection program",
    aspect: "horizontal"
  },
  {
    id: "dis_relief",
    src: "/images/disaster-relief.jpg",
    category: "Health",
    year: "2024",
    alt: "Crisis intervention and community support",
    aspect: "horizontal"
  },
  {
    id: "new_upload_20",
    src: "/images/real/children-mat-session.jpg",
    category: "Education",
    year: "2024",
    alt: "Grassroots Outdoor Study Session on Mat",
    aspect: "vertical"
  },
  {
    id: "new_upload_21",
    src: "/images/real/academy-board-compliance.jpg",
    category: "Events",
    year: "2024",
    alt: "SSF National Academy Official Board and Compliance",
    aspect: "horizontal"
  },
  {
    id: "new_upload_12",
    src: "/images/real/awareness-poster-viewing.jpg",
    category: "Events",
    year: "2024",
    alt: "Community Awareness Poster Campaign",
    aspect: "vertical"
  },
  {
    id: "new_upload_13",
    src: "/images/real/girls-study-group-mat.jpg",
    category: "Education",
    year: "2024",
    alt: "Girls Study Group Session on Mat",
    aspect: "horizontal"
  },
  {
    id: "new_upload_14",
    src: "/images/real/girls-group-learning-close.jpg",
    category: "Education",
    year: "2024",
    alt: "Girls Group Learning Activity",
    aspect: "horizontal"
  },
  {
    id: "new_upload_15",
    src: "/images/real/village-community-center.jpg",
    category: "Events",
    year: "2024",
    alt: "Village Community Center Gathering",
    aspect: "horizontal"
  },
  {
    id: "new_upload_16",
    src: "/images/real/student-leadership-recitation.jpg",
    category: "Education",
    year: "2024",
    alt: "Student Leadership and Recitation Program",
    aspect: "horizontal"
  },
  {
    id: "new_upload_8",
    src: "/images/real/children-playing-park.jpg",
    category: "Events",
    year: "2024",
    alt: "Children Playing in Community Park",
    aspect: "horizontal"
  },
  {
    id: "new_upload_9",
    src: "/images/real/classroom-floor-seating.jpg",
    category: "Education",
    year: "2024",
    alt: "Rural Classroom Session",
    aspect: "horizontal"
  },
  {
    id: "new_upload_10",
    src: "/images/real/midday-meal-gathering.jpg",
    category: "Health",
    year: "2024",
    alt: "Midday Meal Gathering",
    aspect: "vertical"
  },
  {
    id: "new_upload_11",
    src: "/images/real/community-rally-children.jpg",
    category: "Events",
    year: "2024",
    alt: "Community Awareness Rally",
    aspect: "horizontal"
  },
  {
    id: "new_upload_3",
    src: "/images/uploads/ngo-darpan.jpg",
    category: "Events",
    year: "2025",
    alt: "NITI Aayog DARPAN Registration",
    aspect: "vertical"
  },
  {
    id: "new_upload_4",
    src: "/images/uploads/railway-initiative.jpg",
    category: "Events",
    year: "2025",
    alt: "Institutional Initiative for Railway Reforms",
    aspect: "vertical"
  },
  {
    id: "new_upload_5",
    src: "/images/uploads/learning-hub-1.jpg",
    category: "Education",
    year: "2024",
    alt: "SSF Learning Hub - Classroom Session",
    aspect: "horizontal"
  },
  {
    id: "new_upload_6",
    src: "/images/uploads/learning-hub-2.jpg",
    category: "Education",
    year: "2024",
    alt: "SSF Learning Hub - Study Group",
    aspect: "horizontal"
  },
  {
    id: "new_upload_7",
    src: "/images/uploads/community-banner.jpg",
    category: "Events",
    year: "2024",
    alt: "Community Awareness Drive",
    aspect: "horizontal"
  },
  {
    id: "new_upload_1",
    src: "/images/uploads/community-gathering.jpg",
    category: "Events",
    year: "2024",
    alt: "Community Gathering and Cultural Event",
    aspect: "horizontal"
  },
  {
    id: "new_upload_2",
    src: "/images/uploads/tree-planting.jpg",
    category: "Distribution",
    year: "2024",
    alt: "Tree Plantation Drive for Environmental Sustainability",
    aspect: "vertical"
  },
  {
    id: "real1",
    src: "/images/real/ngo_event_1.jpg",
    category: "Events",
    year: "2024",
    alt: "Swastik Srijan Foundation Event",
    aspect: "horizontal"
  },
  {
    id: "real2",
    src: "/images/real/tree_plantation.jpg",
    category: "Distribution",
    year: "2024",
    alt: "Tree Plantation Drive",
    aspect: "horizontal"
  },
  {
    id: "real3",
    src: "/images/real/ngo_event_2.jpg",
    category: "Events",
    year: "2024",
    alt: "Community Gathering",
    aspect: "horizontal"
  },
  {
    id: "real4",
    src: "/images/real/leadership.jpg",
    category: "Events",
    year: "2024",
    alt: "Leadership Meeting",
    aspect: "vertical"
  },
  {
    id: "real5",
    src: "/images/real/education_girls.jpg",
    category: "Education",
    year: "2024",
    alt: "Girl Child Education Program",
    aspect: "horizontal"
  },
  {
    id: "real6",
    src: "/images/real/tree_planting_2.jpg",
    category: "Distribution",
    year: "2024",
    alt: "Community Environmental Awareness Drive",
    aspect: "vertical"
  },
  {
    id: "real7",
    src: "/images/real/news_media_1.jpg",
    category: "Events",
    year: "2023",
    alt: "News coverage of our digital initiative in Rewa",
    aspect: "square"
  },
  {
    id: "real8",
    src: "/images/real/ncw_pledge_certificate.jpg",
    category: "Women Empowerment",
    year: "2021",
    alt: "National Commission for Women Pledge Certificate",
    aspect: "horizontal"
  },
  {
    id: "real9",
    src: "/images/real/coaching_center_1.jpg",
    category: "Education",
    year: "2023",
    alt: "SSF Coaching Center Students",
    aspect: "horizontal"
  },
  {
    id: "real10",
    src: "/images/real/women_empowerment_tailoring.jpg",
    category: "Women Empowerment",
    year: "2024",
    alt: "Tailoring workshop for village women",
    aspect: "vertical"
  },
  {
    id: "real11",
    src: "/images/real/women_community_meeting.jpg",
    category: "Women Empowerment",
    year: "2024",
    alt: "Village Women Community Meeting",
    aspect: "horizontal"
  },
  {
    id: "real12",
    src: "/images/real/nutrition_program.jpg",
    category: "Health",
    year: "2024",
    alt: "Swastik Poshan Sankalp Nutrition Program",
    aspect: "horizontal"
  },
  {
    id: "real13",
    src: "/images/real/scholarship_distribution.jpg",
    category: "Education",
    year: "2023",
    alt: "Scholarship and Material Distribution Event",
    aspect: "vertical"
  },
  {
    id: "real14",
    src: "/images/real/academy_banner_wide.jpg",
    category: "Education",
    year: "2024",
    alt: "SSF National Academy Banner",
    aspect: "horizontal"
  },
  {
    id: "real15",
    src: "/images/real/ssf_event_members.jpg",
    category: "Events",
    year: "2024",
    alt: "SSF Foundation Members Group Photo",
    aspect: "horizontal"
  },
  {
    id: "new_upload_355_1",
    src: "/images/rural-education.jpg",
    category: "Education",
    year: "2024",
    alt: "Rural education session with children and workbooks",
    aspect: "horizontal"
  },
  {
    id: "new_upload_355_2",
    src: "/images/cvc-certificate.jpg",
    category: "Events",
    year: "2024",
    alt: "Central Vigilance Commission Pledge Certificate for SSF",
    aspect: "horizontal"
  },
  {
    id: "new_upload_355_3",
    src: "/images/ssf-team.jpg",
    category: "Events",
    year: "2024",
    alt: "SSF Team members and core working group",
    aspect: "horizontal"
  },
  {
    id: "new_upload_355_4",
    src: "/images/tree-planting-1.jpg",
    category: "Distribution",
    year: "2024",
    alt: "Volunteer planting a sapling with protective cage",
    aspect: "horizontal"
  },
  {
    id: "new_upload_355_5",
    src: "/images/tree-planting-2.jpg",
    category: "Distribution",
    year: "2024",
    alt: "A growing sapling in the field",
    aspect: "horizontal"
  },
  {
    id: "batch2_01",
    src: "/images/real/ssf_event_members.jpg",
    category: "Events",
    year: "2024",
    alt: "SSF Community members and team group photo during field visit",
    aspect: "horizontal"
  },
  {
    id: "batch2_02",
    src: "/images/health-program-masks.jpg",
    category: "Health",
    year: "2021",
    alt: "Health awareness and protocol meeting with masks",
    aspect: "horizontal"
  },
  {
    id: "batch2_03",
    src: "/images/education-material-exchange.jpg",
    category: "Education",
    year: "2024",
    alt: "Children exchanging educational materials at SSF center",
    aspect: "horizontal"
  },
  {
    id: "batch2_04",
    src: "/images/village-outreach-children.jpg",
    category: "Events",
    year: "2024",
    alt: "Village outreach with local children in rural setting",
    aspect: "horizontal"
  },
  {
    id: "batch2_05",
    src: "/images/merit-scholarship-distribution.jpg",
    category: "Education",
    year: "2024",
    alt: "Scholarship and merit award distribution to students",
    aspect: "horizontal"
  },
  {
    id: "batch3_01",
    src: "/images/direct-relief-women.jpg",
    category: "Women Empowerment",
    year: "2024",
    alt: "Direct material support distribution to rural women",
    aspect: "horizontal"
  },
  {
    id: "batch3_02",
    src: "/images/cow-rescue-mission.jpg",
    category: "Events",
    year: "2024",
    alt: "SSF volunteers rescuing a cow from a ditch - Animal welfare in action",
    aspect: "horizontal"
  },
  {
    id: "batch3_03",
    src: "/images/children-exercise-session.jpg",
    category: "Health",
    year: "2024",
    alt: "Morning exercise and physical health session for rural students",
    aspect: "horizontal"
  },
  {
    id: "batch3_04",
    src: "/images/cultural-event-children.jpg",
    category: "Events",
    year: "2024",
    alt: "Children participating in a cultural performance on stage",
    aspect: "horizontal"
  },
  {
    id: "batch4_01",
    src: "/images/real/children-playing-park.jpg",
    category: "Events",
    year: "2024",
    alt: "Children holding hands in a park - Unity and teamwork",
    aspect: "horizontal"
  },
  {
    id: "batch4_02",
    src: "/images/slum-outreach-children.jpg",
    category: "Education",
    year: "2024",
    alt: "Outreach program with children in urban settlements",
    aspect: "horizontal"
  },
  {
    id: "batch4_03",
    src: "/images/rural-children-raising-hands.jpg",
    category: "Events",
    year: "2024",
    alt: "Enthusiastic rural children raising hands during a community meet",
    aspect: "horizontal"
  },
  {
    id: "batch4_04",
    src: "/images/slum-area-outreach.jpg",
    category: "Events",
    year: "2024",
    alt: "Community outreach session in a local neighborhood",
    aspect: "horizontal"
  },
  {
    id: "batch4_05",
    src: "/images/classroom-mat-session.jpg",
    category: "Education",
    year: "2024",
    alt: "Interative learning session on mats with a teacher",
    aspect: "horizontal"
  },
  // ...generateImages() - REMOVED to avoid duplicates
];
const CATEGORIES = ["All", "Education", "Health", "Women Empowerment", "Events", "Distribution"];
const YEARS = ["All", "2014-2025"];

const YOUTUBE_VIDEOS = [
  {
    id: "yoBh0mb9GZE",
    title: "Ground Impact & Community Stories",
    desc: "A glimpse into our daily activities and the lives we touch across India.",
    category: "Impact"
  },
  {
    id: "Zv-vUjPSbAc",
    title: "Empowering Rural Education",
    desc: "See how we are bringing quality education to the most remote corners.",
    category: "Education"
  },
  {
    id: "iah7kGfGUF8",
    title: "National Academy Highlights",
    desc: "Key moments from our flagship educational initiative.",
    category: "Academy"
  },
  {
    id: "uT9U_ld-fEE",
    title: "Women's Empowerment Drive",
    desc: "Success stories of local leaders and self-reliant women.",
    category: "Empowerment"
  },
  {
    id: "gHRx9wbIZPU",
    title: "Health and Wellness Camps",
    desc: "Bringing essential healthcare services to underserved communities.",
    category: "Health"
  },
  {
    id: "mPt7CTLFmPU",
    title: "Community Awareness Programs",
    desc: "Engaging with locals to create meaningful social change.",
    category: "Awareness"
  },
  {
    id: "IXLbvE6qL6Q",
    title: "Growth and Development Milestones",
    desc: "Chronicling our journey and the milestones achieved over the years.",
    category: "Journey"
  },
  {
    id: "_02EXsLLs50",
    title: "Sustainable Living Initiatives",
    desc: "Promoting environment-friendly practices and green living.",
    category: "Sustainability"
  },
  {
    id: "qrH-HK1ZbcA",
    title: "Voices of Change",
    desc: "Direct testimonials from our beneficiaries and volunteers.",
    category: "Impact"
  },
  {
    id: "vDLLP-45GJE",
    title: "Future of Digital Learning",
    desc: "How we are bridging the digital divide in rural India.",
    category: "Education"
  },
  {
    id: "Xl2oPiQHVQo",
    title: "Transformative Power of Support",
    desc: "A thank you to our partners and the difference they help us make.",
    category: "Partnership"
  }
];

export default function MediaGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [selectedImg, setSelectedImg] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Derived filtered images (no extra state needed)
  const filteredImages = ALL_IMAGES.filter((img) => {
    const catMatch = activeCategory === "All" || img.category === activeCategory;
    const yearMatch = activeYear === "All" || img.year === activeYear;
    return catMatch && yearMatch;
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedImg]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedImg(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="w-full bg-zinc-50 font-inria min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-zinc-900 text-white pt-40 pb-24 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003366] opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 opacity-5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block bg-[#003366]/20 text-[#003366] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            <FaCamera className="inline-block mr-2" /> Our Visual Journey
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Media <span className="text-white">Gallery</span>
          </h1>
          <p className="text-zinc-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
            Glimpses of our impact, events, and the smiles we've spread across communities. Witness the change we are making together.
          </p>
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col xl:flex-row gap-6 items-center justify-between">

            {/* Categories */}
            <div className="flex gap-2 pb-2 xl:pb-0 overflow-x-auto w-full xl:w-auto no-scrollbar mask-gradient">
              <span className="flex items-center gap-2 text-zinc-400 font-bold mr-2 text-sm uppercase tracking-wider">
                <FaFilter /> Type:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border
                    ${activeCategory === cat
                      ? "bg-[#003366] text-white border-[#003366] shadow-md transform scale-105"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-[#003366] hover:text-black"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Years */}
            <div className="flex gap-2 overflow-x-auto w-full xl:w-auto no-scrollbar">
              <span className="flex items-center gap-2 text-zinc-400 font-bold mr-2 text-sm uppercase tracking-wider">
                Year:
              </span>
              {YEARS.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setActiveYear(yr)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border
                    ${activeYear === yr
                      ? "bg-black text-white border-black shadow-md transform scale-105"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black"}`}
                >
                  {yr}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ================= GALLERY GRID ================= */}
      <section className="max-w-[1600px] mx-auto py-12 px-4">

        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-zinc-200 mb-4">📷</div>
            <h3 className="text-2xl font-bold text-zinc-400">No images found</h3>
            <p className="text-zinc-500">Try adjusting your filters.</p>
          </div>
        ) : (
          /* Masonry-like CSS Columns */
          <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-zinc-200 cursor-zoom-in"
                onClick={() => setSelectedImg(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-[#003366] text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                      {img.category}
                    </span>
                    <h3 className="text-white font-bold text-lg">{img.category} Drive</h3>
                    <p className="text-zinc-300 text-sm mt-1">{img.year}</p>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <FaEye />
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ================= VIDEO GALLERY ================= */}
      <section className="max-w-[1600px] mx-auto py-12 px-4 border-t border-zinc-200">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#fb8500]/20 text-[#fb8500] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
            <FaEye className="inline-block mr-2" /> Watch Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#002344]">Video <span className="text-[#fb8500]">Highlights</span></h2>
          <p className="text-zinc-500 max-w-2xl mx-auto mt-4 text-lg">A collection of stories, events, and initiatives captured in motion.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          {/* Facebook Video Card (Kept for variety) */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-zinc-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="relative h-64 sm:h-72 lg:h-80 bg-black">
              <iframe
                src="https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=1089068852856795&show_text=false&t=0"
                className="w-full h-full border-none overflow-hidden"
                scrolling="no"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="SSF Legacy Video"
              ></iframe>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-[#fb8500] uppercase tracking-wider mb-2 block">Featured Facebook</span>
              <h3 className="text-xl font-bold text-[#002344] mb-3 group-hover:text-[#fb8500] transition-colors font-serif">
                Transformation Stories
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Witness the moments of change and the stories that define our mission on the ground.
              </p>
            </div>
          </div>

          {/* YouTube Video Cards */}
          {YOUTUBE_VIDEOS.map((video, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-zinc-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="relative h-64 sm:h-72 lg:h-80 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-[#fb8500] uppercase tracking-wider mb-2 block">{video.category}</span>
                <h3 className="text-xl font-bold text-[#002344] mb-3 group-hover:text-[#fb8500] transition-colors font-serif">
                  {video.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {video.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImg(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all"
            onClick={() => setSelectedImg(null)}
          >
            <FaTimes size={24} />
          </button>

          <div
            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row bg-zinc-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div className="flex-1 bg-black flex items-center justify-center p-4 md:p-8">
              <img
                src={selectedImg.src}
                alt={selectedImg.alt}
                className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain shadow-2xl"
              />
            </div>

            {/* Sidebar Details (Visible on Desktop, stacked on Mobile) */}
            <div className="w-full md:w-80 bg-zinc-900 p-8 border-l border-zinc-800 flex flex-col justify-between">
              <div>
                <span className="text-[#003366] font-bold tracking-wider text-sm uppercase mb-2 block">
                  {selectedImg.year}
                </span>
                <h3 className="text-2xl font-white font-bold text-white mb-4">
                  {selectedImg.category} Activity
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-6">
                  {selectedImg.alt}. Every picture tells a story of change, hope, and progress.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 w-24">Date:</span> {selectedImg.year}
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300 text-sm border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 w-24">Category:</span> {selectedImg.category}
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300 text-sm border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500 w-24">Location:</span> Bihar, India
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  className="w-full bg-white text-black font-bold py-3 rounded hover:bg-[#003366] hover:text-white transition-colors"
                  onClick={() => setSelectedImg(null)}
                >
                  Close Gallery
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
