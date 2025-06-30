export interface Task {
  task_id: string;
  description: string;
  location: string;
  proposer: string;
  status: 'open' | 'completed';
  contact_method: string;
  created_at: string;
}

export interface User {
  reddit_username: string;
  nudge_points: number;
  created_at: string;
}