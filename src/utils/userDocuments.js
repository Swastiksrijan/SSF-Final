const getSession = () => {
  try { return JSON.parse(localStorage.getItem('ssf_user_session') || 'null'); } catch { return null; }
};

export const getUserRoleSummary = () => {
  const user = getSession();
  const type = String(user?.memberType || '').toLowerCase();
  return {
    user,
    isMember: type === 'member' || type === 'general' || Boolean(user?.memberId || user?.certId),
    isVolunteer: type.includes('volunteer'),
    isIntern: type.includes('intern'),
    isDonor: type.includes('donor'),
    isPartner: type.includes('partner') || type.includes('csr'),
  };
};

export const roleDocuments = [
  { key: 'memberId', title: 'Member ID Card', subtitle: 'Official membership identity', icon: '🪪' },
  { key: 'memberCertificate', title: 'Membership Certificate', subtitle: 'Issued after membership approval', icon: '🏅' },
  { key: 'volunteerId', title: 'Volunteer ID Card', subtitle: 'Official volunteer identity', icon: '🤝' },
  { key: 'volunteerCertificate', title: 'Volunteer Certificate', subtitle: 'Recognition of verified service', icon: '🏆' },
  { key: 'donorReceipt', title: 'Donation Receipt', subtitle: 'Official contribution record', icon: '🧾' },
  { key: 'donorCertificate', title: 'Donor Appreciation Certificate', subtitle: 'Where applicable', icon: '💚' },
  { key: 'internId', title: 'Intern ID Card', subtitle: 'Official internship identity', icon: '🎓' },
  { key: 'internshipLetter', title: 'Internship Letter', subtitle: 'Engagement / joining letter', icon: '📄' },
  { key: 'internshipCertificate', title: 'Internship Certificate', subtitle: 'Issued on successful completion', icon: '📜' },
  { key: 'partnerCertificate', title: 'Partnership Acknowledgement', subtitle: 'For approved institutional partners', icon: '🏢' },
];
