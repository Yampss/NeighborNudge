interface RedditAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  userAgent: string;
}

interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

interface RedditSubmitResponse {
  json: {
    errors: any[];
    data?: {
      things?: Array<{
        data: {
          id: string;
          name: string;
          url: string;
        };
      }>;
    };
  };
}

class RedditAuth {
  private config: RedditAuthConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.config = {
      clientId: 'fc8neI8d7npdomIB4R1asw',
      clientSecret: 'KQgcB4ISzQVauA8sYpZ-dfMxntWIsA',
      redirectUri: `${window.location.origin}/reddit-callback`,
      userAgent: 'web:NeighborNudge:v1.0.0 (by /u/neighbornudge)'
    };

    // Check for stored token on initialization
    this.loadStoredToken();
  }

  private loadStoredToken() {
    const storedToken = localStorage.getItem('reddit_access_token');
    const storedExpiry = localStorage.getItem('reddit_token_expiry');
    
    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      if (Date.now() < expiryTime) {
        this.accessToken = storedToken;
        this.tokenExpiry = expiryTime;
      } else {
        // Token expired, clear it
        this.clearStoredToken();
      }
    }
  }

  private storeToken(token: string, expiresIn: number) {
    const expiryTime = Date.now() + (expiresIn * 1000) - 60000; // Subtract 1 minute for safety
    localStorage.setItem('reddit_access_token', token);
    localStorage.setItem('reddit_token_expiry', expiryTime.toString());
    this.accessToken = token;
    this.tokenExpiry = expiryTime;
  }

  private clearStoredToken() {
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_token_expiry');
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      state: Math.random().toString(36).substring(7),
      redirect_uri: this.config.redirectUri,
      duration: 'temporary',
      scope: 'submit'
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  async handleAuthCallback(code: string): Promise<boolean> {
    try {
      const tokenResponse = await this.exchangeCodeForToken(code);
      if (tokenResponse.access_token) {
        this.storeToken(tokenResponse.access_token, tokenResponse.expires_in);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error handling auth callback:', error);
      return false;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<RedditTokenResponse> {
    const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
    
    const response = await fetch('/reddit-oauth/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.config.userAgent
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return await response.json();
  }

  async submitPost(title: string, text: string, subreddit: string = 'NeighborNudge'): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'Not authenticated with Reddit' };
    }

    try {
      const response = await fetch('/reddit-oauth/api/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent
        },
        body: new URLSearchParams({
          api_type: 'json',
          kind: 'self',
          sr: subreddit,
          title: title,
          text: text,
          resubmit: 'true'
        })
      });

      if (!response.ok) {
        throw new Error(`Submit failed: ${response.status}`);
      }

      const result: RedditSubmitResponse = await response.json();
      
      if (result.json.errors && result.json.errors.length > 0) {
        return { 
          success: false, 
          error: `Reddit API error: ${result.json.errors.map(e => e.join(': ')).join(', ')}` 
        };
      }

      if (result.json.data?.things?.[0]?.data) {
        const postData = result.json.data.things[0].data;
        return {
          success: true,
          postId: postData.id,
          url: `https://reddit.com${postData.url}`
        };
      }

      return { success: false, error: 'Unexpected response format from Reddit' };
    } catch (error) {
      console.error('Error submitting post:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  logout() {
    this.clearStoredToken();
  }

  generatePostContent(task: { description: string; location: string; proposer: string; contact_method: string }): { title: string; text: string } {
    const title = `[OFFER] ${task.description} - ${task.location}`;
    const text = `Hi r/NeighborNudge!

I'm offering to help with: **${task.description}**

📍 **Location:** ${task.location}
👤 **Posted by:** u/${task.proposer}
📞 **Contact:** ${task.contact_method}

This task was posted through NeighborNudge - a platform for community mutual aid. If you're interested in helping or need similar assistance, check out our app!

---
*This post was automatically generated from NeighborNudge. Join our community to find more ways to help your neighbors!*`;

    return { title, text };
  }
}

export const redditAuth = new RedditAuth();