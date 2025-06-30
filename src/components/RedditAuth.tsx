import { useState, useEffect } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { redditAuth, type RedditUser } from '../lib/redditAuth';

interface RedditAuthProps {
  onUserChange: (user: RedditUser | null) => void;
}

export default function RedditAuth({ onUserChange }: RedditAuthProps) {
  const [user, setUser] = useState<RedditUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = redditAuth.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      onUserChange(storedUser);
    }

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, [onUserChange]);

  const handleOAuthCallback = async (code: string, state: string) => {
    setIsLoading(true);
    try {
      const accessToken = await redditAuth.exchangeCodeForToken(code, state);
      if (accessToken) {
        const userInfo = await redditAuth.getUserInfo(accessToken);
        redditAuth.storeUser(userInfo, accessToken);
        setUser(userInfo);
        onUserChange(userInfo);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      alert('Failed to authenticate with Reddit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    const authUrl = redditAuth.generateAuthUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    redditAuth.logout();
    setUser(null);
    onUserChange(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span className="text-sm text-gray-600">Authenticating...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          {user.icon_img ? (
            <img 
              src={user.icon_img} 
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="h-6 w-6 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-900">u/{user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
    >
      <LogIn className="h-4 w-4" />
      <span>Login with Reddit</span>
    </button>
  );
}