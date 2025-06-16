import { useState, useEffect } from 'react';
import type { List, ListItem } from '../types';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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
    <Card className="p-6 rounded-xl shadow flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{list.name}</h2>
          <span className={`px-3 py-1 rounded text-white ${list.type === 'shopping' ? 'bg-green-600' : list.type === 'workout' ? 'bg-blue-600' : 'bg-gray-500'}`}>{list.type}</span>
        </div>
        <Button onClick={handleDeleteList} variant="destructive" className="self-end mb-2 bg-red-600 hover:bg-red-700 text-white">
          Delete List
        </Button>
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add new item..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddItem} className="ml-2">
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-1">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleItem(item)}
                />
                <span className={item.completed ? 'line-through text-gray-400' : ''}>
                  {item.content}
                </span>
              </label>
              <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)} className="ml-2 bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}; 