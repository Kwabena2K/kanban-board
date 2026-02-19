import { createContext, useContext } from "react"
import { useState, useEffect } from "react"
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext()

function AuthProvider({children}) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Initial check if someone is already logged in
        const fetchUser = async () => {
            setLoading(true)
            
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
            console.log("User from API:", user)
        }
        fetchUser()


        // Listener to watch for login/logout events and update state when auth changes

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event)
            setUser(session?.user ?? null)
        }
    )

    return () => subscription.unsubscribe()
    }, [])


    const signUp = async (email, password) => {
        const {data, error} = await supabase.auth.signUp({ email, password})
        if (error) throw error
        return data
    }

    const signIn = async (email, password) => {
        const {data, error} = await supabase.auth.signInWithPassword({ email, password})
        if (error) throw error
        return data
    }

    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) throw error
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