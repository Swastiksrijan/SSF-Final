// SSF Managing Committee History — real records ported from the SSF Digital Office
// production database (module: officeHistory). Same-to-same bilingual data.
// Regenerate only if the source office data changes.

const OFFICE_HISTORY = [
  {
    "recordId": "SSF-REC-20260924-00040",
    "recordDate": "2026-09-24",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00015",
      "fullName": "SANDEEP TRIPATHI",
      "eventDate": "2026-09-24",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में सदस्य के रूप में शामिल।",
      "remarks": "Current Committe"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00018",
    "recordDate": "2026-09-24",
    "recordType": "Role Change / Transfer",
    "data": {
      "memberId": "SSF-MBR-00005",
      "fullName": "DHEERAJ TIWARI",
      "eventDate": "2026-09-24",
      "changeType": "Role Change / Transfer",
      "previousRole": "NA",
      "newRole": "उपाध्यक्ष ",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "कोषाध्यक्ष पद से उपाध्यक्ष पद के रूप में पद परिवर्तन। ",
      "remarks": "Approx. 2016–17; exact date NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00043",
    "recordDate": "2025-05-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00018",
      "fullName": "RITESH KUMAR TIWARI",
      "eventDate": "2025-05-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-25",
      "details": "नई समिति में सदस्य के रूप में शामिल।",
      "remarks": "Current Committee"
    }
  },
  {
    "recordId": "SSF-REC-20260929-00048",
    "recordDate": "2025-05-10",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00016",
      "fullName": "Prameesh Singh",
      "eventDate": "2025-05-10",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Member",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Managing Committee appointment",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00045",
    "recordDate": "2025-05-10",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00018",
      "fullName": "Ritesh Kumar Tiwari",
      "eventDate": "2025-05-10",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Member",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Managing Committee appointment",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260924-00042",
    "recordDate": "2025-05-10",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00017",
      "fullName": "RISHI KUMAR PANDEY",
      "eventDate": "2025-05-10",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-25",
      "details": "नई समिति में सदस्य के रूप में शामिल।",
      "remarks": "Current Committee"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00041",
    "recordDate": "2025-05-10",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00016",
      "fullName": "PRAMEESH SINGH",
      "eventDate": "2025-05-10",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में सदस्य के रूप में शामिल।",
      "remarks": "Current Committee"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00039",
    "recordDate": "2025-05-10",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00004",
      "fullName": "KIRAN PANDEY",
      "eventDate": "2025-05-10",
      "changeType": "Re-appointment",
      "previousRole": "Joint Secretary",
      "newRole": "Joint Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में सह सचिव पद पर जारी रहे।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00038",
    "recordDate": "2025-05-10",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00003",
      "fullName": "DIVYA SHARMA",
      "eventDate": "2025-05-10",
      "changeType": "Re-appointment",
      "previousRole": "Treasurer",
      "newRole": "Treasurer",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में कोषाध्यक्ष पद पर जारी रहीं।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00037",
    "recordDate": "2025-05-10",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "AMIT KUMAR PANDEY",
      "eventDate": "2025-05-10",
      "changeType": "Re-appointment",
      "previousRole": "Secretary",
      "newRole": "Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में सचिव पद पर जारी रहे।",
      "remarks": "Name recorded as Amit Kumar Pandey"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00036",
    "recordDate": "2025-05-10",
    "recordType": "Role Change / Transfer",
    "data": {
      "memberId": "SSF-MBR-00014",
      "fullName": "PREETI SHUKLA",
      "eventDate": "2025-05-10",
      "changeType": "Role Change / Transfer",
      "previousRole": "Member",
      "newRole": "Vice President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई समिति में उपाध्यक्ष पद पर नियुक्त।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00035",
    "recordDate": "2025-05-10",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00001",
      "fullName": "RAMESH PANDEY",
      "eventDate": "2025-05-10",
      "changeType": "Re-appointment",
      "previousRole": "President",
      "newRole": "President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": "नई प्रबंधकारिणी समिति में अध्यक्ष के रूप में जारी रहे।",
      "remarks": "Current President"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00013",
    "recordDate": "2025-05-10",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00017",
      "fullName": "Rishi Pandey",
      "eventDate": "2025-05-10",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2025-05-10",
      "details": " संबंधित प्रारंभिक प्रबंधकारिणी समिति का ऐतिहासिक पद रिकॉर्ड।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00034",
    "recordDate": "2021-04-30",
    "recordType": "Removal",
    "data": {
      "memberId": "SSF-MBR-00006",
      "fullName": "PRIYA PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Removal",
      "previousRole": "Member",
      "newRole": "NA",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "2021-04-30",
      "details": "30-04-2021 की नई समिति में शामिल नहीं रहीं। Exact cessation/removal date अभी verify करनी है।",
      "remarks": "Date to be verified"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00033",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00007",
      "fullName": "KAMLA PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Member",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में सदस्य के रूप में जारी रहीं।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00032",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00012",
      "fullName": "DHARMENDRA PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Member",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "समिति में सदस्य के रूप में जारी रहे।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00031",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00013",
      "fullName": "MUKESH SINGH",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Member",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में सदस्य के रूप में जारी रहे।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00030",
    "recordDate": "2021-04-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00014",
      "fullName": "PREETI SHUKLA",
      "eventDate": "2021-04-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में सदस्य के रूप में शामिल।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00029",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00004",
      "fullName": "KIRAN PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Joint Secretary",
      "newRole": "Joint Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "नई समिति में सह सचिव पद पर जारी रहे।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00028",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00003",
      "fullName": "DIVYA SHARMA",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Treasurer",
      "newRole": "Treasurer",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में कोषाध्यक्ष पद पर जारी रहीं।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00027",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "AMIT KUMAR PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "appointment Secretary",
      "newRole": "appointment Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में सचिव पद पर जारी रहे।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00026",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00005",
      "fullName": "DHEERAJ TIWARI",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "Vice President",
      "newRole": "Vice President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई समिति में उपाध्यक्ष पद पर नियुक्त।",
      "remarks": "NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00025",
    "recordDate": "2021-04-30",
    "recordType": "Re-appointment",
    "data": {
      "memberId": "SSF-MBR-00001",
      "fullName": "RAMESH PANDEY",
      "eventDate": "2021-04-30",
      "changeType": "Re-appointment",
      "previousRole": "President",
      "newRole": "President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2021-04-30",
      "details": "नई प्रबंधकारिणी समिति के गठन में अध्यक्ष के रूप में जारी रहे।",
      "remarks": "President continued"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00024",
    "recordDate": "2019-04-30",
    "recordType": "Role Change / Transfer",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "AMIT KUMAR PANDEY",
      "eventDate": "2019-04-30",
      "changeType": "Role Change / Transfer",
      "previousRole": "Vice President",
      "newRole": "Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "उपाध्यक्ष पद से सचिव पद पर पद परिवर्तन।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00023",
    "recordDate": "2019-04-30",
    "recordType": "Role Change / Transfer",
    "data": {
      "memberId": "SSF-MBR-00003",
      "fullName": "DIVYA SHARMA",
      "eventDate": "2019-04-30",
      "changeType": "Role Change / Transfer",
      "previousRole": "Secretary",
      "newRole": "Treasurer",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "सचिव पद से कोषाध्यक्ष पद पर पद परिवर्तन।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00022",
    "recordDate": "2019-04-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00013",
      "fullName": "MUKESH SINGH",
      "eventDate": "2019-04-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति में सदस्य के रूप में शामिल।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00021",
    "recordDate": "2019-04-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00012",
      "fullName": "DHARMENDRA PANDEY",
      "eventDate": "2019-04-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति में सदस्य के रूप में शामिल।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00020",
    "recordDate": "2019-04-30",
    "recordType": "Removal",
    "data": {
      "memberId": "SSF-MBR-00011",
      "fullName": "RAM ONKAR SHARMA",
      "eventDate": "2019-04-30",
      "changeType": "Removal",
      "previousRole": "Treasurer",
      "newRole": "NA",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "कोषाध्यक्ष/समिति पद से हटाया गया। Exact date बाद में verify करनी है।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00019",
    "recordDate": "2019-04-30",
    "recordType": "Removal",
    "data": {
      "memberId": "SSF-MBR-00010",
      "fullName": "MANKAMNA PRASAD MISHRA",
      "eventDate": "2019-04-30",
      "changeType": "Removal",
      "previousRole": "Member",
      "newRole": "NA",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति से हटाया गया। Exact date बाद में verify करनी है।",
      "remarks": "Approx. 2018–20"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00017",
    "recordDate": "2016-04-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00011",
      "fullName": "RAM ONKAR SHARMA",
      "eventDate": "2016-04-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Treasurer",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "कोषाध्यक्ष के रूप में नियुक्त।",
      "remarks": "Approx. 2016–17; exact date NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00016",
    "recordDate": "2016-04-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00010",
      "fullName": "MANKAMNA PRASAD MISHRA",
      "eventDate": "2016-04-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति में सदस्य के रूप में शामिल।",
      "remarks": "Approx. 2016–17; exact date NA"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00015",
    "recordDate": "2016-04-30",
    "recordType": "Removal",
    "data": {
      "memberId": "SSF-MBR-00008",
      "fullName": "MOHAN NAT",
      "eventDate": "2016-04-30",
      "changeType": "Removal",
      "previousRole": "Member",
      "newRole": "NA",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति/सदस्यता से हटाया गया। Exact date बाद में verify करनी है।",
      "remarks": "Approx. 2016–17"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00014",
    "recordDate": "2016-04-30",
    "recordType": "Removal",
    "data": {
      "memberId": "SSF-MBR-00009",
      "fullName": "BHOORA KOL",
      "eventDate": "2016-04-30",
      "changeType": "Removal",
      "previousRole": "Member",
      "newRole": "NA",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "",
      "details": "समिति/सदस्यता से हटाया गया। Exact date बाद में verify करनी है।",
      "remarks": "Approx. 2016–17"
    }
  },
  {
    "recordId": "SSF-REC-20260929-00047",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "Amit Kumar Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00046",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "Amit Kumar Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00044",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "Amit Kumar Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00043",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00004",
      "fullName": "Kiran Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Joint Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00042",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00001",
      "fullName": "Ramesh Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "President",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260929-00041",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00004",
      "fullName": "Kiran Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "",
      "newRole": "Joint Secretary",
      "referenceNo": "",
      "resolutionNo": "",
      "meetingDate": "",
      "details": "Founder / Constitution of the Society",
      "remarks": "Recovered baseline governance history; can be corrected or supplemented with formal records."
    }
  },
  {
    "recordId": "SSF-REC-20260924-00012",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00009",
      "fullName": "Bhoora Kol",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00011",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00008",
      "fullName": "Mohan Nat",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00010",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00007",
      "fullName": "Kamla Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00009",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00006",
      "fullName": "Priya Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Member",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00008",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00005",
      "fullName": "Dheeraj Tiwari",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Treasurer",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00007",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00004",
      "fullName": "Kiran Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Joint Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00006",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00003",
      "fullName": "Divya Sharma",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Secretary",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00005",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00002",
      "fullName": "Amit Kumar Pandey",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "Vice President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "मूल प्रबंधकारिणी समिति"
    }
  },
  {
    "recordId": "SSF-REC-20260924-00004",
    "recordDate": "2013-12-30",
    "recordType": "Appointment",
    "data": {
      "memberId": "SSF-MBR-00001",
      "fullName": "RAMESH PANDEY",
      "eventDate": "2013-12-30",
      "changeType": "Appointment",
      "previousRole": "NA",
      "newRole": "President",
      "referenceNo": "NA",
      "resolutionNo": "NA",
      "meetingDate": "2013-12-30",
      "details": "संस्था की स्थापना से संबंधित प्रारंभिक पद इतिहास।",
      "remarks": "Founder Member; संस्था के गठन के समय अध्यक्ष"
    }
  }
];

module.exports = { OFFICE_HISTORY };
