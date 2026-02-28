import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Boards from './pages/Boards'
import ProtectedRoute from './components/ProtectedRoute'
import BoardDetail from './pages/BoardDetail'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './components/UpdatePassword'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/boards" element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        } />
        <Route path="/boards/:id" element={
          <ProtectedRoute>
            <BoardDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App