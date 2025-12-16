import { Routes, Route } from 'react-router-dom'
import Intro from './pages/Intro'
import VaultDashboard from './pages/VaultDashboard'
import CreateVault from './pages/CreateVault'
import VaultDetail from './pages/VaultDetail'
import UnlockProposal from './pages/UnlockProposal'
import VaultDestroyed from './pages/VaultDestroyed'
import FinalProof from './pages/FinalProof'
import Demo from './pages/Demo'
import ToastDemo from './pages/ToastDemo'
import CreateOrganization from './pages/org/CreateOrganization'
import JoinOrganization from './pages/org/JoinOrganization'
import OrgVaultDashboard from './pages/org/OrgVaultDashboard'
import MembersDirectory from './pages/org/MembersDirectory'
import ToastManager from './os/Notifier/ToastManager'
import { ToastProvider } from './contexts/ToastContext'
import { useToasts } from './hooks/useToasts'

function AppContent() {
  const { toasts, removeToast } = useToasts()

  return (
    <>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/dashboard" element={<VaultDashboard />} />
        <Route path="/create" element={<CreateVault />} />
        <Route path="/vault/:id" element={<VaultDetail />} />
        <Route path="/vault/:id/unlock" element={<UnlockProposal />} />
        <Route path="/vault/:id/proof" element={<FinalProof />} />
        <Route path="/vault-destroyed" element={<VaultDestroyed />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/final-proof" element={<FinalProof />} />
        <Route path="/toast-demo" element={<ToastDemo />} />
        
        {/* Organization Routes */}
        <Route path="/org/create" element={<CreateOrganization />} />
        <Route path="/org/join" element={<JoinOrganization />} />
        <Route path="/org/dashboard" element={<OrgVaultDashboard />} />
        <Route path="/org/members" element={<MembersDirectory />} />
      </Routes>

      {/* Global Toast Notification System */}
      <ToastManager
        toasts={toasts}
        onRemove={removeToast}
        maxVisible={3}
        position="top-right"
      />
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
