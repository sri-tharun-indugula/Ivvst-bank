import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-wrapper">
      <div class="login-box nb-card">
        <!-- Logo Branding -->
        <div class="login-brand">
          <div class="logo-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1>NovaBank</h1>
          <p class="tagline">Banking made simpler • Secure Client Portal</p>
        </div>

        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="nb-input-group">
            <label class="nb-label">Email Address / Customer ID</label>
            <input
              type="text"
              class="nb-input"
              placeholder="e.g. alex.morgan@novabank.in or CUST-982314"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="nb-input-group">
            <div class="label-row">
              <label class="nb-label">Password</label>
              <a href="javascript:void(0)" class="forgot-link">Forgot password?</a>
            </div>
            <div class="pwd-wrapper">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                class="nb-input"
                placeholder="••••••••••••"
                [(ngModel)]="password"
                name="password"
                required
              />
              <button type="button" class="eye-toggle" (click)="showPassword.set(!showPassword())">
                {{ showPassword() ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="remember-row">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="remember" />
              <span>Remember this device for 30 days</span>
            </label>
          </div>

          <button type="submit" class="nb-btn nb-btn-primary full-width">Sign In to Dashboard →</button>

          <button type="button" class="nb-btn nb-btn-secondary full-width demo-btn" (click)="fillDemoUser()">
            ⚡ Quick Demo Auto-Fill (Alex Morgan)
          </button>
        </form>

        <div class="login-footer">
          <p>Protected by 256-bit TLS bank-grade encryption.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: radial-gradient(circle at 50% 20%, var(--brand-blue-subtle) 0%, var(--bg-app) 70%);
    }

    .login-box {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2.5rem 2rem;
      box-shadow: var(--shadow-lg);
    }

    .login-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
    }

    .logo-circle {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--brand-blue) 0%, #1d4ed8 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
    }

    .login-brand h1 {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .tagline {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-link {
      font-size: 0.75rem;
      color: var(--brand-blue);
      text-decoration: none;
    }

    .pwd-wrapper {
      position: relative;
    }

    .eye-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
    }

    .remember-row {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      cursor: pointer;
    }

    .full-width {
      width: 100%;
    }

    .demo-btn {
      font-size: 0.8125rem;
    }

    .login-footer {
      text-align: center;
      font-size: 0.75rem;
      color: var(--text-faint);
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
    }
  `]
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = 'alex.morgan@novabank.in';
  password = '••••••••••••';
  rememberMe = true;
  showPassword = signal(false);

  fillDemoUser(): void {
    this.email = 'alex.morgan@novabank.in';
    this.password = 'NovaBank@2026';
    this.onLogin();
  }

  onLogin(): void {
    this.authService.login(this.email, this.password);
    this.router.navigate(['/dashboard']);
  }
}
