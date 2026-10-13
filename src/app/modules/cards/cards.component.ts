import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';
import { BankCard } from '../../core/models/bank.models';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Card Management</h1>
          <p class="subtitle">Control spending limits, freeze cards, and view credit lines securely</p>
        </div>
      </div>

      <div class="cards-layout">
        <!-- Visual Cards Carousel / Selector -->
        <div class="cards-display-column">
          <div class="cards-selector-tabs">
            @for (c of bankData.cards(); track c.id) {
              <button
                class="tab-btn"
                [class.active]="selectedCard()?.id === c.id"
                (click)="selectedCard.set(c)"
              >
                {{ c.variant }}
              </button>
            }
          </div>

          <!-- Glossy Visual Bank Card -->
          @if (selectedCard(); as card) {
            <div class="visual-card-wrapper">
              <div
                class="visual-card"
                [class.card-credit]="card.type === 'CREDIT'"
                [class.card-debit]="card.type === 'DEBIT'"
                [class.card-virtual]="card.type === 'VIRTUAL'"
                [class.card-frozen]="card.status === 'FROZEN'"
              >
                <div class="card-chip-row">
                  <div class="chip"></div>
                  <span class="card-brand-logo">{{ card.brand }}</span>
                </div>

                <div class="card-number-display">{{ card.maskedNumber }}</div>

                <div class="card-bottom-row">
                  <div class="holder-group">
                    <span class="c-label">CARDHOLDER</span>
                    <span class="c-val">{{ card.cardholderName }}</span>
                  </div>
                  <div class="expiry-group">
                    <span class="c-label">EXPIRES</span>
                    <span class="c-val">{{ card.expiry }}</span>
                  </div>
                </div>

                @if (card.status === 'FROZEN') {
                  <div class="frozen-overlay">FROZEN 🔒</div>
                }
              </div>
            </div>

            <!-- Card Limits & Bill Pay Summary -->
            @if (card.type === 'CREDIT') {
              <div class="nb-card credit-summary-card">
                <div class="credit-metric-row">
                  <div>
                    <span class="label">Total Credit Limit</span>
                    <div class="value">₹{{ card.creditLimit?.toLocaleString('en-IN') }}</div>
                  </div>
                  <div>
                    <span class="label">Available Credit</span>
                    <div class="value text-success">₹{{ card.availableCredit?.toLocaleString('en-IN') }}</div>
                  </div>
                  <div>
                    <span class="label">Outstanding Bill</span>
                    <div class="value text-danger">₹{{ card.outstandingAmount?.toLocaleString('en-IN') }}</div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Security & Controls Panel -->
        @if (selectedCard(); as card) {
          <div class="nb-card controls-card">
            <h3>Card Controls & Security</h3>
            <p class="controls-sub">Instantly manage permissions and daily transaction caps.</p>

            <div class="toggle-list">
              <div class="toggle-item">
                <div>
                  <span class="toggle-title">Freeze Card Temporarily</span>
                  <p class="toggle-desc">Instantly disable all in-store and online transactions.</p>
                </div>
                <button
                  class="nb-btn nb-btn-sm"
                  [class.nb-btn-destructive]="card.status === 'ACTIVE'"
                  [class.nb-btn-primary]="card.status === 'FROZEN'"
                  (click)="toggleFreeze(card.id)"
                >
                  {{ card.status === 'ACTIVE' ? 'Freeze Card' : 'Unfreeze Card' }}
                </button>
              </div>

              <div class="toggle-item">
                <div>
                  <span class="toggle-title">Online / E-Commerce Transactions</span>
                  <p class="toggle-desc">Allow transactions on domestic shopping websites.</p>
                </div>
                <input type="checkbox" [(ngModel)]="card.controls.online" />
              </div>

              <div class="toggle-item">
                <div>
                  <span class="toggle-title">International Usage</span>
                  <p class="toggle-desc">Enable POS & e-commerce payments outside India.</p>
                </div>
                <input type="checkbox" [(ngModel)]="card.controls.international" />
              </div>

              <div class="toggle-item">
                <div>
                  <span class="toggle-title">Contactless Tap & Pay</span>
                  <p class="toggle-desc">Transactions up to ₹5,000 without PIN.</p>
                </div>
                <input type="checkbox" [(ngModel)]="card.controls.contactless" />
              </div>
            </div>

            <!-- Daily Limit Slider -->
            <div class="slider-box">
              <div class="slider-header">
                <span>Daily Online Limit Cap</span>
                <strong>₹{{ card.controls.dailyLimit.toLocaleString('en-IN') }}</strong>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                [(ngModel)]="card.controls.dailyLimit"
                class="limit-slider"
              />
            </div>
          </div>
        }
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

    .cards-layout {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .cards-layout {
        grid-template-columns: 1fr;
      }
    }

    .cards-display-column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cards-selector-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 0.5rem 0.875rem;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--brand-blue);
      color: #ffffff;
      border-color: var(--brand-blue);
    }

    /* Glossy Bank Card */
    .visual-card-wrapper {
      perspective: 1000px;
    }

    .visual-card {
      width: 100%;
      max-width: 420px;
      height: 240px;
      border-radius: 18px;
      padding: 1.75rem;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card-credit {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    }

    .card-debit {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
    }

    .card-virtual {
      background: linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%);
    }

    .card-frozen {
      filter: grayscale(0.85);
      opacity: 0.8;
    }

    .card-chip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chip {
      width: 44px;
      height: 32px;
      border-radius: 6px;
      background: linear-gradient(135deg, #fcd34d 0%, #d97706 100%);
    }

    .card-brand-logo {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .card-number-display {
      font-size: 1.375rem;
      letter-spacing: 0.15em;
      font-family: monospace;
      font-weight: 600;
    }

    .card-bottom-row {
      display: flex;
      justify-content: space-between;
    }

    .holder-group, .expiry-group {
      display: flex;
      flex-direction: column;
    }

    .c-label {
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      opacity: 0.7;
    }

    .c-val {
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .frozen-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #ef4444;
    }

    /* Credit Summary */
    .credit-summary-card {
      padding: 1.25rem;
    }

    .credit-metric-row {
      display: flex;
      justify-content: space-between;
      text-align: center;
    }

    .label {
      font-size: 0.75rem;
      color: var(--text-faint);
    }

    .value {
      font-size: 1.25rem;
      font-weight: 800;
      margin-top: 0.25rem;
    }

    .text-success { color: var(--brand-mint); }
    .text-danger { color: var(--brand-rose); }

    /* Controls Panel */
    .controls-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .controls-sub {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.875rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .toggle-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .toggle-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .slider-box {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
    }

    .limit-slider {
      width: 100%;
      accent-color: var(--brand-blue);
    }
  `]
})
export class CardsComponent {
  bankData = inject(BankDataService);
  selectedCard = signal<BankCard | null>(null);

  constructor() {
    const cards = this.bankData.cards();
    if (cards.length > 0) {
      this.selectedCard.set(cards[0]);
    }
  }

  toggleFreeze(cardId: string): void {
    this.bankData.toggleCardFreeze(cardId);
    // Refresh selected card reference
    const updated = this.bankData.cards().find(c => c.id === cardId);
    if (updated) {
      this.selectedCard.set(updated);
    }
  }
}
