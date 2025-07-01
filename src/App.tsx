import { useState, useEffect } from 'react';
import { Heart, Home, Plus, List, Trophy, Users } from 'lucide-react';
import HomePage from './components/HomePage';
import PostTask from './components/PostTask';
import BrowseTasks from './components/BrowseTasks';
import MyTasks from './components/MyTasks';
import Leaderboard from './components/Leaderboard';
import RedditAuthButton from './components/RedditAuthButton';
import { supabase } from './lib/supabase';
import type { Task, User as UserType } from './types';

type TabType = 'home' | 'post' | 'browse' | 'my-tasks' | 'leaderboard';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test the connection by trying to fetch from the tasks table
      const { error } = await supabase
        .from('tasks')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Database connection error:', error);
        setIsConnected(false);
      } else {
        setIsConnected(true);
        // Only fetch data if connection is successful
        fetchTasks();
        fetchUsers();
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
      setLoading(false);
    }
  };

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
      if (error instanceof Error && !error.message.includes('Failed to fetch')) {
        alert('Error loading tasks. Please try refreshing the page.');
      }
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
    // Check connection before attempting to submit
    if (isConnected === false) {
      alert('Database connection is not available. Please connect to Supabase first.');
      return;
    }

    try {
      // Test connection again before submitting
      const { error: connectionError } = await supabase
        .from('tasks')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        console.error('Connection test failed:', connectionError);
        setIsConnected(false);
        alert('Database connection failed. Please check your Supabase configuration and try again.');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'open' }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.message.includes('JWT')) {
          alert('Authentication error. Please check your Supabase configuration.');
        } else if (error.message.includes('permission')) {
          alert('Permission denied. Please check your database policies.');
        } else {
          alert(`Error submitting task: ${error.message}`);
        }
        return;
      }

      // Update user points - handle errors gracefully
      try {
        const { error: pointsError } = await supabase.rpc('increment_user_points', {
          username: taskData.proposer,
          points: 5
        });

        if (pointsError) {
          console.error('Error updating points:', pointsError);
          // Don't fail the entire operation if points update fails
        }
      } catch (pointsError) {
        console.error('Error calling increment_user_points:', pointsError);
      }

      setTasks(prev => [data, ...prev]);
      fetchUsers(); // Refresh leaderboard
      setActiveTab('browse'); // Navigate to browse tasks
      
      // Return the created task data for Reddit posting
      return data;
    } catch (error) {
      console.error('Error submitting task:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          alert('Network error. Please check your internet connection and try again.');
        } else {
          alert(`Error submitting task: ${error.message}`);
        }
      } else {
        alert('Error submitting task. Please check your connection and try again.');
      }
    }
  };

  const handleClaimTask = async (taskId: string, claimerUsername: string) => {
    try {
      // First, check if the task exists and is still open
      const { data: taskCheck, error: checkError } = await supabase
        .from('tasks')
        .select('status, proposer')
        .eq('task_id', taskId)
        .single();

      if (checkError) {
        console.error('Error checking task:', checkError);
        alert('Error checking task status. Please try again.');
        return;
      }

      if (!taskCheck) {
        alert('Task not found.');
        return;
      }

      if (taskCheck.status !== 'open') {
        alert('This task is no longer available.');
        fetchTasks(); // Refresh to show current status
        return;
      }

      if (taskCheck.proposer === claimerUsername) {
        alert('You cannot claim your own task.');
        return;
      }

      // Update the task status and claimer
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'in_progress', 
          claimer: claimerUsername 
        })
        .eq('task_id', taskId)
        .eq('status', 'open'); // Additional check to prevent race conditions

      if (error) {
        console.error('Supabase error:', error);
        if (error.message.includes('permission')) {
          alert('Permission denied. Please check your database configuration.');
        } else {
          alert(`Error claiming task: ${error.message}`);
        }
        return;
      }

      // Refresh tasks to show updated status
      fetchTasks();
      alert('Task claimed successfully! You can now start working on it.');
    } catch (error) {
      console.error('Error claiming task:', error);
      alert('Error claiming task. Please check your connection and try again.');
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

      // Award points to completer - handle errors gracefully
      try {
        const { error: pointsError } = await supabase.rpc('increment_user_points', {
          username: completerUsername,
          points: 10
        });

        if (pointsError) {
          console.error('Error updating points:', pointsError);
          // Don't fail the entire operation if points update fails
        }
      } catch (pointsError) {
        console.error('Error calling increment_user_points:', pointsError);
      }

      fetchTasks();
      fetchUsers();
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Error completing task. Please check your connection and try again.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'post':
        return <PostTask 
          onSubmit={handleTaskSubmit} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
          isConnected={isConnected}
          isRedditAuthenticated={false}
        />;
      case 'browse':
        return <BrowseTasks tasks={tasks} loading={loading} onClaimTask={handleClaimTask} currentUser={currentUser} setCurrentUser={setCurrentUser} isConnected={isConnected} />;
      case 'my-tasks':
        return <MyTasks tasks={tasks} loading={loading} currentUser={currentUser} setCurrentUser={setCurrentUser} onCompleteTask={handleCompleteTask} />;
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
            <div className="flex items-center space-x-4">
              <RedditAuthButton />
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Building stronger communities through mutual aid
          </p>
          {/* Connection Status Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            {isConnected !== null && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '● Database Connected' : '● Database Disconnected'}
              </span>
            )}
          </div>
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

      {/* Global Username Notice */}
      {currentUser && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-6xl mx-auto px-4 py-2">
            <p className="text-center text-blue-700 text-sm">
              <Users className="h-4 w-4 inline mr-1" />
              Logged in as: <span className="font-semibold">u/{currentUser}</span>
              <span className="text-blue-600 ml-2">(This username is used across all sections)</span>
            </p>
          </div>
        </div>
      )}

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