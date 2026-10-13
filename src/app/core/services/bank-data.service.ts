import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {
  BankDatabase,
  UserProfile,
  Account,
  Transaction,
  BankCard,
  Beneficiary,
  Bill,
  Loan,
  LoanProduct,
  SavingsGoal,
  Budget,
  BankDocument,
  BankNotification,
  SupportTicket
} from '../models/bank.models';

const STORAGE_KEY = 'novabank_db_state';

@Injectable({
  providedIn: 'root'
})
export class BankDataService {
  private http = inject(HttpClient);

  // Core signals
  readonly database = signal<BankDatabase | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Derived reactive signals
  readonly user = computed<UserProfile | null>(() => this.database()?.user ?? null);
  readonly accounts = computed<Account[]>(() => this.database()?.accounts ?? []);
  readonly transactions = computed<Transaction[]>(() => this.database()?.transactions ?? []);
  readonly cards = computed<BankCard[]>(() => this.database()?.cards ?? []);
  readonly beneficiaries = computed<Beneficiary[]>(() => this.database()?.beneficiaries ?? []);
  readonly bills = computed<Bill[]>(() => this.database()?.bills ?? []);
  readonly loans = computed<Loan[]>(() => this.database()?.loans ?? []);
  readonly loanProducts = computed<LoanProduct[]>(() => this.database()?.loanProducts ?? []);
  readonly savingsGoals = computed<SavingsGoal[]>(() => this.database()?.savingsGoals ?? []);
  readonly budgets = computed<Budget[]>(() => this.database()?.budgets ?? []);
  readonly statements = computed<BankDocument[]>(() => this.database()?.statements ?? []);
  readonly notifications = computed<BankNotification[]>(() => this.database()?.notifications ?? []);
  readonly supportTickets = computed<SupportTicket[]>(() => this.database()?.supportTickets ?? []);

  // Aggregated calculations
  readonly totalAvailableBalance = computed<number>(() => {
    return this.accounts().reduce((sum, acc) => sum + (acc.availableBalance || 0), 0);
  });

  readonly primaryAccount = computed<Account | null>(() => {
    return this.accounts().find(a => a.isPrimary) || this.accounts()[0] || null;
  });

  readonly unreadNotificationsCount = computed<number>(() => {
    return this.notifications().filter(n => !n.read).length;
  });

  constructor() {
    this.initData();
  }

  initData(): void {
    this.isLoading.set(true);

    // Check session storage first
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as BankDatabase;
          this.database.set(parsed);
          this.isLoading.set(false);
          return;
        } catch (e) {
          console.warn('Failed to parse cached bank db', e);
        }
      }
    }

    // Fetch from JSON file
    this.http.get<BankDatabase>('/data/novabank-db.json').pipe(
      tap(data => {
        this.database.set(data);
        this.persist(data);
        this.isLoading.set(false);
      }),
      catchError(err => {
        console.error('Failed to load bank data from JSON', err);
        this.error.set('Could not load bank data.');
        this.isLoading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  private persist(db: BankDatabase | null): void {
    if (db && typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  }

  // Mutations simulating backend operations
  transferMoney(payload: {
    fromAccountId: string;
    toBeneficiaryId?: string;
    toAccountNumber?: string;
    recipientName: string;
    amount: number;
    category?: string;
    note?: string;
  }): Observable<{ success: boolean; referenceNo: string; message: string }> {
    const current = this.database();
    if (!current) {
      return of({ success: false, referenceNo: '', message: 'Database not initialized' });
    }

    const sourceAcc = current.accounts.find(a => a.id === payload.fromAccountId);
    if (!sourceAcc || sourceAcc.availableBalance < payload.amount) {
      return of({ success: false, referenceNo: '', message: 'Insufficient funds or account invalid' });
    }

    const refNo = 'REF-NB-' + Date.now().toString().slice(-8);
    const newTxn: Transaction = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      accountId: payload.fromAccountId,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-GB'),
      description: payload.note || `Transfer to ${payload.recipientName}`,
      merchant: payload.recipientName,
      category: payload.category || 'Transfers',
      type: 'BANK_TRANSFER',
      amount: payload.amount,
      direction: 'DEBIT',
      status: 'COMPLETED',
      referenceNo: refNo,
      source: `${sourceAcc.type} (${sourceAcc.accountNumber})`,
      destination: payload.recipientName,
      fee: 0.00
    };

    const updatedAccounts = current.accounts.map(acc => {
      if (acc.id === payload.fromAccountId) {
        return {
          ...acc,
          availableBalance: acc.availableBalance - payload.amount,
          currentBalance: acc.currentBalance - payload.amount
        };
      }
      return acc;
    });

    const updatedDb: BankDatabase = {
      ...current,
      accounts: updatedAccounts,
      transactions: [newTxn, ...current.transactions]
    };

    this.database.set(updatedDb);
    this.persist(updatedDb);

    return of({ success: true, referenceNo: refNo, message: 'Transfer completed successfully' });
  }

  toggleCardFreeze(cardId: string): void {
    const current = this.database();
    if (!current) return;

    const updatedCards = current.cards.map(c => {
      if (c.id === cardId) {
        const nextStatus: 'ACTIVE' | 'FROZEN' = c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
        return { ...c, status: nextStatus };
      }
      return c;
    });

    const updatedDb = { ...current, cards: updatedCards };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  payBill(billId: string, accountId: string): Observable<{ success: boolean; message: string }> {
    const current = this.database();
    if (!current) return of({ success: false, message: 'Service unavailable' });

    const bill = current.bills.find(b => b.id === billId);
    const acc = current.accounts.find(a => a.id === accountId);

    if (!bill || !acc || acc.availableBalance < bill.amount) {
      return of({ success: false, message: 'Invalid bill or insufficient balance' });
    }

    const refNo = 'REF-BILL-' + Date.now().toString().slice(-6);
    const newTxn: Transaction = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      accountId: accountId,
      date: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-GB'),
      description: `Bill Payment - ${bill.billerName}`,
      merchant: bill.billerName,
      category: 'Utilities',
      type: 'BILL_PAYMENT',
      amount: bill.amount,
      direction: 'DEBIT',
      status: 'COMPLETED',
      referenceNo: refNo,
      source: `${acc.type} (${acc.accountNumber})`,
      destination: bill.billerName,
      fee: 0.00
    };

    const updatedBills = current.bills.map(b => (b.id === billId ? { ...b, status: 'PAID' as const } : b));
    const updatedAccounts = current.accounts.map(a =>
      a.id === accountId
        ? {
            ...a,
            availableBalance: a.availableBalance - bill.amount,
            currentBalance: a.currentBalance - bill.amount
          }
        : a
    );

    const updatedDb: BankDatabase = {
      ...current,
      bills: updatedBills,
      accounts: updatedAccounts,
      transactions: [newTxn, ...current.transactions]
    };

    this.database.set(updatedDb);
    this.persist(updatedDb);

    return of({ success: true, message: `Payment of ₹${bill.amount.toLocaleString('en-IN')} confirmed.` });
  }

  addBeneficiary(ben: Omit<Beneficiary, 'id' | 'status' | 'avatarColor'>): void {
    const current = this.database();
    if (!current) return;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const newBen: Beneficiary = {
      ...ben,
      id: 'BEN-' + Math.floor(100 + Math.random() * 900),
      status: 'VERIFIED',
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };

    const updatedDb = {
      ...current,
      beneficiaries: [newBen, ...current.beneficiaries]
    };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  deleteBeneficiary(benId: string): void {
    const current = this.database();
    if (!current) return;

    const updatedDb = {
      ...current,
      beneficiaries: current.beneficiaries.filter(b => b.id !== benId)
    };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  addGoalContribution(goalId: string, amount: number, accountId: string): Observable<boolean> {
    const current = this.database();
    if (!current) return of(false);

    const acc = current.accounts.find(a => a.id === accountId);
    if (!acc || acc.availableBalance < amount) return of(false);

    const updatedAccounts = current.accounts.map(a =>
      a.id === accountId
        ? { ...a, availableBalance: a.availableBalance - amount, currentBalance: a.currentBalance - amount }
        : a
    );

    const updatedGoals = current.savingsGoals.map(g =>
      g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
    );

    const updatedDb: BankDatabase = {
      ...current,
      accounts: updatedAccounts,
      savingsGoals: updatedGoals
    };

    this.database.set(updatedDb);
    this.persist(updatedDb);
    return of(true);
  }

  createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'currentAmount'>): void {
    const current = this.database();
    if (!current) return;

    const newGoal: SavingsGoal = {
      ...goal,
      id: 'GOAL-' + Math.floor(200 + Math.random() * 800),
      currentAmount: 0
    };

    const updatedDb = {
      ...current,
      savingsGoals: [...current.savingsGoals, newGoal]
    };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  markNotificationAsRead(id: string): void {
    const current = this.database();
    if (!current) return;

    const updated = current.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
    const updatedDb = { ...current, notifications: updated };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  markAllNotificationsAsRead(): void {
    const current = this.database();
    if (!current) return;

    const updated = current.notifications.map(n => ({ ...n, read: true }));
    const updatedDb = { ...current, notifications: updated };
    this.database.set(updatedDb);
    this.persist(updatedDb);
  }

  search(query: string): {
    transactions: Transaction[];
    accounts: Account[];
    beneficiaries: Beneficiary[];
    bills: Bill[];
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { transactions: [], accounts: [], beneficiaries: [], bills: [] };
    }

    const txns = this.transactions().filter(
      t =>
        t.description.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q)
    );

    const accs = this.accounts().filter(
      a =>
        a.type.toLowerCase().includes(q) ||
        a.accountNumber.includes(q) ||
        a.branch.toLowerCase().includes(q)
    );

    const bens = this.beneficiaries().filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        b.nickname.toLowerCase().includes(q) ||
        b.bankName.toLowerCase().includes(q)
    );

    const billsList = this.bills().filter(
      b => b.billerName.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    );

    return { transactions: txns, accounts: accs, beneficiaries: bens, bills: billsList };
  }
}
