export interface Task {
  task_id: string;
  description: string;
  location: string;
  proposer: string;
  status: 'open' | 'in_progress' | 'completed';
  contact_method: string;
  created_at: string;
  claimer?: string;
}

export interface User {
  reddit_username: string;
  nudge_points: number;
  created_at: string;
}