// Member Register — the single source of truth for SSF members.
//
// Every member of the organisation is listed here once. The seed reads this
// file and keeps the database in step with it, so the register can never drift
// out of date and can never be overwritten by a stale seed.
//
// HOW TO ADD A MEMBER
//   1. Append a new row below with a fresh `memberId` (SSF-MBR-0NN).
//   2. Deploy / restart the backend. The new person appears automatically.
// Nothing else needs editing. Order of rows does not matter.
//
// NOTE: no Aadhaar, PAN, bank or other sensitive identifiers are kept here.
// The repository is public; those identifiers live only in the offline
// personal Excel / hard registers.
//
// `status`: 'active' | 'inactive' | 'former'
// `memberType`: Founder Member | Executive Member | General Member | ...

const MEMBERS_REGISTER = [
  {
    memberId: 'SSF-MBR-001',
    memberType: 'Founder Member',
    name: 'Ramesh Pandey',
    gender: 'Male',
    guardianName: 'Mr. Babu Lal Pandey',
    designation: 'President',
    mobile: '9718346691',
    email: 'rameshpandey335@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486446',
    joiningDate: '2013-12-30',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-002',
    memberType: 'Founder Member',
    name: 'Divya Sharma',
    gender: 'Female',
    guardianName: 'Mr. Abhimanyu Pandey',
    designation: 'Treasurer',
    mobile: '9827263231',
    email: 'divsharma067@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486446',
    joiningDate: '2013-12-30',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-003',
    memberType: 'Founder Member',
    name: 'Amit Kumar Pandey',
    gender: 'Male',
    guardianName: 'Late. Ramji Pandey',
    designation: 'Secretary',
    mobile: '9009255202',
    email: 'amitp203@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486446',
    joiningDate: '2013-12-30',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-004',
    memberType: 'Founder Member',
    name: 'Kiran Pandey',
    gender: 'Female',
    guardianName: 'Mr. SriRam Pandey',
    designation: 'Joint Secretary',
    mobile: '9993495877',
    email: 'kiranpandey1729@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486005',
    joiningDate: '2013-12-30',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-018',
    memberType: 'Executive Member',
    name: 'Preeti Shukla',
    gender: 'Female',
    guardianName: 'Mr. Deepak Shukla',
    designation: 'Vice President',
    mobile: '8085897964',
    email: 'preetipandeydadar@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486001',
    joiningDate: '2021-04-30',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-019',
    memberType: 'General Member',
    name: 'Rishi Kumar Pandey',
    gender: 'Male',
    guardianName: 'Mr. Ganga Prasad',
    designation: 'Member',
    mobile: '7987707912',
    email: 'rishisatna01@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486117',
    joiningDate: '2025-05-10',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-020',
    memberType: 'General Member',
    name: 'Sandeep Tripathi',
    gender: 'Male',
    guardianName: 'Mr. Indrabhan Tripathi',
    designation: 'Member',
    mobile: '7697851754',
    email: 'tri.sandeep22@gmail.com',
    city: 'Satna', state: 'Madhya Pradesh', pinCode: '485221',
    joiningDate: '2025-05-10',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-021',
    memberType: 'General Member',
    name: 'Prameesh Singh',
    gender: 'Male',
    guardianName: 'Mr. Yogendra Singh',
    designation: 'Member',
    mobile: '9144796001',
    email: 'prameeshs321@gmail.com',
    city: 'Rewa', state: 'Madhya Pradesh', pinCode: '486441',
    joiningDate: '2025-05-10',
    status: 'active',
  },
  {
    memberId: 'SSF-MBR-022',
    memberType: 'General Member',
    name: 'Ritesh Kumar Tiwari',
    gender: 'Male',
    guardianName: 'Mr. Ramchandra Tiwari',
    designation: 'Member',
    mobile: '8422819534',
    email: 'riteshtiwari9082@gmail.com',
    city: 'Bhadohi', state: 'Uttar Pradesh', pinCode: '221303',
    joiningDate: '2025-05-10',
    status: 'active',
  },
];

module.exports = { MEMBERS_REGISTER };
