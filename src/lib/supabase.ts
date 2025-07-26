import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqhrsczownjbsyguzcyg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaHJzY3pvd25qYnN5Z3V6Y3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjI3NDgsImV4cCI6MjA2ODMzODc0OH0.UESQol8dvyNtIBG9oAVB2YKnfbF8ffGUwf-CO9H69jA'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'checking' | 'savings' | 'credit_card' | 'investment'
          bank_name: string
          account_number: string | null
          balance: number
          credit_limit: number | null
          closing_date: number | null
          due_date: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'checking' | 'savings' | 'credit_card' | 'investment'
          bank_name: string
          account_number?: string | null
          balance?: number
          credit_limit?: number | null
          closing_date?: number | null
          due_date?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'checking' | 'savings' | 'credit_card' | 'investment'
          bank_name?: string
          account_number?: string | null
          balance?: number
          credit_limit?: number | null
          closing_date?: number | null
          due_date?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      open_finance_connections: {
        Row: {
          id: string
          user_id: string
          institution_name: string
          connection_id: string
          status: 'connected' | 'disconnected' | 'expired' | 'error'
          consent_expiry: string | null
          last_sync: string | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution_name: string
          connection_id: string
          status?: 'connected' | 'disconnected' | 'expired' | 'error'
          consent_expiry?: string | null
          last_sync?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution_name?: string
          connection_id?: string
          status?: 'connected' | 'disconnected' | 'expired' | 'error'
          consent_expiry?: string | null
          last_sync?: string | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          account_id: string
          category_id: string | null
          description: string
          amount: number
          transaction_date: string
          type: 'income' | 'expense' | 'transfer'
          installment_number: number
          total_installments: number
          installment_group_id: string | null
          is_recurring: boolean
          recurring_frequency: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id: string
          category_id?: string | null
          description: string
          amount: number
          transaction_date: string
          type: 'income' | 'expense' | 'transfer'
          installment_number?: number
          total_installments?: number
          installment_group_id?: string | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string
          category_id?: string | null
          description?: string
          amount?: number
          transaction_date?: string
          type?: 'income' | 'expense' | 'transfer'
          installment_number?: number
          total_installments?: number
          installment_group_id?: string | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: 'income' | 'expense' | 'transfer'
          color: string
          icon: string
          is_system: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: 'income' | 'expense' | 'transfer'
          color?: string
          icon?: string
          is_system?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: 'income' | 'expense' | 'transfer'
          color?: string
          icon?: string
          is_system?: boolean
          created_at?: string
        }
      }
    }
  }
}