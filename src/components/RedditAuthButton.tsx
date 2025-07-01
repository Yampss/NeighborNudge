import { useState, useEffect } from 'react';
import { ExternalLink, LogOut, CheckCircle } from 'lucide-react';
import { redditAuth } from '../lib/redditAuth';

interface RedditAuthButtonProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export default function RedditAuthButton({ onAuthChange }: RedditAuthButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = redditAuth.isAuthenticated();
      setIsAuthenticated(authenticated);
      onAuthChange?.(authenticated);
    };

    checkAuth();
    
    // Check auth status periodically
    const interval = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [onAuthChange]);

  const handleConnect = () => {
    const authUrl = redditAuth.getAuthUrl();
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    redditAuth.logout();
    setIsAuthenticated(false);
    onAuthChange?.(false);
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>Reddit Connected</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-gray-500 hover:text-gray-700 p-1 rounded"
          title="Disconnect from Reddit"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center space-x-2 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
    >
      <ExternalLink className="h-4 w-4" />
      <span>Connect Reddit</span>
    </button>
  );
}