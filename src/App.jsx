import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-3xl font-bold">Home Page</h1>
            <a href="/login" className="text-blue-600">Go to Login</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App