import { useAuth } from './contexts/AuthContent'
function App() {
  const { user, loading } = useAuth()
  
  console.log('User:', user)
  console.log('Loading:', loading)
  
  if (loading) {
    return <div className="p-8">Loading...</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Kanban Board</h1>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}

export default App