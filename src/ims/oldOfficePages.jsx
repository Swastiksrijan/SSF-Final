// SSF-IMS pages that render the verbatim old Digital Office components inside
// the IMS layout. Each page wires the legacy data contract (rows + add /
// updateRecord / archive / restore / summary) to the ported component so the
// screens behave exactly like the old SSF Digital Office.
import { useNavigate } from '@tanstack/react-router';
import ImsLayout from './ImsLayout';
import { useOfficeRows, exportRows, exportExcel, exportPdf } from './oldOfficeCore';
import {
  Dashboard, MeetingsHub, MembersRegister, ManagingCommittee,
  MembershipContributions, NotificationsHub, Reports, Audit, Users,
  OfficialDocuments, AppointmentLetters, DonorSlips, SeparationManagement,
  DownloadCenter,
} from './oldOfficeComponents';
import { BankBook, CashBook } from './oldOfficeFinance';
import AdminLearningCertificates from '../components/AdminLearningCertificates';

const token = () => localStorage.getItem('ssf_admin_token') || '';

function Shell({ active, children }){
  return <ImsLayout active={active}><div className="min-w-0">{children}</div></ImsLayout>;
}

function Loading(){ return <div className="p-10 text-center text-slate-500">Loading…</div>; }

export function ImsDashboardLegacy(){
  const { summary, loading } = useOfficeRows('dashboard');
  return <Shell active="main_dashboard">{loading&&!summary ? <Loading/> : <Dashboard summary={summary}/>}</Shell>;
}

export function ImsMeetingsLegacy(){
  const { rows, add, archive, restore, updateRecord } = useOfficeRows('meetings');
  return <Shell active="meetings"><MeetingsHub token={token()} rows={rows} add={add} archive={archive} restore={restore} updateRecord={updateRecord}/></Shell>;
}

export function ImsMembersLegacy(){
  const { rows, add, archive, updateRecord } = useOfficeRows('members');
  return <Shell active="members"><MembersRegister rows={rows} add={add} archive={archive} updateRecord={updateRecord}/></Shell>;
}

export function ImsManagingCommitteeLegacy(){
  const { rows, add, archive, updateRecord } = useOfficeRows('managingCommittee');
  return <Shell active="managing_committee"><ManagingCommittee rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token()} loaded/></Shell>;
}

export function ImsMembershipContributionsLegacy(){
  const { rows, add, archive } = useOfficeRows('membershipContributions');
  return <Shell active="membership_contributions"><MembershipContributions rows={rows} add={add} archive={archive}/></Shell>;
}

export function ImsNotificationsLegacy(){
  const { rows, add, archive, updateRecord } = useOfficeRows('notifications');
  return <Shell active="notifications"><NotificationsHub rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token()}/></Shell>;
}

export function ImsReportsLegacy(){
  return <Shell active="reports"><Reports token={token()} exportRows={exportRows} exportPdf={exportPdf}/></Shell>;
}

export function ImsAuditLegacy(){
  return <Shell active="audit_trail"><Audit token={token()}/></Shell>;
}

export function ImsUsersLegacy(){
  const { add } = useOfficeRows('users');
  return <Shell active="users"><Users add={add}/></Shell>;
}

export function ImsOfficialDocumentsLegacy(){
  const { rows, add } = useOfficeRows('officialDocuments');
  return <Shell active="official_documents"><OfficialDocuments rows={rows} add={add}/></Shell>;
}

export function ImsAppointmentLettersLegacy(){
  const { rows, add } = useOfficeRows('appointmentLetters');
  return <Shell active="appointment_letters"><AppointmentLetters rows={rows} add={add}/></Shell>;
}

export function ImsDonorSlipsLegacy(){
  const { rows, add } = useOfficeRows('donorSlips');
  return <Shell active="donor_slips"><DonorSlips rows={rows} add={add}/></Shell>;
}

export function ImsSeparationsLegacy(){
  const { rows, add } = useOfficeRows('separations');
  return <Shell active="separations"><SeparationManagement rows={rows} add={add}/></Shell>;
}

export function ImsDownloadCenterLegacy(){
  const navigate = useNavigate();
  const { rows } = useOfficeRows('documents');
  const setActive = (id) => { if(id) navigate({ to: '/ims/r/$resource', params: { resource: id } }).catch(()=>{}); };
  return <Shell active="download_center"><DownloadCenter active="documents" rows={rows} exportRows={exportRows} exportExcel={exportExcel} exportPdf={exportPdf} setActive={setActive} token={token()}/></Shell>;
}

export function ImsBankBookLegacy(){
  const { rows, add, archive, updateRecord, reload } = useOfficeRows('bank');
  return <Shell active="bank_accounts"><BankBook rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token()} reload={reload}/></Shell>;
}

export function ImsCashBookLegacy(){
  const { rows, add, archive, updateRecord, reload } = useOfficeRows('cash');
  return <Shell active="cash_accounts"><CashBook rows={rows} add={add} archive={archive} updateRecord={updateRecord} token={token()} reload={reload}/></Shell>;
}

// Certificate requests raised from the Learning Hub. The old office rendered the
// dedicated AdminLearningCertificates screen; the inline LearningCertificates
// copy inside SSFDigitalOffice.jsx was dead code and is not ported.
export function ImsLearningCertificatesLegacy(){
  return <Shell active="learning_certificates"><AdminLearningCertificates token={token()}/></Shell>;
}
