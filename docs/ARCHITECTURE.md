# 🏗️ NovaBank Architecture Deep Dive

This document details the software architecture, reactive state management patterns, and mock data engine implemented in the **NovaBank** application.

---

## 1. Architectural Principles

NovaBank is built according to modern enterprise frontend standards:
1. **Frontend-Only Decoupling**: Complete independence from a live backend server through an in-memory JSON mock database engine.
2. **Fine-Grained Reactivity**: Built entirely on Angular Signals rather than complex global state management libraries (such as NgRx or Akita), reducing boilerplate while preserving high reactivity.
3. **Standalone Modularization**: Zero `NgModule` declarations. Every page component is isolated and lazy-loaded on demand.
4. **Optimistic UI Updates**: Transfers, bill payments, and card freeze toggles immediately update the in-memory data store with simulated network latency to test loading skeletons.
5. **Session Continuity**: In-memory state changes automatically synchronize to `sessionStorage` so testing workflows survive browser reloads.

---

## 2. Component Hierarchy & Routing

```text
App (Root)
└── RouterOutlet
    ├── /auth/login -> LoginComponent
    └── / -> ShellComponent (Layout Coordinator)
        ├── SidebarComponent (Sticky Desktop Nav)
        ├── TopbarComponent (Search, Notifications, Theme)
        ├── BottomNavComponent (Mobile Touch Bar)
        └── RouterOutlet (Active Module View)
            ├── /dashboard    -> DashboardComponent
            ├── /accounts     -> AccountsComponent
            ├── /transactions -> TransactionsComponent
            ├── /transfers    -> TransfersComponent
            ├── /payments     -> PaymentsComponent
            ├── /cards        -> CardsComponent
            ├── /loans        -> LoansComponent
            ├── /savings      -> SavingsComponent
            ├── /budgeting    -> BudgetingComponent
            ├── /beneficiaries-> BeneficiariesComponent
            ├── /statements   -> StatementsComponent
            ├── /support      -> SupportComponent
            └── /settings     -> SettingsComponent
```

---

## 3. Reactive State Store (`BankDataService`)

The central nervous system of NovaBank is `BankDataService` (`src/app/core/services/bank-data.service.ts`).

### Signal Store Structure
```typescript
// Core State Signals
readonly database = signal<BankDatabase | null>(null);
readonly isLoading = signal<boolean>(true);
readonly error = signal<string | null>(null);

// Derived Reactive Signals
readonly user = computed<UserProfile | null>(() => this.database()?.user ?? null);
readonly accounts = computed<Account[]>(() => this.database()?.accounts ?? []);
readonly transactions = computed<Transaction[]>(() => this.database()?.transactions ?? []);
readonly cards = computed<BankCard[]>(() => this.database()?.cards ?? []);
readonly beneficiaries = computed<Beneficiary[]>(() => this.database()?.beneficiaries ?? []);
readonly bills = computed<Bill[]>(() => this.database()?.bills ?? []);
readonly loans = computed<Loan[]>(() => this.database()?.loans ?? []);
readonly savingsGoals = computed<SavingsGoal[]>(() => this.database()?.savingsGoals ?? []);
readonly budgets = computed<Budget[]>(() => this.database()?.budgets ?? []);

// Computed Business Logic
readonly totalAvailableBalance = computed<number>(() => {
  return this.accounts().reduce((sum, acc) => sum + (acc.availableBalance || 0), 0);
});

readonly primaryAccount = computed<Account | null>(() => {
  return this.accounts().find(a => a.isPrimary) || this.accounts()[0] || null;
});

readonly unreadNotificationsCount = computed<number>(() => {
  return this.notifications().filter(n => !n.read).length;
});
```

### Simulated REST Endpoints & Mutations
Every mutation returns an `Observable` or updates the signal synchronously:
- `transferMoney(payload)`: Validates available balance $\rightarrow$ deducts from source account $\rightarrow$ generates reference ID (`REF-NB-...`) $\rightarrow$ prepends to `transactions` list $\rightarrow$ persists to `sessionStorage`.
- `toggleCardFreeze(cardId)`: Toggles card between `ACTIVE` and `FROZEN`.
- `payBill(billId, accountId)`: Validates funds $\rightarrow$ deducts balance $\rightarrow$ marks bill status `PAID` $\rightarrow$ records transaction.
- `addBeneficiary(ben)`: Appends newly verified recipient with automatic color avatar generation.
- `createSavingsGoal(goal)`: Inserts target goal into savings portfolio.

---

## 4. Mock Database Schema (`novabank-db.json`)

The mock database is served as a static asset from `public/data/novabank-db.json` and mirrored in TypeScript interfaces in `src/app/core/models/bank.models.ts`.

It includes:
- **User Profile**: Full KYC data, contact details, security settings, preferences.
- **Accounts**: Checking, High-Yield Savings, Joint, Fixed Deposits.
- **Transactions**: 20+ realistic entries spanning multiple merchant categories with debit/credit indicators.
- **Cards**: Credit, Debit, and Virtual cards with spend caps and security toggles.
- **Beneficiaries**: External banks (HDFC, ICICI, SBI) and intra-bank payees.
- **Bills**: Utility billing records with due dates and payment tracking.
- **Loans**: Active borrowings with repayment amortization tables.
- **Savings Goals**: Goal amounts, progress percentages, and target deadlines.
- **Budgets**: Category budget allocation with overspending indicators.
- **Statements**: Official PDF records and tax certificates.
- **Notifications**: Transaction alerts, bill reminders, security notices.
- **Support Tickets**: Message threads with customer service replies.

---

## 5. Stitch MCP Integration Protocol

The application was designed with direct compatibility for Google Stitch MCP tools:
1. **Design System Translation**: Colors, typography, spacing, and elevation were extracted from the Stitch `design.md` specifications.
2. **Screen Adaptation**: UI structures generated by Stitch were decomposed into modular Angular template syntax (`@if`, `@for`, `[style.width.%]`, `[class.active]`).
3. **Data Binding**: Static mock text in Stitch layouts was systematically wired to `BankDataService` signals for full interactivity.
