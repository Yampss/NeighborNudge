interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  score: number;
  num_comments: number;
  url: string;
  permalink: string;
  subreddit: string;
  flair_text?: string;
}

class RedditAPI {
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || '';
  }

  async fetchSubredditPosts(subreddit: string = 'NeighborNudge', limit: number = 25): Promise<RedditPost[]> {
    try {
      // For public subreddits, we can use the JSON API without authentication
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`, {
        headers: {
          'User-Agent': 'NeighborNudge/1.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext,
        author: child.data.author,
        created_utc: child.data.created_utc,
        score: child.data.score,
        num_comments: child.data.num_comments,
        url: child.data.url,
        permalink: child.data.permalink,
        subreddit: child.data.subreddit,
        flair_text: child.data.link_flair_text,
      }));
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      return [];
    }
  }

  async searchSubredditPosts(subreddit: string = 'NeighborNudge', query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=${limit}`, {
        headers: {
          'User-Agent': 'NeighborNudge/1.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to search posts: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext,
        author: child.data.author,
        created_utc: child.data.created_utc,
        score: child.data.score,
        num_comments: child.data.num_comments,
        url: child.data.url,
        permalink: child.data.permalink,
        subreddit: child.data.subreddit,
        flair_text: child.data.link_flair_text,
      }));
    } catch (error) {
      console.error('Error searching subreddit posts:', error);
      return [];
    }
  }
}

export const redditAPI = new RedditAPI();
export type { RedditPost };