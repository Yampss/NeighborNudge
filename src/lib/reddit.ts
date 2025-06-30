import snoowrap from 'snoowrap';

interface RedditUser {
  name: string;
  id: string;
  icon_img: string;
}

interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

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

class RedditAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private snoowrapInstance: snoowrap | null = null;

  constructor() {
    this.clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || '';
    this.redirectUri = `${window.location.origin}/auth/callback`;
    this.initializeSnoowrap();
  }

  private initializeSnoowrap() {
    try {
      this.snoowrapInstance = new snoowrap({
        userAgent: 'NeighborNudge/1.0.0 by u/NeighborNudgeBot',
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        refreshToken: '', // We'll use this for read-only access
      });
    } catch (error) {
      console.warn('Failed to initialize snoowrap:', error);
    }
  }

  generateAuthUrl(): string {
    const state = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('reddit_auth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      state: state,
      redirect_uri: this.redirectUri,
      duration: 'temporary',
      scope: 'identity read'
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<string | null> {
    const storedState = localStorage.getItem('reddit_auth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data: RedditTokenResponse = await response.json();
    
    // Update snoowrap instance with access token
    if (this.snoowrapInstance) {
      this.snoowrapInstance.accessToken = data.access_token;
    }
    
    return data.access_token;
  }

  async getUserInfo(accessToken: string): Promise<RedditUser> {
    const response = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'NeighborNudge/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
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

  logout(): void {
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_user');
    localStorage.removeItem('reddit_auth_state');
    
    // Reset snoowrap instance
    if (this.snoowrapInstance) {
      this.snoowrapInstance.accessToken = '';
    }
  }

  getStoredUser(): RedditUser | null {
    const userStr = localStorage.getItem('reddit_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  storeUser(user: RedditUser, accessToken: string): void {
    localStorage.setItem('reddit_user', JSON.stringify(user));
    localStorage.setItem('reddit_access_token', accessToken);
    
    // Update snoowrap instance
    if (this.snoowrapInstance) {
      this.snoowrapInstance.accessToken = accessToken;
    }
  }
}

export const redditAuth = new RedditAuth();
export type { RedditUser, RedditPost };