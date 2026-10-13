export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  currency: string;
  currencySymbol: string;
  occupation: string;
  address: string;
  dob: string;
  customerSince: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    biometricEnabled: boolean;
    defaultAccount: string;
    language: string;
    dateFormat: string;
  };
}

export interface MonthlyCashflow {
  income: number;
  expense: number;
}

export interface Account {
  id: string;
  accountNumber: string;
  fullAccountNumber: string;
  type: string;
  category: 'CHECKING' | 'SAVINGS' | 'JOINT' | 'FIXED_DEPOSIT' | 'SALARY';
  availableBalance: number;
  currentBalance: number;
  currency: string;
  ifscCode: string;
  branch: string;
  isPrimary: boolean;
  status: 'ACTIVE' | 'FROZEN' | 'DORMANT' | 'CLOSED';
  openedDate: string;
  interestRate?: number;
  secondaryHolder?: string;
  maturityDate?: string;
  maturityAmount?: number;
  monthlyCashflow?: MonthlyCashflow;
}

export type TransactionType =
  | 'CARD_PAYMENT'
  | 'BANK_TRANSFER'
  | 'SALARY_CREDIT'
  | 'CASH_WITHDRAWAL'
  | 'ATM_DEPOSIT'
  | 'BILL_PAYMENT'
  | 'REFUND'
  | 'INTEREST_CREDIT'
  | 'LOAN_REPAYMENT'
  | 'FEE';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED' | 'REFUNDED';

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  displayDate: string;
  description: string;
  merchant: string;
  category: string;
  type: TransactionType;
  amount: number;
  direction: 'DEBIT' | 'CREDIT';
  status: TransactionStatus;
  referenceNo: string;
  source?: string;
  destination?: string;
  fee: number;
}

export interface CardControls {
  online: boolean;
  international: boolean;
  contactless: boolean;
  atmWithdrawal: boolean;
  dailyLimit: number;
}

export interface BankCard {
  id: string;
  accountId: string;
  type: 'CREDIT' | 'DEBIT' | 'VIRTUAL';
  cardholderName: string;
  maskedNumber: string;
  expiry: string;
  variant: string;
  brand: 'VISA' | 'MASTERCARD' | 'RUPAY';
  status: 'ACTIVE' | 'FROZEN' | 'BLOCKED';
  creditLimit?: number;
  availableCredit?: number;
  outstandingAmount?: number;
  minimumDue?: number;
  dueDate?: string;
  rewardPoints?: number;
  dailyAtmLimit?: number;
  dailyPosLimit?: number;
  controls: CardControls;
}

export interface Beneficiary {
  id: string;
  name: string;
  nickname: string;
  bankName: string;
  accountNumber: string;
  fullAccountNumber: string;
  ifscCode: string;
  transferType: string;
  status: 'VERIFIED' | 'PENDING';
  lastTransferred?: string;
  avatarColor: string;
}

export interface Bill {
  id: string;
  billerName: string;
  category: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'UPCOMING';
  autoPay: boolean;
  icon: string;
}

export interface RepaymentInstallment {
  month: string;
  emi: number;
  principal: number;
  interest: number;
}

export interface Loan {
  id: string;
  type: string;
  status: 'ACTIVE' | 'CLOSED';
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  tenureMonths: number;
  remainingMonths: number;
  emiAmount: number;
  nextDueDate: string;
  repaidPercentage: number;
  repaymentSchedule: RepaymentInstallment[];
}

export interface LoanProduct {
  id: string;
  name: string;
  interestRate: string;
  maxTenure: string;
  maxAmount: string;
  features: string[];
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: string;
  color: string;
}

export interface Budget {
  category: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface BankDocument {
  id: string;
  title: string;
  type: string;
  account: string;
  date: string;
  format: string;
  size: string;
}

export interface BankNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'TRANSACTION' | 'BILL' | 'CARD' | 'SECURITY';
  icon: string;
}

export interface SupportTicketMessage {
  sender: string;
  time: string;
  text: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdDate: string;
  lastUpdate: string;
  messages: SupportTicketMessage[];
}

export interface BankDatabase {
  user: UserProfile;
  accounts: Account[];
  transactions: Transaction[];
  cards: BankCard[];
  beneficiaries: Beneficiary[];
  bills: Bill[];
  loans: Loan[];
  loanProducts: LoanProduct[];
  savingsGoals: SavingsGoal[];
  budgets: Budget[];
  statements: BankDocument[];
  notifications: BankNotification[];
  supportTickets: SupportTicket[];
}
