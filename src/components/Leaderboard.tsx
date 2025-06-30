import { Trophy, Medal, Award, Star } from 'lucide-react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
  loading: boolean;
}

export default function Leaderboard({ users, loading }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-primary-500" />;
    }
  };

  const getRankColors = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-accent-500" />
          <span>Community Leaders</span>
        </h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-accent-500" />
        <span>Community Leaders</span>
      </h2>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No leaders yet!</p>
          <p className="text-gray-400">Start helping your community to earn Nudge Points.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div
              key={user.reddit_username}
              className={`p-4 rounded-lg border-2 ${getRankColors(index)} transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(index)}
                    <span className="text-lg font-bold text-gray-700">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      u/{user.reddit_username}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {user.nudge_points}
                  </p>
                  <p className="text-sm text-gray-500">
                    Nudge Points
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-100">
        <h3 className="font-semibold text-gray-900 mb-2">How to earn points:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Post a task: <span className="font-medium text-primary-600">5 points</span></li>
          <li>• Complete a task: <span className="font-medium text-accent-600">10 points</span></li>
        </ul>
      </div>
    </div>
  );
}