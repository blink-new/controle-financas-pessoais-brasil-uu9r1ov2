import { blink } from '@/blink/client'
import { supabaseService } from './supabaseService'

export interface OpenFinanceInstitution {
  id: string
  name: string
  logo: string
  type: 'bank' | 'fintech'
  supportedServices: string[]
}

export interface OpenFinanceAccount {
  id: string
  institutionId: string
  name: string
  type: 'checking' | 'savings' | 'credit_card' | 'investment'
  balance: number
  currency: string
  accountNumber: string
  branch?: string
}

export interface OpenFinanceTransaction {
  id: string
  accountId: string
  description: string
  amount: number
  date: string
  category: string
  type: 'debit' | 'credit'
  merchant?: string
  location?: string
}

export interface OpenFinanceConnection {
  id: string
  institutionId: string
  institutionName: string
  status: 'connected' | 'expired' | 'error'
  lastSync: string
  accounts: OpenFinanceAccount[]
}

// Simulação de instituições financeiras brasileiras
const MOCK_INSTITUTIONS: OpenFinanceInstitution[] = [
  {
    id: 'bb',
    name: 'Banco do Brasil',
    logo: '🏦',
    type: 'bank',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    logo: '🏦',
    type: 'bank',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    logo: '🏦',
    type: 'bank',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'santander',
    name: 'Santander',
    logo: '🏦',
    type: 'bank',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica Federal',
    logo: '🏦',
    type: 'bank',
    supportedServices: ['accounts', 'transactions']
  },
  {
    id: 'nubank',
    name: 'Nubank',
    logo: '💳',
    type: 'fintech',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    logo: '🧡',
    type: 'fintech',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  },
  {
    id: 'c6',
    name: 'C6 Bank',
    logo: '⚫',
    type: 'fintech',
    supportedServices: ['accounts', 'transactions', 'credit_cards']
  }
]

class OpenFinanceService {
  // Obter instituições disponíveis
  async getInstitutions(): Promise<OpenFinanceInstitution[]> {
    // Em produção, isso viria de uma API real do Open Finance
    return MOCK_INSTITUTIONS
  }

  // Iniciar processo de conexão com uma instituição
  async connectInstitution(institutionId: string): Promise<{ authUrl: string }> {
    const institution = MOCK_INSTITUTIONS.find(i => i.id === institutionId)
    if (!institution) {
      throw new Error('Instituição não encontrada')
    }

    // Simular URL de autenticação do Open Finance
    const authUrl = `https://auth.openfinance.com.br/connect/${institutionId}?client_id=your_client_id&redirect_uri=${encodeURIComponent(window.location.origin)}/callback`
    
    return { authUrl }
  }

  // Processar callback de autenticação
  async handleAuthCallback(code: string, institutionId: string): Promise<OpenFinanceConnection> {
    const user = await blink.auth.me()
    
    // Simular troca de código por token
    const mockConnection: OpenFinanceConnection = {
      id: `conn_${Date.now()}`,
      institutionId,
      institutionName: MOCK_INSTITUTIONS.find(i => i.id === institutionId)?.name || 'Banco',
      status: 'connected',
      lastSync: new Date().toISOString(),
      accounts: this.generateMockAccounts(institutionId)
    }

    // Salvar conexão no banco
    try {
      await supabaseService.createOpenFinanceConnection({
        userId: user.id,
        institutionName: mockConnection.institutionName,
        connectionId: mockConnection.id,
        status: 'connected'
      })
    } catch (error) {
      console.log('Erro ao salvar conexão, usando mock:', error)
    }

    return mockConnection
  }

  // Gerar contas mock para demonstração
  private generateMockAccounts(institutionId: string): OpenFinanceAccount[] {
    const accounts: OpenFinanceAccount[] = []
    
    switch (institutionId) {
      case 'nubank':
        accounts.push({
          id: 'acc_nu_conta',
          institutionId,
          name: 'Conta do Nubank',
          type: 'checking',
          balance: 2500.50,
          currency: 'BRL',
          accountNumber: '****1234'
        })
        accounts.push({
          id: 'acc_nu_credito',
          institutionId,
          name: 'Cartão de Crédito Nubank',
          type: 'credit_card',
          balance: -850.30,
          currency: 'BRL',
          accountNumber: '****5678'
        })
        break
      
      case 'itau':
        accounts.push({
          id: 'acc_itau_cc',
          institutionId,
          name: 'Conta Corrente Itaú',
          type: 'checking',
          balance: 4200.75,
          currency: 'BRL',
          accountNumber: '12345-6',
          branch: '0001'
        })
        accounts.push({
          id: 'acc_itau_poup',
          institutionId,
          name: 'Poupança Itaú',
          type: 'savings',
          balance: 8500.00,
          currency: 'BRL',
          accountNumber: '12345-7',
          branch: '0001'
        })
        break
      
      default:
        accounts.push({
          id: `acc_${institutionId}_default`,
          institutionId,
          name: `Conta ${MOCK_INSTITUTIONS.find(i => i.id === institutionId)?.name}`,
          type: 'checking',
          balance: Math.random() * 10000,
          currency: 'BRL',
          accountNumber: '****' + Math.floor(Math.random() * 9999)
        })
    }

    return accounts
  }

  // Sincronizar dados de uma conexão
  async syncConnection(connectionId: string): Promise<{
    accounts: OpenFinanceAccount[]
    transactions: OpenFinanceTransaction[]
  }> {
    const connection = await this.getConnection(connectionId)
    const accounts = connection.accounts

    // Gerar transações mock
    const transactions = this.generateMockTransactions(accounts)

    // Salvar transações no banco
    const user = await blink.auth.me()
    for (const transaction of transactions) {
      try {
        await supabaseService.createTransaction({
          userId: user.id,
          accountId: transaction.accountId,
          description: transaction.description,
          amount: transaction.amount,
          transactionDate: transaction.date,
          type: transaction.type === 'debit' ? 'expense' : 'income',
          installmentNumber: 1,
          totalInstallments: 1,
          isRecurring: false
        })
      } catch (error) {
        console.log('Erro ao salvar transação:', error)
      }
    }

    return { accounts, transactions }
  }

  // Gerar transações mock
  private generateMockTransactions(accounts: OpenFinanceAccount[]): OpenFinanceTransaction[] {
    const transactions: OpenFinanceTransaction[] = []
    const categories = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Moradia']
    const merchants = ['Supermercado Extra', 'Uber', 'Netflix', 'Farmácia', 'Posto Shell', 'Restaurante']

    accounts.forEach(account => {
      for (let i = 0; i < 10; i++) {
        const isCredit = Math.random() > 0.7
        const amount = isCredit ? Math.random() * 1000 : -(Math.random() * 200)
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))

        transactions.push({
          id: `trans_${account.id}_${i}`,
          accountId: account.id,
          description: merchants[Math.floor(Math.random() * merchants.length)],
          amount,
          date: date.toISOString(),
          category: categories[Math.floor(Math.random() * categories.length)],
          type: isCredit ? 'credit' : 'debit',
          merchant: merchants[Math.floor(Math.random() * merchants.length)]
        })
      }
    })

    return transactions
  }

  // Obter conexões do usuário
  async getConnections(): Promise<OpenFinanceConnection[]> {
    try {
      const connections = await supabaseService.getOpenFinanceConnections()

      return connections.map(conn => ({
        id: conn.id,
        institutionId: conn.connectionId,
        institutionName: conn.institutionName,
        status: conn.status as 'connected' | 'expired' | 'error',
        lastSync: conn.lastSync || conn.updatedAt,
        accounts: this.generateMockAccounts(conn.connectionId)
      }))
    } catch (error) {
      console.log('Erro ao buscar conexões, usando mock:', error)
      return []
    }
  }

  // Obter conexão específica
  async getConnection(connectionId: string): Promise<OpenFinanceConnection> {
    const connections = await this.getConnections()
    const connection = connections.find(c => c.id === connectionId)
    
    if (!connection) {
      throw new Error('Conexão não encontrada')
    }

    return connection
  }

  // Remover conexão
  async removeConnection(connectionId: string): Promise<void> {
    try {
      await supabaseService.deleteOpenFinanceConnection(connectionId)
    } catch (error) {
      console.log('Erro ao remover conexão:', error)
    }
  }

  // Obter status de saúde das conexões
  async getConnectionsHealth(): Promise<{
    total: number
    active: number
    expired: number
    errors: number
  }> {
    const connections = await this.getConnections()
    
    return {
      total: connections.length,
      active: connections.filter(c => c.status === 'connected').length,
      expired: connections.filter(c => c.status === 'expired').length,
      errors: connections.filter(c => c.status === 'error').length
    }
  }
}

export const openFinanceService = new OpenFinanceService()