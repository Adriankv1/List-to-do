import { useState, useEffect } from 'react'
import type { List } from './types'
import { ListManager } from './components/ListManager'
import { ListDisplay } from './components/ListDisplay'
import { AuthForm } from './components/AuthForm'
import { supabase } from './lib/supabase'

function App() {
  const [lists, setLists] = useState<List[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) fetchLists()
    else setLists([])
    // eslint-disable-next-line
  }, [user])

  const fetchLists = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: 0,
      }}>
        <AuthForm onAuth={setUser} />
      </div>
    )
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ marginBottom: 0, textAlign: 'center', fontSize: '2.5rem', fontWeight: 700 }}>My Lists</h1>
          <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', marginLeft: 16 }}>Logout</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ListManager onListCreated={handleListCreated} userId={user.id} />
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
