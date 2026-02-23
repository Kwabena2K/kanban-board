import Logout from "../components/Logout"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'



function Boards() {

    const [boards, setBoards] = useState([])
    const [loading, setLoading] = useState(true)
    const [newBoardTitle, setNewBoardTitle] = useState("")

    const { user, signOut } = useAuth()
    // run on mount

    useEffect(() => {
        fetchBoard()
    }, [])

    // Functions

    // Fetch all boards
    const fetchBoard = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('boards').select('*').order('created_at', { ascending: false })

            if (error) throw error
            setBoards(data || [])
        } catch (error) { // error handling
            console.log('Error fetching board:', error)
        } finally {
            setLoading(false)
        }
    }

    // Create new board
    const createBoard = async (e) => {
        e.preventDefault()

        // Check if board has been created
        if (!newBoardTitle.trim()) { // remove whitespace
            alert('Please enter a title')
            return
        }

        try {
            // insert into supabase
            const { data, error } = await supabase.from('boards').insert({ title: newBoardTitle, user_id: user.id }).select() // return created board

            if (error) throw error

            setNewBoardTitle('') // clear the input
            fetchBoard() // refresh list
        } catch (error) { // error handling
            console.log('Error creating board:', error)
            alert(error.message)
        }
    }


    // Delete new board
    const deleteBoard = async (id) => {
        if (!confirm('Delete this board?')) return

        try {
            const { error } = await supabase.from('boards').delete().eq('id', id)
            if (error) throw error
            fetchBoard() // Refresh list

        } catch (error) { // error handling
            console.log('Error deleting board:', error)
            alert(error.message)
        }
    }




    return (
    <div className="min-h-screen bg-slate-800">
        {/* Navbar */}
        <div className="bg-slate-900 border-b border-slate-700 shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">My Boards</h1>
                <Logout />
            </div>
        </div>

        {/* Create board form */}
        <div className="container mx-auto px-6 py-6">
            <form onSubmit={createBoard}>
                <div className="flex gap-3 max-w-lg">
                    <input
                        type="text"
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                        value={newBoardTitle}
                        className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="New board title"
                    />
                    <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium transition" type="submit">
                        Create Board
                    </button>
                </div>
            </form>
        </div>

        {/* Table */}
        <div className="container mx-auto px-6">
            {loading ? (
                <p className="text-center text-slate-400">Loading...</p>
            ) : boards.length === 0 ? (
                <p className="text-center text-slate-400">No boards available yet. Create one!</p>
            ) : (
                <table className="w-full bg-slate-900 rounded-xl shadow-xl border border-slate-700">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Title</th>
                            <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Created</th>
                            <th className="text-left px-6 py-3 text-slate-400 text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.map((board) => (
                            <tr key={board.id} className="border-b border-slate-700 hover:bg-slate-800 transition">
                                <td className="px-6 py-4">
                                    <Link to={`/boards/${board.id}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                                        {board.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {new Date(board.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 text-sm transition"
                                        onClick={() => deleteBoard(board.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
)
}

export default Boards