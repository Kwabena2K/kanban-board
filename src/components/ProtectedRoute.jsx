import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";


function ProtectedRoute({ children }) {

    // children = whatever is wrapped inside
    // <ProtectedRoute><Boards /></ProtectedRoute>
    // children = <Boards />
    const { user, loading } = useAuth()

    if (loading){
        return <div>Loading...</div>
    } else if(!user){
        // navigate() for event handlers (onClick, onSubmit)
        // <Navigate> for conditional rendering during render
        return <Navigate to="/login"></Navigate>
    } else {
        return children
    }

}

export default ProtectedRoute