import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Home</span>
      </a>

      <a routerLink="/accounts" routerLinkActive="active" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
        <span>Accounts</span>
      </a>

      <a routerLink="/transfers" routerLinkActive="active" class="nav-item transfer-action">
        <div class="transfer-btn-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        </div>
        <span>Transfer</span>
      </a>

      <a routerLink="/cards" routerLinkActive="active" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
        <span>Cards</span>
      </a>

      <button class="nav-item more-btn" (click)="openMore.emit()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span>More</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background-color: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
      z-index: 40;
      padding: 0 0.5rem;
      align-items: center;
      justify-content: space-around;
    }

    @media (max-width: 1024px) {
      .bottom-nav {
        display: flex;
      }
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      color: var(--text-muted);
      font-size: 0.6875rem;
      font-weight: 500;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      flex: 1;
      transition: color 0.15s ease;
    }

    .nav-item.active {
      color: var(--brand-blue);
      font-weight: 600;
    }

    .transfer-action {
      position: relative;
    }

    .transfer-btn-circle {
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      background: linear-gradient(135deg, var(--brand-blue) 0%, #1d4ed8 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
      margin-top: -16px;
      margin-bottom: 2px;
    }
  `]
})
export class BottomNavComponent {
  openMore = output<void>();
}
