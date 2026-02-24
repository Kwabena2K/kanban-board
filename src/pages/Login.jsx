import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Login() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)


    const {signIn} = useAuth()
    const navigate = useNavigate();


    const handleSubmit = async () => {
        setError("")
        console.log("Login clicked")

        if (!email || !password){
            setError("Please fill in both fields to continue!")
            return
        }


        setLoading(true)

        try {
            await signIn(email,password)
            console.log("Logged in")
            navigate("/boards") // navigate to the boards page if successful
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="mb-4 text-4xl font-semibold text-center">Login</h1>
                
                <form onSubmit={handleSubmit} className="w-[90vw] max-w-96 flex flex-col gap-4">
                    {error && 
                    <p className="text-red-600 text-sm text-center mb-2">
                        {error}
                    </p>
                }
                    <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button type="button" disabled={loading} className="px-12 py-4 mb-2 bg-green-800 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-green-900 transition-all duration-200" onClick={handleSubmit}>{loading ? 'Logging in...' : 'Login'}</button>
                    <p className="text-sm text-center text-green-800 mt-1">
                        <Link to="/forgot-password">
                            <span
                                    className="underline cursor-pointer hover:text-green-600"
                                >
                                Forgot password?
                            </span>
                        </Link>
                            
                        </p>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>

        </div>
    )
}

export default Login;