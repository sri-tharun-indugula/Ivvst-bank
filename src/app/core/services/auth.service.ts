import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BankDataService } from './bank-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private bankData = inject(BankDataService);

  readonly isAuthenticated = signal<boolean>(true);
  readonly user = this.bankData.user;

  login(email: string, password?: string): boolean {
    if (email) {
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }
}
