// Single source of truth for team data
// Each member object: { id, name, role, location, img, group, visible }

export const teamMembers = [
  // Governing Body
  { id: 'g1', name: 'Mr. Ramesh Pandey', role: 'Founder & National President', location: 'Rewa, Madhya Pradesh', img: '/Teams_Images/ramesh_pandey.jpg', group: 'governing', visible: true },
  { id: 'g2', name: 'Ms. Preeti Shukla', role: 'Vice President', location: 'Rewa, Madhya Pradesh', img: '/Teams_Images/image_19.jpg', group: 'governing', visible: true },
  { id: 'g3', name: 'Mr. Amit Pandey', role: 'General Secretary', location: 'Rewa, Madhya Pradesh', img: '/Teams_Images/image_15.jpg', group: 'governing', visible: true },
  { id: 'g4', name: 'Ms. Divya Sharma', role: 'Treasurer', location: 'Rewa, Madhya Pradesh', img: '/Teams_Images/divya_sharma.jpg', group: 'governing', visible: true },
  { id: 'g5', name: 'Ms. Kiran Pandey', role: 'Joint Secretary', location: 'Rewa, Madhya Pradesh', img: '/Teams_Images/image_22.jpg', group: 'governing', visible: true },

  // Management
  { id: 'm1', name: 'Ms. Priya Shukla', role: 'Admin Support & Core Volunteer', location: 'Madhya Pradesh', img: '/Teams_Images/priya_shukla.jpg', group: 'management', visible: true },

  // Regional Leadership (many removed — set visible: false for inactive/old)
  { id: 'r1', name: 'Mr. Azad Singh Adhana', role: 'Regional Head & Operations', location: 'Greater Noida, Uttar Pradesh', img: '/Teams_Images/azad_singh.jpg', group: 'regional', visible: false },
  { id: 'r2', name: 'Mr. Naresh Kumar', role: 'President, Faridabad Wing', location: 'Faridabad, Haryana', img: '/Teams_Images/naresh_kumar.jpg', group: 'regional', visible: false },
  { id: 'r3', name: 'Mr. Dhiraj Kumar', role: 'President, Pune Wing', location: 'Pune, Maharashtra', img: '/Teams_Images/image_4.png', group: 'regional', visible: false },
  { id: 'r4', name: 'Mr. Surender Mishra', role: 'President, Uttar Pradesh Wing', location: 'Greater Noida, Uttar Pradesh', img: '/Teams_Images/surender_mishra.jpg', group: 'regional', visible: false },

  // Advisory Board
  { id: 'a1', name: 'Mr. Kapil Tiwari', role: 'Legal Advisor', location: 'Madhya Pradesh', img: '/Teams_Images/kapil_tiwari.jpg', group: 'advisory', visible: true },
  { id: 'a2', name: 'Mr. Harish Kumar', role: 'Legal Advisor', location: 'Madhya Pradesh', img: '/Teams_Images/harish_kumar.jpg', group: 'advisory', visible: true },
  { id: 'a3', name: 'Mr. Raji P. Alex', role: 'National Advisory', location: 'Delhi NCR', img: '/Teams_Images/raji_p_alex.jpg', group: 'advisory', visible: false },
  { id: 'a4', name: 'Ms. Amrita Sinha', role: 'Coordination Officer', location: 'Delhi', img: '/Teams_Images/image_20.jpg', group: 'advisory', visible: false },
  { id: 'a5', name: 'Mr. Ghanshyam Sharma', role: 'National Advisor', location: 'Gautam Buddha Nagar, UP', img: '/Teams_Images/ghanshyam_sharma.jpg', group: 'advisory', visible: false },
  { id: 'a6', name: 'Mr. Chaman Rajora', role: 'Support & Advisory', location: 'Haryana', img: '/Teams_Images/chaman_rajora.jpg', group: 'advisory', visible: true },

  // Volunteers
  { id: 'v1', name: 'Mr. Rajeev Pandey', role: 'Advisor & Volunteer', location: 'Madhya Pradesh', img: '/Teams_Images/rajeev_pandey.jpg', group: 'volunteer', visible: true },
  { id: 'v2', name: 'Ms. A. Gincy George', role: 'Head, Counselling Services', location: 'Mumbai, Maharashtra', img: '/Teams_Images/image_1.jpg', group: 'volunteer', visible: true },
  { id: 'v3', name: 'Ms. Aayushi Tyagi', role: 'Volunteer', location: 'Ghaziabad, Uttar Pradesh', img: '/Teams_Images/aayushi_tyagi.jpg', group: 'volunteer', visible: false },
  { id: 'v4', name: 'Mr. Krishna Kumar', role: 'Volunteer & Advisor', location: 'Hyderabad, Telangana', img: '/Teams_Images/krishna_kumar.jpg', group: 'volunteer', visible: true },
  { id: 'v5', name: 'Ms. Sneha Ravishankar Pandey', role: 'Web & Technical Support Volunteer', location: 'Mumbai, Maharashtra', img: '/Teams_Images/sneha_ravishankar_pandey.jpg', group: 'volunteer', visible: true },
  { id: 'v6', name: 'Ms. Vaishnavi Manik Chaudhari', role: 'Web & Technical Support Volunteer', location: 'Mumbai, Maharashtra', img: '/Teams_Images/vaishnavi_manik_chaudhari.jpg', group: 'volunteer', visible: true },
];

export default teamMembers;
