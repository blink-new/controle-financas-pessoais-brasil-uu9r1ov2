import { supabase } from '../lib/supabase'
import { blink } from '../blink/client'

export interface Account {
  id: string
  userId: string
  name: string
  type: 'checking' | 'savings' | 'credit_card' | 'investment'
  institution: string
  balance: number
  creditLimit?: number
  dueDate?: number
  closingDate?: number
  color: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OpenFinanceConnection {
  id: string
  userId: string
  institutionName: string
  connectionId: string
  status: 'connected' | 'disconnected' | 'expired' | 'error'
  consentExpiry?: string
  lastSync?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId?: string
  description: string
  amount: number
  transactionDate: string
  type: 'income' | 'expense' | 'transfer'
  installmentNumber: number
  totalInstallments: number
  installmentGroupId?: string
  isRecurring: boolean
  recurringFrequency?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  type: 'income' | 'expense' | 'transfer'
  color: string
  icon: string
  isSystem: boolean
  createdAt: string
}

class SupabaseService {
  private async getCurrentUser() {
    try {
      const user = await blink.auth.me()
      return user
    } catch (error) {
      console.error('User not authenticated:', error)
      throw new Error('User not authenticated')
    }
  }

  // Accounts
  async getAccounts(): Promise<Account[]> {
    const user = await this.getCurrentUser()
    
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching accounts:', error)
      throw error
    }

    return data.map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      type: account.type,
      institution: account.bank_name,
      balance: account.balance,
      creditLimit: account.credit_limit,
      dueDate: account.due_date,
      closingDate: account.closing_date,
      color: '#0052CC', // Default color, can be enhanced later
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }))
  }

  async createAccount(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    const user = await this.getCurrentUser()
    
    const { data: account, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name: data.name,
        type: data.type,
        bank_name: data.institution,
        balance: data.balance,
        credit_limit: data.creditLimit,
        due_date: data.dueDate,
        closing_date: data.closingDate,
        is_active: data.isActive
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating account:', error)
      throw error
    }

    return {
      id: account.id,
      userId: account.user_id,
      name: account.name,
      type: account.type,
      institution: account.bank_name,
      balance: account.balance,
      creditLimit: account.credit_limit,
      dueDate: account.due_date,
      closingDate: account.closing_date,
      color: data.color,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }
  }

  async updateAccount(id: string, data: Partial<Account>): Promise<Account> {
    const { data: account, error } = await supabase
      .from('accounts')
      .update({
        name: data.name,
        type: data.type,
        bank_name: data.institution,
        balance: data.balance,
        credit_limit: data.creditLimit,
        due_date: data.dueDate,
        closing_date: data.closingDate,
        is_active: data.isActive
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating account:', error)
      throw error
    }

    return {
      id: account.id,
      userId: account.user_id,
      name: account.name,
      type: account.type,
      institution: account.bank_name,
      balance: account.balance,
      creditLimit: account.credit_limit,
      dueDate: account.due_date,
      closingDate: account.closing_date,
      color: data.color || '#0052CC',
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at
    }
  }

  async deleteAccount(id: string): Promise<void> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  // Open Finance Connections
  async getOpenFinanceConnections(): Promise<OpenFinanceConnection[]> {
    const user = await this.getCurrentUser()
    
    const { data, error } = await supabase
      .from('open_finance_connections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching open finance connections:', error)
      throw error
    }

    return data.map(conn => ({
      id: conn.id,
      userId: conn.user_id,
      institutionName: conn.institution_name,
      connectionId: conn.connection_id,
      status: conn.status,
      consentExpiry: conn.consent_expiry,
      lastSync: conn.last_sync,
      errorMessage: conn.error_message,
      createdAt: conn.created_at,
      updatedAt: conn.updated_at
    }))
  }

  async createOpenFinanceConnection(data: Omit<OpenFinanceConnection, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpenFinanceConnection> {
    const user = await this.getCurrentUser()
    
    const { data: connection, error } = await supabase
      .from('open_finance_connections')
      .insert({
        user_id: user.id,
        institution_name: data.institutionName,
        connection_id: data.connectionId,
        status: data.status,
        consent_expiry: data.consentExpiry,
        last_sync: data.lastSync,
        error_message: data.errorMessage
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating open finance connection:', error)
      throw error
    }

    return {
      id: connection.id,
      userId: connection.user_id,
      institutionName: connection.institution_name,
      connectionId: connection.connection_id,
      status: connection.status,
      consentExpiry: connection.consent_expiry,
      lastSync: connection.last_sync,
      errorMessage: connection.error_message,
      createdAt: connection.created_at,
      updatedAt: connection.updated_at
    }
  }

  async updateOpenFinanceConnection(id: string, data: Partial<OpenFinanceConnection>): Promise<OpenFinanceConnection> {
    const { data: connection, error } = await supabase
      .from('open_finance_connections')
      .update({
        institution_name: data.institutionName,
        connection_id: data.connectionId,
        status: data.status,
        consent_expiry: data.consentExpiry,
        last_sync: data.lastSync,
        error_message: data.errorMessage
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating open finance connection:', error)
      throw error
    }

    return {
      id: connection.id,
      userId: connection.user_id,
      institutionName: connection.institution_name,
      connectionId: connection.connection_id,
      status: connection.status,
      consentExpiry: connection.consent_expiry,
      lastSync: connection.last_sync,
      errorMessage: connection.error_message,
      createdAt: connection.created_at,
      updatedAt: connection.updated_at
    }
  }

  async deleteOpenFinanceConnection(id: string): Promise<void> {
    const { error } = await supabase
      .from('open_finance_connections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting open finance connection:', error)
      throw error
    }
  }

  // Transactions
  async getTransactions(limit = 50): Promise<Transaction[]> {
    const user = await this.getCurrentUser()
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }

    return data.map(transaction => ({
      id: transaction.id,
      userId: transaction.user_id,
      accountId: transaction.account_id,
      categoryId: transaction.category_id,
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transaction_date,
      type: transaction.type,
      installmentNumber: transaction.installment_number,
      totalInstallments: transaction.total_installments,
      installmentGroupId: transaction.installment_group_id,
      isRecurring: transaction.is_recurring,
      recurringFrequency: transaction.recurring_frequency,
      notes: transaction.notes,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    }))
  }

  async createTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const user = await this.getCurrentUser()
    
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        account_id: data.accountId,
        category_id: data.categoryId,
        description: data.description,
        amount: data.amount,
        transaction_date: data.transactionDate,
        type: data.type,
        installment_number: data.installmentNumber,
        total_installments: data.totalInstallments,
        installment_group_id: data.installmentGroupId,
        is_recurring: data.isRecurring,
        recurring_frequency: data.recurringFrequency,
        notes: data.notes
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      throw error
    }

    return {
      id: transaction.id,
      userId: transaction.user_id,
      accountId: transaction.account_id,
      categoryId: transaction.category_id,
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transaction_date,
      type: transaction.type,
      installmentNumber: transaction.installment_number,
      totalInstallments: transaction.total_installments,
      installmentGroupId: transaction.installment_group_id,
      isRecurring: transaction.is_recurring,
      recurringFrequency: transaction.recurring_frequency,
      notes: transaction.notes,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const user = await this.getCurrentUser()
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${user.id},user_id.eq.system`)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    return data.map(category => ({
      id: category.id,
      userId: category.user_id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.is_system,
      createdAt: category.created_at
    }))
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const user = await this.getCurrentUser()
    
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: data.name,
        type: data.type,
        color: data.color,
        icon: data.icon,
        is_system: data.isSystem
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      throw error
    }

    return {
      id: category.id,
      userId: category.user_id,
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isSystem: category.is_system,
      createdAt: category.created_at
    }
  }
}

export const supabaseService = new SupabaseService()