import { createContext, useContext } from "react"
import { useState, useEffect } from "react"
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext()

function AuthProvider({children}) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
            console.log("User from API:", user)
        }
        fetchUser()
        
    }, [])


    const signUp = async (email, password) => {
        const response = await supabase.auth.signUp({ email, password})
    }

    const signIn = async (email, password) => {
        const response = await supabase.auth.signInWithPassword({ email, password})
    }

    const signOut = async (email, password) => {
        const response = await supabase.auth.signOut()
    }

    return (
            <AuthContext.Provider value={{user, loading, signIn, signUp, signOut}}>{children}</AuthContext.Provider>
    )
}


export { AuthProvider }

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}