import { Heart, Users, Heart as HandHeart, Trophy, ArrowRight, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'post' | 'browse' | 'my-tasks' | 'leaderboard') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl text-white shadow-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="h-16 w-16 text-white animate-pulse" />
              <Sparkles className="h-8 w-8 text-yellow-300 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6">Welcome to NeighborNudge</h1>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Transform your community through the power of mutual aid. 
            Small acts of kindness create ripples of positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('post')}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <HandHeart className="h-5 w-5" />
              <span>Offer Help</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Find Tasks</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <HandHeart className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Offer Help</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Share your skills and time with neighbors who need assistance. Every small act makes a difference.
          </p>
          <button
            onClick={() => onNavigate('post')}
            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center space-x-1"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-accent-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Find Tasks</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Discover ways to help your community. Browse available tasks and make meaningful connections.
          </p>
          <button
            onClick={() => onNavigate('browse')}
            className="text-accent-600 font-semibold hover:text-accent-700 flex items-center space-x-1"
          >
            <span>Browse Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-105">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <Trophy className="h-8 w-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Earn Recognition</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Build your reputation as a community helper. Earn Nudge Points and climb the leaderboard.
          </p>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="text-yellow-600 font-semibold hover:text-yellow-700 flex items-center space-x-1"
          >
            <span>View Leaders</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Community Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Tasks Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-600 mb-2">200+</div>
            <div className="text-gray-600">Active Helpers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Neighborhoods</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-gray-600">Lives Touched</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Join thousands of neighbors who are building stronger, more connected communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('post')}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <HandHeart className="h-5 w-5" />
            <span>Start Helping Today</span>
          </button>
        </div>
      </section>
    </div>
  );
}