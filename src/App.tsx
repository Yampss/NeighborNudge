import React, { useState, useEffect } from 'react';
import { Heart, Trophy, MapPin, User, Plus } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Leaderboard from './components/Leaderboard';
import NudgeOfTheDay from './components/NudgeOfTheDay';
import { supabase } from './lib/supabase';
import type { Task, User as UserType } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'leaderboard'>('tasks');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('nudge_points', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTaskSubmit = async (taskData: Omit<Task, 'task_id' | 'created_at' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'open' }])
        .select()
        .single();

      if (error) throw error;

      // Update user points
      await supabase.rpc('increment_user_points', {
        username: taskData.proposer,
        points: 5
      });

      setTasks(prev => [data, ...prev]);
      fetchUsers(); // Refresh leaderboard
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Heart className="h-8 w-8 text-accent-500" />
            <h1 className="text-3xl font-bold text-gray-900">NeighborNudge</h1>
            <Heart className="h-8 w-8 text-primary-500" />
          </div>
          <p className="text-center text-gray-600 mt-2">
            Building stronger communities through mutual aid
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Nudge of the Day */}
        <NudgeOfTheDay />

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'tasks'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'tasks' ? (
          <div className="space-y-8">
            <TaskForm onSubmit={handleTaskSubmit} />
            <TaskList tasks={tasks} loading={loading} />
          </div>
        ) : (
          <Leaderboard users={users} loading={loading} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Made with ❤️ for stronger communities</p>
            <p className="text-sm">
              Connect with your neighbors and build mutual aid networks in your area
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;