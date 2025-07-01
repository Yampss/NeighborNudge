import { Heart, Users, Heart as HandHeart, Trophy, ArrowRight, Sparkles, Star, Gift } from 'lucide-react';
import RedditPosts from './RedditPosts';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'post' | 'browse' | 'my-tasks' | 'leaderboard') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-primary-500 via-purple-500 to-accent-500 rounded-3xl text-white shadow-2xl relative overflow-hidden animate-fadeInUp">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Heart className="h-20 w-20 text-white animate-heartBeat drop-shadow-lg" />
              <Sparkles className="h-10 w-10 text-yellow-300 absolute -top-3 -right-3 animate-bounce" />
              <Star className="h-6 w-6 text-yellow-200 absolute -bottom-2 -left-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              NeighborNudge
            </span>
          </h1>
          <p className="text-2xl mb-10 opacity-95 leading-relaxed font-light">
            Transform your community through the power of mutual aid. 
            <br />
            <span className="font-medium">Small acts of kindness create ripples of positive change.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onNavigate('post')}
              className="group bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105 btn-bounce"
            >
              <HandHeart className="h-6 w-6 group-hover:text-accent-500 transition-colors" />
              <span>Offer Help</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="group bg-transparent border-3 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Users className="h-6 w-6" />
              <span>Find Tasks</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Features Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover-lift hover-glow group animate-fadeInUp">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HandHeart className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">Offer Help</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Share your skills and time with neighbors who need assistance. Every small act makes a difference.
              </p>
              <button
                onClick={() => onNavigate('post')}
                className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-2 text-lg group-hover:translate-x-2 transition-transform"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover-lift hover-glow group animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="bg-gradient-to-br from-accent-100 to-accent-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-accent-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-accent-600 transition-colors">Find Tasks</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Discover ways to help your community. Browse available tasks and make meaningful connections.
              </p>
              <button
                onClick={() => onNavigate('browse')}
                className="text-accent-600 font-semibold hover:text-accent-700 flex items-center space-x-2 text-lg group-hover:translate-x-2 transition-transform"
              >
                <span>Browse Now</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover-lift hover-glow group animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors">Earn Recognition</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Build your reputation as a community helper. Earn Nudge Points and climb the leaderboard.
              </p>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="text-yellow-600 font-semibold hover:text-yellow-700 flex items-center space-x-2 text-lg group-hover:translate-x-2 transition-transform"
              >
                <span>View Leaders</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover-lift hover-glow group animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">Join the Community</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Connect with like-minded neighbors on Reddit and share your mutual aid experiences.
              </p>
              <a
                href="https://reddit.com/r/NeighborNudge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 font-semibold hover:text-orange-700 flex items-center space-x-2 text-lg group-hover:translate-x-2 transition-transform"
              >
                <span>Visit r/NeighborNudge</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-10 bg-pattern-grid animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10 gradient-text">Community Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="text-4xl font-bold text-primary-600 mb-3 group-hover:scale-110 transition-transform">500+</div>
                <div className="text-gray-600 font-medium">Tasks Completed</div>
                <Gift className="h-6 w-6 text-primary-400 mx-auto mt-2 opacity-60" />
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-accent-600 mb-3 group-hover:scale-110 transition-transform">200+</div>
                <div className="text-gray-600 font-medium">Active Helpers</div>
                <Users className="h-6 w-6 text-accent-400 mx-auto mt-2 opacity-60" />
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-green-600 mb-3 group-hover:scale-110 transition-transform">50+</div>
                <div className="text-gray-600 font-medium">Neighborhoods</div>
                <Heart className="h-6 w-6 text-green-400 mx-auto mt-2 opacity-60" />
              </div>
              <div className="text-center group">
                <div className="text-4xl font-bold text-purple-600 mb-3 group-hover:scale-110 transition-transform">1000+</div>
                <div className="text-gray-600 font-medium">Lives Touched</div>
                <Sparkles className="h-6 w-6 text-purple-400 mx-auto mt-2 opacity-60" />
              </div>
            </div>
          </section>
        </div>

        {/* Reddit Posts Sidebar */}
        <div className="lg:col-span-1 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
          <RedditPosts />
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden animate-fadeInUp" style={{animationDelay: '0.6s'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-accent-50 opacity-50"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 gradient-text">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
            Join thousands of neighbors who are building stronger, more connected communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onNavigate('post')}
              className="group bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl hover:scale-105 btn-bounce"
            >
              <HandHeart className="h-6 w-6 group-hover:animate-pulse" />
              <span>Start Helping Today</span>
              <Sparkles className="h-6 w-6 group-hover:animate-spin" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}