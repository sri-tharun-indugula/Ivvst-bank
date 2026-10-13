import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDataService } from '../../core/services/bank-data.service';
import { Account } from '../../core/models/bank.models';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Accounts Overview</h1>
          <p class="subtitle">Review and manage your deposit, checking, savings and term deposits</p>
        </div>
        <button class="nb-btn nb-btn-primary" (click)="openOpenAccountModal.set(true)">
          + Open New Account
        </button>
      </div>

      <!-- Accounts Grid -->
      <div class="accounts-grid">
        @for (acc of bankData.accounts(); track acc.id) {
          <div class="nb-card nb-card-hover account-card" [class.selected]="selectedAccount()?.id === acc.id" (click)="selectAccount(acc)">
            <div class="card-top">
              <span class="nb-badge" [class.nb-badge-info]="acc.category === 'CHECKING'" [class.nb-badge-success]="acc.category === 'SAVINGS'" [class.nb-badge-warning]="acc.category === 'FIXED_DEPOSIT'">
                {{ acc.type }}
              </span>
              @if (acc.isPrimary) {
                <span class="primary-badge">PRIMARY</span>
              }
            </div>

            <div class="account-num-row">
              <span class="acc-num">{{ acc.accountNumber }}</span>
              <span class="status-pill">{{ acc.status }}</span>
            </div>

            <div class="balance-meta">
              <span class="label">Available Balance</span>
              <span class="val">₹{{ acc.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</span>
            </div>

            <div class="acc-details-list">
              <div class="detail-row">
                <span>Branch:</span>
                <strong>{{ acc.branch }}</strong>
              </div>
              <div class="detail-row">
                <span>IFSC Code:</span>
                <strong>{{ acc.ifscCode }}</strong>
              </div>
              <div class="detail-row">
                <span>Opened On:</span>
                <strong>{{ acc.openedDate }}</strong>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Account Detail Inspector -->
      @if (selectedAccount(); as acc) {
        <div class="nb-card detail-inspector">
          <div class="inspector-header">
            <div>
              <h3>Account Details: {{ acc.type }}</h3>
              <p class="acc-full-no">Full Account Number: <strong>{{ acc.fullAccountNumber }}</strong> (Confidential)</p>
            </div>
            <div class="inspector-actions">
              <button class="nb-btn nb-btn-secondary" (click)="downloadAccountStatement(acc.id)">Download Statement</button>
              <button class="nb-btn nb-btn-outline">Manage Limits</button>
            </div>
          </div>

          <div class="stat-boxes">
            <div class="stat-box">
              <span class="stat-label">Available Balance</span>
              <span class="stat-val text-brand">₹{{ acc.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Current Ledger Balance</span>
              <span class="stat-val">₹{{ acc.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">Interest Rate</span>
              <span class="stat-val">{{ acc.interestRate || '3.0' }}% p.a.</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .account-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.2s ease;
    }

    .account-card.selected {
      border-color: var(--brand-blue);
      box-shadow: 0 0 0 2px var(--brand-blue-subtle);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .primary-badge {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--brand-blue);
      background-color: var(--brand-blue-subtle);
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .account-num-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .acc-num {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      font-family: monospace;
    }

    .status-pill {
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--brand-mint);
      background: var(--brand-mint-subtle);
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
    }

    .balance-meta {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .acc-details-list {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
      font-size: 0.8125rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
    }

    .detail-row strong {
      color: var(--text-main);
    }

    .detail-inspector {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-subtle) 100%);
    }

    .inspector-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .acc-full-no {
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .inspector-actions {
      display: flex;
      gap: 0.75rem;
    }

    .stat-boxes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-box {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .stat-val {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .text-brand {
      color: var(--brand-blue);
    }
  `]
})
export class AccountsComponent {
  bankData = inject(BankDataService);
  selectedAccount = signal<Account | null>(null);
  openOpenAccountModal = signal(false);

  constructor() {
    const accs = this.bankData.accounts();
    if (accs.length > 0) {
      this.selectedAccount.set(accs[0]);
    }
  }

  selectAccount(acc: Account): void {
    this.selectedAccount.set(acc);
  }

  downloadAccountStatement(accId: string): void {
    alert(`Downloading statement for account ${accId}...`);
  }
}
