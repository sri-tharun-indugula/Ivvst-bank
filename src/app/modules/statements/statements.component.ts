import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Statements & Tax Certificates</h1>
          <p class="subtitle">Download official e-statements, interest certificates and TDS Form 16A</p>
        </div>
      </div>

      <!-- Statements List -->
      <div class="nb-card doc-card">
        <h3>Available Documents</h3>
        <div class="doc-list">
          @for (doc of bankData.statements(); track doc.id) {
            <div class="doc-item">
              <div class="doc-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>

              <div class="doc-meta">
                <h4>{{ doc.title }}</h4>
                <p class="doc-sub">{{ doc.account }} • Date: {{ doc.date }} • {{ doc.size }}</p>
              </div>

              <button class="nb-btn nb-btn-secondary" (click)="download(doc.title)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Download {{ doc.format }}</span>
              </button>
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

    .doc-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .doc-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .doc-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-surface-subtle);
      border-radius: var(--radius-md);
      transition: all 0.15s ease;
    }

    .doc-item:hover {
      background: var(--border-subtle);
    }

    .doc-icon {
      color: var(--brand-blue);
    }

    .doc-meta {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .doc-meta h4 {
      font-size: 0.9375rem;
      font-weight: 600;
    }

    .doc-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `]
})
export class StatementsComponent {
  bankData = inject(BankDataService);

  download(title: string): void {
    alert(`Downloading ${title}...`);
  }
}
