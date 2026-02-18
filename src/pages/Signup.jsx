import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Signup() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")


    const {signUp} = useAuth()
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email || !password){
            setError("Please fill in both fields to continue!")
            return
        }


        setLoading(true)

        try {
            await signUp(email,password)
            setMessage("Success! Check your email to confirm your account.")
            navigate("/login")
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="mb-4 text-4xl text-black font-semibold text-center">Signup</h1>
                
                <form onSubmit={handleSubmit} className="w-[90vw] max-w-96 flex flex-col gap-4">
                    {error && 
                    <p className="text-red-600 text-sm text-center mb-2">
                        {error}
                    </p>
                }
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button type="submit" disabled={loading} className="px-12 py-4 mb-2 bg-green-800 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-green-900 transition-all duration-200">{loading ? 'Signing in...' : 'Sign up'}</button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </div>

        </div>
    )
}

export default Signup;