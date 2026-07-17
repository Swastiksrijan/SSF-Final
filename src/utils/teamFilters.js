export const REMOVED_TEAM_MEMBER_NAMES = new Set([
  "Ms. Aayushi Tyagi",
  "Mr. Raji P. Alex",
  "Ms. Amrita Sinha",
  "Mr. Ghanshyam Sharma",
  "Mr. Surender Mishra",
  "Mr. Azad Singh Adhana",
  "Mr. Naresh Kumar",
  "Mr. Dhiraj Kumar",
]);

export const visibleTeamMembers = (members) =>
  members.filter((member) => member && !REMOVED_TEAM_MEMBER_NAMES.has(member.name));
