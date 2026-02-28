import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";


export default function BoardDetail() {
    const { id } = useParams();
    const [error, setError] = useState(null)
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lists, setLists] = useState([])
    const [listTitle, setListTitle] = useState("")
    const [editingListId, setEditingListId] = useState(null)
    const [editListTitle, setEditListTitle] = useState("")
    const [cards, setCards] = useState([])
    const [newCardTitle, setNewCardTitle] = useState({}) // track per list in object versus shared state with a string




    useEffect(() => {
        // combining all fetching in one useEffect to fix glitches from multiple useEffects 
        async function fetchAll() {
            try {
                setLoading(true)
                // fetch board
                const { data: boardData, error: boardError } = await supabase.from('boards').select('*').eq('id', id).single();
                if (boardError) throw boardError
                setBoard(boardData)

                // fetch lists
                const { data: listsData, error: listsError } = await supabase.from('lists').select('*').eq('board_id', id).order('position');
                if (listsError) throw listsError
                setLists(listsData)

                // fetch cards
                if (listsData.length > 0) {
                    const { data: cardsData, error: cardsError } = await supabase.from('cards').select('*').in('list_id', listsData.map(list => list.id)).order('position');
                    if (cardsError) throw cardsError
                    setCards(cardsData)
                }
            } catch (error) {
                console.log('Error:', error.message)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchAll()
    }, [id])

    async function createList() {
        if (!listTitle || listTitle.trim() === ''){
            alert("Please enter a list title")
            return
        }
        try {
            const { data, error } = await supabase.from('lists').insert({ title: listTitle, board_id: id, position: lists.length + 1 }).select().single()
            if (error) throw error
            setLists([...lists, data])
            setListTitle('')
        } catch (error) {
            setError(error.message)
        }
    }

    async function deleteList(listId) {
        if (!confirm('Delete this list?')) return
        try {
            const { error } = await supabase.from('lists').delete().eq('id', listId)
            if (error) throw error
            setLists(lists.filter(list => list.id !== listId))
        } catch (error) {
            console.log('Error deleting board:', error)
            alert(error.message)
        }
    }


    // Create card
    const createCard = async (listId) => {
        try {
            const listCards = cards.filter(c => c.list_id === listId);
            const title = newCardTitle[listId];
            if (!title || title.trim() === '') return
            const { data, error } = await supabase.from('cards').insert({ title, list_id: listId, position: listCards.length + 1 }).select().single()
            if (error) throw error
            setCards([...cards, data])
            setNewCardTitle({ ...newCardTitle, [listId]: '' })
        } catch (error) {
            setError(error.message)
        }
    }

    // Delete card

    const deleteCard = async (cardId) => {
        if (!confirm('Delete this card?')) return
        try {
            const { data, error } = await supabase.from('cards').delete().eq('id', cardId)
            if (error) throw error
            setCards(cards.filter(card => card.id !== cardId))
        } catch (error) {
            alert(error.message)
        }
    }


    // Update card

    const updateList = async (title, listId) => {
        try {
            if (!title || title.trim() === '') return
            const { data, error } = await supabase.from('lists').update({ title }).eq('id', listId)
            if (error) throw error
            setLists(lists.map(list => list.id === listId ? { ...list, title } : list))
            setEditListTitle("")
            setEditingListId(null)
        } catch (error) {
            setError(error.message)
        }

    }




    // Back button 
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // return to prev page
    }



    if (loading) return (
        <div className="min-h-screen bg-slate-800 flex items-center justify-center">
            <p className="text-slate-400">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-slate-800 flex items-center justify-center">
            <p className="text-slate-400">Error: {error}</p>
        </div>
    )

    if (!board) return (
        <div className="min-h-screen bg-slate-800 flex items-center justify-center">
            <p className="text-slate-400">Board not found</p>
        </div>
    )


    return (
        <div className="min-h-screen bg-slate-800">
            <div className="bg-black/20 px-4 py-3 flex items-center gap-4 mb-4">
                <h1 className="text-xl font-bold text-white">{board.title}</h1>
                <input
                    required
                    value={listTitle}
                    onChange={e => setListTitle(e.target.value)}
                    placeholder="Add a list..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button onClick={createList} className="px-3 py-1 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-50">
                    Add List
                </button>
            </div>
            {/* Lists section */}
            <div className="flex gap-4 flex-wrap lg:flex-nowrap overflow-x-auto pb-4">
                {lists.map(list => (
                    <div key={list.id} className="bg-gray-200 rounded-lg p-3 w-72 shrink-0 flex flex-col self-start min-h-[200px]">
                        {/* List header */}
                        <div className="flex justify-between items-center mb-3">
                            {editingListId === list.id ? (
                                <input
                                    autoFocus
                                    value={editListTitle}
                                    onChange={e => setEditListTitle(e.target.value)}
                                    onBlur={() => updateList(editListTitle, list.id)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') updateList(editListTitle, list.id)
                                        if (e.key === 'Escape') setEditingListId(null)
                                    }}
                                    className="font-semibold text-gray-700 bg-transparent border-b border-gray-400 focus:outline-none"
                                />
                            ) : (
                                <h2
                                    className="font-semibold text-gray-700 hover:cursor-pointer"
                                    onClick={() => { setEditingListId(list.id); setEditListTitle(list.title) }}
                                >
                                    {list.title}
                                </h2>
                            )}
                            <button
                                onClick={() => deleteList(list.id)}
                                className="text-gray-400 hover:text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        {/* Cards section */}

                        <div className="flex flex-col gap-2 overflow-y-auto">
                            {cards.filter(card => card.list_id === list.id).map(card => (
                                <div key={card.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center w-full">
                                    <p className="text-sm text-gray-700">{card.title}</p>
                                    <button onClick={() => deleteCard(card.id)} className="text-gray-300 hover:text-red-500 text-xs ml-2">✕</button>
                                </div>
                            ))}
                        </div>
                        <input required
                            value={newCardTitle[list.id] || ''}
                            onChange={e => setNewCardTitle({ ...newCardTitle, [list.id]: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    createCard(list.id)
                                }
                            }}
                            placeholder="Add a card..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={() => createCard(list.id)}
                            className="w-full mt-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-300 rounded-lg text-left"
                        >
                            + Add a card
                        </button>
                    </div>
                ))}
            </div>
            {/* Back button */}
            <button onClick={handleGoBack} className="fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Back
            </button>
        </div>
    )
}
