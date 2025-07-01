import { useState } from 'react';
import { MapPin, User, MessageCircle, Send, AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { redditAuth } from '../lib/redditAuth';
import type { Task } from '../types';

interface PostTaskProps {
  onSubmit: (task: Omit<Task, 'task_id' | 'created_at' | 'status'>) => Promise<Task | undefined>;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  isConnected: boolean | null;
  isRedditAuthenticated: boolean;
}

export default function PostTask({ onSubmit, currentUser, setCurrentUser, isConnected }: PostTaskProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<Task | null>(null);
  const [redditPostUrl, setRedditPostUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim() || !contactMethod.trim() || !currentUser.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        description: description.trim(),
        location: location.trim(),
        contact_method: contactMethod.trim(),
        proposer: currentUser.trim(),
      };

      const createdTask = await onSubmit(taskData);
      
      if (createdTask) {
        setSubmittedTask(createdTask);
        
        // Generate Reddit post URL
        const redditUrl = redditAuth.generateRedditSubmitUrl({
          description: createdTask.description,
          location: createdTask.location,
          proposer: createdTask.proposer,
          contact_method: createdTask.contact_method
        });
        setRedditPostUrl(redditUrl);
        
        // Reset form
        setDescription('');
        setLocation('');
        setContactMethod('');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setSubmittedTask(null);
    setRedditPostUrl('');
  };

  if (submittedTask && redditPostUrl) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Posted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your task has been added to NeighborNudge.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Your Task:</h3>
              <p className="text-gray-700 mb-2">{submittedTask.description}</p>
              <p className="text-sm text-gray-600">📍 {submittedTask.location}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-3">Share on Reddit</h3>
              <p className="text-green-700 text-sm mb-4">
                Click the button below to post your task to r/NeighborNudge and reach more people in your community.
              </p>
              <a
                href={redditPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Post to r/NeighborNudge</span>
              </a>
              <p className="text-green-600 text-xs mt-2">
                This will open Reddit with your post pre-filled. Just click "Post" on Reddit!
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Continue to Browse Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
          <Send className="h-8 w-8 text-primary-500" />
          <span>Offer Help to Your Community</span>
        </h2>
        <p className="text-gray-600 mb-8">
          Share what you can offer to help your neighbors. Every act of kindness matters!
        </p>
        
        {isConnected === false && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Database Connection Required</h3>
                <p className="text-blue-700 text-sm mt-1">
                  To save tasks, you need to connect to Supabase. Click the "Connect to Supabase" button in the top right corner to set up your database connection.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <ExternalLink className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900">Reddit Sharing</h3>
              <p className="text-orange-700 text-sm mt-1">
                After posting your task, you'll get a link to easily share it on r/NeighborNudge to reach more people in your community.
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentUser" className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Your Reddit Username
            </label>
            <input
              type="text"
              id="currentUser"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Enter your Reddit username"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              required
            />
            {currentUser && (
              <p className="text-sm text-blue-600 mt-1">
                This username will be used across all sections of the app
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              What help can you offer?
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'I can help with grocery shopping', 'Free tutoring for kids', 'Dog walking services'"
              maxLength={200}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {description.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Location/Area
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., 'Downtown Seattle', 'Brooklyn Heights', 'Near Central Park'"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="h-4 w-4 inline mr-1" />
              How should people contact you?
            </label>
            <input
              type="text"
              id="contactMethod"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              placeholder="e.g., 'DM me on Reddit', 'Text me at...', 'Email me at...'"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isConnected === false}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Post Your Offer</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}