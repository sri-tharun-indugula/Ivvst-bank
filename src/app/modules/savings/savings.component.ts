import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Savings Goals & Term Deposits</h1>
          <p class="subtitle">Set financial targets, automate monthly contributions, and grow your wealth</p>
        </div>
        <button class="nb-btn nb-btn-primary" (click)="showNewGoalModal.set(true)">+ Create Savings Goal</button>
      </div>

      <!-- Goals Grid -->
      <div class="goals-grid">
        @for (goal of bankData.savingsGoals(); track goal.id) {
          <div class="nb-card goal-card">
            <div class="goal-top">
              <span class="nb-badge nb-badge-info">{{ goal.category }}</span>
              <span class="goal-date">Target: {{ goal.targetDate }}</span>
            </div>

            <h3 class="goal-title">{{ goal.title }}</h3>

            <div class="progress-wrap">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100" [style.background-color]="goal.color"></div>
              </div>
              <div class="progress-meta">
                <span>{{ ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0) }}% Completed</span>
                <span>₹{{ goal.currentAmount.toLocaleString('en-IN') }} of ₹{{ goal.targetAmount.toLocaleString('en-IN') }}</span>
              </div>
            </div>

            <div class="goal-footer">
              <span class="monthly-sip">Monthly Contribution: <strong>₹{{ goal.monthlyContribution.toLocaleString('en-IN') }}</strong></span>
              <button class="nb-btn nb-btn-sm nb-btn-secondary" (click)="addFunds(goal.id)">+ Add Funds</button>
            </div>
          </div>
        }
      </div>

      <!-- New Goal Modal -->
      @if (showNewGoalModal()) {
        <div class="modal-backdrop" (click)="showNewGoalModal.set(false)">
          <div class="nb-card modal-panel" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Create New Goal</h3>
              <button class="close-btn" (click)="showNewGoalModal.set(false)">✕</button>
            </div>

            <form (ngSubmit)="submitGoal()" class="modal-form">
              <div class="nb-input-group">
                <label class="nb-label">Goal Title</label>
                <input type="text" class="nb-input" placeholder="e.g. Europe Trip, MacBook Pro" [(ngModel)]="newTitle" name="title" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">Target Amount (₹)</label>
                <input type="number" class="nb-input" placeholder="100000" [(ngModel)]="newTarget" name="target" required />
              </div>

              <div class="nb-input-group">
                <label class="nb-label">Target Date</label>
                <input type="text" class="nb-input" placeholder="31/12/2027" [(ngModel)]="newDate" name="date" required />
              </div>

              <div class="modal-actions">
                <button type="button" class="nb-btn nb-btn-secondary" (click)="showNewGoalModal.set(false)">Cancel</button>
                <button type="submit" class="nb-btn nb-btn-primary">Save Goal</button>
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

    .goals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .goal-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .goal-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .goal-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .goal-title {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .progress-bar {
      height: 10px;
      background: var(--bg-surface-subtle);
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }

    .progress-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.375rem;
    }

    .goal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
      font-size: 0.75rem;
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
export class SavingsComponent {
  bankData = inject(BankDataService);

  showNewGoalModal = signal(false);
  newTitle = '';
  newTarget = 100000;
  newDate = '31/12/2027';

  addFunds(goalId: string): void {
    const primary = this.bankData.primaryAccount();
    if (!primary) return;

    this.bankData.addGoalContribution(goalId, 5000, primary.id).subscribe(ok => {
      if (ok) alert('Added ₹5,000 to goal from checking account!');
    });
  }

  submitGoal(): void {
    if (!this.newTitle) return;

    this.bankData.createSavingsGoal({
      title: this.newTitle,
      targetAmount: this.newTarget,
      targetDate: this.newDate,
      monthlyContribution: Math.round(this.newTarget / 24),
      category: 'PERSONAL',
      color: '#3b82f6'
    });

    this.showNewGoalModal.set(false);
    this.newTitle = '';
  }
}
