import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar-container">
      <!-- Logo Branding -->
      <div class="brand-header">
        <div class="logo-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">NovaBank</span>
          <span class="brand-tagline">Banking made simpler</span>
        </div>
      </div>

      <!-- Navigation List -->
      <nav class="nav-scroller">
        <div class="nav-section-label">MAIN MENU</div>
        <ul class="nav-list">
          @for (item of mainNavItems; track item.route) {
            <li>
              <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                <span class="nav-label">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="nav-badge">{{ item.badge }}</span>
                }
              </a>
            </li>
          }
        </ul>

        <div class="nav-section-label">FINANCES</div>
        <ul class="nav-list">
          @for (item of financeNavItems; track item.route) {
            <li>
              <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                <span class="nav-label">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>

        <div class="nav-section-label">SUPPORT & ACCOUNT</div>
        <ul class="nav-list">
          @for (item of supportNavItems; track item.route) {
            <li>
              <a [routerLink]="item.route" routerLinkActive="active" class="nav-link">
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                <span class="nav-label">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>

      <!-- User Quick Status & Logout -->
      <div class="sidebar-footer">
        <button class="logout-btn" (click)="authService.logout()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: var(--sidebar-width);
      height: 100vh;
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .brand-header {
      padding: 1.5rem 1.25rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--brand-blue) 0%, #1d4ed8 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .brand-tagline {
      font-size: 0.6875rem;
      color: var(--text-muted);
      letter-spacing: 0.01em;
    }

    .nav-scroller {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0.75rem;
    }

    .nav-section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-faint);
      padding: 0.75rem 0.5rem 0.375rem;
      margin-top: 0.5rem;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5625rem 0.75rem;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .nav-link:hover {
      background-color: var(--bg-surface-subtle);
      color: var(--text-main);
    }

    .nav-link.active {
      background-color: var(--brand-blue-subtle);
      color: var(--brand-blue);
      font-weight: 600;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }

    .nav-badge {
      margin-left: auto;
      background-color: var(--brand-blue);
      color: #ffffff;
      font-size: 0.6875rem;
      padding: 0.125rem 0.4375rem;
      border-radius: 9999px;
      font-weight: 600;
    }

    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-subtle);
      background-color: var(--bg-surface);
    }

    .logout-btn {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.625rem 0.75rem;
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background-color: var(--brand-rose-subtle);
      color: var(--brand-rose);
      border-color: transparent;
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);

  readonly mainNavItems: NavItem[] = [
    {
      label: 'Overview',
      route: '/dashboard',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>'
    },
    {
      label: 'Accounts',
      route: '/accounts',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>'
    },
    {
      label: 'Transactions',
      route: '/transactions',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>'
    },
    {
      label: 'Transfers',
      route: '/transfers',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>'
    },
    {
      label: 'Payments & Bills',
      route: '/payments',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    },
    {
      label: 'Cards',
      route: '/cards',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
    }
  ];

  readonly financeNavItems: NavItem[] = [
    {
      label: 'Loans & Credit',
      route: '/loans',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>'
    },
    {
      label: 'Savings Goals',
      route: '/savings',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8l-8 8"></path><path d="M8 8l8 8"></path></svg>'
    },
    {
      label: 'Budgeting & Spend',
      route: '/budgeting',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
    },
    {
      label: 'Beneficiaries',
      route: '/beneficiaries',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
    },
    {
      label: 'Documents',
      route: '/statements',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>'
    }
  ];

  readonly supportNavItems: NavItem[] = [
    {
      label: 'Help & Support',
      route: '/support',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    },
    {
      label: 'Settings',
      route: '/settings',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
    }
  ];
}
