import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Loans & Credit Lines</h1>
          <p class="subtitle">Track existing borrowings, view repayment schedules and calculate indicative EMIs</p>
        </div>
      </div>

      <!-- Active Loan Card -->
      @for (l of bankData.loans(); track l.id) {
        <div class="nb-card active-loan-card">
          <div class="loan-card-top">
            <div>
              <span class="nb-badge nb-badge-info">{{ l.type }}</span>
              <h2 class="loan-id-heading">{{ l.id }}</h2>
            </div>
            <div class="loan-repay-badge">
              <span>{{ l.repaidPercentage }}% Repaid</span>
            </div>
          </div>

          <div class="loan-metrics-row">
            <div>
              <span class="label">Outstanding Principal</span>
              <div class="val text-danger">₹{{ l.outstandingAmount.toLocaleString('en-IN') }}</div>
            </div>
            <div>
              <span class="label">Monthly EMI</span>
              <div class="val">₹{{ l.emiAmount.toLocaleString('en-IN') }}</div>
            </div>
            <div>
              <span class="label">Interest Rate</span>
              <div class="val">{{ l.interestRate }}% p.a.</div>
            </div>
            <div>
              <span class="label">Next Due Date</span>
              <div class="val">{{ l.nextDueDate }}</div>
            </div>
          </div>

          <div class="repay-schedule-box">
            <h4>Upcoming Repayment Installments</h4>
            <div class="schedule-table">
              @for (inst of l.repaymentSchedule; track inst.month) {
                <div class="schedule-item">
                  <span class="inst-month">{{ inst.month }}</span>
                  <span class="inst-emi">EMI: ₹{{ inst.emi.toLocaleString('en-IN') }}</span>
                  <span class="inst-split">Principal: ₹{{ inst.principal.toLocaleString('en-IN') }} | Interest: ₹{{ inst.interest.toLocaleString('en-IN') }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Interactive EMI Calculator -->
      <div class="nb-card calculator-card">
        <h3>Indicative Loan EMI Calculator</h3>
        <p class="calc-sub">Estimate your monthly installment for new home, car or personal loans</p>

        <div class="calc-grid">
          <div class="calc-inputs">
            <div class="nb-input-group">
              <label class="nb-label">Principal Amount: ₹{{ calcAmount().toLocaleString('en-IN') }}</label>
              <input type="range" min="50000" max="5000000" step="50000" [(ngModel)]="calcAmount" class="nb-slider" />
            </div>

            <div class="nb-input-group">
              <label class="nb-label">Tenure: {{ calcTenureYears() }} Years ({{ calcTenureYears() * 12 }} Months)</label>
              <input type="range" min="1" max="30" step="1" [(ngModel)]="calcTenureYears" class="nb-slider" />
            </div>

            <div class="nb-input-group">
              <label class="nb-label">Interest Rate: {{ calcInterestRate() }}% p.a.</label>
              <input type="range" min="7" max="18" step="0.25" [(ngModel)]="calcInterestRate" class="nb-slider" />
            </div>
          </div>

          <div class="calc-result-box">
            <span class="calc-result-label">ESTIMATED MONTHLY EMI</span>
            <div class="calc-emi-value">₹{{ computedEmi().toLocaleString('en-IN') }}</div>
            <p class="calc-disclaimer">*Figures shown are indicative and do not include processing fees or taxes.</p>
            <button class="nb-btn nb-btn-primary">Apply for this Loan →</button>
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

    .active-loan-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .loan-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .loan-id-heading {
      font-size: 1.25rem;
      margin-top: 0.25rem;
    }

    .loan-repay-badge {
      background: var(--brand-mint-subtle);
      color: var(--brand-mint);
      font-weight: 700;
      font-size: 0.8125rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .loan-metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 1rem 0;
    }

    .label {
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .val {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 0.25rem;
    }

    .text-danger { color: var(--brand-rose); }

    .repay-schedule-box h4 {
      font-size: 0.9375rem;
      margin-bottom: 0.75rem;
    }

    .schedule-table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .schedule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.625rem 0.875rem;
      background: var(--bg-surface-subtle);
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
    }

    .inst-month { font-weight: 700; }
    .inst-emi { font-weight: 600; color: var(--brand-blue); }
    .inst-split { color: var(--text-muted); font-size: 0.75rem; }

    /* Calculator */
    .calculator-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .calc-sub {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .calc-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .calc-grid {
        grid-template-columns: 1fr;
      }
    }

    .calc-inputs {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .nb-slider {
      width: 100%;
      accent-color: var(--brand-blue);
      margin-top: 0.5rem;
    }

    .calc-result-box {
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.75rem;
    }

    .calc-result-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-faint);
      letter-spacing: 0.05em;
    }

    .calc-emi-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--brand-blue);
    }

    .calc-disclaimer {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }
  `]
})
export class LoansComponent {
  bankData = inject(BankDataService);

  calcAmount = signal(500000);
  calcTenureYears = signal(3);
  calcInterestRate = signal(10.5);

  computedEmi(): number {
    const P = this.calcAmount();
    const annualR = this.calcInterestRate();
    const N = this.calcTenureYears() * 12;
    const r = annualR / (12 * 100);

    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    return Math.round(emi);
  }
}
