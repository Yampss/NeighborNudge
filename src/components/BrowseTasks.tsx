import { useState } from 'react';
import { MapPin, User, MessageCircle, Clock, CheckCircle, Play, AlertCircle, ShoppingCart, Heart, Star, Gift } from 'lucide-react';
import RedditPosts from './RedditPosts';
import type { Task } from '../types';

interface BrowseTasksProps {
  tasks: Task[];
  loading: boolean;
  onClaimTask: (taskId: string, claimerUsername: string) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  isConnected: boolean | null;
}

export default function BrowseTasks({ tasks, loading, onClaimTask, currentUser, setCurrentUser, isConnected }: BrowseTasksProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-green-300';
      case 'in_progress':
        return 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300';
      case 'completed':
        return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5" />;
      case 'in_progress':
        return <Play className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getTaskIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('grocery') || desc.includes('shopping')) return <ShoppingCart className="h-6 w-6 text-green-500" />;
    if (desc.includes('dog') || desc.includes('pet')) return <Heart className="h-6 w-6 text-pink-500" />;
    if (desc.includes('tutor') || desc.includes('teach')) return <Star className="h-6 w-6 text-yellow-500" />;
    return <Gift className="h-6 w-6 text-primary-500" />;
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Tasks</h2>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-shimmer rounded-2xl h-32"></div>
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
      <div className="lg:col-span-2 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden animate-fadeInUp">
          <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">Browse Community Tasks</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Find ways to help your neighbors and make a positive impact in your community. 🌟
            </p>

            {/* User Input */}
            <div className="mb-8">
              <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-500" />
                Your Reddit Username (required to claim tasks)
              </label>
              <input
                type="text"
                id="username"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="Enter your Reddit username"
                className="w-full max-w-md px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 text-lg font-medium"
              />
              {currentUser && (
                <p className="text-blue-600 mt-2 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  This username is shared across all sections of the app
                </p>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Tasks', color: 'from-gray-500 to-gray-600' },
                { key: 'open', label: 'Available', color: 'from-green-500 to-green-600' },
                { key: 'in_progress', label: 'In Progress', color: 'from-blue-500 to-blue-600' },
                { key: 'completed', label: 'Completed', color: 'from-purple-500 to-purple-600' }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    filter === key
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Database Connection Notice */}
        {isConnected === false && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 animate-fadeInUp">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900 mb-3 text-xl">No Database Connection</h3>
                <p className="text-blue-700 mb-4 leading-relaxed text-lg">
                  To see and interact with tasks, you need to connect to Supabase. Click the "Connect to Supabase" button in the top right corner to set up your database connection.
                </p>
                <p className="text-blue-600 font-medium">
                  Once connected, tasks posted by community members will appear here.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        {isConnected === true && filteredTasks.length === 0 && tasks.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center animate-fadeInUp">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">No tasks found for the selected filter.</p>
          </div>
        ) : isConnected === true && tasks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center animate-fadeInUp">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">No tasks have been posted yet.</p>
            <p className="text-gray-400 mt-2">Be the first to post a task and help your community!</p>
          </div>
        ) : isConnected === true ? (
          <div className="space-y-6">
            {filteredTasks.map((task, index) => (
              <div
                key={task.task_id}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover-lift hover-glow transition-all duration-300 animate-fadeInUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        {getTaskIcon(task.description)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-semibold mb-4 text-xl leading-relaxed">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-primary-500" />
                            <span className="font-medium">Posted by u/{task.proposer}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-accent-500" />
                            <span className="font-medium">{task.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium">{task.contact_method}</span>
                          </div>
                          {task.claimer && (
                            <div className="flex items-center space-x-2">
                              <User className="h-5 w-5 text-blue-500" />
                              <span className="font-medium">Claimed by u/{task.claimer}</span>
                            </div>
                          )}
                        </div>

                        {task.status === 'open' && currentUser && currentUser !== task.proposer && (
                          <button
                            onClick={() => handleClaimTask(task.task_id)}
                            className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 btn-bounce"
                          >
                            🤝 Claim This Task
                          </button>
                        )}

                        {task.status === 'open' && currentUser === task.proposer && (
                          <div className="text-gray-500 italic font-medium">
                            This is your task - others can claim it
                          </div>
                        )}

                        {!currentUser && task.status === 'open' && (
                          <div className="text-gray-500 italic font-medium">
                            Enter your username above to claim tasks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-semibold border-2 ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Reddit Posts Sidebar */}
      <div className="lg:col-span-1 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
        <RedditPosts />
      </div>
    </div>
  );
}