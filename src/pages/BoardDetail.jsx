import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function BoardDetail() {
    const { id } = useParams();
    const [error, setError] = useState(null)
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lists, setLists] = useState([])
    const [newListTitle, setNewListTitle] = useState("")



    useEffect(() => {
        async function fetchBoard() {
            try {
                // fetch board
                const { data, error } = await supabase.from('boards').select('*').eq('id', id).single();
                if (error) throw error;
                setBoard(data)
            } catch (error) {
                console.log('Error fetching data:', error.message)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchBoard()
    }, [id])


    useEffect(() => {
        async function fetchLists() {

            try {
                // fetch list
                const { data, error } = await supabase.from('lists').select('*').eq('board_id', id).order('position');
                console.log('lists data:', data);
                console.log('lists error:', error);
                if (error) throw error;
                setLists(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchLists()

    }, [id])

    async function createList() {
        // create list
        try {
            const { data, error } = await supabase.from('lists').insert({ title: newListTitle, board_id: id, position: lists.length + 1 }).select().single()
            if (error) throw error
            setLists([...lists, data])
            setNewListTitle('')
        } catch (error) {
            setError(error.message)
        }
    }

    async function deleteList(listId) {
        if (!confirm('Delete this list?')) return
        // delete list
        try {
            const { error } = await supabase.from('lists').delete().eq('id', listId)
            if (error) throw error
            setLists(lists.filter(list => list.id !== listId)) // Refresh list

        } catch (error) { // error handling
            console.log('Error deleting board:', error)
            alert(error.message)
        }
    }



    // Back button 
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // return to prev page
    }



    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    if (!board) return <p>Board not found</p>


    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">{board.title}</h1>

                {/* Add list feature */}
                <div className="flex gap-2 mb-6">
                    <input
                        value={newListTitle}
                        onChange={e => setNewListTitle(e.target.value)}
                        placeholder="Add a list..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button onClick={createList} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Add List
                    </button>
                </div>

                {/* Lists section */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {lists.map(list => (
                        <div key={list.id} className="bg-gray-200 rounded-lg p-3 w-72 shrink-0">
                            {/* List header */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-semibold text-gray-700">{list.title}</h2>
                                <button
                                    onClick={() => deleteList(list.id)}
                                    className="text-gray-400 hover:text-red-500 text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            {/* Cards section  */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-gray-400">No cards yet</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Back button */}
            <button onClick={handleGoBack} className="fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Back
            </button>
        </div>
    )
}
