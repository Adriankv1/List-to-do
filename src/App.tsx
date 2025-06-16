import { useState, useEffect } from 'react'
import type { List } from './types'
import { ListManager } from './components/ListManager'
import { ListDisplay } from './components/ListDisplay'
import { supabase } from './lib/supabase'

function App() {
  const [lists, setLists] = useState<List[]>([])

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lists:', error)
      return
    }

    setLists(data || [])
  }

  const handleListCreated = (newList: List) => {
    setLists([newList, ...lists])
  }

  const handleDeleteList = async (listId: string) => {
    // Delete all items in the list first (to avoid foreign key constraint errors)
    await supabase.from('list_items').delete().eq('list_id', listId)
    // Then delete the list itself
    const { error } = await supabase.from('lists').delete().eq('id', listId)
    if (error) {
      alert('Error deleting list.')
      return
    }
    setLists(lists.filter((l) => l.id !== listId))
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      paddingTop: 0,
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        boxSizing: 'border-box',
        background: 'transparent',
        marginTop: 0,
      }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '2.5rem', fontWeight: 700 }}>My Lists</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ListManager onListCreated={handleListCreated} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {lists.map((list) => (
              <div key={list.id}>
                <ListDisplay list={list} onUpdate={fetchLists} onDelete={handleDeleteList} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          div[style*='max-width: 500px'] {
            max-width: 100vw !important;
            min-width: 0 !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default App
