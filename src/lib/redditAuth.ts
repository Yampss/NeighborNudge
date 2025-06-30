export interface RedditUser {
  id: string;
  name: string;
  icon_img: string;
  link_karma: number;
  comment_karma: number;
  created_utc: number;
}

class RedditAuth {
  private clientId: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private user: RedditUser | null = null;

  constructor() {
    this.clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || '';
    this.redirectUri = `${window.location.origin}/reddit-callback`;
  }

  generateAuthUrl(): string {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('reddit_auth_state', state);
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      state,
      redirect_uri: this.redirectUri,
      duration: 'temporary',
      scope: 'identity read'
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<boolean> {
    const savedState = sessionStorage.getItem('reddit_auth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    try {
      const response = await fetch('/reddit-oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      sessionStorage.setItem('reddit_access_token', this.accessToken!);
      
      return true;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return false;
    }
  }

  async fetchUserInfo(): Promise<RedditUser | null> {
    if (!this.accessToken) {
      this.accessToken = sessionStorage.getItem('reddit_access_token');
    }

    if (!this.accessToken) {
      return null;
    }

    try {
      const response = await fetch('/reddit-oauth/api/v1/me', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': 'NeighborNudge/1.0'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      this.user = await response.json();
      return this.user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      this.logout();
      return null;
    }
  }

  getCurrentUser(): RedditUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    this.user = null;
    sessionStorage.removeItem('reddit_access_token');
    sessionStorage.removeItem('reddit_auth_state');
  }
}

export const redditAuth = new RedditAuth();