import { useState, useEffect } from 'react';
import { Heart, Home, Plus, List, Trophy, Users } from 'lucide-react';
import HomePage from './components/HomePage';
import PostTask from './components/PostTask';
import BrowseTasks from './components/BrowseTasks';
import MyTasks from './components/MyTasks';
import Leaderboard from './components/Leaderboard';
import RedditAuth from './components/RedditAuth';
import { supabase } from './lib/supabase';
import type { Task, User as UserType } from './types';
import type { RedditUser } from './lib/reddit';

type TabType = 'home' | 'post' | 'browse' | 'my-tasks' | 'leaderboard';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [redditUser, setRedditUser] = useState<RedditUser | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // Update currentUser when Reddit user changes
  useEffect(() => {
    if (redditUser) {
      setCurrentUser(redditUser.name);
    } else {
      setCurrentUser('');
    }
  }, [redditUser]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
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
        .limit(10);
      
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
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

      if (error) {
        console.error('Supabase error:', error);
        alert('Error submitting task. Please check your database connection.');
        return;
      }

      // Update user points
      const { error: pointsError } = await supabase.rpc('increment_user_points', {
        username: taskData.proposer,
        points: 5
      });

      if (pointsError) {
        console.error('Error updating points:', pointsError);
      }

      setTasks(prev => [data, ...prev]);
      fetchUsers(); // Refresh leaderboard
      setActiveTab('browse'); // Navigate to browse tasks
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error submitting task. Please try again.');
    }
  };

  const handleClaimTask = async (taskId: string, claimerUsername: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'in_progress', claimer: claimerUsername })
        .eq('task_id', taskId);

      if (error) {
        console.error('Supabase error:', error);
        alert('Error claiming task. Please try again.');
        return;
      }

      fetchTasks();
    } catch (error) {
      console.error('Error claiming task:', error);
    }
  };

  const handleCompleteTask = async (taskId: string, completerUsername: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('task_id', taskId);

      if (error) {
        console.error('Supabase error:', error);
        alert('Error completing task. Please try again.');
        return;
      }

      // Award points to completer
      const { error: pointsError } = await supabase.rpc('increment_user_points', {
        username: completerUsername,
        points: 10
      });

      if (pointsError) {
        console.error('Error updating points:', pointsError);
      }

      fetchTasks();
      fetchUsers();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'post':
        return <PostTask onSubmit={handleTaskSubmit} currentUser={currentUser} setCurrentUser={setCurrentUser} redditUser={redditUser} />;
      case 'browse':
        return <BrowseTasks tasks={tasks} loading={loading} onClaimTask={handleClaimTask} currentUser={currentUser} setCurrentUser={setCurrentUser} redditUser={redditUser} />;
      case 'my-tasks':
        return <MyTasks tasks={tasks} loading={loading} currentUser={currentUser} setCurrentUser={setCurrentUser} onCompleteTask={handleCompleteTask} redditUser={redditUser} />;
      case 'leaderboard':
        return <Leaderboard users={users} loading={loading} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center space-x-3 flex-1">
              <Heart className="h-8 w-8 text-accent-500" />
              <h1 className="text-3xl font-bold text-gray-900">NeighborNudge</h1>
              <Heart className="h-8 w-8 text-primary-500" />
            </div>
            <div className="flex-shrink-0">
              <RedditAuth onUserChange={setRedditUser} />
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Building stronger communities through mutual aid
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'post'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Post Task</span>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'browse'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5" />
              <span>Browse Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('my-tasks')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'my-tasks'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>My Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'leaderboard'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
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