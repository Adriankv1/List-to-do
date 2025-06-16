export interface List {
  id: string;
  name: string;
  type: 'shopping' | 'workout' | 'custom';
  created_at: string;
  user_id: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  content: string;
  completed: boolean;
  created_at: string;
  metadata?: {
    weight?: number;
    sets?: number;
    reps?: number;
    notes?: string;
  };
}

export interface WorkoutItem extends ListItem {
  metadata: {
    weight: number;
    sets: number;
    reps: number;
    notes?: string;
  };
} 