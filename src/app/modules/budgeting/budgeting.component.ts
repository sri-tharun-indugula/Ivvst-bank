import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-budgeting',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Spending & Budgeting</h1>
          <p class="subtitle">Real-time expenditure tracking, category breakdown and budget cap utilization</p>
        </div>
      </div>

      <!-- Top Summary Cards -->
      <div class="summary-cards-grid">
        <div class="nb-card sum-card">
          <span class="label">Total Monthly Budget</span>
          <div class="val">₹73,000.00</div>
          <span class="sub text-success">Within expected safe threshold</span>
        </div>

        <div class="nb-card sum-card">
          <span class="label">Current Month Spend</span>
          <div class="val text-brand">₹56,659.00</div>
          <span class="sub">77.6% utilization</span>
        </div>

        <div class="nb-card sum-card">
          <span class="label">Monthly Surplus / Savings</span>
          <div class="val text-mint">₹28,341.00</div>
          <span class="sub">33.3% savings rate</span>
        </div>
      </div>

      <!-- Category Budget Utilization -->
      <div class="nb-card category-card">
        <h3>Category-Wise Budget Utilization</h3>
        <div class="budget-items-list">
          @for (b of bankData.budgets(); track b.category) {
            <div class="b-item">
              <div class="b-info-row">
                <span class="cat-name">{{ b.category }}</span>
                <span class="cat-numbers">₹{{ b.spent.toLocaleString('en-IN') }} / ₹{{ b.budgeted.toLocaleString('en-IN') }}</span>
              </div>
              <div class="b-bar-bg">
                <div class="b-bar-fill" [style.width.%]="(b.spent / b.budgeted) * 100" [style.background-color]="b.color"></div>
              </div>
              <div class="b-util-row">
                <span>{{ ((b.spent / b.budgeted) * 100).toFixed(0) }}% Used</span>
                @if (b.spent >= b.budgeted) {
                  <span class="badge-alert">Cap Reached</span>
                }
              </div>
            </div>
          }
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

    .summary-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .sum-card {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .label {
      font-size: 0.75rem;
      color: var(--text-faint);
      font-weight: 600;
    }

    .val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }

    .text-brand { color: var(--brand-blue); }
    .text-mint { color: var(--brand-mint); }
    .text-success { color: var(--brand-mint); }

    .sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .category-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .budget-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .b-item {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .b-info-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .cat-name { font-weight: 600; }
    .cat-numbers { color: var(--text-muted); font-size: 0.8125rem; }

    .b-bar-bg {
      height: 8px;
      background: var(--bg-surface-subtle);
      border-radius: 9999px;
      overflow: hidden;
    }

    .b-bar-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .b-util-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.6875rem;
      color: var(--text-faint);
    }

    .badge-alert {
      color: var(--brand-rose);
      font-weight: 700;
    }
  `]
})
export class BudgetingComponent {
  bankData = inject(BankDataService);
}
