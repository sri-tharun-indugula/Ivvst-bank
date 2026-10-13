import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankDataService } from '../../core/services/bank-data.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Profile & Banking Preferences</h1>
          <p class="subtitle">Update personal credentials, configure two-factor authentication and display settings</p>
        </div>
      </div>

      @if (bankData.user(); as u) {
        <div class="settings-grid">
          <!-- Profile Card -->
          <div class="nb-card profile-card">
            <div class="profile-header">
              <img [src]="u.avatar" [alt]="u.name" class="profile-img" />
              <div>
                <h2>{{ u.name }}</h2>
                <p class="cust-id">Customer ID: {{ u.id }}</p>
                <span class="nb-badge nb-badge-success">KYC {{ u.kycStatus }}</span>
              </div>
            </div>

            <div class="profile-fields">
              <div class="p-field">
                <span class="f-label">Email Address</span>
                <span class="f-val">{{ u.email }}</span>
              </div>
              <div class="p-field">
                <span class="f-label">Registered Mobile</span>
                <span class="f-val">{{ u.phone }}</span>
              </div>
              <div class="p-field">
                <span class="f-label">Occupation</span>
                <span class="f-val">{{ u.occupation }}</span>
              </div>
              <div class="p-field">
                <span class="f-label">Communication Address</span>
                <span class="f-val">{{ u.address }}</span>
              </div>
            </div>
          </div>

          <!-- Preferences & Security -->
          <div class="nb-card security-card">
            <h3>App Preferences & Security</h3>

            <div class="pref-list">
              <div class="pref-row">
                <div>
                  <span class="p-title">Theme Mode</span>
                  <p class="p-sub">Toggle between clean light and sleek dark mode</p>
                </div>
                <button class="nb-btn nb-btn-secondary nb-btn-sm" (click)="themeService.toggleTheme()">
                  {{ themeService.currentTheme() === 'dark' ? 'Switch to Light' : 'Switch to Dark' }}
                </button>
              </div>

              <div class="pref-row">
                <div>
                  <span class="p-title">Two-Factor Authentication (2FA)</span>
                  <p class="p-sub">Require OTP on new transfers & card actions</p>
                </div>
                <input type="checkbox" [(ngModel)]="u.preferences.biometricEnabled" />
              </div>

              <div class="pref-row">
                <div>
                  <span class="p-title">Email Transaction Alerts</span>
                  <p class="p-sub">Get real-time receipts on debits above ₹1,000</p>
                </div>
                <input type="checkbox" [(ngModel)]="u.preferences.emailAlerts" />
              </div>

              <div class="pref-row">
                <div>
                  <span class="p-title">SMS Transaction Alerts</span>
                  <p class="p-sub">Regulatory RBI SMS alerts sent instantly</p>
                </div>
                <input type="checkbox" [(ngModel)]="u.preferences.smsAlerts" />
              </div>
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

    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }

    .profile-card, .security-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile-img {
      width: 64px;
      height: 64px;
      border-radius: 9999px;
      border: 3px solid var(--brand-blue);
      object-fit: cover;
    }

    .cust-id {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0.125rem 0 0.375rem;
    }

    .profile-fields {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
    }

    .p-field {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .f-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-faint);
    }

    .f-val {
      font-size: 0.875rem;
      color: var(--text-main);
    }

    .pref-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
    }

    .pref-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.875rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .p-title {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .p-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `]
})
export class SettingsComponent {
  bankData = inject(BankDataService);
  themeService = inject(ThemeService);
}
