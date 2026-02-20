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
        <button type="button" disabled={loading} className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800" onClick={handleLogout}>{loading ? 'Logging out...' : 'Logout'}</button>
    )

}
export default Logout;