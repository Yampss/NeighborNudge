import { useState } from 'react';
import { MapPin, User, MessageCircle, Clock, CheckCircle, Play } from 'lucide-react';
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

  const handleCompleteTask = (taskId: string) => {
    onCompleteTask(taskId, currentUser);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h2>
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
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">My Tasks</h2>
        <p className="text-gray-600 mb-6">
          Track the tasks you've posted and the ones you're helping with.
        </p>

        {/* User Input */}
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Your Reddit Username
          </label>
          <input
            type="text"
            id="username"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            placeholder="Enter your Reddit username to see your tasks"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('posted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'posted'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tasks I Posted ({myPostedTasks.length})
          </button>
          <button
            onClick={() => setFilter('claimed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'claimed'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tasks I'm Helping With ({myClaimedTasks.length})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {!currentUser ? (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Please enter your username to see your tasks.</p>
        </div>
      ) : displayTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filter === 'posted' 
              ? "You haven't posted any tasks yet." 
              : "You haven't claimed any tasks yet."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayTasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
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

                  {filter === 'claimed' && task.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteTask(task.task_id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                      Mark as Completed
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
  );
}