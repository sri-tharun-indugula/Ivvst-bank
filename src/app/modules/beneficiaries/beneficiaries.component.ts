import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Beneficiaries Management</h1>
          <p class="subtitle">Manage saved payees across HDFC, ICICI, SBI and NovaBank accounts</p>
        </div>
        <button class="nb-btn nb-btn-primary" (click)="showAddModal.set(true)">+ Add New Beneficiary</button>
      </div>

      <!-- Beneficiaries Grid -->
      <div class="ben-grid">
        @for (ben of bankData.beneficiaries(); track ben.id) {
          <div class="nb-card ben-card">
            <div class="ben-top">
              <div class="ben-avatar" [style.background-color]="ben.avatarColor">
                {{ ben.name.charAt(0) }}
              </div>
              <span class="nb-badge nb-badge-success">{{ ben.status }}</span>
            </div>

            <div class="ben-info">
              <h3>{{ ben.name }}</h3>
              <p class="ben-nick">{{ ben.nickname }}</p>
            </div>

            <div class="ben-meta">
              <div class="meta-row">
                <span>Bank:</span>
                <strong>{{ ben.bankName }}</strong>
              </div>
              <div class="meta-row">
                <span>Account No:</span>
                <strong>{{ ben.accountNumber }}</strong>
              </div>
              <div class="meta-row">
                <span>IFSC:</span>
                <strong>{{ ben.ifscCode }}</strong>
              </div>
            </div>

            <div class="ben-actions">
              <button class="nb-btn nb-btn-sm nb-btn-destructive" (click)="deleteBen(ben.id)">Remove</button>
            </div>
          </div>
        }
      </div>

      <!-- Add Beneficiary Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop" (click)="showAddModal.set(false)">
          <div class="nb-card modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Add Beneficiary</h3>
              <button class="close-btn" (click)="showAddModal.set(false)">✕</button>
            </div>

            <form (ngSubmit)="saveBeneficiary()" class="modal-form">
              <div class="nb-input-group">
                <label class="nb-label">Full Legal Name</label>
                <input type="text" class="nb-input" [(ngModel)]="name" name="name" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">Nickname</label>
                <input type="text" class="nb-input" [(ngModel)]="nickname" name="nickname" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">Bank Name</label>
                <input type="text" class="nb-input" [(ngModel)]="bankName" name="bankName" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">Account Number</label>
                <input type="text" class="nb-input" [(ngModel)]="accNumber" name="accNumber" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">IFSC Code</label>
                <input type="text" class="nb-input" [(ngModel)]="ifsc" name="ifsc" required />
              </div>

              <div class="modal-actions">
                <button type="button" class="nb-btn nb-btn-secondary" (click)="showAddModal.set(false)">Cancel</button>
                <button type="submit" class="nb-btn nb-btn-primary">Verify & Add</button>
              </div>
            </form>
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

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .ben-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .ben-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .ben-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ben-avatar {
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      color: #ffffff;
      font-size: 1.125rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ben-info h3 {
      font-size: 1rem;
      font-weight: 700;
    }

    .ben-nick {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .ben-meta {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      font-size: 0.8125rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
    }

    .meta-row strong {
      color: var(--text-main);
    }

    .ben-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
    }

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

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
  `]
})
export class BeneficiariesComponent {
  bankData = inject(BankDataService);

  showAddModal = signal(false);
  name = '';
  nickname = '';
  bankName = '';
  accNumber = '';
  ifsc = '';

  saveBeneficiary(): void {
    if (!this.name || !this.accNumber) return;

    this.bankData.addBeneficiary({
      name: this.name,
      nickname: this.nickname,
      bankName: this.bankName,
      accountNumber: '•••• ' + this.accNumber.slice(-4),
      fullAccountNumber: this.accNumber,
      ifscCode: this.ifsc,
      transferType: 'IMPS / NEFT'
    });

    this.showAddModal.set(false);
    this.name = '';
    this.nickname = '';
    this.bankName = '';
    this.accNumber = '';
    this.ifsc = '';
  }

  deleteBen(id: string): void {
    if (confirm('Are you sure you want to remove this beneficiary?')) {
      this.bankData.deleteBeneficiary(id);
    }
  }
}
