import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  Home, 
  Receipt,
  Settings,
  TrendingUp,
  Wallet,
  Link2
} from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'

const navigationItems = [
  { 
    title: 'Dashboard', 
    icon: Home, 
    href: '/' 
  },
  { 
    title: 'Contas', 
    icon: Wallet, 
    href: '/contas' 
  },
  { 
    title: 'Transações', 
    icon: Receipt, 
    href: '/transacoes' 
  },
  { 
    title: 'Relatórios', 
    icon: BarChart3, 
    href: '/relatorios' 
  },
  { 
    title: 'Calendário', 
    icon: Calendar, 
    href: '/calendario' 
  },
  { 
    title: 'Open Finance', 
    icon: Link2, 
    href: '/open-finance' 
  },
  { 
    title: 'Configurações', 
    icon: Settings, 
    href: '/configuracoes' 
  }
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r bg-white">
      <SidebarHeader className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">FinancesBR</h2>
            <p className="text-xs text-muted-foreground">Controle Financeiro</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild
                isActive={location.pathname === item.href}
                className="w-full justify-start"
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  )
}