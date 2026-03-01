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
        <div className="min-h-screen bg-btn">
            {/* Navbar */}
            <div className="border-b border-boards shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">My Boards</h1>
                    <Logout />
                </div>
            </div>

            {/* Create board form */}
            <div className="container mx-auto px-4 py-6">
                <form onSubmit={createBoard}>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            onChange={(e) => setNewBoardTitle(e.target.value)}
                            value={newBoardTitle}
                            className="flex-1 px-4 py-2 rounded-lg bg-boards/20 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Create a new board"
                        />
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium transition" type="submit">
                            Create Board
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <p className="text-center text-white mt-24">Loading...</p>
                ) : boards.length === 0 ? (
                    <p className="text-center text-white mt-24">No boards available yet. Create one!</p>
                ) : (
                    <>
                        {/* Mobile fix */}
                        <div className="flex flex-col gap-3 sm:hidden">
                            {boards.map((board) => (
                                <div key={board.id} className="bg-boards/20 border border-slate-700 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <Link to={`/boards/${board.id}`} className="text-white hover:text-blue-300 font-semibold block">
                                            {board.title}
                                        </Link>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(board.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 text-sm transition shrink-0"
                                        onClick={() => deleteBoard(board.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop view */}
                        <table className="hidden sm:table w-full bg-btn rounded-xl shadow-xl border border-slate-700">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left px-6 py-3 text-white text-lg font-medium">Title</th>
                                    <th className="text-left px-6 py-3 text-white text-lg font-medium">Date</th>
                                    <th className="text-left px-6 py-3 text-white text-lg font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boards.map((board) => (
                                    <tr key={board.id} className="border-b border-slate-700 hover:bg-boards/20 transition">
                                        <td className="px-6 py-4">
                                            <Link to={`/boards/${board.id}`} className="text-white hover:text-blue-300 font-semibold">
                                                {board.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            {new Date(board.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40 text-sm transition"
                                                onClick={() => deleteBoard(board.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    )
}

export default Boards