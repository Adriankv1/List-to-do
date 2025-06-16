import { useState } from 'react';
import type { List } from '../types';
import { supabase } from '../lib/supabase';

interface ListManagerProps {
  onListCreated: (list: List) => void;
  userId: string;
}

export const ListManager = ({ onListCreated, userId }: ListManagerProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'shopping' | 'workout' | 'custom'>('custom');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('lists')
        .insert([
          {
            name,
            type,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      onListCreated(data);
      setName('');
      alert('List created successfully!');
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>List Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter list name"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '5px' }}>List Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="shopping">Shopping List</option>
            <option value="workout">Workout List</option>
            <option value="custom">Custom List</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create List
        </button>
      </div>
    </form>
  );
}; 