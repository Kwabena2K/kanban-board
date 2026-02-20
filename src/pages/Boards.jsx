import Logout from "../components/Logout"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react"



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
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">My Boards</h1>
                        <Logout />
                    </div>
                </div>
                


                <div className="container mx-auto px-4 py-8">
                    <form onSubmit={createBoard} className="mb-8">
                        <div className="flex gap-2">
                            Title: <input type="text" onChange={(e) => setNewBoardTitle(e.target.value)} value={newBoardTitle} className="flex-1 px-4 py-2 border rounded-lg" placeholder="New board title" />
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" type="submit">Create Board</button>
                        </div>
                        
                    </form>
                </div>


                {loading ? (
                    <p>Loading...</p>
                ) : boards.length === 0 ? (
                    <p>No boards available yet. Create one!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {boards.map((board) => (
                            <div key={board.id} className="inline-flex items-center gap-2">
                                <h3>{board.title}</h3>
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"  onClick={() => deleteBoard(board.id)}>Delete</button>
                            </div>
                        ))}
                        {/* <Logout /> */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Boards