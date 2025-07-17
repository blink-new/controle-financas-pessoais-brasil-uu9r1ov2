import React, { useState } from 'react';
import { User, Bell, Shield, Download, Trash2, Save, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Perfil
    displayName: 'João Silva',
    email: 'joao@example.com',
    phone: '+55 11 99999-9999',
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    weeklyReports: true,
    
    // Preferências
    currency: 'BRL',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    theme: 'light',
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    
    // Privacidade
    dataSharing: false,
    analytics: true
  });

  const handleSaveSettings = () => {
    // Simula salvamento
    alert('Configurações salvas com sucesso!');
  };

  const handleExportData = () => {
    // Simula exportação
    alert('Dados exportados com sucesso!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      alert('Conta excluída com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu de Navegação */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-900 bg-gray-100 rounded-lg">
                <User className="w-4 h-4" />
                Perfil
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-4 h-4" />
                Notificações
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Shield className="w-4 h-4" />
                Segurança
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Configurações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    value={settings.displayName}
                    onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-gray-600">Receba lembretes e atualizações por email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-gray-600">Receba notificações no navegador</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Pagamento</Label>
                  <p className="text-sm text-gray-600">Alertas sobre vencimentos próximos</p>
                </div>
                <Switch
                  checked={settings.reminderNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, reminderNotifications: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios Semanais</Label>
                  <p className="text-sm text-gray-600">Resumo semanal das suas finanças</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => setSettings({...settings, weeklyReports: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirme sua nova senha"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
              </div>
              
              <div>
                <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                <Select value={settings.sessionTimeout.toString()} onValueChange={(value) => setSettings({...settings, sessionTimeout: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dados e Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle>Dados e Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compartilhamento de Dados</Label>
                  <p className="text-sm text-gray-600">Permitir compartilhamento para melhorar o serviço</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => setSettings({...settings, dataSharing: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Análises e Estatísticas</Label>
                  <p className="text-sm text-gray-600">Permitir coleta de dados para análises</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings({...settings, analytics: checked})}
                />
              </div>
              
              <Separator />
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Dados
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Salvar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Aviso de Desenvolvimento */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Esta é uma versão de demonstração. Em produção, todas as configurações seriam salvas de forma segura.
        </AlertDescription>
      </Alert>
    </div>
  );
}