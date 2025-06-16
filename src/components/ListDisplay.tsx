import { useState, useEffect } from 'react';
import type { List, ListItem } from '../types';
import { supabase } from '../lib/supabase';

interface ListDisplayProps {
  list: List;
  onUpdate: () => void;
  onDelete: (listId: string) => void;
}

export const ListDisplay = ({ list, onUpdate, onDelete }: ListDisplayProps) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchItems();
  }, [list.id]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('list_items')
      .select('*')
      .eq('list_id', list.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching items:', error);
      return;
    }

    setItems(data || []);
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    const { error } = await supabase
      .from('list_items')
      .insert([
        {
          list_id: list.id,
          content: newItem.trim(),
          completed: false,
        },
      ]);

    if (error) {
      console.error('Error adding item:', error);
      return;
    }

    setNewItem('');
    fetchItems();
    onUpdate();
  };

  const handleToggleItem = async (item: ListItem) => {
    const { error } = await supabase
      .from('list_items')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating item:', error);
      return;
    }

    fetchItems();
    onUpdate();
  };

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      return;
    }

    fetchItems();
    onUpdate();
  };

  const handleDeleteList = () => {
    if (window.confirm('Are you sure you want to delete this list and all its items?')) {
      onDelete(list.id);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{list.name}</h2>
          <span style={{ padding: '5px 10px', backgroundColor: list.type === 'shopping' ? '#4caf50' : list.type === 'workout' ? '#2196f3' : '#9e9e9e', color: 'white', borderRadius: '4px' }}>
            {list.type}
          </span>
        </div>
        <button onClick={handleDeleteList} style={{ alignSelf: 'flex-end', padding: '6px 14px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Delete List
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleAddItem} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleItem(item)}
                />
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none', color: item.completed ? '#9e9e9e' : 'inherit' }}>
                  {item.content}
                </span>
              </label>
              <button onClick={() => handleDeleteItem(item.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 