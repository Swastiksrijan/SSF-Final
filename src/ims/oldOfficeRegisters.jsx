// Verbatim replication of every remaining old Digital Office register that
// lived in a standalone component under src/components/. Each register is
// rendered unchanged; only the legacy data contract is wired to the IMS API.
import { useParams } from '@tanstack/react-router';
import ImsLayout from './ImsLayout';
import { useOfficeRows } from './oldOfficeCore';

import SahyogRegister from '../components/SahyogRegister';
import PettyCashRegister from '../components/PettyCashRegister';
import GrantRegister from '../components/GrantRegister';
import TransferRegister from '../components/TransferRegister';
import AdjustmentRegister from '../components/AdjustmentRegister';
import FundMaster from '../components/FundMaster';
import ChartOfAccounts from '../components/ChartOfAccounts';
import FYMaster from '../components/FYMaster';
import { FinanceDashboard, FinanceStatements, IntegrityCheck } from '../components/FinanceOffice';
import { FinanceTransactions, FinanceLedger, FinanceIntegrity, FinanceAudit } from '../components/FinanceOps';
import { AuditedStatements, AuditObservations, StatutoryRegistrations, TaxReturns } from '../components/AuditComplianceRegisters';
import { DepreciationSchedule, CorpusFund, FundClassification, ProcurementRegister, PayrollRegister, HonorariumRegister, FundUtilisation } from '../components/AssetsFundsRegisters';
import {
  FcraRegister, Donor80GRegister, ComplianceCalendar, LegalCaseRegister, PropertyLeaseRegister,
  RelatedPartyRegister, LicenceRegister, AgmMinutesRegister, EcMinutesRegister, ResolutionRegister,
  DelegationRegister, PolicyRegister, MemberRegisterGovernance, OfficeBearerRegister, DonorMasterRegister,
  GrantAgreementRegister, UtilisationCertificateRegister, DonorReportingCalendar, ForeignDonorRegister,
  SegregationOfDuties, MakerCheckerRegister, AccessLogRegister, WhistleblowerRegister, RiskRegister,
} from '../components/Tier5Registers';
import {
  IncomeExpenditure, BalanceSheet, TrialBalance, CorpusDonation, InKindRegister, CsrFund, InterestIncome,
  EventIncome, AnonymousDonation, FundWiseIncome, PledgeRegister, PaymentVoucher, RentRegister,
  ProgrammeExpense, TravelRegister, AdvanceRegister, CapitalExpenditure, BankCharges, SecurityDeposit,
  CreditorsRegister, DebtorsRegister, ReserveFund, ContingentLiability, PhysicalVerification, InsuranceRegister,
  BankAccountMaster, ChequeIssue, ChequeBook, SignatoryAuthority, FdReceipt, BudgetRevision, CashFlow,
  Variance, InternalAudit, ManagementResponse, EmployeeMaster, Attendance, VolunteerIntern,
  ReimbursementAdvance, PartyMaster, CostCentre, DocumentIndex,
} from '../components/Tier6Registers';

// module key (as used by the IMS API + nav) -> { component, navKey }
const REGISTERS = {
  chartOfAccounts: { C: ChartOfAccounts, nav: 'chart_of_accounts' },
  fundMaster: { C: FundMaster, nav: 'funds' },
  fyMaster: { C: FYMaster, nav: 'financialYears' },
  sahyog: { C: SahyogRegister, nav: 'sahyog' },
  pettyCash: { C: PettyCashRegister, nav: 'petty_cash' },
  grant: { C: GrantRegister, nav: 'grants' },
  transfer: { C: TransferRegister, nav: 'transfer' },
  adjustment: { C: AdjustmentRegister, nav: 'adjustment' },
  auditedStatements: { C: AuditedStatements, nav: 'audited_statements' },
  auditObservations: { C: AuditObservations, nav: 'audit_observations' },
  statutoryRegistrations: { C: StatutoryRegistrations, nav: 'statutory_registrations' },
  taxReturns: { C: TaxReturns, nav: 'tax_returns' },
  depreciation: { C: DepreciationSchedule, nav: 'depreciation' },
  corpusFund: { C: CorpusFund, nav: 'corpus_fund' },
  fundClassification: { C: FundClassification, nav: 'fund_classification' },
  procurement: { C: ProcurementRegister, nav: 'procurement' },
  payroll: { C: PayrollRegister, nav: 'payroll' },
  honorarium: { C: HonorariumRegister, nav: 'honorarium' },
  fundUtilisation: { C: FundUtilisation, nav: 'fund_utilisation' },
  fcra: { C: FcraRegister, nav: 'fcra' },
  complianceCalendar: { C: ComplianceCalendar, nav: 'compliance_calendar' },
  legalCase: { C: LegalCaseRegister, nav: 'legal_case' },
  propertyLease: { C: PropertyLeaseRegister, nav: 'property_lease' },
  relatedParty: { C: RelatedPartyRegister, nav: 'related_party' },
  licence: { C: LicenceRegister, nav: 'licence' },
  agmMinutes: { C: AgmMinutesRegister, nav: 'agm_minutes' },
  ecMinutes: { C: EcMinutesRegister, nav: 'ec_minutes' },
  resolution: { C: ResolutionRegister, nav: 'resolution' },
  delegation: { C: DelegationRegister, nav: 'delegation' },
  policy: { C: PolicyRegister, nav: 'policy' },
  memberRegister: { C: MemberRegisterGovernance, nav: 'member_register' },
  officeBearer: { C: OfficeBearerRegister, nav: 'office_bearer' },
  donorMaster: { C: DonorMasterRegister, nav: 'donor_master' },
  grantAgreement: { C: GrantAgreementRegister, nav: 'grant_agreement' },
  utilisationCertificate: { C: UtilisationCertificateRegister, nav: 'utilisation_certificate' },
  donorReporting: { C: DonorReportingCalendar, nav: 'donor_reporting' },
  foreignDonor: { C: ForeignDonorRegister, nav: 'foreign_donor' },
  segregationOfDuties: { C: SegregationOfDuties, nav: 'segregation_of_duties' },
  makerChecker: { C: MakerCheckerRegister, nav: 'maker_checker' },
  accessLog: { C: AccessLogRegister, nav: 'access_log' },
  whistleblower: { C: WhistleblowerRegister, nav: 'whistleblower' },
  risk: { C: RiskRegister, nav: 'risk' },
  incomeExpenditure: { C: IncomeExpenditure, nav: 'income_expenditure' },
  balanceSheet: { C: BalanceSheet, nav: 'balance_sheet' },
  trialBalance: { C: TrialBalance, nav: 'trial_balance' },
  corpusDonation: { C: CorpusDonation, nav: 'corpus_donation' },
  inKind: { C: InKindRegister, nav: 'in_kind' },
  csrFund: { C: CsrFund, nav: 'csr_fund' },
  interestIncome: { C: InterestIncome, nav: 'interest_income' },
  eventIncome: { C: EventIncome, nav: 'event_income' },
  anonymousDonation: { C: AnonymousDonation, nav: 'anonymous_donation' },
  fundWiseIncome: { C: FundWiseIncome, nav: 'fund_wise_income' },
  pledge: { C: PledgeRegister, nav: 'pledge' },
  paymentVoucher: { C: PaymentVoucher, nav: 'payment_voucher' },
  rent: { C: RentRegister, nav: 'rent' },
  programmeExpense: { C: ProgrammeExpense, nav: 'programme_expense' },
  travel: { C: TravelRegister, nav: 'travel' },
  advance: { C: AdvanceRegister, nav: 'advance' },
  capitalExpenditure: { C: CapitalExpenditure, nav: 'capital_expenditure' },
  bankCharges: { C: BankCharges, nav: 'bank_charges' },
  securityDeposit: { C: SecurityDeposit, nav: 'security_deposit' },
  creditors: { C: CreditorsRegister, nav: 'creditors' },
  debtors: { C: DebtorsRegister, nav: 'debtors' },
  reserveFund: { C: ReserveFund, nav: 'reserve_fund' },
  contingentLiability: { C: ContingentLiability, nav: 'contingent_liability' },
  physicalVerification: { C: PhysicalVerification, nav: 'physical_verification' },
  insurance: { C: InsuranceRegister, nav: 'insurance' },
  bankAccountMaster: { C: BankAccountMaster, nav: 'bank_account_master' },
  chequeIssue: { C: ChequeIssue, nav: 'cheque_issue' },
  chequeBook: { C: ChequeBook, nav: 'cheque_book' },
  signatoryAuthority: { C: SignatoryAuthority, nav: 'signatory_authority' },
  fdReceipt: { C: FdReceipt, nav: 'fd_receipt' },
  budgetRevision: { C: BudgetRevision, nav: 'budget_revision' },
  cashFlow: { C: CashFlow, nav: 'cash_flow' },
  variance: { C: Variance, nav: 'variance' },
  internalAudit: { C: InternalAudit, nav: 'internal_audit' },
  managementResponse: { C: ManagementResponse, nav: 'management_response' },
  employeeMaster: { C: EmployeeMaster, nav: 'employee_master' },
  attendance: { C: Attendance, nav: 'attendance' },
  volunteerIntern: { C: VolunteerIntern, nav: 'volunteer_intern' },
  reimbursementAdvance: { C: ReimbursementAdvance, nav: 'reimbursement_advance' },
  partyMaster: { C: PartyMaster, nav: 'party_master' },
  costCentre: { C: CostCentre, nav: 'cost_centre' },
  documentIndex: { C: DocumentIndex, nav: 'document_index' },
};

// Finance-only screens that read live data with a token (no rows contract).
const FINANCE_SCREENS = {
  finDashboard: { C: FinanceDashboard, nav: 'finance_dashboard', token: false },
  finStatements: { C: FinanceStatements, nav: 'finance_dashboard', token: false },
  finTransactions: { C: FinanceTransactions, nav: 'finance_dashboard', token: true },
  finLedger: { C: FinanceLedger, nav: 'ledger_journal', token: true },
  finIntegrity: { C: FinanceIntegrity, nav: 'integrity', token: true },
  finAudit: { C: FinanceAudit, nav: 'audit_risk', token: true },
  integrity: { C: IntegrityCheck, nav: 'integrity', token: false },
};

const FY = '2025-26';
const token = () => localStorage.getItem('ssf_admin_token') || '';

function Shell({ active, children }){
  return <ImsLayout active={active}><div className="min-w-0">{children}</div></ImsLayout>;
}

function LegacyRegister({ module }){
  const def = REGISTERS[module];
  const { rows, add, archive, restore, loading, reload } = useOfficeRows(module);
  const C = def.C;
  return <Shell active={def.nav}><C rows={rows} add={add} archive={archive} restore={restore} loading={loading} reload={reload}/></Shell>;
}

function LegacyFinance({ module }){
  const def = FINANCE_SCREENS[module];
  const C = def.C;
  return <Shell active={def.nav}><C fy={FY} token={token()}/></Shell>;
}

export function ImsLegacyRegister(){
  const { module } = useParams({ from: '/ims/legacy/$module' });
  if(REGISTERS[module]) return <LegacyRegister module={module}/>;
  if(FINANCE_SCREENS[module]) return <LegacyFinance module={module}/>;
  return <Shell active="main_dashboard"><div className="bg-white border rounded-2xl p-8"><h2 className="text-2xl font-black text-[#002344]">Section not found</h2><p className="text-zinc-500 mt-2">Unknown legacy module: {module}</p></div></Shell>;
}
