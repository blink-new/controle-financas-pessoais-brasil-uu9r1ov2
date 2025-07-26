/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, Wallet, PiggyBank, TrendingUp, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Account } from '../types';
import { dataService } from '../services/dataService';
import { supabaseService } from '../services/supabaseService';

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit_card: CreditCard,
  investment: TrendingUp
};

const accountTypeLabels = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  credit_card: 'Cartão de Crédito',
  investment: 'Investimento'
};

const institutionColors = {
  'Nubank': '#8A05BE',
  'Itaú': '#FF7A00',
  'Bradesco': '#CC092F',
  'Banco do Brasil': '#FFEB3B',
  'Santander': '#EC0000',
  'Caixa': '#1F4E79',
  'Banco Inter': '#FF7A00',
  'XP Investimentos': '#00A859',
  'Rico': '#FF6B00',
  'Clear': '#00C853',
  'Outros': '#6B7280'
};

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as Account['type'],
    institution: '',
    balance: 0,
    creditLimit: 0,
    dueDate: 15,
    closingDate: 10,
    color: '#0052CC'
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      // Try to use Supabase first, fallback to dataService
      try {
        const accountsData = await supabaseService.getAccounts();
        setAccounts(accountsData);
      } catch (supabaseError) {
        console.log('Supabase not available, using dataService:', supabaseError);
        const accountsData = await dataService.getAccounts();
        setAccounts(accountsData);
      }
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      // Try to use Supabase first, fallback to dataService
      let account;
      try {
        account = await supabaseService.createAccount({
          ...newAccount,
          userId: 'user_1', // This will be overridden by the service
          isActive: true
        });
      } catch (supabaseError) {
        console.log('Supabase not available, using dataService:', supabaseError);
        account = await dataService.createAccount({
          ...newAccount,
          userId: 'user_1', // This will be overridden by the service
          isActive: true
        });
      }
      setAccounts([...accounts, account]);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;
    
    try {
      const updatedAccount = await dataService.updateAccount(editingAccount.id, newAccount);
      setAccounts(accounts.map(acc => acc.id === editingAccount.id ? updatedAccount : acc));
      setEditingAccount(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await dataService.deleteAccount(id);
      setAccounts(accounts.filter(acc => acc.id !== id));
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  const resetForm = () => {
    setNewAccount({
      name: '',
      type: 'checking',
      institution: '',
      balance: 0,
      creditLimit: 0,
      dueDate: 15,
      closingDate: 10,
      color: '#0052CC'
    });
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setNewAccount({
      name: account.name,
      type: account.type,
      institution: account.institution,
      balance: account.balance,
      creditLimit: account.creditLimit || 0,
      dueDate: account.dueDate || 15,
      closingDate: account.closingDate || 10,
      color: account.color
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getAccountIcon = (type: Account['type']) => {
    const Icon = accountTypeIcons[type];
    return <Icon className="w-5 h-5" />;
  };

  const getInstitutionColor = (institution: string) => {
    return institutionColors[institution as keyof typeof institutionColors] || institutionColors.Outros;
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      if (account.type === 'credit_card') {
        return total; // Não contar saldo negativo de cartão no total
      }
      return total + account.balance;
    }, 0);
  };

  const getTotalCreditUsed = () => {
    return accounts
      .filter(acc => acc.type === 'credit_card')
      .reduce((total, account) => total + Math.abs(account.balance), 0);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando contas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas</h1>
          <p className="text-gray-600">Gerencie suas contas bancárias e cartões</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Conta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Conta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Conta</Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="Ex: Nubank, Itaú CC"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value as Account['type']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Conta Corrente</SelectItem>
                    <SelectItem value="savings">Poupança</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="investment">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="institution">Instituição</Label>
                <Select value={newAccount.institution} onValueChange={(value) => setNewAccount({...newAccount, institution: value, color: getInstitutionColor(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a instituição" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(institutionColors).map(institution => (
                      <SelectItem key={institution} value={institution}>
                        {institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="balance">Saldo Atual</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              
              {newAccount.type === 'credit_card' && (
                <>
                  <div>
                    <Label htmlFor="creditLimit">Limite do Cartão</Label>
                    <Input
                      id="creditLimit"
                      type="number"
                      step="0.01"
                      value={newAccount.creditLimit}
                      onChange={(e) => setNewAccount({...newAccount, creditLimit: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dueDate">Vencimento</Label>
                      <Input
                        id="dueDate"
                        type="number"
                        min="1"
                        max="31"
                        value={newAccount.dueDate}
                        onChange={(e) => setNewAccount({...newAccount, dueDate: parseInt(e.target.value) || 15})}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <Label htmlFor="closingDate">Fechamento</Label>
                      <Input
                        id="closingDate"
                        type="number"
                        min="1"
                        max="31"
                        value={newAccount.closingDate}
                        onChange={(e) => setNewAccount({...newAccount, closingDate: parseInt(e.target.value) || 10})}
                        placeholder="10"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddAccount}>
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalBalance())}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Crédito Usado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(getTotalCreditUsed())}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Contas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {accounts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: account.color }}
                  >
                    {getAccountIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.name}</h3>
                    <p className="text-sm text-gray-600">{account.institution}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(account)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAccount(account.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Saldo</span>
                  <span className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(account.balance)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tipo</span>
                  <Badge variant="secondary">
                    {accountTypeLabels[account.type]}
                  </Badge>
                </div>
                
                {account.type === 'credit_card' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Limite</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(account.creditLimit || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vencimento</span>
                      <span className="text-sm font-medium">
                        Dia {account.dueDate}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de Edição */}
      <Dialog open={editingAccount !== null} onOpenChange={(open) => !open && setEditingAccount(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Conta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome da Conta</Label>
              <Input
                id="edit-name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                placeholder="Ex: Nubank, Itaú CC"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-type">Tipo</Label>
              <Select value={newAccount.type} onValueChange={(value) => setNewAccount({...newAccount, type: value as Account['type']})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Conta Corrente</SelectItem>
                  <SelectItem value="savings">Poupança</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="investment">Investimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-institution">Instituição</Label>
              <Select value={newAccount.institution} onValueChange={(value) => setNewAccount({...newAccount, institution: value, color: getInstitutionColor(value)})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a instituição" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(institutionColors).map(institution => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-balance">Saldo Atual</Label>
              <Input
                id="edit-balance"
                type="number"
                step="0.01"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({...newAccount, balance: parseFloat(e.target.value) || 0})}
                placeholder="0.00"
              />
            </div>
            
            {newAccount.type === 'credit_card' && (
              <>
                <div>
                  <Label htmlFor="edit-creditLimit">Limite do Cartão</Label>
                  <Input
                    id="edit-creditLimit"
                    type="number"
                    step="0.01"
                    value={newAccount.creditLimit}
                    onChange={(e) => setNewAccount({...newAccount, creditLimit: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-dueDate">Vencimento</Label>
                    <Input
                      id="edit-dueDate"
                      type="number"
                      min="1"
                      max="31"
                      value={newAccount.dueDate}
                      onChange={(e) => setNewAccount({...newAccount, dueDate: parseInt(e.target.value) || 15})}
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-closingDate">Fechamento</Label>
                    <Input
                      id="edit-closingDate"
                      type="number"
                      min="1"
                      max="31"
                      value={newAccount.closingDate}
                      onChange={(e) => setNewAccount({...newAccount, closingDate: parseInt(e.target.value) || 10})}
                      placeholder="10"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingAccount(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateAccount}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}