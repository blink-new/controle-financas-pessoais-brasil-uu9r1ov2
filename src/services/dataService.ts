import { blink } from '../blink/client';
import { Transaction, Account, Category, Reminder } from '../types';
import { supabaseService } from './supabaseService';

export class DataService {
  private useMockData = false; // Try real database first
  private mockDataInitialized = false;

  private async ensureUser() {
    try {
      const user = await blink.auth.me();
      return user;
    } catch (error) {
      console.error('User not authenticated:', error);
      throw new Error('User not authenticated');
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    if (this.useMockData) {
      return false; // Already using mock data
    }
    
    try {
      // Try a simple query to check if database is available
      await supabaseService.getAccounts();
      this.useMockData = false;
      return true;
    } catch (error) {
      console.log('Database not available, using mock data. Error:', error);
      this.useMockData = true;
      return false;
    }
  }

  // Mock data storage
  private mockAccounts: Account[] = [];
  private mockTransactions: Transaction[] = [];
  private mockCategories: Category[] = [];
  private mockReminders: Reminder[] = [];

  private async initializeMockData() {
    if (this.mockDataInitialized) return;

    // Get the current user ID for mock data
    let currentUserId = 'user_1';
    try {
      const user = await blink.auth.me();
      currentUserId = user.id;
    } catch (error) {
      console.log('Could not get user ID, using default');
    }

    this.mockAccounts = [
      {
        id: 'acc_sample_1',
        userId: currentUserId,
        name: 'Conta Corrente Nubank',
        type: 'checking',
        institution: 'Nubank',
        balance: 2500.00,
        color: '#8A05BE',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'acc_sample_2',
        userId: currentUserId,
        name: 'Cartão Nubank',
        type: 'credit_card',
        institution: 'Nubank',
        balance: -350.00,
        creditLimit: 1500.00,
        dueDate: 15,
        closingDate: 10,
        color: '#8A05BE',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'acc_sample_3',
        userId: currentUserId,
        name: 'Poupança Itaú',
        type: 'savings',
        institution: 'Itaú',
        balance: 5000.00,
        color: '#FF7A00',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.mockCategories = [
      { id: 'cat_alimentacao', userId: currentUserId, name: 'Alimentação', type: 'expense', color: '#FF6B6B', icon: 'utensils', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_transporte', userId: currentUserId, name: 'Transporte', type: 'expense', color: '#4ECDC4', icon: 'car', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_moradia', userId: currentUserId, name: 'Moradia', type: 'expense', color: '#45B7D1', icon: 'home', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_saude', userId: currentUserId, name: 'Saúde', type: 'expense', color: '#96CEB4', icon: 'heart', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_lazer', userId: currentUserId, name: 'Lazer', type: 'expense', color: '#FFEAA7', icon: 'gamepad', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_educacao', userId: currentUserId, name: 'Educação', type: 'expense', color: '#DDA0DD', icon: 'book', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_compras', userId: currentUserId, name: 'Compras', type: 'expense', color: '#F8BBD0', icon: 'shopping-bag', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_salario', userId: currentUserId, name: 'Salário', type: 'income', color: '#4CAF50', icon: 'briefcase', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_freelance', userId: currentUserId, name: 'Freelance', type: 'income', color: '#81C784', icon: 'laptop', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_investimentos', userId: currentUserId, name: 'Investimentos', type: 'income', color: '#A5D6A7', icon: 'trending-up', isDefault: true, createdAt: new Date().toISOString() },
      { id: 'cat_transferencia', userId: currentUserId, name: 'Transferência', type: 'transfer', color: '#2196F3', icon: 'arrow-right', isDefault: true, createdAt: new Date().toISOString() }
    ];

    this.mockTransactions = [
      {
        id: 'txn_sample_1',
        userId: currentUserId,
        accountId: 'acc_sample_1',
        categoryId: 'cat_alimentacao',
        description: 'Supermercado Pão de Açúcar',
        amount: -156.87,
        transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'expense',
        installmentNumber: 1,
        totalInstallments: 1,
        isPending: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'txn_sample_2',
        userId: currentUserId,
        accountId: 'acc_sample_1',
        categoryId: 'cat_salario',
        description: 'Salário Empresa XYZ',
        amount: 3500.00,
        transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'income',
        installmentNumber: 1,
        totalInstallments: 1,
        isPending: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'txn_sample_3',
        userId: currentUserId,
        accountId: 'acc_sample_2',
        categoryId: 'cat_transporte',
        description: 'Uber',
        amount: -23.50,
        transactionDate: new Date().toISOString().split('T')[0],
        type: 'expense',
        installmentNumber: 1,
        totalInstallments: 1,
        isPending: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'txn_sample_4',
        userId: currentUserId,
        accountId: 'acc_sample_2',
        categoryId: 'cat_lazer',
        description: 'Netflix',
        amount: -25.90,
        transactionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'expense',
        installmentNumber: 1,
        totalInstallments: 1,
        isPending: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'txn_sample_5',
        userId: currentUserId,
        accountId: 'acc_sample_2',
        categoryId: 'cat_moradia',
        description: 'Aluguel',
        amount: -1200.00,
        transactionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'expense',
        installmentNumber: 1,
        totalInstallments: 1,
        isPending: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.mockReminders = [
      {
        id: 'rem_sample_1',
        userId: currentUserId,
        accountId: 'acc_sample_2',
        title: 'Vencimento Cartão Nubank',
        description: 'Lembrete para pagamento da fatura',
        amount: 350.00,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        repeatType: 'monthly',
        isCompleted: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rem_sample_2',
        userId: currentUserId,
        title: 'Aluguel',
        description: 'Pagamento do aluguel',
        amount: 1200.00,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        repeatType: 'monthly',
        isCompleted: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'rem_sample_3',
        userId: currentUserId,
        title: 'Internet',
        description: 'Mensalidade da internet',
        amount: 89.90,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        repeatType: 'monthly',
        isCompleted: false,
        createdAt: new Date().toISOString()
      }
    ];

    this.mockDataInitialized = true;
  }

  // Account methods
  async getAccounts(): Promise<Account[]> {
    if (!await this.checkDatabaseConnection()) {
      await this.initializeMockData();
      return this.mockAccounts;
    }

    try {
      const accounts = await supabaseService.getAccounts();
      return accounts;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      await this.initializeMockData();
      return this.mockAccounts;
    }
  }

  async createAccount(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    if (this.useMockData) {
      const newAccount: Account = {
        ...data,
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.mockAccounts.push(newAccount);
      return newAccount;
    }

    try {
      const account = await supabaseService.createAccount(data);
      return account;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    if (this.useMockData) {
      const index = this.mockAccounts.findIndex(acc => acc.id === id);
      if (index !== -1) {
        this.mockAccounts[index] = { ...this.mockAccounts[index], ...data, updatedAt: new Date().toISOString() };
        return this.mockAccounts[index];
      }
      throw new Error('Account not found');
    }

    try {
      const updatedAccount = await supabaseService.updateAccount(id, data);
      return updatedAccount;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteAccount(id: string): Promise<void> {
    if (this.useMockData) {
      this.mockAccounts = this.mockAccounts.filter(acc => acc.id !== id);
      return;
    }

    try {
      await supabaseService.deleteAccount(id);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Transaction methods
  async getTransactions(limit: number = 50): Promise<Transaction[]> {
    if (!await this.checkDatabaseConnection()) {
      await this.initializeMockData();
      return this.mockTransactions.slice(0, limit);
    }

    try {
      const transactions = await supabaseService.getTransactions(limit);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      await this.initializeMockData();
      return this.mockTransactions.slice(0, limit);
    }
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    if (this.useMockData) {
      const newTransaction: Transaction = {
        ...data,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.mockTransactions.unshift(newTransaction);
      return newTransaction;
    }

    try {
      const transaction = await supabaseService.createTransaction(data);
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    if (this.useMockData) {
      const index = this.mockTransactions.findIndex(txn => txn.id === id);
      if (index !== -1) {
        this.mockTransactions[index] = { ...this.mockTransactions[index], ...data, updatedAt: new Date().toISOString() };
        return this.mockTransactions[index];
      }
      throw new Error('Transaction not found');
    }

    try {
      const updatedTransaction = await blink.db.transactions.update(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    if (this.useMockData) {
      this.mockTransactions = this.mockTransactions.filter(txn => txn.id !== id);
      return;
    }

    try {
      await blink.db.transactions.delete(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    if (!await this.checkDatabaseConnection()) {
      await this.initializeMockData();
      return this.mockCategories;
    }

    try {
      const categories = await supabaseService.getCategories();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      await this.initializeMockData();
      return this.mockCategories;
    }
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    if (this.useMockData) {
      const newCategory: Category = {
        ...data,
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      this.mockCategories.push(newCategory);
      return newCategory;
    }

    try {
      const category = await supabaseService.createCategory(data);
      return category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  private async createDefaultCategories(): Promise<void> {
    try {
      const user = await this.ensureUser();
      
      const defaultCategories = [
        // Expense categories
        { name: 'Alimentação', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
        { name: 'Transporte', type: 'expense', color: '#4ECDC4', icon: 'car' },
        { name: 'Moradia', type: 'expense', color: '#45B7D1', icon: 'home' },
        { name: 'Saúde', type: 'expense', color: '#96CEB4', icon: 'heart' },
        { name: 'Lazer', type: 'expense', color: '#FFEAA7', icon: 'gamepad' },
        { name: 'Educação', type: 'expense', color: '#DDA0DD', icon: 'book' },
        { name: 'Compras', type: 'expense', color: '#F8BBD0', icon: 'shopping-bag' },
        { name: 'Serviços', type: 'expense', color: '#B39DDB', icon: 'settings' },
        
        // Income categories
        { name: 'Salário', type: 'income', color: '#4CAF50', icon: 'briefcase' },
        { name: 'Freelance', type: 'income', color: '#81C784', icon: 'laptop' },
        { name: 'Investimentos', type: 'income', color: '#A5D6A7', icon: 'trending-up' },
        { name: 'Outros', type: 'income', color: '#C8E6C9', icon: 'plus-circle' },
        
        // Transfer categories
        { name: 'Transferência', type: 'transfer', color: '#2196F3', icon: 'arrow-right' },
        
        // Investment categories
        { name: 'Ações', type: 'investment', color: '#9C27B0', icon: 'bar-chart' },
        { name: 'Tesouro Direto', type: 'investment', color: '#673AB7', icon: 'shield' },
        { name: 'CDB', type: 'investment', color: '#3F51B5', icon: 'credit-card' },
        { name: 'Fundos', type: 'investment', color: '#9C27B0', icon: 'pie-chart' }
      ];

      for (const category of defaultCategories) {
        await blink.db.categories.create({
          ...category,
          userId: user.id,
          isDefault: true,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error creating default categories:', error);
    }
  }

  // Reminder methods
  async getReminders(): Promise<Reminder[]> {
    if (!await this.checkDatabaseConnection()) {
      await this.initializeMockData();
      return this.mockReminders;
    }

    try {
      const user = await this.ensureUser();
      const reminders = await blink.db.reminders.list({
        where: { userId: user.id },
        orderBy: { dueDate: 'asc' }
      });
      return reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      await this.initializeMockData();
      return this.mockReminders;
    }
  }

  async createReminder(data: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> {
    if (this.useMockData) {
      const newReminder: Reminder = {
        ...data,
        id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      this.mockReminders.push(newReminder);
      return newReminder;
    }

    try {
      const user = await this.ensureUser();
      const reminder = await blink.db.reminders.create({
        ...data,
        userId: user.id,
        createdAt: new Date().toISOString()
      });
      return reminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    if (this.useMockData) {
      const index = this.mockReminders.findIndex(rem => rem.id === id);
      if (index !== -1) {
        this.mockReminders[index] = { ...this.mockReminders[index], ...data };
        return this.mockReminders[index];
      }
      throw new Error('Reminder not found');
    }

    try {
      const updatedReminder = await blink.db.reminders.update(id, data);
      return updatedReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  async deleteReminder(id: string): Promise<void> {
    if (this.useMockData) {
      this.mockReminders = this.mockReminders.filter(rem => rem.id !== id);
      return;
    }

    try {
      await blink.db.reminders.delete(id);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  // Initialize sample data for new users
  async initializeSampleData(): Promise<void> {
    // This method is no longer needed as we initialize mock data automatically
    // when the database is not available
    await this.initializeMockData();
  }
}

export const dataService = new DataService();