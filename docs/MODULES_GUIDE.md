# 📖 NovaBank Module & Feature Guide

This guide provides an exhaustive breakdown of all modules, screens, user flows, and interactive features built into NovaBank.

---

## 1. Authentication & Onboarding (`/auth/login`)
- **Branding**: Clean NovaBank navy blue emblem with modern typography.
- **Form Controls**: Customer ID or Email input, masked password field with a **Show/Hide** toggle.
- **Session Control**: "Remember this device for 30 days" checkbox.
- **Demo Mode**: **⚡ Quick Demo Auto-Fill** button pre-fills credentials for **Alex Morgan** (`alex.morgan@novabank.in`) and automatically enters the dashboard.
- **Security Footnote**: Bank-grade TLS encryption badge.

---

## 2. Dashboard & Account Overview (`/dashboard`)
- **Personalized Header**: Dynamic greeting with current date pill and quick transfer/bill payment shortcuts.
- **Net Portfolio Balance**: Displays total sum of all eligible checking and savings accounts (`₹85,450.00 + ₹2,40,000.00 + ...`).
- **Privacy Mask**: Eye toggle button masks or reveals balances with dots (`••••••••`).
- **Metric Cards**:
  - **Monthly Inflow**: Tracks salary credits (`₹85,000.00`).
  - **Monthly Outflow**: Tracks expenditure (`₹42,350.00`).
  - **Credit Due**: Next bill due on credit card (`₹12,450.00`).
- **Account Summary Carousel**: Cards for Checking, High-Yield Savings, Joint, and Fixed Deposits showing masked account numbers, balances, and IFSC codes.
- **Quick Actions**: 5 one-click actions: Send Money, Pay Bill, Add Payee, Manage Cards, and Statements.
- **Recent Financial Activity**: 6 latest credit/debit events with category pills and direction styling.
- **Savings Goals Progress**: Visual progress bars showing completion percentages for active goals.
- **Upcoming Bills Alert**: Quick "Pay Now" actions for pending utilities.

---

## 3. Accounts Module (`/accounts`)
- **Multi-Account Grid**: Displays all checking, savings, and term deposits.
- **Primary Account Tag**: Highlights default account used for debits and bill payments.
- **Account Inspector Panel**: Selecting any account opens an expanded inspector showing:
  - Confidential unmasked account number.
  - Branch location and routing IFSC codes.
  - Available vs. Current ledger balances.
  - Account interest rate.
  - Instant statement download shortcut.

---

## 4. Transactions Ledger (`/transactions`)
- **Filter Bar**:
  - Instant text search across descriptions, merchant names, and reference numbers.
  - Category dropdown filter (Food & Dining, Shopping, Transport, Utilities, etc.).
  - Transaction direction filter (All, Debits Only, Credits Only).
- **Tabular Ledger**: Tabular numeric columns for date, description, category badge, reference ID, status, and colored amount.
- **CSV Data Export**: One-click download generates an official CSV file of the filtered transactions.
- **Digital Receipt Modal**: Clicking "Receipt" on any row opens a branded digital receipt card detailing transaction fees, payment methods, merchant details, and timestamps.

---

## 5. Money Transfers (`/transfers`)
- **3-Step Transfer Wizard**:
  - **Step 1: Input Details**: Source account selector with live balance indicator, quick beneficiary chips with bank logos, numeric amount entry, and optional payment note.
  - **Step 2: Review & Authorization**: Summary of source, destination, fee (₹0), and settlement mode (IMPS). Prompts for a 4-digit security OTP (`1234`).
  - **Step 3: Success Confirmation**: Checkmark badge, success message, generated reference ID (`REF-NB-...`), and an action to perform another transfer.
- **Optimistic State Updates**: Successful transfers automatically reduce the account balance and record a new transaction in the ledger.

---

## 6. Bill Payments & Recharges (`/payments`)
- **Category Filter**: Electricity, Broadband, Water, Mobile Postpaid, and DTH.
- **Biller Directory**: Shows biller names (BESCOM, Airtel Fiber, BWSSB, Jio, Tata Play), consumer IDs, and due dates.
- **Instant Settlement**: Clicking "Pay Now" executes the payment against the primary account, flips the status pill to `PAID`, and logs a new utility transaction.

---

## 7. Card Management (`/cards`)
- **Glossy Payment Cards**: Realistic debit, credit, and virtual cards with metallic gradients, gold chip visuals, masked numbers, cardholder names, and expiry dates.
- **Instant Freeze / Unfreeze**: Disables card operations in real time with an overlay visual badge.
- **Usage Switches**: Toggle checkboxes for Online Transactions, International Usage, and Contactless Tap & Pay.
- **Spending Limit Slider**: Interactive slider adjusting daily online spending caps between ₹5,000 and ₹1,50,000.
- **Credit Line Summary**: Total limit, available credit, and outstanding balance metrics for credit cards.

---

## 8. Loans & Credit Lines (`/loans`)
- **Active Borrowings Card**: Personal loan status, principal, interest rate (10.5%), tenure remaining (24 months), and next installment date.
- **Repayment Amortization Schedule**: Table breaking down principal vs. interest components for upcoming months.
- **Interactive Indicative EMI Calculator**:
  - Principal amount slider (₹50,000 to ₹50,00,000).
  - Tenure slider (1 to 30 years).
  - Interest rate slider (7% to 18%).
  - Real-time monthly EMI calculation output.

---

## 9. Savings Goals & Deposits (`/savings`)
- **Goals Portfolio**: Emergency Fund, Electric SUV, Tokyo Summer Vacation, and Apartment Down Payment.
- **Visual Progress Meters**: Color-coded progress bars with percentage completion and target dates.
- **Add Funds Action**: Top-up funds directly from the checking account.
- **New Goal Creator**: Modal dialog to add custom financial targets with target amounts and completion dates.

---

## 10. Spending & Budgeting (`/budgeting`)
- **Summary Metrics**: Total Monthly Budget (₹73,000), Current Spend (₹56,659), and Monthly Savings Surplus (₹28,341 / 33.3%).
- **Category Utilization Meters**: Housing, Food & Dining, Shopping, Utilities, Transport, Entertainment, and Healthcare with overspending badges.

---

## 11. Beneficiaries Directory (`/beneficiaries`)
- **Payee Cards**: Verified beneficiaries with bank logos (HDFC, ICICI, SBI, NovaBank), masked account numbers, and IFSC codes.
- **Add Beneficiary Wizard**: Modal to register and verify new bank payees.
- **Remove Payee**: Confirmation prompt to delete beneficiaries safely.

---

## 12. Statements & Tax Documents (`/statements`)
- **Document List**: Monthly checking statements, credit card statements, Annual Interest Certificates, and TDS Form 16A certificates.
- **Download Actions**: Direct PDF download actions.

---

## 13. Customer Support Center (`/support`)
- **Emergency Action Cards**: Fast links for reporting lost/stolen cards, disputing charges, and locating branches.
- **Support Ticket Tracker**: Live ticket view with message threads between Alex Morgan and NovaBank customer care representatives.

---

## 14. Profile & Preferences (`/settings`)
- **Customer KYC Profile**: Official customer ID, address, contact details, and verified KYC status.
- **Security Toggles**: Two-Factor Authentication, SMS alerts, and email notifications.
- **Theme Switcher**: Instant toggle between Light and Dark mode.
