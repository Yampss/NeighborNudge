import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ExternalLink, Clock, User, Search, RefreshCw } from 'lucide-react';
import { redditAuth, type RedditPost } from '../lib/reddit';

interface RedditPostsProps {
  className?: string;
}

export default function RedditPosts({ className = '' }: RedditPostsProps) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const redditPosts = await redditAuth.fetchSubredditPosts('NeighborNudge', 20);
      setPosts(redditPosts);
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await redditAuth.searchSubredditPosts('NeighborNudge', searchQuery, 20);
      setPosts(searchResults);
    } catch (error) {
      console.error('Error searching Reddit posts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) {
      return `${Math.floor(diff / 60)}m ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h ago`;
    } else {
      return `${Math.floor(diff / 86400)}d ago`;
    }
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-orange-500" />
          <span>r/NeighborNudge Posts</span>
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-orange-500" />
          <span>r/NeighborNudge Posts</span>
        </h3>
        <button
          onClick={fetchPosts}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh posts"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts in r/NeighborNudge..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Search'
            )}
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchPosts();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchQuery ? 'No posts found for your search.' : 'No posts found in r/NeighborNudge.'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery ? 'Try a different search term.' : 'Be the first to post in the subreddit!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
                  {post.title}
                </h4>
                <a
                  href={`https://reddit.com${post.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 flex-shrink-0"
                  title="View on Reddit"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {post.flair_text && (
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mb-2">
                  {post.flair_text}
                </span>
              )}

              {post.selftext && (
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {truncateText(post.selftext)}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>u/{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(post.created_utc)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{post.score}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{post.num_comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <a
          href="https://reddit.com/r/NeighborNudge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center space-x-1"
        >
          <span>Visit r/NeighborNudge</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}