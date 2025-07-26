/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, CreditCard, Bell, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Reminder, Account } from '../types';
import { mockDataService } from '../services/mockData';

export default function Calendar() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    accountId: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    repeatType: 'none' as Reminder['repeatType']
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [remindersData, accountsData] = await Promise.all([
        mockDataService.getReminders(),
        mockDataService.getAccounts()
      ]);
      
      setReminders(remindersData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async () => {
    try {
      const reminder = await mockDataService.createReminder({
        ...newReminder,
        userId: 'user_1',
        isCompleted: false
      });
      setReminders([...reminders, reminder]);
      setShowAddDialog(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao adicionar lembrete:', error);
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    try {
      await mockDataService.updateReminder(id, { isCompleted: completed });
      setReminders(reminders.map(r => 
        r.id === id ? { ...r, isCompleted: completed } : r
      ));
    } catch (error) {
      console.error('Erro ao atualizar lembrete:', error);
    }
  };

  const resetForm = () => {
    setNewReminder({
      title: '',
      description: '',
      accountId: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      repeatType: 'none'
    });
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getRemindersForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reminders.filter(r => r.dueDate === dateStr);
  };

  const getUpcomingReminders = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return reminders
      .filter(r => {
        const reminderDate = new Date(r.dueDate);
        return reminderDate >= today && reminderDate <= nextWeek && !r.isCompleted;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getOverdueReminders = () => {
    const today = new Date();
    return reminders
      .filter(r => {
        const reminderDate = new Date(r.dueDate);
        return reminderDate < today && !r.isCompleted;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDue = (date: Date) => {
    const today = new Date();
    return date < today;
  };

  const days = getDaysInMonth(currentDate);
  const upcomingReminders = getUpcomingReminders();
  const overdueReminders = getOverdueReminders();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando calendário...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário de Pagamentos</h1>
          <p className="text-gray-600">Acompanhe seus vencimentos e lembretes</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Lembrete
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Lembrete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="Ex: Fatura do cartão, Aluguel"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  placeholder="Descrição opcional..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newReminder.amount}
                    onChange={(e) => setNewReminder({...newReminder, amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="account">Conta (opcional)</Label>
                <Select value={newReminder.accountId} onValueChange={(value) => setNewReminder({...newReminder, accountId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma conta</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {account.institution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="repeat">Repetir</Label>
                <Select value={newReminder.repeatType} onValueChange={(value) => setNewReminder({...newReminder, repeatType: value as Reminder['repeatType']})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a repetição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não repetir</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddReminder}>
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Vencidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueReminders.length}
            </div>
            <div className="text-sm text-gray-600">
              {overdueReminders.length > 0 && (
                formatCurrency(overdueReminders.reduce((sum, r) => sum + (r.amount || 0), 0))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Próximos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {upcomingReminders.length}
            </div>
            <div className="text-sm text-gray-600">
              {upcomingReminders.length > 0 && (
                formatCurrency(upcomingReminders.reduce((sum, r) => sum + (r.amount || 0), 0))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Concluídos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reminders.filter(r => r.isCompleted).length}
            </div>
            <div className="text-sm text-gray-600">
              Este mês
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Headers dos dias da semana */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              
              {/* Dias do mês */}
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="p-2 h-24"></div>;
                }
                
                const dayReminders = getRemindersForDate(day);
                const isCurrentDay = isToday(day);
                const isPast = isPastDue(day);
                
                return (
                  <div
                    key={day.getDate()}
                    className={`p-2 h-24 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      isCurrentDay ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium ${
                      isCurrentDay ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayReminders.slice(0, 2).map(reminder => (
                        <div
                          key={reminder.id}
                          className={`text-xs p-1 rounded truncate ${
                            reminder.isCompleted
                              ? 'bg-green-100 text-green-800'
                              : isPast
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {reminder.title}
                        </div>
                      ))}
                      {dayReminders.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayReminders.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Lembretes */}
        <Card>
          <CardHeader>
            <CardTitle>Lembretes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Vencidos */}
              {overdueReminders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-red-600 mb-2">Vencidos</h3>
                  <div className="space-y-2">
                    {overdueReminders.map(reminder => (
                      <div key={reminder.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <Checkbox
                          checked={reminder.isCompleted}
                          onCheckedChange={(checked) => 
                            handleToggleCompleted(reminder.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-red-900 truncate">{reminder.title}</h4>
                          <p className="text-sm text-red-700">{formatDate(reminder.dueDate)}</p>
                          {reminder.amount && (
                            <p className="text-sm font-medium text-red-900">
                              {formatCurrency(reminder.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Próximos */}
              {upcomingReminders.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-yellow-600 mb-2">Próximos</h3>
                  <div className="space-y-2">
                    {upcomingReminders.map(reminder => (
                      <div key={reminder.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Checkbox
                          checked={reminder.isCompleted}
                          onCheckedChange={(checked) => 
                            handleToggleCompleted(reminder.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-yellow-900 truncate">{reminder.title}</h4>
                          <p className="text-sm text-yellow-700">{formatDate(reminder.dueDate)}</p>
                          {reminder.amount && (
                            <p className="text-sm font-medium text-yellow-900">
                              {formatCurrency(reminder.amount)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concluídos recentes */}
              {reminders.filter(r => r.isCompleted).slice(0, 3).map(reminder => (
                <div key={reminder.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Checkbox
                    checked={reminder.isCompleted}
                    onCheckedChange={(checked) => 
                      handleToggleCompleted(reminder.id, checked as boolean)
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-green-900 truncate line-through">{reminder.title}</h4>
                    <p className="text-sm text-green-700">{formatDate(reminder.dueDate)}</p>
                    {reminder.amount && (
                      <p className="text-sm font-medium text-green-900">
                        {formatCurrency(reminder.amount)}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {reminders.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Nenhum lembrete encontrado</p>
                  <p className="text-sm text-gray-500">Adicione lembretes para acompanhar seus vencimentos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}