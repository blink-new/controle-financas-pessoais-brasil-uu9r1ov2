import { Account, Category, Transaction, Reminder } from '../types';

// Dados mock para desenvolvimento
export const mockCategories: Category[] = [
  {
    id: 'cat_alimentacao',
    userId: 'user_1',
    name: 'Alimentação',
    type: 'expense',
    color: '#FF6B6B',
    icon: 'UtensilsCrossed',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_transporte',
    userId: 'user_1',
    name: 'Transporte',
    type: 'expense',
    color: '#4ECDC4',
    icon: 'Car',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_moradia',
    userId: 'user_1',
    name: 'Moradia',
    type: 'expense',
    color: '#45B7D1',
    icon: 'Home',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_saude',
    userId: 'user_1',
    name: 'Saúde',
    type: 'expense',
    color: '#96CEB4',
    icon: 'Heart',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_lazer',
    userId: 'user_1',
    name: 'Lazer',
    type: 'expense',
    color: '#DDA0DD',
    icon: 'Music',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_salario',
    userId: 'user_1',
    name: 'Salário',
    type: 'income',
    color: '#98FB98',
    icon: 'TrendingUp',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat_freelance',
    userId: 'user_1',
    name: 'Freelance',
    type: 'income',
    color: '#90EE90',
    icon: 'Briefcase',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAccounts: Account[] = [
  {
    id: 'acc_nubank',
    userId: 'user_1',
    name: 'Nubank',
    type: 'checking',
    institution: 'Nubank',
    balance: 2450.75,
    color: '#8A05BE',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc_itau',
    userId: 'user_1',
    name: 'Itaú CC',
    type: 'checking',
    institution: 'Itaú',
    balance: 1200.50,
    color: '#FF7A00',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc_nubank_credit',
    userId: 'user_1',
    name: 'Nubank Cartão',
    type: 'credit_card',
    institution: 'Nubank',
    balance: -890.25,
    creditLimit: 5000,
    dueDate: 15,
    closingDate: 10,
    color: '#8A05BE',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc_inter_savings',
    userId: 'user_1',
    name: 'Inter Poupança',
    type: 'savings',
    institution: 'Banco Inter',
    balance: 8500.00,
    color: '#FF7A00',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    userId: 'user_1',
    accountId: 'acc_nubank',
    categoryId: 'cat_alimentacao',
    description: 'Supermercado Extra',
    amount: -125.50,
    transactionDate: '2024-01-15',
    type: 'expense',
    installmentNumber: 1,
    totalInstallments: 1,
    isPending: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'txn_2',
    userId: 'user_1',
    accountId: 'acc_nubank',
    categoryId: 'cat_salario',
    description: 'Salário Janeiro',
    amount: 4500.00,
    transactionDate: '2024-01-01',
    type: 'income',
    installmentNumber: 1,
    totalInstallments: 1,
    isPending: false,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 'txn_3',
    userId: 'user_1',
    accountId: 'acc_nubank_credit',
    categoryId: 'cat_transporte',
    description: 'Uber',
    amount: -25.80,
    transactionDate: '2024-01-14',
    type: 'expense',
    installmentNumber: 1,
    totalInstallments: 1,
    isPending: false,
    createdAt: '2024-01-14T18:30:00Z',
    updatedAt: '2024-01-14T18:30:00Z'
  },
  {
    id: 'txn_4',
    userId: 'user_1',
    accountId: 'acc_nubank_credit',
    categoryId: 'cat_lazer',
    description: 'Netflix',
    amount: -29.90,
    transactionDate: '2024-01-12',
    type: 'expense',
    installmentNumber: 1,
    totalInstallments: 1,
    isPending: false,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z'
  },
  {
    id: 'txn_5',
    userId: 'user_1',
    accountId: 'acc_nubank_credit',
    categoryId: 'cat_alimentacao',
    description: 'iFood - Jantar',
    amount: -45.90,
    transactionDate: '2024-01-13',
    type: 'expense',
    installmentNumber: 1,
    totalInstallments: 1,
    isPending: false,
    createdAt: '2024-01-13T20:15:00Z',
    updatedAt: '2024-01-13T20:15:00Z'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem_1',
    userId: 'user_1',
    accountId: 'acc_nubank_credit',
    title: 'Fatura Nubank',
    description: 'Vencimento da fatura do cartão',
    amount: 890.25,
    dueDate: '2024-01-15',
    repeatType: 'monthly',
    isCompleted: false,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'rem_2',
    userId: 'user_1',
    title: 'Aluguel',
    description: 'Pagamento do aluguel',
    amount: 1200.00,
    dueDate: '2024-01-10',
    repeatType: 'monthly',
    isCompleted: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Serviço para simular operações do banco
export const mockDataService = {
  // Accounts
  getAccounts: async (): Promise<Account[]> => {
    return [...mockAccounts];
  },

  createAccount: async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> => {
    const newAccount: Account = {
      ...account,
      id: `acc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockAccounts.push(newAccount);
    return newAccount;
  },

  updateAccount: async (id: string, updates: Partial<Account>): Promise<Account> => {
    const index = mockAccounts.findIndex(acc => acc.id === id);
    if (index === -1) throw new Error('Account not found');
    
    mockAccounts[index] = {
      ...mockAccounts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return mockAccounts[index];
  },

  deleteAccount: async (id: string): Promise<void> => {
    const index = mockAccounts.findIndex(acc => acc.id === id);
    if (index === -1) throw new Error('Account not found');
    mockAccounts.splice(index, 1);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return [...mockCategories];
  },

  createCategory: async (category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockCategories.push(newCategory);
    return newCategory;
  },

  // Transactions
  getTransactions: async (filters?: { accountId?: string; categoryId?: string; startDate?: string; endDate?: string }): Promise<Transaction[]> => {
    let filtered = [...mockTransactions];
    
    if (filters?.accountId) {
      filtered = filtered.filter(t => t.accountId === filters.accountId);
    }
    if (filters?.categoryId) {
      filtered = filtered.filter(t => t.categoryId === filters.categoryId);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(t => t.transactionDate >= filters.startDate!);
    }
    if (filters?.endDate) {
      filtered = filtered.filter(t => t.transactionDate <= filters.endDate!);
    }
    
    // Add account and category info
    return filtered.map(t => ({
      ...t,
      account: mockAccounts.find(acc => acc.id === t.accountId),
      category: mockCategories.find(cat => cat.id === t.categoryId)
    }));
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTransactions.push(newTransaction);
    
    // Update account balance
    const account = mockAccounts.find(acc => acc.id === transaction.accountId);
    if (account) {
      account.balance += transaction.amount;
      account.updatedAt = new Date().toISOString();
    }
    
    return newTransaction;
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    const oldTransaction = mockTransactions[index];
    
    mockTransactions[index] = {
      ...oldTransaction,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Update account balance if amount changed
    if (updates.amount !== undefined && updates.amount !== oldTransaction.amount) {
      const account = mockAccounts.find(acc => acc.id === oldTransaction.accountId);
      if (account) {
        account.balance = account.balance - oldTransaction.amount + updates.amount;
        account.updatedAt = new Date().toISOString();
      }
    }
    
    return mockTransactions[index];
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    
    const transaction = mockTransactions[index];
    
    // Update account balance
    const account = mockAccounts.find(acc => acc.id === transaction.accountId);
    if (account) {
      account.balance -= transaction.amount;
      account.updatedAt = new Date().toISOString();
    }
    
    mockTransactions.splice(index, 1);
  },

  // Reminders
  getReminders: async (): Promise<Reminder[]> => {
    return mockReminders.map(r => ({
      ...r,
      account: mockAccounts.find(acc => acc.id === r.accountId)
    }));
  },

  createReminder: async (reminder: Omit<Reminder, 'id' | 'createdAt'>): Promise<Reminder> => {
    const newReminder: Reminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockReminders.push(newReminder);
    return newReminder;
  },

  updateReminder: async (id: string, updates: Partial<Reminder>): Promise<Reminder> => {
    const index = mockReminders.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reminder not found');
    
    mockReminders[index] = {
      ...mockReminders[index],
      ...updates
    };
    return mockReminders[index];
  },

  deleteReminder: async (id: string): Promise<void> => {
    const index = mockReminders.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reminder not found');
    mockReminders.splice(index, 1);
  }
};