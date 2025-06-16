import { useState } from 'react';
import type { List } from '../types';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <form onSubmit={handleSubmit} className="p-5 bg-white rounded-lg shadow flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">List Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter list name"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">List Type</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          required
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="shopping">Shopping List</option>
          <option value="workout">Workout List</option>
          <option value="custom">Custom List</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        Create List
      </Button>
    </form>
  );
}; 