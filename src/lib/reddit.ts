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
    // Reddit's API doesn't allow direct browser requests due to CORS
    // Return sample data for demonstration purposes
    return this.getSamplePosts();
  }

  async searchSubredditPosts(subreddit: string, query: string, limit: number = 25): Promise<RedditPost[]> {
    // Reddit's API doesn't allow direct browser requests due to CORS
    // Return filtered sample data for demonstration purposes
    const posts = this.getSamplePosts();
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.selftext.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getSamplePosts(): RedditPost[] {
    return [
      {
        id: 'sample1',
        title: 'Welcome to NeighborNudge Community!',
        author: 'community_mod',
        score: 25,
        num_comments: 8,
        created_utc: Date.now() / 1000 - 3600,
        url: 'https://reddit.com/r/NeighborNudge',
        selftext: 'Welcome to our mutual aid community! This is where neighbors help neighbors. Share your offers to help, find ways to contribute, and build stronger community connections.',
        permalink: '/r/NeighborNudge/comments/sample1/',
        subreddit: 'NeighborNudge',
        flair_text: 'Welcome'
      },
      {
        id: 'sample2',
        title: 'How to get started with mutual aid',
        author: 'helpful_neighbor',
        score: 18,
        num_comments: 5,
        created_utc: Date.now() / 1000 - 7200,
        url: 'https://reddit.com/r/NeighborNudge',
        selftext: 'New to mutual aid? Here are some tips: Start small, be consistent, focus on your immediate community, and remember that every act of kindness matters.',
        permalink: '/r/NeighborNudge/comments/sample2/',
        subreddit: 'NeighborNudge',
        flair_text: 'Guide'
      },
      {
        id: 'sample3',
        title: '[OFFER] Free tutoring for kids in math and science',
        author: 'science_teacher',
        score: 12,
        num_comments: 3,
        created_utc: Date.now() / 1000 - 10800,
        url: 'https://reddit.com/r/NeighborNudge',
        selftext: 'I\'m a retired science teacher offering free tutoring for elementary and middle school students. Available weekends in the downtown area.',
        permalink: '/r/NeighborNudge/comments/sample3/',
        subreddit: 'NeighborNudge',
        flair_text: 'Offer'
      },
      {
        id: 'sample4',
        title: '[REQUEST] Need help moving furniture this weekend',
        author: 'moving_neighbor',
        score: 8,
        num_comments: 6,
        created_utc: Date.now() / 1000 - 14400,
        url: 'https://reddit.com/r/NeighborNudge',
        selftext: 'Moving to a new apartment this Saturday and could use some help with heavy furniture. Pizza and drinks provided!',
        permalink: '/r/NeighborNudge/comments/sample4/',
        subreddit: 'NeighborNudge',
        flair_text: 'Request'
      },
      {
        id: 'sample5',
        title: 'Community garden project update',
        author: 'green_thumb',
        score: 15,
        num_comments: 4,
        created_utc: Date.now() / 1000 - 18000,
        url: 'https://reddit.com/r/NeighborNudge',
        selftext: 'Our community garden is thriving! Thanks to everyone who has contributed time, tools, and expertise. Next workday is this Sunday.',
        permalink: '/r/NeighborNudge/comments/sample5/',
        subreddit: 'NeighborNudge',
        flair_text: 'Update'
      }
    ];
  }

  // Generate Reddit post URL for manual posting
  generateRedditPostUrl(task: { description: string; location: string; proposer: string; contact_method: string }): string {
    const title = `[OFFER] ${task.description} - ${task.location}`;
    const body = `Hi r/NeighborNudge!

I'm offering to help with: ${task.description}

📍 **Location:** ${task.location}
👤 **Posted by:** u/${task.proposer}
📞 **Contact:** ${task.contact_method}

This task was posted through NeighborNudge - a platform for community mutual aid. If you're interested in helping or need similar assistance, check out our app!

---
*This post was generated from NeighborNudge. Join our community to find more ways to help your neighbors!*`;

    const params = new URLSearchParams({
      title: title,
      text: body,
      subreddit: 'NeighborNudge'
    });

    return `https://www.reddit.com/r/NeighborNudge/submit?${params.toString()}`;
  }
}

export const redditAPI = new RedditAPI();