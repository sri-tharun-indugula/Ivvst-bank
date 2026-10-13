<div align="center">

# 🏦 NovaBank — Modern Digital Banking Web Application

[![Angular](https://img.shields.io/badge/Angular-19%20%7C%2020-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Signals](https://img.shields.io/badge/Reactivity-Angular%20Signals-FF5722?style=for-the-badge&logo=html5&logoColor=white)](https://angular.dev/guide/signals)
[![Design](https://img.shields.io/badge/Design-Stitch%20MCP%20Engine-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://stitch.googleapis.com)
[![Status](https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge)](http://localhost:4200)

**NovaBank** is a production-grade, highly responsive digital banking platform engineered as a frontend-first single page application. Powered by **Angular Standalone Components**, **Signals**, and an in-memory **JSON Mock REST Database**, NovaBank simulates full institutional banking workflows: multi-account management, instant funds transfers, live transaction auditing, card freeze controls, and smart financial budgeting.

[Explore Architecture](docs/ARCHITECTURE.md) • [Module Deep Dive](docs/MODULES_GUIDE.md) • [Design System](docs/DESIGN_SYSTEM.md) • [Run Locally](#-quick-start)

---

</div>

## 📸 Visual Showcase & Screens

### 1. Main Dashboard & Portfolio Overview
The command center featuring real-time net-worth balance toggling, recent financial audits, incoming/outgoing flow indicators, and quick-action shortcuts.

<div align="center">
  <img src="docs/images/dashboard-stitch.png" alt="NovaBank Dashboard" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

### 2. Multi-Account Management & Inspector
Manage multiple financial instruments: Checking Accounts, High-Yield Savings, Joint Portfolios, and Term Deposits with dedicated statement downloads and branch IFSC metadata.

<div align="center">
  <img src="docs/images/accounts-stitch.png" alt="NovaBank Accounts" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

### 3. Financial Transactions & Audit Ledger
Real-time filterable transaction table with category pills, debit/credit indicators, instant CSV export, and granular transaction receipt modals.

<div align="center">
  <img src="docs/images/transactions-stitch.png" alt="NovaBank Transactions" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

### 4. Money Transfers & Beneficiary Routing
3-step secure fund transfer wizard supporting IMPS, NEFT, and Intra-bank settlements with 4-digit security OTP authentication and balance validation.

<div align="center">
  <img src="docs/images/transfers-stitch.png" alt="NovaBank Transfers" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

### 5. Card Management & Spending Controls
Glossy metallic payment cards with instant freeze/unfreeze toggles, contactless rules, online e-commerce permissions, and daily transaction cap adjustments.

<div align="center">
  <img src="docs/images/cards-showcase.png" alt="NovaBank Cards" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
</div>

<br/>

### 6. Dedicated Mobile Banking Experience
Fully optimized mobile experience with a thumb-friendly bottom navigation bar, quick transfer avatars, and swipeable balance cards.

<div align="center">
  <img src="docs/images/mobile-showcase.png" alt="NovaBank Mobile Experience" width="60%" style="border-radius: 16px; box-shadow: 0 15px 35px rgba(0,0,0,0.25);" />
</div>

---

## ⚡ Core Feature Highlights

| Module | Features & Capabilities |
| :--- | :--- |
| **Authentication & Onboarding** | Welcome sign-in portal, show/hide password toggle, remember-me session persistence, quick one-click demo login (`alex.morgan@novabank.in`). |
| **Account Overview** | Checking (`₹85,450.00`), High-Yield Savings (`₹2,40,000.00`), Joint Household (`₹1,15,000.00`), and Fixed Term Deposit (`₹5,00,000.00`). Balance visibility privacy mask. |
| **Transactions Ledger** | Real-time search by merchant/reference ID, category filtering (Food, Shopping, Utilities, Salary, etc.), date sorting, CSV export, and printable receipt modals. |
| **Money Movement** | 3-Step transfer stepper (Account $\rightarrow$ Beneficiary $\rightarrow$ Amount $\rightarrow$ OTP Review $\rightarrow$ Receipt) with balance checks and optimistic state mutation. |
| **Beneficiaries** | Directory of verified payees across HDFC, ICICI, SBI, and NovaBank with custom avatars, nickname tagging, and deletion review. |
| **Bills & Utilities** | Multi-category biller directory (Electricity, Water, Broadband, Mobile, DTH) with one-click bill payment and auto-pay indicators. |
| **Cards & Security** | Platinum Credit Card, Signature Debit Card, and Virtual SafePay Card. Real-time Freeze/Unfreeze, toggle online/international/contactless payments, and slider limit caps. |
| **Loans & Credit** | Active Personal Loan tracking, repayment schedule breakdown, and an interactive **Indicative EMI Calculator** with amount, tenure, and rate sliders. |
| **Savings Goals** | Visual financial targets (Emergency Fund, Electric SUV, Tokyo Trip) with progress meters, monthly contribution SIP reminders, and top-up funds actions. |
| **Budgeting & Spend** | Category spending utilization meters, monthly cash-flow health checks, and overspending warning flags. |
| **Documents & Statements**| Official e-statements (PDF format), Annual Interest Certificates, and TDS Form 16A download center. |
| **Customer Support**| 24x7 ticket management center, interactive message thread, dispute transaction routing, and emergency lost card assistance. |
| **Profile & Settings** | KYC profile management, light/dark theme switcher, 2FA biometric preferences, and global search modal (`Ctrl+K`). |

---

## 🏗️ Technical Architecture

NovaBank is built on a clean, scalable single-page architecture that completely decouples the frontend from backend servers while providing full reactive state and offline persistence.

```mermaid
flowchart TD
    subgraph UI Layer
        Shell[Shell Component] --> Sidebar[Desktop Sidebar]
        Shell --> Topbar[Global Topbar + Search + Notifs]
        Shell --> BottomNav[Mobile Bottom Bar]
        Shell --> Outlet[Router Outlet / Module Views]
    end

    subgraph Reactive State Layer
        Outlet --> BDS[BankDataService (Angular Signals)]
        BDS --> UserSignal[user Signal]
        BDS --> AccountsSignal[accounts Signal]
        BDS --> TxnsSignal[transactions Signal]
        BDS --> CardsSignal[cards Signal]
        BDS --> TotalBalance[computed: totalAvailableBalance]
    end

    subgraph Mock Data & Storage
        BDS -->|Initial GET| DB[public/data/novabank-db.json]
        BDS -->|Optimistic Sync| SS[Browser sessionStorage]
    end
```

### 1. Angular Standalone Components & Signals
- **Zero NgModules**: All components (`DashboardComponent`, `AccountsComponent`, `TransfersComponent`, etc.) are standalone, reducing bundle sizes and enabling granular lazy-loading via Angular Router's `loadComponent()`.
- **Signal-Based Reactivity**: Core data structures are managed through Angular Signals (`signal()`, `computed()`), providing instantaneous UI updates when funds are transferred or cards are frozen without unnecessary CD cycles.

### 2. Central JSON Mock Database (`novabank-db.json`)
All backend entities are stored in [`public/data/novabank-db.json`](file:///c:/Users/sindu/OneDrive/Desktop/practice/Ivvst%20bank/public/data/novabank-db.json). On startup, [`BankDataService`](file:///c:/Users/sindu/OneDrive/Desktop/practice/Ivvst%20bank/src/app/core/services/bank-data.service.ts) queries the endpoint and synchronizes state with `sessionStorage` so your transfers and actions persist across page refreshes during prototype demonstrations.

### 3. Google Stitch MCP Engine Integration
All screen layouts and design tokens follow the **Nova Precision** design system generated and managed via the Stitch Model Context Protocol (`mcp_config.json`), ensuring consistent 8px/16px/24px roundedness, WCAG AA/AAA color contrast, and fintech aesthetics.

---

## 🎨 Design System & Branding

- **Brand Name**: NovaBank
- **Tagline**: Banking made simpler.
- **Palette**:
  - **Primary Navy**: `#0D2137` / `#0F172A`
  - **Royal Blue**: `#2563EB`
  - **Mint / Teal Accent**: `#10B981` / `#0D9488`
  - **Surface Canvas**: `#F8FAFC` (Light) / `#080D1A` (Dark)
  - **Card Surface**: `#FFFFFF` (Light) / `#0F172A` (Dark)
- **Typography**: Inter (Google Fonts) with tabular figures for absolute column alignment in financial ledgers.
- **Elevation**: Flat base, crisp 1px borders (`#E2E8F0`), and soft ambient shadows (`0 4px 6px -1px rgba(...)`).

---

## 📁 Project Directory Structure

```text
├── docs/                                  # Showcase documentation & assets
│   ├── images/                            # High-resolution screenshots
│   ├── ARCHITECTURE.md                    # Technical architecture deep dive
│   ├── MODULES_GUIDE.md                   # Complete module & feature guide
│   └── DESIGN_SYSTEM.md                   # Tokens, palettes & typography
├── public/
│   └── data/
│       └── novabank-db.json               # Central mock banking database
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/                    # bank.models.ts (TypeScript interfaces)
│   │   │   └── services/                  # bank-data.service.ts, theme.service.ts, auth.service.ts
│   │   ├── layout/
│   │   │   ├── sidebar/                   # Persistent left navigation
│   │   │   ├── topbar/                    # Global header with search & alerts
│   │   │   ├── bottom-nav/                # Mobile navigation bar
│   │   │   └── shell/                     # Layout coordinator & drawer
│   │   ├── modules/
│   │   │   ├── auth/                      # Login & authentication view
│   │   │   ├── dashboard/                 # Primary overview & metrics
│   │   │   ├── accounts/                  # Multi-account grid & detail
│   │   │   ├── transactions/              # Audit ledger, filters & CSV
│   │   │   ├── transfers/                 # 3-Step fund transfer wizard
│   │   │   ├── payments/                  # Utility bills & recharges
│   │   │   ├── cards/                     # Card controls & freeze actions
│   │   │   ├── loans/                     # Active loans & EMI calculator
│   │   │   ├── savings/                   # Goals progress & deposits
│   │   │   ├── budgeting/                 # Spend utilization & analytics
│   │   │   ├── beneficiaries/             # Payee directory management
│   │   │   ├── statements/                # Official PDF statement downloads
│   │   │   ├── support/                   # Help center & ticketing
│   │   │   └── settings/                  # User profile & preferences
│   │   ├── app.config.ts                  # HttpClient & view transitions
│   │   └── app.routes.ts                  # Lazy-loaded route table
│   ├── index.html                         # Typography & SEO metadata
│   └── styles.css                         # Design system tokens & utility classes
├── mcp_config.json                        # Stitch MCP Server Configuration
└── package.json                           # Dependencies & run scripts
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.x or later (v24.x recommended)
- **npm**: v9.x or later

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/novabank.git
   cd novabank
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to [http://localhost:4200](http://localhost:4200) to view the live application.

5. **Demo Credentials**:
   - **User**: Alex Morgan
   - **Email**: `alex.morgan@novabank.in`
   - **Password**: Any password or click **⚡ Quick Demo Auto-Fill** on the login page.

---

## 📄 License & Attribution

This project is created for portfolio showcase and educational purposes. Designed and architected using Google Antigravity & the Stitch Model Context Protocol. Fictional bank data is modeled for realistic demonstration only.
