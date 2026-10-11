// Managing Committee — the single source of truth for the current committee.
//
// Kept deliberately separate from the Member Register: a person is a member of
// the organisation, while the committee is the set of office bearers and
// members who currently hold responsibility. One is not the other, so they are
// stored in two files and can never overwrite each other.
//
// HOW TO CHANGE THE COMMITTEE
//   1. Edit / append a row below (a new person is created in the Master if the
//      name is not already there; an existing person is reused).
//   2. Deploy / restart the backend. The committee is rebuilt to match.
// For a change of term, update TERM and add the new members; former members are
// kept for history automatically (rows you remove are marked 'former', not
// deleted).
//
// `position`: President | Vice President | Secretary | Treasurer |
//             Joint Secretary | Member

const TERM = {
  name: 'Current Managing Committee',
  formedOn: '2025-05-10',
  termStart: '2025-05-10',
  termEnd: '2028-05-09',
  isCurrent: true,
};

const MANAGING_COMMITTEE = [
  { name: 'Ramesh Pandey',       position: 'President',       responsibility: 'Overall leadership & institutional representation' },
  { name: 'Preeti Shukla',       position: 'Vice President',  responsibility: 'Programme oversight & policy review' },
  { name: 'Amit Kumar Pandey',   position: 'Secretary',       responsibility: 'Operations, records & registrar filings' },
  { name: 'Divya Sharma',        position: 'Treasurer',       responsibility: 'Finance, accounts & compliance' },
  { name: 'Kiran Pandey',        position: 'Joint Secretary', responsibility: 'Coordination & documentation' },
  { name: 'Ritesh Kumar Tiwari', position: 'Member',          responsibility: 'General member' },
  { name: 'Rishi Kumar Pandey',  position: 'Member',          responsibility: 'General member' },
  { name: 'Sandeep Tripathi',    position: 'Member',          responsibility: 'General member' },
  { name: 'Prameesh Singh',      position: 'Member',          responsibility: 'General member' },
];

module.exports = { TERM, MANAGING_COMMITTEE };
