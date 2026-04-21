import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import AgentSettings from './pages/AgentSettings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import TestChatModal from './components/TestChatModal'
import KnowledgeBase from './pages/KnowledgeBase'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [testChatOpen, setTestChatOpen] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/*" element={
          <ProtectedRoute>
            <div className="grid min-h-screen grid-cols-dashboard grid-rows-dashboard">
              <TopBar onOpenTestChat={() => setTestChatOpen(true)} />
              <Sidebar onOpenModal={() => setModalOpen(true)} />
              <Routes>
                <Route path="/" element={
                  <Home
                    modalOpen={modalOpen}
                    onOpenModal={() => setModalOpen(true)}
                    onCloseModal={() => setModalOpen(false)}
                  />
                } />
                <Route path="/knowledge-base" element={<KnowledgeBase />} />
                <Route path="/agent-settings" element={<AgentSettings />} />
              </Routes>
            </div>
            {testChatOpen && (
              <TestChatModal onClose={() => setTestChatOpen(false)} />
            )}
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App