/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Link2, 
  RefreshCw, 
  Trash2, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  openFinanceService, 
  OpenFinanceInstitution, 
  OpenFinanceConnection 
} from '@/services/openFinanceService'
import { supabaseService } from '@/services/supabaseService'

export default function OpenFinance() {
  const [connections, setConnections] = useState<OpenFinanceConnection[]>([])
  const [institutions, setInstitutions] = useState<OpenFinanceInstitution[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [connectionsData, institutionsData] = await Promise.all([
        openFinanceService.getConnections(),
        openFinanceService.getInstitutions()
      ])
      
      setConnections(connectionsData)
      setInstitutions(institutionsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do Open Finance')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (institutionId: string) => {
    try {
      const { authUrl } = await openFinanceService.connectInstitution(institutionId)
      
      // Simular processo de autenticação
      toast.success('Redirecionando para autenticação...')
      
      // Em produção, seria um redirect real
      setTimeout(async () => {
        try {
          const connection = await openFinanceService.handleAuthCallback('mock_code', institutionId)
          setConnections(prev => [...prev, connection])
          setShowAddDialog(false)
          toast.success(`Conexão com ${connection.institutionName} estabelecida!`)
        } catch (error) {
          toast.error('Erro ao conectar com a instituição')
        }
      }, 2000)
    } catch (error) {
      toast.error('Erro ao iniciar conexão')
    }
  }

  const handleSync = async (connectionId: string) => {
    setSyncing(connectionId)
    try {
      const { accounts, transactions } = await openFinanceService.syncConnection(connectionId)
      
      toast.success(`Sincronização concluída: ${transactions.length} transações importadas`)
      
      // Atualizar conexão
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, lastSync: new Date().toISOString() }
          : conn
      ))
    } catch (error) {
      toast.error('Erro na sincronização')
    } finally {
      setSyncing(null)
    }
  }

  const handleRemove = async (connectionId: string) => {
    try {
      await openFinanceService.removeConnection(connectionId)
      setConnections(prev => prev.filter(conn => conn.id !== connectionId))
      toast.success('Conexão removida')
    } catch (error) {
      toast.error('Erro ao remover conexão')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-4 w-4" />
      case 'savings':
        return <PiggyBank className="h-4 w-4" />
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />
      case 'investment':
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Carregando conexões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Open Finance</h1>
          <p className="text-muted-foreground">
            Conecte suas contas bancárias e importe transações automaticamente
          </p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Conectar Banco
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Conectar Instituição Financeira</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {institutions.map((institution) => (
                <Card key={institution.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{institution.logo}</div>
                        <div>
                          <h3 className="font-medium">{institution.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {institution.type === 'bank' ? 'Banco' : 'Fintech'}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleConnect(institution.id)}
                        disabled={connections.some(c => c.institutionId === institution.id)}
                      >
                        {connections.some(c => c.institutionId === institution.id) ? 'Conectado' : 'Conectar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Open Finance:</strong> Integração segura com instituições financeiras brasileiras. 
          Suas credenciais são criptografadas e nunca armazenadas em nossos servidores.
        </AlertDescription>
      </Alert>

      {connections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Link2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhuma conexão encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Conecte suas contas bancárias para importar transações automaticamente
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Conectar Primeiro Banco
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {institutions.find(i => i.id === connection.institutionId)?.logo || '🏦'}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{connection.institutionName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(connection.status)}
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status === 'connected' ? 'Conectado' : 
                           connection.status === 'expired' ? 'Expirado' : 'Erro'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSync(connection.id)}
                      disabled={syncing === connection.id}
                    >
                      {syncing === connection.id ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Sincronizar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(connection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Última sincronização: {new Date(connection.lastSync).toLocaleString('pt-BR')}
                  </div>
                  
                  <div className="grid gap-2">
                    <h4 className="font-medium text-sm">Contas Conectadas</h4>
                    {connection.accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {getAccountIcon(account.type)}
                          <div>
                            <div className="font-medium text-sm">{account.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {account.accountNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium text-sm ${
                            account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {account.balance.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}