import { useState } from 'react';
import { MapPin, User, MessageCircle, Send, AlertCircle, ExternalLink, CheckCircle, Eye, Sparkles, Heart } from 'lucide-react';
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

  const generatePreviewUrl = () => {
    if (!description.trim() || !location.trim() || !contactMethod.trim() || !currentUser.trim()) {
      return '';
    }
    
    return redditAuth.generateRedditSubmitUrl({
      description: description.trim(),
      location: location.trim(),
      proposer: currentUser.trim(),
      contact_method: contactMethod.trim()
    });
  };

  const previewUrl = generatePreviewUrl();

  if (submittedTask && redditPostUrl) {
    return (
      <div className="max-w-2xl mx-auto animate-bounceIn">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-50"></div>
          <div className="relative text-center">
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 gradient-text">Task Posted Successfully!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Your task has been added to NeighborNudge and is now visible to the community! 🎉
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border-2 border-dashed border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                Your Task:
              </h3>
              <p className="text-gray-700 mb-3 text-lg">{submittedTask.description}</p>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {submittedTask.location}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-orange-900 mb-4 flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Share on Reddit
              </h3>
              <p className="text-orange-700 mb-6 leading-relaxed">
                Click the button below to post your task to r/NeighborNudge and reach more people in your community.
              </p>
              <a
                href={redditPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 btn-bounce"
              >
                <ExternalLink className="h-6 w-6" />
                <span>Post to r/NeighborNudge</span>
                <Sparkles className="h-6 w-6" />
              </a>
              <p className="text-orange-600 text-sm mt-4 font-medium">
                ✨ This will open Reddit with your post pre-filled. Just click "Post" on Reddit!
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Continue to Browse Tasks →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 flex items-center space-x-4">
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-2xl">
              <Send className="h-10 w-10 text-primary-600" />
            </div>
            <span className="gradient-text">Offer Help to Your Community</span>
          </h2>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Share what you can offer to help your neighbors. Every act of kindness matters! ✨
          </p>
          
          {isConnected === false && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 animate-fadeInUp">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">Database Connection Required</h3>
                  <p className="text-blue-700 mt-2 leading-relaxed">
                    To save tasks, you need to connect to Supabase. Click the "Connect to Supabase" button in the top right corner to set up your database connection.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <ExternalLink className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 text-lg">Reddit Sharing</h3>
                <p className="text-orange-700 mt-2 leading-relaxed">
                  After posting your task, you'll get a link to easily share it on r/NeighborNudge to reach more people in your community.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="currentUser" className="block text-lg font-semibold text-gray-700 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-500" />
                Your Reddit Username
              </label>
              <input
                type="text"
                id="currentUser"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="e.g., helpful_neighbor_2024"
                maxLength={50}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 text-lg font-medium hover:border-gray-300"
                required
              />
              {currentUser && (
                <p className="text-blue-600 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  This username will be used across all sections of the app
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
                What help can you offer?
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 'I can help with grocery shopping for elderly neighbors', 'Free tutoring for kids in math and science', 'Dog walking services while you're at work'"
                maxLength={200}
                rows={5}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 resize-none text-lg hover:border-gray-300"
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-gray-500 font-medium">
                  {description.length}/200 characters
                </p>
                <div className={`w-20 h-2 rounded-full ${description.length > 180 ? 'bg-red-200' : description.length > 150 ? 'bg-yellow-200' : 'bg-green-200'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${description.length > 180 ? 'bg-red-500' : description.length > 150 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${(description.length / 200) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="location" className="block text-lg font-semibold text-gray-700 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-accent-500" />
                Location/Area
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., 'Downtown Seattle', 'Brooklyn Heights', 'Near Central Park'"
                maxLength={100}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 text-lg font-medium hover:border-gray-300"
                required
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="contactMethod" className="block text-lg font-semibold text-gray-700 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                How should people contact you?
              </label>
              <input
                type="text"
                id="contactMethod"
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                placeholder="e.g., 'DM me on Reddit', 'Text me at (555) 123-4567', 'Email me at helper@example.com'"
                maxLength={100}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-400 transition-all duration-300 text-lg font-medium hover:border-gray-300"
                required
              />
            </div>

            {/* Preview Reddit Link */}
            {previewUrl && (
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-6 animate-fadeInUp">
                <div className="flex items-start space-x-4">
                  <Eye className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 mb-3 text-lg">Preview Reddit Post</h3>
                    <p className="text-orange-700 mb-4 leading-relaxed">
                      Here's what your Reddit post will look like:
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>Preview on Reddit</span>
                    </a>
                    <p className="text-orange-600 text-sm mt-3 font-medium">
                      ✨ This opens Reddit with your post pre-filled. You can see exactly how it will look!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isConnected === false}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-xl hover:shadow-2xl hover:scale-105 btn-bounce"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Posting Your Offer...</span>
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  <span>Post Your Offer</span>
                  <Sparkles className="h-6 w-6" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}