import { useState} from "react"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


function UpdatePassword() {


    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const { updateUser } = useAuth()
    const navigate = useNavigate()

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.trim() === '') {
            setError('Please enter a password')
            return
        }
        // || newPassword !== confirmPassword || newPassword.length < 8
        if (newPassword !== confirmPassword) {
            setError ('These passwords do not match')
            return
        }
        if (newPassword.length < 8 ) {
            setError ('The password must be at least 8 characters')
            return
        }

        try {
            setLoading(true)
            await updateUser(newPassword)
            setSuccess('Password updated successfully')
            navigate('/login') // redirect back to login page
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
                <p className="mb-4 text-center">Confirm your new password</p>

                <form className="w-[90vw] max-w-96 flex flex-col gap-4">
                    {error &&
                        <p className="text-red-600 text-sm text-center mb-2">
                            {error}
                        </p>
                    }
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setError("")
                        }} className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button type="button" onClick={handleUpdatePassword} disabled={loading} className="px-12 py-4 mb-2 bg-green-800 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-green-900 transition-all duration-200">{loading ? 'Saving...' : 'Reset Password'}</button>
                    {success && <p className="text-green-700 text-sm text-center">{success}</p>}
                    <Link to="/login" className="text-blue-600 hover:underline text-center">
                        Login
                    </Link>
                </form>
            </div>

        </div>
    )
}

export default UpdatePassword