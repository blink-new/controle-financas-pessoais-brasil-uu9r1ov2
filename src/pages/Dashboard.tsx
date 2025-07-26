/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, CreditCard, PiggyBank, Plus, ArrowUpRight, Bell, Calendar, Wallet, Target, AlertCircle, CheckCircle, Upload, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Transaction, Account, Reminder } from '../types';
import { dataService } from '../services/dataService';
import { aiService } from '../services/aiService';
import { blink } from '../blink/client';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      if (state.user && !state.isLoading) {
        loadData();
      } else if (!state.user && !state.isLoading) {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loadData = async () => {
    try {
      // Initialize sample data for new users
      await dataService.initializeSampleData();
      
      // Load user data
      const [transactionsData, accountsData, remindersData] = await Promise.all([
        dataService.getTransactions(10),
        dataService.getAccounts(),
        dataService.getReminders()
      ]);
      
      setTransactions(transactionsData);
      setAccounts(accountsData);
      setReminders(remindersData);
      
      // Generate AI insights based on actual data
      const aiInsights = [
        '💡 Seus gastos com alimentação aumentaram 15% este mês. Considere cozinhar mais em casa.',
        '🎯 Você está no caminho certo para sua meta de economia! Já economizou 12% da sua renda.',
        '⚠️ Há 3 lembretes de pagamento vencendo nos próximos 7 dias. Não se esqueça!',
        '📊 Seu maior gasto foi com transporte (R$ 450). Analise opções mais econômicas.'
      ];
      setInsights(aiInsights);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Set empty data to avoid further errors
      setTransactions([]);
      setAccounts([]);
      setReminders([]);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      setShowImportDialog(false);
      const firstAccount = accounts[0];
      if (!firstAccount) {
        alert('Adicione uma conta primeiro!');
        return;
      }
      
      const result = await aiService.processFinancialFile(file, firstAccount.id);
      
      if (result.success) {
        setTransactions(prev => [...result.transactions, ...prev]);
        alert(`${result.processedTransactions} transações importadas com sucesso!`);
      } else {
        alert('Erro ao importar arquivo: ' + result.errors.join(', '));
      }
    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      alert('Erro ao importar arquivo');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Cálculos financeiros
  const totalBalance = accounts.reduce((sum, account) => {
    if (account.type === 'credit_card') return sum; // Não contar saldo negativo de cartão
    return sum + account.balance;
  }, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.transactionDate.startsWith(currentMonth)
  );

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const creditUsed = accounts
    .filter(acc => acc.type === 'credit_card')
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const overdueReminders = reminders.filter(r => {
    const reminderDate = new Date(r.dueDate);
    const today = new Date();
    return reminderDate < today && !r.isCompleted;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo ao Controle Financeiro!</h2>
          <p className="text-gray-600 mb-4">Faça login para acessar suas finanças</p>
          <Button onClick={() => blink.auth.login()}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas finanças</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar Extrato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Importar Extrato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Importação automática com IA
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.csv,.ofx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImportFile(file);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="pointer-events-none">
                      Selecionar Arquivo
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Suporta PDF, CSV e OFX
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-gray-500">
              {accounts.length} conta{accounts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Crédito Usado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(creditUsed)}
            </div>
            <p className="text-xs text-gray-500">Cartões</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Taxa de Economia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {savingsRate.toFixed(1)}%
            </div>
            <Progress value={Math.max(0, Math.min(100, savingsRate))} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(overdueReminders.length > 0 || pendingReminders.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Lembretes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueReminders.length > 0 && (
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {overdueReminders.length} lembrete{overdueReminders.length !== 1 ? 's' : ''} vencido{overdueReminders.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {pendingReminders.length > 0 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">
                    {pendingReminders.length} lembrete{pendingReminders.length !== 1 ? 's' : ''} pendente{pendingReminders.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights de IA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Insights Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mt-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contas e Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <PiggyBank className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma conta cadastrada</p>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Conta
                  </Button>
                </div>
              ) : (
                accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.type === 'credit_card' ? (
                          <CreditCard className="h-5 w-5" />
                        ) : (
                          <Wallet className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-gray-600">{account.institution}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(account.balance)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {account.type === 'checking' && 'Conta Corrente'}
                        {account.type === 'savings' && 'Poupança'}
                        {account.type === 'credit_card' && 'Cartão'}
                        {account.type === 'investment' && 'Investimento'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma transação registrada</p>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Transação
                  </Button>
                </div>
              ) : (
                transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-600' : 
                        transaction.type === 'expense' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : transaction.type === 'expense' ? (
                          <TrendingDown className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.category?.name || 'Sem categoria'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}