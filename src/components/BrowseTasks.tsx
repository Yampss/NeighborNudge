import { useState } from 'react';
import { MapPin, User, MessageCircle, Clock, CheckCircle, Play, AlertCircle } from 'lucide-react';
import RedditPosts from './RedditPosts';
import type { Task } from '../types';

interface BrowseTasksProps {
  tasks: Task[];
  loading: boolean;
  onClaimTask: (taskId: string, claimerUsername: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
}

export default function BrowseTasks({ tasks, loading, onClaimTask, currentUser, setCurrentUser }: BrowseTasksProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleClaimTask = (taskId: string) => {
    if (!currentUser.trim()) {
      alert('Please enter your username first');
      return;
    }
    onClaimTask(taskId, currentUser);
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Tasks</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <RedditPosts />
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Community Tasks</h2>
          <p className="text-gray-600 mb-6">
            Find ways to help your neighbors and make a positive impact in your community.
          </p>

          {/* User Input */}
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Your Reddit Username (required to claim tasks)
            </label>
            <input
              type="text"
              id="username"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Enter your Reddit username"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'open', label: 'Available' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === key
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Database Connection Notice */}
        {tasks.length === 0 && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">No Database Connection</h3>
                <p className="text-blue-700 mb-4">
                  To see and interact with tasks, you need to connect to Supabase. Click the "Connect to Supabase" button in the top right corner to set up your database connection.
                </p>
                <p className="text-blue-600 text-sm">
                  Once connected, tasks posted by community members will appear here.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length === 0 && tasks.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks found for the selected filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.task_id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-3 text-lg">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Posted by u/{task.proposer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{task.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{task.contact_method}</span>
                      </div>
                    </div>

                    {task.status === 'open' && currentUser && currentUser !== task.proposer && (
                      <button
                        onClick={() => handleClaimTask(task.task_id)}
                        className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-2 rounded-lg font-medium hover:from-accent-600 hover:to-accent-700 transition-all duration-200"
                      >
                        Claim This Task
                      </button>
                    )}
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reddit Posts Sidebar */}
      <div className="lg:col-span-1">
        <RedditPosts />
      </div>
    </div>
  );
}