import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="topbar-container">
      <!-- Left side: Mobile Toggle & Search -->
      <div class="left-section">
        <button class="mobile-menu-btn" (click)="toggleMobileMenu.emit()" aria-label="Toggle Navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Search transactions, accounts, beneficiaries (Ctrl+K)..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput()"
            (focus)="showSearchResults.set(true)"
          />
          @if (searchQuery) {
            <button class="search-clear" (click)="clearSearch()">✕</button>
          }

          <!-- Search Dropdown Results -->
          @if (showSearchResults() && (searchResults().transactions.length || searchResults().accounts.length || searchResults().beneficiaries.length)) {
            <div class="search-results-popover">
              <div class="popover-header">Search Results</div>
              @if (searchResults().accounts.length) {
                <div class="result-group">
                  <div class="group-title">ACCOUNTS</div>
                  @for (acc of searchResults().accounts; track acc.id) {
                    <a [routerLink]="['/accounts']" (click)="clearSearch()" class="result-item">
                      <span class="item-title">{{ acc.type }} ({{ acc.accountNumber }})</span>
                      <span class="item-sub">₹{{ acc.availableBalance.toLocaleString('en-IN') }}</span>
                    </a>
                  }
                </div>
              }
              @if (searchResults().transactions.length) {
                <div class="result-group">
                  <div class="group-title">TRANSACTIONS</div>
                  @for (txn of searchResults().transactions.slice(0, 4); track txn.id) {
                    <a [routerLink]="['/transactions']" (click)="clearSearch()" class="result-item">
                      <span class="item-title">{{ txn.description }}</span>
                      <span class="item-sub" [class.text-danger]="txn.direction === 'DEBIT'">
                        {{ txn.direction === 'DEBIT' ? '-' : '+' }}₹{{ txn.amount.toLocaleString('en-IN') }}
                      </span>
                    </a>
                  }
                </div>
              }
              @if (searchResults().beneficiaries.length) {
                <div class="result-group">
                  <div class="group-title">BENEFICIARIES</div>
                  @for (ben of searchResults().beneficiaries; track ben.id) {
                    <a [routerLink]="['/transfers']" (click)="clearSearch()" class="result-item">
                      <span class="item-title">{{ ben.name }}</span>
                      <span class="item-sub">{{ ben.bankName }}</span>
                    </a>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Right side: Actions & User -->
      <div class="right-section">
        <!-- Theme Toggle -->
        <button class="action-btn" (click)="themeService.toggleTheme()" aria-label="Toggle Theme" [title]="'Switch to ' + (themeService.currentTheme() === 'dark' ? 'Light' : 'Dark') + ' Mode'">
          @if (themeService.currentTheme() === 'dark') {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          } @else {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          }
        </button>

        <!-- Notifications -->
        <div class="notif-wrapper">
          <button class="action-btn" (click)="toggleNotifDropdown()" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            @if (bankData.unreadNotificationsCount() > 0) {
              <span class="notif-dot">{{ bankData.unreadNotificationsCount() }}</span>
            }
          </button>

          <!-- Notifications Dropdown -->
          @if (showNotifDropdown()) {
            <div class="notif-dropdown">
              <div class="notif-header">
                <span class="font-semibold text-sm">Notifications</span>
                <button class="mark-read-btn" (click)="bankData.markAllNotificationsAsRead()">Mark all as read</button>
              </div>
              <div class="notif-list">
                @for (n of bankData.notifications(); track n.id) {
                  <div class="notif-item" [class.unread]="!n.read" (click)="bankData.markNotificationAsRead(n.id)">
                    <div class="notif-item-body">
                      <p class="notif-title">{{ n.title }}</p>
                      <p class="notif-msg">{{ n.message }}</p>
                      <span class="notif-time">{{ n.time }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- User Profile Dropdown -->
        @if (bankData.user(); as u) {
          <a [routerLink]="['/settings']" class="user-profile-badge">
            <img [src]="u.avatar" [alt]="u.name" class="avatar-img" />
            <div class="user-meta">
              <span class="user-name">{{ u.name }}</span>
              <span class="user-tag">Customer ID: {{ u.id }}</span>
            </div>
          </a>
        }
      </div>
    </header>
  `,
  styles: [`
    .topbar-container {
      height: var(--topbar-height);
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .left-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      max-width: 580px;
    }

    .mobile-menu-btn {
      display: none;
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 0.25rem;
    }

    @media (max-width: 1024px) {
      .mobile-menu-btn {
        display: flex;
      }
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-icon {
      position: absolute;
      left: 0.875rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-faint);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.5625rem 2.25rem 0.5625rem 2.5rem;
      background-color: var(--bg-surface-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 0.875rem;
      outline: none;
      transition: all 0.2s ease;
    }

    .search-input:focus {
      border-color: var(--brand-blue);
      background-color: var(--bg-surface);
      box-shadow: 0 0 0 3px var(--brand-blue-subtle);
    }

    .search-clear {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.875rem;
    }

    .search-results-popover {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      max-height: 380px;
      overflow-y: auto;
      z-index: 50;
    }

    .popover-header {
      padding: 0.625rem 0.875rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-faint);
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface-subtle);
    }

    .result-group {
      padding: 0.5rem 0;
    }

    .group-title {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-faint);
      padding: 0.25rem 0.875rem;
    }

    .result-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      transition: background-color 0.15s ease;
    }

    .result-item:hover {
      background-color: var(--bg-surface-subtle);
    }

    .item-title {
      font-weight: 500;
      color: var(--text-main);
    }

    .item-sub {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      background-color: var(--bg-surface-subtle);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background-color: var(--border-subtle);
      color: var(--text-main);
    }

    .notif-wrapper {
      position: relative;
    }

    .notif-dot {
      position: absolute;
      top: -4px;
      right: -4px;
      background-color: var(--brand-blue);
      color: #ffffff;
      font-size: 0.625rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid var(--bg-surface);
    }

    .notif-dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 10px);
      width: 320px;
      max-height: 420px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 50;
      overflow-y: auto;
    }

    .notif-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mark-read-btn {
      background: none;
      border: none;
      color: var(--brand-blue);
      font-size: 0.75rem;
      cursor: pointer;
      font-weight: 500;
    }

    .notif-item {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .notif-item:hover {
      background-color: var(--bg-surface-subtle);
    }

    .notif-item.unread {
      background-color: var(--brand-blue-subtle);
    }

    .notif-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .notif-msg {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.125rem;
    }

    .notif-time {
      font-size: 0.6875rem;
      color: var(--text-faint);
      margin-top: 0.25rem;
      display: inline-block;
    }

    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.375rem 0.625rem;
      border-radius: var(--radius-md);
      transition: background-color 0.15s ease;
      cursor: pointer;
    }

    .user-profile-badge:hover {
      background-color: var(--bg-surface-subtle);
    }

    .avatar-img {
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      object-fit: cover;
      border: 2px solid var(--brand-blue);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .user-tag {
      font-size: 0.6875rem;
      color: var(--text-muted);
    }

    @media (max-width: 640px) {
      .user-meta {
        display: none;
      }
      .topbar-container {
        padding: 0 1rem;
      }
    }
  `]
})
export class TopbarComponent {
  themeService = inject(ThemeService);
  bankData = inject(BankDataService);

  toggleMobileMenu = output<void>();

  searchQuery = '';
  showSearchResults = signal(false);
  showNotifDropdown = signal(false);

  searchResults = signal<{
    transactions: any[];
    accounts: any[];
    beneficiaries: any[];
    bills: any[];
  }>({ transactions: [], accounts: [], beneficiaries: [], bills: [] });

  onSearchInput(): void {
    if (this.searchQuery.trim().length > 1) {
      const res = this.bankData.search(this.searchQuery);
      this.searchResults.set(res);
      this.showSearchResults.set(true);
    } else {
      this.searchResults.set({ transactions: [], accounts: [], beneficiaries: [], bills: [] });
      this.showSearchResults.set(false);
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSearchResults.set(false);
  }

  toggleNotifDropdown(): void {
    this.showNotifDropdown.update(v => !v);
  }
}
