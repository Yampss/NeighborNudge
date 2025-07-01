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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-accent-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b-2 border-primary-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center space-x-4 flex-1">
              <Heart className="h-10 w-10 text-accent-500 animate-heartBeat" />
              <h1 className="text-4xl font-bold gradient-text">NeighborNudge</h1>
              <Heart className="h-10 w-10 text-primary-500 animate-heartBeat" />
            </div>
            <div className="flex items-center space-x-4">
              <RedditAuthButton />
            </div>
          </div>
          <p className="text-center text-gray-600 mt-3 text-lg font-medium">
            Building stronger communities through mutual aid ✨
          </p>
          {/* Connection Status Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-3">
            {isConnected !== null && (
              <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isConnected 
                  ? 'bg-green-100 text-green-800 shadow-sm' 
                  : 'bg-red-100 text-red-800 shadow-sm'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                {isConnected ? 'Database Connected' : 'Database Disconnected'}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-[120px] z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto py-3 custom-scrollbar">
            {[
              { key: 'home', label: 'Home', icon: Home },
              { key: 'post', label: 'Post Task', icon: Plus },
              { key: 'browse', label: 'Browse Tasks', icon: List },
              { key: 'my-tasks', label: 'My Tasks', icon: Users },
              { key: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap relative group ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${activeTab === key ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                <span>{label}</span>
                {activeTab === key && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Global Username Notice */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 animate-fadeInUp">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <p className="text-center text-blue-700 font-medium">
              <Users className="h-5 w-5 inline mr-2" />
              Logged in as: <span className="font-bold text-blue-800">u/{currentUser}</span>
              <span className="text-blue-600 ml-3 text-sm">(This username is used across all sections)</span>
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white/95 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center text-gray-600">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-red-500 animate-heartBeat" />
              <p className="text-lg font-semibold">Made with love for stronger communities</p>
              <Heart className="h-6 w-6 text-red-500 animate-heartBeat" />
            </div>
            <p className="text-gray-500">
              Connect with your neighbors and build mutual aid networks in your area
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;