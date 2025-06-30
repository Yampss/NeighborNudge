import React, { useState } from 'react';
import { MapPin, User, MessageCircle, Send } from 'lucide-react';
import type { Task } from '../types';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'task_id' | 'created_at' | 'status'>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [proposer, setProposer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim() || !contactMethod.trim() || !proposer.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description: description.trim(),
        location: location.trim(),
        contact_method: contactMethod.trim(),
        proposer: proposer.trim(),
      });
      
      // Reset form
      setDescription('');
      setLocation('');
      setContactMethod('');
      setProposer('');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <Send className="h-6 w-6 text-primary-500" />
        <span>Post a Task</span>
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="proposer" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Reddit Username
          </label>
          <input
            type="text"
            id="proposer"
            value={proposer}
            onChange={(e) => setProposer(e.target.value)}
            placeholder="Your Reddit username"
            maxLength={50}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What help can you offer? (e.g., 'I'll grab groceries for a neighbor')"
            maxLength={100}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {description.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Neighborhood or area (e.g., 'Downtown Seattle')"
            maxLength={50}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="contactMethod" className="block text-sm font-medium text-gray-700 mb-2">
            <MessageCircle className="h-4 w-4 inline mr-1" />
            Contact Method
          </label>
          <input
            type="text"
            id="contactMethod"
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            placeholder="How should people reach you? (e.g., 'DM me on Reddit')"
            maxLength={50}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Task</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}