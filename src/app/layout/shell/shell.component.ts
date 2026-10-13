import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { BankDataService } from '../../core/services/bank-data.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, BottomNavComponent],
  template: `
    <div class="shell-layout">
      <!-- Desktop Sidebar -->
      <app-sidebar class="desktop-sidebar"></app-sidebar>

      <!-- Mobile Drawer Modal -->
      @if (mobileDrawerOpen()) {
        <div class="drawer-backdrop" (click)="mobileDrawerOpen.set(false)">
          <div class="drawer-panel" (click)="$event.stopPropagation()">
            <div class="drawer-close-row">
              <span class="drawer-title">NovaBank Navigation</span>
              <button class="drawer-close-btn" (click)="mobileDrawerOpen.set(false)">✕</button>
            </div>
            <app-sidebar></app-sidebar>
          </div>
        </div>
      }

      <!-- Main Stage -->
      <div class="main-stage">
        <app-topbar (toggleMobileMenu)="mobileDrawerOpen.set(true)"></app-topbar>

        <main class="content-scroll">
          @if (bankData.isLoading()) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading NovaBank secure session...</p>
            </div>
          } @else {
            <router-outlet></router-outlet>
          }
        </main>

        <!-- Mobile Bottom Nav -->
        <app-bottom-nav (openMore)="mobileDrawerOpen.set(true)"></app-bottom-nav>
      </div>
    </div>
  `,
  styles: [`
    .shell-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-app);
    }

    .desktop-sidebar {
      display: block;
    }

    @media (max-width: 1024px) {
      .desktop-sidebar {
        display: none;
      }
    }

    .main-stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      position: relative;
    }

    .content-scroll {
      flex: 1;
      padding: 1.75rem;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .content-scroll {
        padding: 1rem 1rem 5.5rem;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      gap: 1rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--border-medium);
      border-top-color: var(--brand-blue);
      border-radius: 9999px;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
    }

    .drawer-panel {
      width: 280px;
      background: var(--bg-surface);
      height: 100%;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
    }

    .drawer-close-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .drawer-title {
      font-size: 0.875rem;
      font-weight: 700;
    }

    .drawer-close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--text-muted);
    }
  `]
})
export class ShellComponent {
  bankData = inject(BankDataService);
  mobileDrawerOpen = signal(false);
}
