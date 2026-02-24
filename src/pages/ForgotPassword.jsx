import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ForgotPassword () {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [email, setEmail] = useState('')
    const { resetPassword } = useAuth()


        const handleResetPassword = async () => {
        if (!email || email.trim() === '') return
        try {
            setLoading(true)
            await resetPassword(email)
            setSuccess('Check your email for a new reset link!')
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-800">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="mb-4 text-2xl text-black font-semibold text-center">RESET YOUR PASSWORD</h1>
                <p className="mb-4 text-center">Enter the email address you used to register</p>
                
                <form  className="w-[90vw] max-w-96 flex flex-col gap-4">
                    {error && 
                    <p className="text-red-600 text-sm text-center mb-2">
                        {error}
                    </p>
                }
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button type="button" onClick={handleResetPassword} disabled={loading} className="px-12 py-4 mb-2 bg-green-800 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-green-900 transition-all duration-200">{loading ? 'Resetting...' : 'Reset Password'}</button>
                    {success && <p className="text-green-700 text-sm text-center">{success}</p>}
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

export default ForgotPassword;