import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <!-- 1. Personalized Greeting Section -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <div class="greeting-row">
            <h1>Good afternoon, {{ bankData.user()?.name }} 👋</h1>
            <span class="date-badge">{{ currentDate }}</span>
          </div>
          <p class="tagline">Here is your financial summary for today. All systems operating securely.</p>
        </div>

        <div class="banner-actions">
          <a routerLink="/transfers" class="nb-btn nb-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Transfer Money</span>
          </a>
          <a routerLink="/payments" class="nb-btn nb-btn-secondary">
            <span>Pay Bills</span>
          </a>
        </div>
      </section>

      <!-- 2. Financial Metrics Grid -->
      <div class="metrics-grid">
        <!-- Total Net Balance Card -->
        <div class="nb-card total-balance-card">
          <div class="card-header-flex">
            <span class="card-metric-label">TOTAL PORTFOLIO BALANCE</span>
            <button class="mask-toggle-btn" (click)="toggleHideBalance()" [title]="hideBalance() ? 'Show Balance' : 'Hide Balance'">
              @if (hideBalance()) {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              } @else {
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              }
            </button>
          </div>

          <div class="balance-display">
            @if (hideBalance()) {
              <span class="masked-digits">₹ ••••••••</span>
            } @else {
              <span class="currency-symbol">₹</span>
              <span class="balance-amount">{{ bankData.totalAvailableBalance().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
            }
          </div>

          <div class="balance-meta-row">
            <span class="nb-badge nb-badge-success">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              +4.8% vs last month
            </span>
            <span class="last-sync">Synced just now</span>
          </div>
        </div>

        <!-- Monthly Inflow Metric -->
        <div class="nb-card mini-metric-card">
          <div class="mini-metric-icon icon-inflow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </div>
          <div class="mini-metric-content">
            <span class="mini-label">MONTHLY INFLOW</span>
            <span class="mini-value">₹85,000.00</span>
            <span class="mini-subtext">Salary credited on 01/10</span>
          </div>
        </div>

        <!-- Monthly Outflow Metric -->
        <div class="nb-card mini-metric-card">
          <div class="mini-metric-icon icon-outflow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          <div class="mini-metric-content">
            <span class="mini-label">MONTHLY OUTFLOW</span>
            <span class="mini-value">₹42,350.00</span>
            <span class="mini-subtext">49.8% of monthly income</span>
          </div>
        </div>

        <!-- Active Credit Outstanding -->
        <div class="nb-card mini-metric-card">
          <div class="mini-metric-icon icon-credit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div class="mini-metric-content">
            <span class="mini-label">CREDIT DUE</span>
            <span class="mini-value text-gold">₹12,450.00</span>
            <span class="mini-subtext">Due 05 Nov • Min due ₹1,250</span>
          </div>
        </div>
      </div>

      <!-- 3. Account Summary Carousel / Grid -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <h2>Your Accounts</h2>
            <p class="section-desc">Manage your deposit, checking and joint accounts</p>
          </div>
          <a routerLink="/accounts" class="view-all-link">View Details →</a>
        </div>

        <div class="accounts-grid">
          @for (acc of bankData.accounts(); track acc.id) {
            <div class="nb-card nb-card-hover account-summary-card">
              <div class="acc-top">
                <span class="nb-badge" [class.nb-badge-info]="acc.category === 'CHECKING'" [class.nb-badge-success]="acc.category === 'SAVINGS'" [class.nb-badge-warning]="acc.category === 'FIXED_DEPOSIT'">
                  {{ acc.type }}
                </span>
                @if (acc.isPrimary) {
                  <span class="primary-tag">Primary</span>
                }
              </div>

              <div class="acc-number">{{ acc.accountNumber }}</div>

              <div class="acc-balance-block">
                <span class="acc-balance-label">Available Balance</span>
                <div class="acc-balance-val">
                  @if (hideBalance()) {
                    <span>₹ •••••••</span>
                  } @else {
                    <span>₹{{ acc.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</span>
                  }
                </div>
              </div>

              <div class="acc-footer-meta">
                <span>IFSC: {{ acc.ifscCode }}</span>
                <a [routerLink]="['/accounts']" class="acc-quick-view">Manage</a>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- 4. Quick Actions Tray -->
      <section class="section-container">
        <div class="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div class="quick-actions-bar">
          <a routerLink="/transfers" class="qa-item">
            <div class="qa-icon bg-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="17 1 21 5 17 9"></polyline>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                <polyline points="7 23 3 19 7 15"></polyline>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
              </svg>
            </div>
            <span>Send Money</span>
          </a>

          <a routerLink="/payments" class="qa-item">
            <div class="qa-icon bg-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <span>Pay Bill</span>
          </a>

          <a routerLink="/beneficiaries" class="qa-item">
            <div class="qa-icon bg-purple">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <span>Add Payee</span>
          </a>

          <a routerLink="/cards" class="qa-item">
            <div class="qa-icon bg-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <span>Manage Cards</span>
          </a>

          <a routerLink="/statements" class="qa-item">
            <div class="qa-icon bg-sky">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <span>Statements</span>
          </a>
        </div>
      </section>

      <!-- 5. Activity & Analytics Double Column -->
      <div class="dashboard-dual-column">
        <!-- Recent Transactions Column -->
        <div class="nb-card txn-column">
          <div class="dual-col-header">
            <h3>Recent Financial Activity</h3>
            <a routerLink="/transactions" class="view-all-link">All Transactions →</a>
          </div>

          <div class="txn-stream">
            @for (txn of bankData.transactions().slice(0, 6); track txn.id) {
              <div class="txn-row">
                <div class="txn-icon-circle" [class.circle-credit]="txn.direction === 'CREDIT'" [class.circle-debit]="txn.direction === 'DEBIT'">
                  @if (txn.direction === 'CREDIT') {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5"></line>
                      <polyline points="5 12 12 5 19 12"></polyline>
                    </svg>
                  } @else {
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  }
                </div>

                <div class="txn-info">
                  <span class="txn-title">{{ txn.description }}</span>
                  <span class="txn-sub">{{ txn.displayDate }} • {{ txn.category }}</span>
                </div>

                <div class="txn-amount-col">
                  <span class="txn-amount" [class.amount-credit]="txn.direction === 'CREDIT'" [class.amount-debit]="txn.direction === 'DEBIT'">
                    {{ txn.direction === 'CREDIT' ? '+' : '-' }}₹{{ txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}
                  </span>
                  <span class="txn-status-badge">{{ txn.status }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Savings Goals & Upcoming Bills Column -->
        <div class="right-stack-column">
          <!-- Savings Goals Progress -->
          <div class="nb-card stack-card">
            <div class="dual-col-header">
              <h3>Savings Goals Progress</h3>
              <a routerLink="/savings" class="view-all-link">Manage Goals →</a>
            </div>

            <div class="goals-list">
              @for (goal of bankData.savingsGoals().slice(0, 3); track goal.id) {
                <div class="goal-item">
                  <div class="goal-header-row">
                    <span class="goal-name">{{ goal.title }}</span>
                    <span class="goal-progress-text">₹{{ goal.currentAmount.toLocaleString('en-IN') }} / ₹{{ goal.targetAmount.toLocaleString('en-IN') }}</span>
                  </div>
                  <div class="goal-bar-bg">
                    <div class="goal-bar-fill" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100" [style.background-color]="goal.color"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Upcoming Bills Alert Card -->
          <div class="nb-card stack-card">
            <div class="dual-col-header">
              <h3>Upcoming Due Bills</h3>
              <a routerLink="/payments" class="view-all-link">Pay All →</a>
            </div>

            <div class="bills-list">
              @for (bill of bankData.bills().slice(0, 3); track bill.id) {
                <div class="bill-row">
                  <div class="bill-details">
                    <span class="bill-title">{{ bill.billerName }}</span>
                    <span class="bill-due">Due: {{ bill.dueDate }}</span>
                  </div>
                  <div class="bill-action-col">
                    <span class="bill-amount">₹{{ bill.amount.toLocaleString('en-IN') }}</span>
                    <button class="nb-btn nb-btn-sm nb-btn-outline" (click)="paySingleBill(bill.id)">Pay Now</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
      padding: 1.5rem 1.75rem;
      background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
    }

    .greeting-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .greeting-row h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .date-badge {
      background-color: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .tagline {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .banner-actions {
      display: flex;
      gap: 0.75rem;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1fr;
      gap: 1.25rem;
    }

    @media (max-width: 1200px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .total-balance-card {
      background: linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-surface-elevated) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-metric-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-faint);
    }

    .mask-toggle-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.25rem;
    }

    .balance-display {
      margin: 0.75rem 0;
      display: flex;
      align-items: baseline;
      gap: 0.375rem;
    }

    .currency-symbol {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--brand-blue);
    }

    .balance-amount {
      font-size: 2.125rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text-main);
    }

    .masked-digits {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-faint);
      letter-spacing: 0.1em;
    }

    .balance-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .last-sync {
      font-size: 0.6875rem;
      color: var(--text-faint);
    }

    .mini-metric-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mini-metric-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-inflow {
      background-color: var(--brand-mint-subtle);
      color: var(--brand-mint);
    }

    .icon-outflow {
      background-color: var(--brand-blue-subtle);
      color: var(--brand-blue);
    }

    .icon-credit {
      background-color: var(--brand-gold-subtle);
      color: var(--brand-gold);
    }

    .mini-metric-content {
      display: flex;
      flex-direction: column;
    }

    .mini-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--text-faint);
    }

    .mini-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      margin: 0.125rem 0;
    }

    .text-gold {
      color: var(--brand-gold);
    }

    .mini-subtext {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    /* Section Container */
    .section-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-header h2 {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .section-desc {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.125rem;
    }

    .view-all-link {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--brand-blue);
      text-decoration: none;
    }

    /* Accounts Grid */
    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .account-summary-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .acc-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .primary-tag {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--brand-blue);
      background-color: var(--brand-blue-subtle);
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .acc-number {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-family: monospace;
      letter-spacing: 0.05em;
    }

    .acc-balance-block {
      display: flex;
      flex-direction: column;
    }

    .acc-balance-label {
      font-size: 0.6875rem;
      color: var(--text-faint);
    }

    .acc-balance-val {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .acc-footer-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
      margin-top: 0.25rem;
    }

    .acc-quick-view {
      color: var(--brand-blue);
      font-weight: 600;
    }

    /* Quick Actions Bar */
    .quick-actions-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1rem;
    }

    .qa-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.625rem;
      padding: 1.125rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-main);
      transition: all 0.2s ease;
      text-align: center;
    }

    .qa-item:hover {
      border-color: var(--border-medium);
      box-shadow: var(--shadow-sm);
      transform: translateY(-2px);
    }

    .qa-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .bg-emerald { background: linear-gradient(135deg, #10b981, #059669); }
    .bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
    .bg-amber { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .bg-sky { background: linear-gradient(135deg, #0284c7, #0369a1); }

    /* Dual Column Layout */
    .dashboard-dual-column {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.25rem;
    }

    @media (max-width: 1024px) {
      .dashboard-dual-column {
        grid-template-columns: 1fr;
      }
    }

    .dual-col-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .dual-col-header h3 {
      font-size: 1rem;
      font-weight: 700;
    }

    .txn-stream {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .txn-row {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.625rem 0.25rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .txn-row:last-child {
      border-bottom: none;
    }

    .txn-icon-circle {
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .circle-credit {
      background-color: var(--brand-mint-subtle);
      color: var(--brand-mint);
    }

    .circle-debit {
      background-color: var(--bg-surface-subtle);
      color: var(--text-muted);
    }

    .txn-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .txn-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .txn-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .txn-amount-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .txn-amount {
      font-size: 0.9375rem;
      font-weight: 700;
    }

    .amount-credit { color: var(--brand-mint); }
    .amount-debit { color: var(--text-main); }

    .txn-status-badge {
      font-size: 0.625rem;
      font-weight: 700;
      color: var(--text-faint);
    }

    /* Stack Column */
    .right-stack-column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .goals-list, .bills-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .goal-item {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .goal-header-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
    }

    .goal-name {
      font-weight: 600;
      color: var(--text-main);
    }

    .goal-progress-text {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .goal-bar-bg {
      height: 8px;
      background-color: var(--bg-surface-subtle);
      border-radius: 9999px;
      overflow: hidden;
    }

    .goal-bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .bill-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }

    .bill-row:last-child {
      border-bottom: none;
    }

    .bill-details {
      display: flex;
      flex-direction: column;
    }

    .bill-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .bill-due {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .bill-action-col {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .bill-amount {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-main);
    }
  `]
})
export class DashboardComponent {
  bankData = inject(BankDataService);
  hideBalance = signal(false);

  currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  toggleHideBalance(): void {
    this.hideBalance.update(v => !v);
  }

  paySingleBill(billId: string): void {
    const primary = this.bankData.primaryAccount();
    if (primary) {
      this.bankData.payBill(billId, primary.id).subscribe();
    }
  }
}
