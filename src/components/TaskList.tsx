import { MapPin, User, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
}

export default function TaskList({ tasks, loading }: TaskListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Tasks</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No tasks yet!</p>
          <p className="text-gray-400">Be the first to offer help to your community.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                task.status === 'completed'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50 hover:border-primary-200 hover:bg-primary-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium mb-2">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{task.proposer}</span>
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
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  {task.status === 'completed' ? (
                    <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-accent-600 bg-accent-100 px-3 py-1 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4" />
                      <span>Open</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}