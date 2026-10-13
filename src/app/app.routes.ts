import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./modules/accounts/accounts.component').then(m => m.AccountsComponent)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./modules/transactions/transactions.component').then(m => m.TransactionsComponent)
      },
      {
        path: 'transfers',
        loadComponent: () => import('./modules/transfers/transfers.component').then(m => m.TransfersComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./modules/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'cards',
        loadComponent: () => import('./modules/cards/cards.component').then(m => m.CardsComponent)
      },
      {
        path: 'loans',
        loadComponent: () => import('./modules/loans/loans.component').then(m => m.LoansComponent)
      },
      {
        path: 'savings',
        loadComponent: () => import('./modules/savings/savings.component').then(m => m.SavingsComponent)
      },
      {
        path: 'budgeting',
        loadComponent: () => import('./modules/budgeting/budgeting.component').then(m => m.BudgetingComponent)
      },
      {
        path: 'beneficiaries',
        loadComponent: () => import('./modules/beneficiaries/beneficiaries.component').then(m => m.BeneficiariesComponent)
      },
      {
        path: 'statements',
        loadComponent: () => import('./modules/statements/statements.component').then(m => m.StatementsComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./modules/support/support.component').then(m => m.SupportComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
