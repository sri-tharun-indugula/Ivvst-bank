import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Help & Customer Support</h1>
          <p class="subtitle">24x7 NovaBank Care • FAQs, branch locator, emergency block and ticket resolution</p>
        </div>
      </div>

      <!-- Quick Action Cards -->
      <div class="support-cards-grid">
        <div class="nb-card help-action-card">
          <h4>Report Lost / Stolen Card</h4>
          <p>Instantly freeze your debit or credit card and request a replacement.</p>
          <a routerLink="/cards" class="nb-btn nb-btn-destructive nb-btn-sm">Emergency Freeze →</a>
        </div>

        <div class="nb-card help-action-card">
          <h4>Dispute Transaction</h4>
          <p>Report unrecognized merchant charges or ATM cash dispense errors.</p>
          <a routerLink="/transactions" class="nb-btn nb-btn-secondary nb-btn-sm">Select Transaction →</a>
        </div>

        <div class="nb-card help-action-card">
          <h4>Branch & ATM Locator</h4>
          <p>Find nearby branches with cash deposit and passbook kiosks.</p>
          <button class="nb-btn nb-btn-outline nb-btn-sm">Find Near Indiranagar</button>
        </div>
      </div>

      <!-- Active Support Tickets -->
      <div class="nb-card tickets-card">
        <h3>Your Support Tickets</h3>
        <div class="ticket-list">
          @for (t of bankData.supportTickets(); track t.id) {
            <div class="ticket-item">
              <div class="t-top">
                <span class="nb-badge" [class.nb-badge-warning]="t.status === 'IN_PROGRESS'" [class.nb-badge-success]="t.status === 'RESOLVED'">
                  {{ t.status }}
                </span>
                <span class="t-date">Created: {{ t.createdDate }}</span>
              </div>

              <h4>{{ t.subject }}</h4>
              <p class="ticket-id">Ticket ID: {{ t.id }} • Category: {{ t.category }}</p>

              <div class="messages-thread">
                @for (m of t.messages; track m.time) {
                  <div class="msg-bubble">
                    <strong>{{ m.sender }}:</strong>
                    <span>{{ m.text }}</span>
                  </div>
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

    .support-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .help-action-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .help-action-card h4 {
      font-size: 1rem;
      font-weight: 700;
    }

    .help-action-card p {
      font-size: 0.8125rem;
      color: var(--text-muted);
      flex: 1;
    }

    .tickets-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .ticket-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .ticket-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.25rem;
      background: var(--bg-surface-subtle);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .t-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .t-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .ticket-id {
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .messages-thread {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
    }

    .msg-bubble {
      font-size: 0.8125rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .msg-bubble strong {
      color: var(--brand-blue);
      font-size: 0.75rem;
    }
  `]
})
export class SupportComponent {
  bankData = inject(BankDataService);
}
