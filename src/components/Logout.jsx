import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function Logout() {

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const { signOut } = useAuth()
    const navigate = useNavigate();


    const handleLogout = async (e) => {
        setError("")
        console.log("Logout clicked")

        setLoading(true)

        try {
            await signOut()
            console.log("signed out")
            navigate("/login") // navigate to the login page if successful
        } catch (error) {
            console.log("Logout error:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button type="button" disabled={loading} className="px-12 py-4 mb-2 bg-green-800 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-green-900 transition-all duration-200" onClick={handleLogout}>{loading ? 'Logging out...' : 'Logout'}</button>
    )

}
export default Logout;