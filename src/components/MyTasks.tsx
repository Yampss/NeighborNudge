import { useState } from 'react';
import { MapPin, User, MessageCircle, Clock, CheckCircle, Play, Heart, Star, Gift } from 'lucide-react';
import type { Task } from '../types';

interface MyTasksProps {
  tasks: Task[];
  loading: boolean;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  onCompleteTask: (taskId: string, completerUsername: string) => void;
}

export default function MyTasks({ tasks, loading, currentUser, setCurrentUser, onCompleteTask }: MyTasksProps) {
  const [filter, setFilter] = useState<'posted' | 'claimed'>('posted');

  const myPostedTasks = tasks.filter(task => task.proposer === currentUser);
  const myClaimedTasks = tasks.filter(task => (task as any).claimer === currentUser);

  const displayTasks = filter === 'posted' ? myPostedTasks : myClaimedTasks;

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
    if (desc.includes('grocery') || desc.includes('shopping')) return <Gift className="h-6 w-6 text-green-500" />;
    if (desc.includes('dog') || desc.includes('pet')) return <Heart className="h-6 w-6 text-pink-500" />;
    if (desc.includes('tutor') || desc.includes('teach')) return <Star className="h-6 w-6 text-yellow-500" />;
    return <Gift className="h-6 w-6 text-primary-500" />;
  };

  const handleCompleteTask = (taskId: string) => {
    onCompleteTask(taskId, currentUser);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeInUp">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">My Tasks</h2>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-shimmer rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden animate-fadeInUp">
        <div className="absolute inset-0 bg-pattern-grid opacity-5"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 gradient-text">My Tasks</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Track the tasks you've posted and the ones you're helping with. 📋
          </p>

          {/* User Input */}
          <div className="mb-8">
            <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary-500" />
              Your Reddit Username
            </label>
            <input
              type="text"
              id="username"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Enter your Reddit username to see your tasks"
              className="w-full max-w-md px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 text-lg font-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('posted')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                filter === 'posted'
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              📝 Tasks I Posted ({myPostedTasks.length})
            </button>
            <button
              onClick={() => setFilter('claimed')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                filter === 'claimed'
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              🤝 Tasks I'm Helping With ({myClaimedTasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {!currentUser ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center animate-fadeInUp">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <p className="text-gray-500 text-xl font-medium">Please enter your username to see your tasks.</p>
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center animate-fadeInUp">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <p className="text-gray-500 text-xl font-medium">
            {filter === 'posted' 
              ? "You haven't posted any tasks yet." 
              : "You haven't claimed any tasks yet."
            }
          </p>
          <p className="text-gray-400 mt-2">
            {filter === 'posted' 
              ? "Start by posting a task to help your community!" 
              : "Browse available tasks to start helping!"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayTasks.map((task, index) => (
            <div
              key={task.task_id}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 hover-lift transition-all duration-300 animate-fadeInUp"
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
                      </div>

                      {filter === 'claimed' && task.status === 'in_progress' && (
                        <button
                          onClick={() => handleCompleteTask(task.task_id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 btn-bounce"
                        >
                          ✅ Mark as Completed
                        </button>
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
      )}
    </div>
  );
}