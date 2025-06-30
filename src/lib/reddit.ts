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

class RedditAuth {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || '';
    this.redirectUri = `${window.location.origin}/auth/callback`;
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
      scope: 'identity'
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

  logout(): void {
    localStorage.removeItem('reddit_access_token');
    localStorage.removeItem('reddit_user');
    localStorage.removeItem('reddit_auth_state');
  }

  getStoredUser(): RedditUser | null {
    const userStr = localStorage.getItem('reddit_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  storeUser(user: RedditUser, accessToken: string): void {
    localStorage.setItem('reddit_user', JSON.stringify(user));
    localStorage.setItem('reddit_access_token', accessToken);
  }
}

export const redditAuth = new RedditAuth();
export type { RedditUser };