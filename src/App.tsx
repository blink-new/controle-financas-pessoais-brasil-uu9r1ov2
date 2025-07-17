import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Accounts from '@/pages/Accounts'
import Transactions from '@/pages/Transactions'
import Reports from '@/pages/Reports'
import Calendar from '@/pages/Calendar'
import Settings from '@/pages/Settings'
import OpenFinance from '@/pages/OpenFinance'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contas" element={<Accounts />} />
          <Route path="transacoes" element={<Transactions />} />
          <Route path="relatorios" element={<Reports />} />
          <Route path="calendario" element={<Calendar />} />
          <Route path="open-finance" element={<OpenFinance />} />
          <Route path="configuracoes" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App