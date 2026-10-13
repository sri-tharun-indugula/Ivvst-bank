import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Transfer Funds</h1>
          <p class="subtitle">Fast, secure domestic bank transfers with IMPS, NEFT and Intra-Bank routing</p>
        </div>
      </div>

      <div class="transfer-layout">
        <!-- Transfer Form Card -->
        <div class="nb-card transfer-card">
          <!-- Stepper Indicator -->
          <div class="stepper">
            <div class="step" [class.active]="step() === 1" [class.completed]="step() > 1">
              <span class="step-num">1</span>
              <span class="step-label">Details</span>
            </div>
            <div class="step-divider"></div>
            <div class="step" [class.active]="step() === 2" [class.completed]="step() > 2">
              <span class="step-num">2</span>
              <span class="step-label">Review</span>
            </div>
            <div class="step-divider"></div>
            <div class="step" [class.active]="step() === 3">
              <span class="step-num">3</span>
              <span class="step-label">Confirmation</span>
            </div>
          </div>

          <!-- Step 1: Input Details -->
          @if (step() === 1) {
            <form (ngSubmit)="goToReview()" class="transfer-form">
              <!-- Source Account -->
              <div class="nb-input-group">
                <label class="nb-label">From Account</label>
                <select class="nb-input" [(ngModel)]="fromAccountId" name="fromAccount" required>
                  @for (acc of bankData.accounts(); track acc.id) {
                    <option [value]="acc.id">
                      {{ acc.type }} ({{ acc.accountNumber }}) — ₹{{ acc.availableBalance.toLocaleString('en-IN') }}
                    </option>
                  }
                </select>
              </div>

              <!-- Beneficiary Selection -->
              <div class="nb-input-group">
                <label class="nb-label">Select Beneficiary</label>
                <div class="beneficiary-chips">
                  @for (ben of bankData.beneficiaries(); track ben.id) {
                    <div
                      class="ben-chip"
                      [class.selected]="selectedBeneficiaryId === ben.id"
                      (click)="selectBeneficiary(ben.id)"
                    >
                      <div class="chip-avatar" [style.background-color]="ben.avatarColor">
                        {{ ben.name.charAt(0) }}
                      </div>
                      <div class="chip-info">
                        <span class="chip-name">{{ ben.name }}</span>
                        <span class="chip-bank">{{ ben.bankName }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Amount Input -->
              <div class="nb-input-group">
                <label class="nb-label">Amount (₹)</label>
                <div class="amount-input-box">
                  <span class="currency-prefix">₹</span>
                  <input
                    type="number"
                    class="nb-input amount-field"
                    placeholder="0.00"
                    [(ngModel)]="amount"
                    name="amount"
                    min="1"
                    required
                  />
                </div>
                @if (selectedAccountBalance(); as bal) {
                  <span class="helper-text">Available: ₹{{ bal.toLocaleString('en-IN') }}</span>
                }
              </div>

              <!-- Note -->
              <div class="nb-input-group">
                <label class="nb-label">Payment Purpose / Note (Optional)</label>
                <input
                  type="text"
                  class="nb-input"
                  placeholder="e.g. Rent, Freelance invoice, Family support"
                  [(ngModel)]="note"
                  name="note"
                />
              </div>

              @if (errorMessage()) {
                <div class="error-banner">{{ errorMessage() }}</div>
              }

              <button type="submit" class="nb-btn nb-btn-primary full-width" [disabled]="!canProceedStep1()">
                Continue to Review →
              </button>
            </form>
          }

          <!-- Step 2: Review & OTP -->
          @if (step() === 2) {
            <div class="review-pane">
              <h3>Confirm Transfer Details</h3>
              <p class="review-sub">Please verify recipient information before authorization.</p>

              <div class="review-summary-card">
                <div class="sum-row">
                  <span>Transfer Amount</span>
                  <strong class="text-large text-brand">₹{{ amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</strong>
                </div>
                <div class="sum-row">
                  <span>From</span>
                  <span>{{ getAccountLabel(fromAccountId) }}</span>
                </div>
                <div class="sum-row">
                  <span>To Beneficiary</span>
                  <span>{{ getBeneficiaryName(selectedBeneficiaryId) }}</span>
                </div>
                <div class="sum-row">
                  <span>Transfer Mode</span>
                  <span>IMPS (Instant Settlement)</span>
                </div>
                <div class="sum-row">
                  <span>Transfer Fee</span>
                  <span>₹0.00 (Free)</span>
                </div>
              </div>

              <div class="otp-box">
                <label class="nb-label">Enter 4-digit Security OTP</label>
                <p class="otp-sub">Sent to your registered mobile (•••• ••210)</p>
                <input
                  type="text"
                  class="nb-input otp-field"
                  maxlength="4"
                  [(ngModel)]="otpCode"
                  placeholder="1234"
                />
              </div>

              <div class="action-buttons-row">
                <button class="nb-btn nb-btn-secondary" (click)="step.set(1)">Back</button>
                <button
                  class="nb-btn nb-btn-primary flex-1"
                  [disabled]="otpCode.length < 4 || isTransferring()"
                  (click)="executeTransfer()"
                >
                  {{ isTransferring() ? 'Authorizing...' : 'Authorize & Pay' }}
                </button>
              </div>
            </div>
          }

          <!-- Step 3: Success Screen -->
          @if (step() === 3) {
            <div class="success-pane">
              <div class="success-icon-badge">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2>Transfer Successful!</h2>
              <p class="success-desc">
                ₹{{ amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }} has been transferred to {{ getBeneficiaryName(selectedBeneficiaryId) }}.
              </p>

              <div class="ref-badge-box">
                <span>Reference Number:</span>
                <strong>{{ lastReferenceNo() }}</strong>
              </div>

              <div class="success-actions">
                <button class="nb-btn nb-btn-primary full-width" (click)="resetForm()">Make Another Transfer</button>
              </div>
            </div>
          }
        </div>

        <!-- Quick Help & Saved Payees Sidebar -->
        <div class="transfer-sidebar">
          <div class="nb-card info-card">
            <h4>Transfer Guidelines</h4>
            <ul class="guideline-list">
              <li><strong>IMPS:</strong> 24x7 instant transfers up to ₹5,00,000.</li>
              <li><strong>NEFT:</strong> Hourly settlement batches on banking days.</li>
              <li><strong>Zero Charges:</strong> No fee for digital NovaBank transfers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .transfer-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .transfer-layout {
        grid-template-columns: 1fr;
      }
    }

    .transfer-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 1.25rem;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-faint);
    }

    .step.active {
      color: var(--brand-blue);
      font-weight: 600;
    }

    .step.completed {
      color: var(--brand-mint);
    }

    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: var(--bg-surface-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
    }

    .step.active .step-num {
      background: var(--brand-blue);
      color: #ffffff;
    }

    .step.completed .step-num {
      background: var(--brand-mint);
      color: #ffffff;
    }

    .step-label {
      font-size: 0.8125rem;
    }

    .step-divider {
      flex: 1;
      height: 2px;
      background: var(--border-subtle);
      margin: 0 0.75rem;
    }

    .transfer-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .beneficiary-chips {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .ben-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .ben-chip:hover {
      border-color: var(--border-medium);
      background-color: var(--bg-surface-subtle);
    }

    .ben-chip.selected {
      border-color: var(--brand-blue);
      background-color: var(--brand-blue-subtle);
    }

    .chip-avatar {
      width: 30px;
      height: 30px;
      border-radius: 9999px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .chip-info {
      display: flex;
      flex-direction: column;
    }

    .chip-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .chip-bank {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    .amount-input-box {
      display: flex;
      align-items: center;
      position: relative;
    }

    .currency-prefix {
      position: absolute;
      left: 1rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-muted);
    }

    .amount-field {
      padding-left: 2.25rem;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .helper-text {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .error-banner {
      background: var(--brand-rose-subtle);
      color: var(--brand-rose);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
    }

    .full-width {
      width: 100%;
    }

    .flex-1 {
      flex: 1;
    }

    /* Review & OTP */
    .review-pane {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .review-sub {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .review-summary-card {
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .sum-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .text-large { font-size: 1.375rem; }
    .text-brand { color: var(--brand-blue); }

    .otp-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      padding: 1rem;
    }

    .otp-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .otp-field {
      width: 160px;
      text-align: center;
      font-size: 1.5rem;
      letter-spacing: 0.5em;
      font-weight: 700;
    }

    .action-buttons-row {
      display: flex;
      gap: 1rem;
    }

    /* Success Pane */
    .success-pane {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
      padding: 2rem 1rem;
    }

    .success-icon-badge {
      width: 64px;
      height: 64px;
      border-radius: 9999px;
      background: var(--brand-mint-subtle);
      color: var(--brand-mint);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ref-badge-box {
      background: var(--bg-surface-subtle);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      display: flex;
      gap: 0.5rem;
    }

    .guideline-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-top: 0.75rem;
    }
  `]
})
export class TransfersComponent {
  bankData = inject(BankDataService);

  step = signal(1);
  fromAccountId = 'ACC-1001';
  selectedBeneficiaryId = 'BEN-101';
  amount = 1500;
  note = '';
  otpCode = '1234';
  errorMessage = signal('');
  isTransferring = signal(false);
  lastReferenceNo = signal('');

  selectedAccountBalance(): number {
    const acc = this.bankData.accounts().find(a => a.id === this.fromAccountId);
    return acc ? acc.availableBalance : 0;
  }

  selectBeneficiary(benId: string): void {
    this.selectedBeneficiaryId = benId;
  }

  canProceedStep1(): boolean {
    return this.amount > 0 && this.amount <= this.selectedAccountBalance() && !!this.selectedBeneficiaryId;
  }

  goToReview(): void {
    if (this.amount > this.selectedAccountBalance()) {
      this.errorMessage.set('Amount exceeds available account balance.');
      return;
    }
    this.errorMessage.set('');
    this.step.set(2);
  }

  getAccountLabel(accId: string): string {
    const a = this.bankData.accounts().find(acc => acc.id === accId);
    return a ? `${a.type} (${a.accountNumber})` : accId;
  }

  getBeneficiaryName(benId: string): string {
    const b = this.bankData.beneficiaries().find(ben => ben.id === benId);
    return b ? `${b.name} (${b.bankName})` : benId;
  }

  executeTransfer(): void {
    this.isTransferring.set(true);
    const ben = this.bankData.beneficiaries().find(b => b.id === this.selectedBeneficiaryId);

    setTimeout(() => {
      this.bankData.transferMoney({
        fromAccountId: this.fromAccountId,
        toBeneficiaryId: this.selectedBeneficiaryId,
        recipientName: ben ? ben.name : 'Beneficiary',
        amount: this.amount,
        note: this.note
      }).subscribe(res => {
        this.isTransferring.set(false);
        if (res.success) {
          this.lastReferenceNo.set(res.referenceNo);
          this.step.set(3);
        } else {
          this.errorMessage.set(res.message);
          this.step.set(1);
        }
      });
    }, 400);
  }

  resetForm(): void {
    this.step.set(1);
    this.amount = 0;
    this.note = '';
  }
}
