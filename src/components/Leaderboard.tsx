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
        return 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:via-yellow-800/20 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-600 shadow-yellow-200 dark:shadow-yellow-900/50';
      case 1:
        return 'bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-slate-800/50 border-gray-300 dark:border-gray-600 shadow-gray-200 dark:shadow-gray-800/50';
      case 2:
        return 'bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100 dark:from-amber-900/30 dark:via-orange-800/20 dark:to-amber-900/30 border-amber-300 dark:border-amber-600 shadow-amber-200 dark:shadow-amber-900/50';
      default:
        return 'bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 dark:from-primary-900/30 dark:via-blue-800/20 dark:to-primary-900/30 border-primary-200 dark:border-primary-600 shadow-primary-200 dark:shadow-primary-900/50';
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
      <div className="bg-white dark:bg-black rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center space-x-3">
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
    <div className="bg-white dark:bg-black rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden animate-fadeInUp">
      <div className="absolute inset-0 bg-pattern-dots opacity-5"></div>
      <div className="relative">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-accent-500 animate-bounce" />
          <span className="gradient-text">Community Leaders</span>
          <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
        </h2>
        
        {users.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-500 dark:text-gray-400 text-xl font-medium">No leaders yet!</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Start helping your community to earn Nudge Points.</p>
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
                      <span className={`font-bold ${index < 3 ? 'text-2xl' : 'text-xl'} text-gray-700 dark:text-gray-200`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className={`font-bold text-gray-900 dark:text-gray-100 ${index < 3 ? 'text-xl' : 'text-lg'}`}>
                        u/{user.reddit_username}
                      </p>
                      {index === 0 && (
                        <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium flex items-center">
                          <Crown className="h-4 w-4 mr-1" />
                          Community Champion
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-primary-600 dark:text-primary-400 ${index < 3 ? 'text-3xl' : 'text-2xl'}`}>
                      {user.nudge_points}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      Nudge Points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 via-blue-50 to-accent-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-accent-900/20 rounded-2xl border-2 border-primary-100 dark:border-primary-800">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center text-lg">
            <Gift className="h-5 w-5 mr-2 text-primary-500" />
            How to earn points:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-primary-200 dark:border-primary-700">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Post a task</span>
              </div>
              <span className="font-bold text-primary-600 dark:text-primary-400 text-lg">5 points</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-accent-200 dark:border-accent-700">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-accent-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Complete a task</span>
              </div>
              <span className="font-bold text-accent-600 dark:text-accent-400 text-lg">10 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}