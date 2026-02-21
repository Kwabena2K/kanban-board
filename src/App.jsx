import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Boards from './pages/Boards'
import ProtectedRoute from './components/ProtectedRoute'
import BoardDetail from './pages/BoardDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/boards" element={
          <ProtectedRoute>
            <Boards/>
          </ProtectedRoute>
        } />
        <Route path="/boards/:id" element={
          <ProtectedRoute>
            <BoardDetail/>
          </ProtectedRoute>
        } />
          <Route path="/" element={<Navigate to="/boards" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App