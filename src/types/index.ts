export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'investment';
  institution: string;
  balance: number;
  creditLimit?: number;
  dueDate?: number; // dia do vencimento da fatura
  closingDate?: number; // dia do fechamento
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense' | 'transfer' | 'investment';
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  description: string;
  amount: number;
  transactionDate: string;
  type: 'income' | 'expense' | 'transfer' | 'investment';
  installmentNumber: number;
  totalInstallments: number;
  installmentGroupId?: string;
  notes?: string;
  isPending: boolean;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

export interface Reminder {
  id: string;
  userId: string;
  accountId?: string;
  title: string;
  description?: string;
  amount?: number;
  dueDate: string;
  repeatType: 'none' | 'monthly' | 'yearly';
  isCompleted: boolean;
  createdAt: string;
  account?: Account;
}

export interface MonthlyReport {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: { [key: string]: number };
  incomesByCategory: { [key: string]: number };
}

export interface ImportResult {
  success: boolean;
  processedTransactions: number;
  errors: string[];
  transactions: Transaction[];
}