// Canonical column set for the Volunteer register import/export template.
// The English part of each label is the import key; the Hindi part is shown to
// the user. Keep this list in step with the ImsVolunteer model fields so a
// downloaded template can be filled and re-imported without renaming anything.
export const VOLUNTEER_TEMPLATE_COLUMNS = [
  { key: 'fullName', en: 'Full Name', hi: 'पूरा नाम', required: true },
  { key: 'fullNameHi', en: 'Name (Hindi)', hi: 'नाम (हिंदी)' },
  { key: 'email', en: 'Email', hi: 'ईमेल' },
  { key: 'mobile', en: 'Mobile Number', hi: 'मोबाइल नंबर' },
  { key: 'gender', en: 'Gender', hi: 'लिंग' },
  { key: 'dob', en: 'Date of Birth', hi: 'जन्म तिथि' },
  { key: 'city', en: 'City / District', hi: 'शहर / ज़िला' },
  { key: 'state', en: 'State', hi: 'राज्य' },
  { key: 'volunteerType', en: 'Volunteer Type', hi: 'स्वयंसेवक प्रकार' },
  { key: 'roleApplied', en: 'Role Applied For', hi: 'आवेदित भूमिका' },
  { key: 'preferredArea', en: 'Preferred Area of Work', hi: 'पसंदीदा कार्यक्षेत्र' },
  { key: 'timeCommitment', en: 'Time per Month', hi: 'प्रति माह समय' },
  { key: 'financiallyIndependent', en: 'Financially Independent', hi: 'आर्थिक रूप से स्वतंत्र' },
  { key: 'experienceCapacity', en: 'Experience / Capacity', hi: 'अनुभव / क्षमता' },
  { key: 'contribution', en: 'Skills / Contribution', hi: 'कौशल / योगदान' },
  { key: 'motivation', en: 'Motivation', hi: 'प्रेरणा' },
  { key: 'fundraisingSupport', en: 'Fundraising / CSR Support', hi: 'निधि / CSR सहयोग' },
  { key: 'availability', en: 'Availability', hi: 'उपलब्धता' },
  { key: 'joinDate', en: 'Join Date', hi: 'जॉइन दिनांक' },
  { key: 'source', en: 'Source', hi: 'स्रोत' },
];

/** A filled example row, so the person filling the template sees the format. */
export const VOLUNTEER_TEMPLATE_SAMPLE = {
  fullName: 'Example Name',
  email: 'example@email.com',
  mobile: '9876543210',
  gender: 'Male',
  dob: '1995-01-31',
  city: 'Lucknow',
  state: 'Uttar Pradesh',
  volunteerType: 'field',
  roleApplied: 'Block Lead',
  preferredArea: 'Rural development',
  timeCommitment: '10 hours',
  financiallyIndependent: 'Yes',
  experienceCapacity: 'Community mobilisation',
  contribution: 'Teaching, fundraising',
  motivation: 'To serve society',
  fundraisingSupport: 'CSR introductions',
  availability: 'Weekends',
  joinDate: '2026-10-04',
  source: 'Leadership - Volunteer & Membership form',
};
