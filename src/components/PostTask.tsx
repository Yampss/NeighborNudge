import { useState } from 'react';
import { MapPin, User, MessageCircle, Send, AlertCircle } from 'lucide-react';
import type { Task } from '../types';

interface PostTaskProps {
  onSubmit: (task: Omit<Task, 'task_id' | 'created_at' | 'status'>) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
}

export default function PostTask({ onSubmit, currentUser, setCurrentUser }: PostTaskProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim() || !contactMethod.trim() || !currentUser.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description: description.trim(),
        location: location.trim(),
        contact_method: contactMethod.trim(),
        proposer: currentUser.trim(),
      });
      
      // Reset form
      setDescription('');
      setLocation('');
      setContactMethod('');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            disabled={isSubmitting}
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