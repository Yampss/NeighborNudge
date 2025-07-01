import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ExternalLink, Clock, User, Search, RefreshCw, AlertCircle, Heart, Star } from 'lucide-react';

interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  selftext: string;
  permalink: string;
  subreddit: string;
  flair_text?: string;
}

interface RedditPostsProps {
  className?: string;
}

export default function RedditPosts({ className = '' }: RedditPostsProps) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if we're in development (with proxy) or production
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      let url: string;
      if (isDevelopment) {
        // Use proxy in development
        url = '/reddit-api/r/NeighborNudge/hot.json?limit=20';
      } else {
        // Use direct Reddit API in production (may be blocked by CORS)
        url = 'https://www.reddit.com/r/NeighborNudge/hot.json?limit=20';
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid response format from Reddit API');
      }
      
      const redditPosts = data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        score: child.data.score,
        num_comments: child.data.num_comments,
        created_utc: child.data.created_utc,
        url: child.data.url,
        selftext: child.data.selftext,
        permalink: child.data.permalink,
        subreddit: child.data.subreddit,
        flair_text: child.data.link_flair_text
      }));

      setPosts(redditPosts);
    } catch (error) {
      console.error('Error fetching Reddit posts:', error);
      
      // In production, if Reddit API fails due to CORS, show sample posts
      if (!window.location.hostname.includes('localhost')) {
        const samplePosts: RedditPost[] = [
          {
            id: 'sample1',
            title: '[OFFER] Free grocery delivery for seniors in downtown area',
            author: 'helpfulneighbor23',
            score: 45,
            num_comments: 12,
            created_utc: Date.now() / 1000 - 3600,
            url: 'https://reddit.com/r/NeighborNudge',
            selftext: 'I have a car and some free time this weekend. Happy to help seniors or anyone who needs grocery delivery in the downtown area. Just DM me!',
            permalink: '/r/NeighborNudge/comments/sample1/',
            subreddit: 'NeighborNudge',
            flair_text: 'Offer'
          },
          {
            id: 'sample2',
            title: '[REQUEST] Looking for someone to walk my dog while I recover',
            author: 'dogowner42',
            score: 32,
            num_comments: 8,
            created_utc: Date.now() / 1000 - 7200,
            url: 'https://reddit.com/r/NeighborNudge',
            selftext: 'I recently had surgery and need help walking my golden retriever for the next two weeks. He\'s very friendly and well-behaved.',
            permalink: '/r/NeighborNudge/comments/sample2/',
            subreddit: 'NeighborNudge',
            flair_text: 'Request'
          },
          {
            id: 'sample3',
            title: '[SUCCESS] Thank you to everyone who helped with my move!',
            author: 'gratefulrenter',
            score: 78,
            num_comments: 15,
            created_utc: Date.now() / 1000 - 10800,
            url: 'https://reddit.com/r/NeighborNudge',
            selftext: 'This community is amazing! Five neighbors showed up to help me move last weekend. The mutual aid network really works!',
            permalink: '/r/NeighborNudge/comments/sample3/',
            subreddit: 'NeighborNudge',
            flair_text: 'Success Story'
          },
          {
            id: 'sample4',
            title: '[OFFER] Free tutoring for high school math and science',
            author: 'teachervolunteer',
            score: 56,
            num_comments: 9,
            created_utc: Date.now() / 1000 - 14400,
            url: 'https://reddit.com/r/NeighborNudge',
            selftext: 'I\'m a retired teacher and would love to help students with math and science. Available weekday evenings and weekends.',
            permalink: '/r/NeighborNudge/comments/sample4/',
            subreddit: 'NeighborNudge',
            flair_text: 'Offer'
          },
          {
            id: 'sample5',
            title: '[COMMUNITY] Monthly NeighborNudge meetup this Saturday!',
            author: 'communityleader',
            score: 89,
            num_comments: 23,
            created_utc: Date.now() / 1000 - 18000,
            url: 'https://reddit.com/r/NeighborNudge',
            selftext: 'Join us at Central Park this Saturday at 2 PM for our monthly community meetup. Great chance to meet your neighbors and discuss local mutual aid initiatives!',
            permalink: '/r/NeighborNudge/comments/sample5/',
            subreddit: 'NeighborNudge',
            flair_text: 'Community Event'
          }
        ];
        
        setPosts(samplePosts);
        setError('Live Reddit posts unavailable due to browser restrictions. Showing sample community posts.');
      } else {
        setError('Unable to load Reddit posts. This may be due to network connectivity or Reddit API limitations.');
      }
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
    setError(null);
    try {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      let url: string;
      if (isDevelopment) {
        url = `/reddit-api/r/NeighborNudge/search.json?q=${encodeURIComponent(searchQuery)}&restrict_sr=1&limit=20`;
      } else {
        url = `https://www.reddit.com/r/NeighborNudge/search.json?q=${encodeURIComponent(searchQuery)}&restrict_sr=1&limit=20`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid response format from Reddit API');
      }
      
      const searchResults = data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        author: child.data.author,
        score: child.data.score,
        num_comments: child.data.num_comments,
        created_utc: child.data.created_utc,
        url: child.data.url,
        selftext: child.data.selftext,
        permalink: child.data.permalink,
        subreddit: child.data.subreddit,
        flair_text: child.data.link_flair_text
      }));

      setPosts(searchResults);
    } catch (error) {
      console.error('Error searching Reddit posts:', error);
      if (!window.location.hostname.includes('localhost')) {
        setError('Search unavailable in production due to browser restrictions. Visit r/NeighborNudge directly to search.');
      } else {
        setError('Unable to search Reddit posts. Please try again later.');
      }
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

  const getFlairColor = (flair: string) => {
    switch (flair?.toLowerCase()) {
      case 'offer':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'request':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'success story':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'community event':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 ${className}`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <MessageSquare className="h-6 w-6 text-orange-500" />
          <span className="gradient-text">r/NeighborNudge Posts</span>
        </h3>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-shimmer rounded-2xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <MessageSquare className="h-6 w-6 text-orange-500 animate-bounce" />
            <span className="gradient-text">r/NeighborNudge Posts</span>
          </h3>
          <button
            onClick={fetchPosts}
            className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110"
            title="Refresh posts"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts in r/NeighborNudge..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isSearching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                className="px-6 py-3 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-all duration-300 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-orange-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">
              {searchQuery ? 'No posts found for your search.' : 'No posts found in r/NeighborNudge.'}
            </p>
            <p className="text-gray-400 mt-2">
              {searchQuery ? 'Try a different search term.' : 'Be the first to post in the subreddit!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="border-2 border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fadeInUp"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-gray-900 leading-tight flex-1 mr-3 text-lg">
                    {post.title}
                  </h4>
                  <a
                    href={`https://reddit.com${post.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 flex-shrink-0 p-2 hover:bg-orange-50 rounded-xl transition-all duration-300"
                    title="View on Reddit"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>

                {post.flair_text && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 border ${getFlairColor(post.flair_text)}`}>
                    {post.flair_text}
                  </span>
                )}

                {post.selftext && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {truncateText(post.selftext)}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">u/{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeAgo(post.created_utc)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{post.score}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">{post.num_comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <a
            href="https://reddit.com/r/NeighborNudge"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 font-bold flex items-center space-x-2 justify-center bg-orange-50 py-3 px-6 rounded-2xl hover:bg-orange-100 transition-all duration-300 hover:scale-105"
          >
            <Heart className="h-5 w-5" />
            <span>Visit r/NeighborNudge</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}