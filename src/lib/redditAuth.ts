interface RedditPostData {
  description: string;
  location: string;
  proposer: string;
  contact_method: string;
}

class RedditAuth {
  // Remove all the complex OAuth stuff and just provide simple post generation
  generatePostContent(task: RedditPostData): { title: string; text: string } {
    const title = `[OFFER] ${task.description} - ${task.location}`;
    const text = `Hi r/NeighborNudge!

I'm offering to help with: **${task.description}**

📍 **Location:** ${task.location}
👤 **Posted by:** u/${task.proposer}
📞 **Contact:** ${task.contact_method}

This task was posted through NeighborNudge - a platform for community mutual aid. If you're interested in helping or need similar assistance, check out our app!

---
*This post was generated from NeighborNudge. Join our community to find more ways to help your neighbors!*`;

    return { title, text };
  }

  // Generate a Reddit submit URL that opens Reddit's post form with pre-filled content
  generateRedditSubmitUrl(task: RedditPostData): string {
    const { title, text } = this.generatePostContent(task);
    
    const params = new URLSearchParams({
      title: title,
      text: text,
      subreddit: 'NeighborNudge'
    });

    return `https://www.reddit.com/r/NeighborNudge/submit?${params.toString()}`;
  }

  // Simple methods that don't require authentication
  isAuthenticated(): boolean {
    return false; // We're not doing OAuth anymore
  }

  getAuthUrl(): string {
    return ''; // Not needed
  }

  async handleAuthCallback(): Promise<boolean> {
    return false; // Not needed
  }

  async submitPost(_title: string, _text: string): Promise<{ success: boolean; url?: string; error?: string }> {
    // Instead of actually submitting, we'll return a URL for manual posting
    return { 
      success: false, 
      error: 'Direct posting not available. Use the generated Reddit link instead.' 
    };
  }

  logout() {
    // Nothing to do
  }
}

export const redditAuth = new RedditAuth();