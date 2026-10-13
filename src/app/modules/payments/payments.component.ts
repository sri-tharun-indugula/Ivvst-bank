import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';
import { Bill } from '../../core/models/bank.models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Bill Payments & Recharges</h1>
          <p class="subtitle">Pay utility bills, mobile recharges, subscriptions and DTH directly</p>
        </div>
      </div>

      <!-- Bill Categories Grid -->
      <div class="categories-bar">
        @for (cat of categories; track cat.name) {
          <div class="cat-chip" [class.active]="selectedCategory() === cat.name" (click)="selectedCategory.set(cat.name)">
            <span>{{ cat.name }}</span>
          </div>
        }
      </div>

      <!-- Pending Bills List -->
      <div class="nb-card bills-card">
        <h3>Pending & Upcoming Bills</h3>
        <div class="bills-grid">
          @for (b of filteredBills(); track b.id) {
            <div class="nb-card nb-card-hover bill-item" [class.paid]="b.status === 'PAID'">
              <div class="bill-top">
                <span class="nb-badge" [class.nb-badge-warning]="b.status === 'PENDING'" [class.nb-badge-success]="b.status === 'PAID'">
                  {{ b.status }}
                </span>
                <span class="bill-due">Due: {{ b.dueDate }}</span>
              </div>

              <div class="biller-info">
                <h4>{{ b.billerName }}</h4>
                <span class="biller-acc">Consumer No: {{ b.accountNumber }}</span>
              </div>

              <div class="bill-bottom">
                <div class="bill-amount-wrap">
                  <span class="label">Amount</span>
                  <span class="amount">₹{{ b.amount.toLocaleString('en-IN') }}</span>
                </div>

                @if (b.status !== 'PAID') {
                  <button class="nb-btn nb-btn-primary" (click)="payBill(b)">Pay Now</button>
                } @else {
                  <span class="nb-badge nb-badge-success">Paid ✓</span>
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

    .categories-bar {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .cat-chip {
      padding: 0.5rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .cat-chip.active {
      background: var(--brand-blue);
      color: #ffffff;
      border-color: var(--brand-blue);
    }

    .bills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }

    .bill-item {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .bill-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bill-due {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .biller-info h4 {
      font-size: 1rem;
      font-weight: 700;
    }

    .biller-acc {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: monospace;
    }

    .bill-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
    }

    .bill-amount-wrap {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 0.6875rem;
      color: var(--text-faint);
    }

    .amount {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-main);
    }
  `]
})
export class PaymentsComponent {
  bankData = inject(BankDataService);
  selectedCategory = signal('ALL');

  categories = [
    { name: 'ALL' },
    { name: 'Electricity' },
    { name: 'Broadband' },
    { name: 'Water' },
    { name: 'Mobile Postpaid' },
    { name: 'DTH / Cable' }
  ];

  filteredBills = () => {
    const cat = this.selectedCategory();
    const bills = this.bankData.bills();
    if (cat === 'ALL') return bills;
    return bills.filter(b => b.category === cat);
  };

  payBill(bill: Bill): void {
    const primary = this.bankData.primaryAccount();
    if (!primary) return;

    this.bankData.payBill(bill.id, primary.id).subscribe(res => {
      alert(res.message);
    });
  }
}
