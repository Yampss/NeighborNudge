import { Trophy, Medal, Star, Crown, Sparkles, Heart, Gift } from 'lucide-react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
  loading: boolean;
}

export default function Leaderboard({ users, loading }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Trophy className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Medal className="h-8 w-8 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-primary-500" />;
    }
  };

  const getRankColors = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100 border-yellow-300 shadow-yellow-200';
      case 1:
        return 'bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100 border-gray-300 shadow-gray-200';
      case 2:
        return 'bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100 border-amber-300 shadow-amber-200';
      default:
        return 'bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 border-primary-200 shadow-primary-200';
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
            🏆 Nudge Champ!
          </div>
        );
      case 1:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🥈 Runner-up
          </div>
        );
      case 2:
        return (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🥉 Third Place
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-accent-500" />
          <span className="gradient-text">Community Leaders</span>
        </h2>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-shimmer rounded-2xl h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden animate-fadeInUp">
      <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
      <div className="relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-accent-500 animate-bounce" />
          <span className="gradient-text">Community Leaders</span>
          <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
        </h2>
        
        {users.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 text-xl font-medium">No leaders yet!</p>
            <p className="text-gray-400 mt-2">Start helping your community to earn Nudge Points.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {users.map((user, index) => (
              <div
                key={user.reddit_username}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${getRankColors(index)} ${index < 3 ? 'shadow-lg' : 'shadow-md'}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {getRankBadge(index)}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(index)}
                      <span className={`font-bold ${index < 3 ? 'text-2xl' : 'text-xl'} text-gray-700`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className={`font-bold text-gray-900 ${index < 3 ? 'text-xl' : 'text-lg'}`}>
                        u/{user.reddit_username}
                      </p>
                      {index === 0 && (
                        <p className="text-yellow-600 text-sm font-medium flex items-center">
                          <Crown className="h-4 w-4 mr-1" />
                          Community Champion
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-primary-600 ${index < 3 ? 'text-3xl' : 'text-2xl'}`}>
                      {user.nudge_points}
                    </p>
                    <p className="text-gray-500 font-medium">
                      Nudge Points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 via-blue-50 to-accent-50 rounded-2xl border-2 border-primary-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <Gift className="h-5 w-5 mr-2 text-primary-500" />
            How to earn points:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-primary-200">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-700">Post a task</span>
              </div>
              <span className="font-bold text-primary-600 text-lg">5 points</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-accent-200">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-accent-500" />
                <span className="font-medium text-gray-700">Complete a task</span>
              </div>
              <span className="font-bold text-accent-600 text-lg">10 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}