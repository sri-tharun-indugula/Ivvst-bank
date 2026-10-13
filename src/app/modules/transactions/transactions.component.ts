import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';
import { Transaction } from '../../core/models/bank.models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Transactions History</h1>
          <p class="subtitle">Search, filter, and review all credit and debit records across your accounts</p>
        </div>
        <button class="nb-btn nb-btn-secondary" (click)="exportCSV()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      <!-- Filter Controls Bar -->
      <div class="nb-card filter-card">
        <div class="filter-grid">
          <div class="nb-input-group">
            <label class="nb-label">Search Description / Ref</label>
            <input type="text" class="nb-input" placeholder="e.g. Starbucks, Amazon..." [(ngModel)]="searchQuery" />
          </div>

          <div class="nb-input-group">
            <label class="nb-label">Filter Category</label>
            <select class="nb-input" [(ngModel)]="selectedCategory">
              <option value="ALL">All Categories</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Salary">Salary</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transfers">Transfers</option>
            </select>
          </div>

          <div class="nb-input-group">
            <label class="nb-label">Direction</label>
            <select class="nb-input" [(ngModel)]="selectedDirection">
              <option value="ALL">All Types</option>
              <option value="DEBIT">Debits Only</option>
              <option value="CREDIT">Credits Only</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Transaction Data Table -->
      <div class="nb-card table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Description</th>
                <th>Category</th>
                <th>Reference No</th>
                <th>Status</th>
                <th class="text-right">Amount</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (txn of filteredTransactions(); track txn.id) {
                <tr>
                  <td class="date-cell">{{ txn.displayDate }}</td>
                  <td>
                    <div class="desc-cell">
                      <span class="desc-title">{{ txn.description }}</span>
                      <span class="desc-source">{{ txn.source || 'Checking Account' }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="nb-badge nb-badge-neutral">{{ txn.category }}</span>
                  </td>
                  <td class="ref-cell">{{ txn.referenceNo }}</td>
                  <td>
                    <span class="nb-badge" [class.nb-badge-success]="txn.status === 'COMPLETED'" [class.nb-badge-warning]="txn.status === 'PENDING'">
                      {{ txn.status }}
                    </span>
                  </td>
                  <td class="text-right amount-cell" [class.amount-credit]="txn.direction === 'CREDIT'" [class.amount-debit]="txn.direction === 'DEBIT'">
                    {{ txn.direction === 'CREDIT' ? '+' : '-' }}₹{{ txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}
                  </td>
                  <td class="text-center">
                    <button class="nb-btn nb-btn-sm nb-btn-secondary" (click)="viewReceipt(txn)">Receipt</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-cell">No transactions found matching the filter criteria.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Receipt Modal -->
      @if (activeReceipt(); as r) {
        <div class="modal-backdrop" (click)="activeReceipt.set(null)">
          <div class="nb-card modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Transaction Receipt</h3>
              <button class="close-btn" (click)="activeReceipt.set(null)">✕</button>
            </div>
            <div class="receipt-body">
              <div class="receipt-amount-badge">
                <span class="currency">₹</span>
                <span class="amt">{{ r.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <p class="receipt-status text-success">{{ r.status }}</p>

              <div class="receipt-rows">
                <div class="r-row">
                  <span>Reference ID</span>
                  <strong>{{ r.referenceNo }}</strong>
                </div>
                <div class="r-row">
                  <span>Date & Time</span>
                  <strong>{{ r.displayDate }}</strong>
                </div>
                <div class="r-row">
                  <span>Merchant / Recipient</span>
                  <strong>{{ r.merchant }}</strong>
                </div>
                <div class="r-row">
                  <span>Payment Method</span>
                  <strong>{{ r.source }}</strong>
                </div>
                <div class="r-row">
                  <span>Transaction Fee</span>
                  <strong>₹{{ r.fee.toFixed(2) }} (Nil)</strong>
                </div>
              </div>

              <button class="nb-btn nb-btn-primary full-width" (click)="activeReceipt.set(null)">Done</button>
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

    .filter-card {
      padding: 1rem 1.25rem;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .filter-grid {
        grid-template-columns: 1fr;
      }
    }

    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }

    .data-table th {
      padding: 0.875rem 1.25rem;
      background: var(--bg-surface-subtle);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-faint);
      border-bottom: 1px solid var(--border-subtle);
    }

    .data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      color: var(--text-main);
    }

    .desc-cell {
      display: flex;
      flex-direction: column;
    }

    .desc-title {
      font-weight: 600;
    }

    .desc-source {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .date-cell, .ref-cell {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-family: monospace;
    }

    .amount-cell {
      font-weight: 700;
      font-size: 0.9375rem;
    }

    .amount-credit { color: var(--brand-mint); }
    .amount-debit { color: var(--text-main); }

    .text-right { text-align: right; }
    .text-center { text-align: center; }

    .empty-cell {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .modal-panel {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.75rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .receipt-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .receipt-amount-badge {
      display: flex;
      align-items: baseline;
      font-size: 2rem;
      font-weight: 800;
    }

    .receipt-status {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--brand-mint);
    }

    .receipt-rows {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0.75rem 0;
      font-size: 0.8125rem;
    }

    .r-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
    }

    .r-row strong {
      color: var(--text-main);
    }

    .full-width {
      width: 100%;
    }
  `]
})
export class TransactionsComponent {
  bankData = inject(BankDataService);

  searchQuery = '';
  selectedCategory = 'ALL';
  selectedDirection = 'ALL';
  activeReceipt = signal<Transaction | null>(null);

  filteredTransactions = computed(() => {
    let list = this.bankData.transactions();

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.referenceNo.toLowerCase().includes(q));
    }

    if (this.selectedCategory !== 'ALL') {
      list = list.filter(t => t.category === this.selectedCategory);
    }

    if (this.selectedDirection !== 'ALL') {
      list = list.filter(t => t.direction === this.selectedDirection);
    }

    return list;
  });

  viewReceipt(txn: Transaction): void {
    this.activeReceipt.set(txn);
  }

  exportCSV(): void {
    const txns = this.filteredTransactions();
    const rows = [
      ['Date', 'Description', 'Category', 'Amount', 'Type', 'Reference'],
      ...txns.map(t => [t.displayDate, `"${t.description}"`, t.category, t.amount, t.direction, t.referenceNo])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'novabank_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
