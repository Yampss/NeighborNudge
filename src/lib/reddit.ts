export interface RedditPost {
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

class RedditAPI {
  async fetchSubredditPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      // Use Reddit's JSON API directly with JSONP-like approach
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
        headers: {
          'User-Agent': 'NeighborNudge/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid response format from Reddit API');
      }
      
      return data.data.children.map((child: any) => ({
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
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      throw new Error('Failed to fetch');
    }
  }

  async searchSubredditPosts(subreddit: string, query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const response = await fetch(`https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}`, {
        headers: {
          'User-Agent': 'NeighborNudge/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data || !data.data.children) {
        throw new Error('Invalid response format from Reddit API');
      }
      
      return data.data.children.map((child: any) => ({
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
    } catch (error) {
      console.error('Error searching subreddit posts:', error);
      throw new Error('Failed to search');
    }
  }
}

export const redditAPI = new RedditAPI();