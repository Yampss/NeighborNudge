import { useState } from 'react';
import { MapPin, User, MessageCircle, Send, AlertCircle, ExternalLink, CheckCircle, Loader } from 'lucide-react';
import { redditAuth } from '../lib/redditAuth';
import type { Task } from '../types';

interface PostTaskProps {
  onSubmit: (task: Omit<Task, 'task_id' | 'created_at' | 'status'>) => Promise<Task | undefined>;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  isConnected: boolean | null;
  isRedditAuthenticated: boolean;
}

export default function PostTask({ onSubmit, currentUser, setCurrentUser, isConnected, isRedditAuthenticated }: PostTaskProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedditOption, setShowRedditOption] = useState(false);
  const [submittedTask, setSubmittedTask] = useState<Task | null>(null);
  const [autoPostToReddit, setAutoPostToReddit] = useState(false);
  const [redditPostStatus, setRedditPostStatus] = useState<'idle' | 'posting' | 'success' | 'error'>('idle');
  const [redditPostUrl, setRedditPostUrl] = useState<string>('');
  const [redditError, setRedditError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim() || !contactMethod.trim() || !currentUser.trim()) {
      return;
    }

    setIsSubmitting(true);
    setRedditPostStatus('idle');
    setRedditError('');
    
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
        
        // If auto-post to Reddit is enabled and user is authenticated
        if (autoPostToReddit && isRedditAuthenticated) {
          setRedditPostStatus('posting');
          try {
            const { title, text } = redditAuth.generatePostContent({
              description: createdTask.description,
              location: createdTask.location,
              proposer: createdTask.proposer,
              contact_method: createdTask.contact_method
            });

            const result = await redditAuth.submitPost(title, text);
            
            if (result.success && result.url) {
              setRedditPostStatus('success');
              setRedditPostUrl(result.url);
            } else {
              setRedditPostStatus('error');
              setRedditError(result.error || 'Failed to post to Reddit');
            }
          } catch (error) {
            setRedditPostStatus('error');
            setRedditError('An error occurred while posting to Reddit');
            console.error('Reddit post error:', error);
          }
        } else {
          setShowRedditOption(true);
        }
        
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

  const handlePostToReddit = async () => {
    if (!submittedTask) return;
    
    setRedditPostStatus('posting');
    try {
      const { title, text } = redditAuth.generatePostContent({
        description: submittedTask.description,
        location: submittedTask.location,
        proposer: submittedTask.proposer,
        contact_method: submittedTask.contact_method
      });

      const result = await redditAuth.submitPost(title, text);
      
      if (result.success && result.url) {
        setRedditPostStatus('success');
        setRedditPostUrl(result.url);
      } else {
        setRedditPostStatus('error');
        setRedditError(result.error || 'Failed to post to Reddit');
      }
    } catch (error) {
      setRedditPostStatus('error');
      setRedditError('An error occurred while posting to Reddit');
      console.error('Reddit post error:', error);
    }
  };

  const handleDismissRedditOption = () => {
    setShowRedditOption(false);
    setSubmittedTask(null);
    setRedditPostStatus('idle');
    setRedditError('');
    setRedditPostUrl('');
  };

  if ((showRedditOption || redditPostStatus !== 'idle') && submittedTask) {
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

            {/* Reddit posting section */}
            {isRedditAuthenticated ? (
              <div className="space-y-4">
                {redditPostStatus === 'posting' && (
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Posting to Reddit...</span>
                  </div>
                )}

                {redditPostStatus === 'success' && redditPostUrl && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-green-800 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Successfully posted to Reddit!</span>
                    </div>
                    <a
                      href={redditPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 flex items-center space-x-1"
                    >
                      <span>View your post on r/NeighborNudge</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {redditPostStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-red-800 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Failed to post to Reddit</span>
                    </div>
                    <p className="text-red-700 text-sm mb-3">{redditError}</p>
                    <button
                      onClick={handlePostToReddit}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {redditPostStatus === 'idle' && showRedditOption && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handlePostToReddit}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>Post to r/NeighborNudge</span>
                    </button>
                    <button
                      onClick={handleDismissRedditOption}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                    >
                      Skip for Now
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-orange-800 mb-3">
                  Connect your Reddit account to automatically post tasks to r/NeighborNudge
                </p>
                <button
                  onClick={() => window.location.href = redditAuth.getAuthUrl()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Connect Reddit Account
                </button>
              </div>
            )}

            <button
              onClick={handleDismissRedditOption}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
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

        {/* Reddit Auto-Post Option */}
        {isRedditAuthenticated && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Reddit Integration</h3>
                <p className="text-orange-700 text-sm mt-1 mb-3">
                  Automatically post your task to r/NeighborNudge to reach more people in your community.
                </p>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoPostToReddit}
                    onChange={(e) => setAutoPostToReddit(e.target.checked)}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-orange-800 text-sm">Automatically post to Reddit</span>
                </label>
              </div>
            </div>
          </div>
        )}
        
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

        {!isRedditAuthenticated && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-900">Connect Reddit for Auto-Posting</h3>
                <p className="text-orange-700 text-sm mt-1 mb-3">
                  Connect your Reddit account to automatically post tasks to r/NeighborNudge and reach more people in your community.
                </p>
                <button
                  onClick={() => window.location.href = redditAuth.getAuthUrl()}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                >
                  Connect Reddit Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}