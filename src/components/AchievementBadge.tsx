import { useState } from 'react';
import { Trophy, Star, Award, Target, BookOpen, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  icon: string;
  points: number;
  unlocked_at: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export default function AchievementBadge({ 
  achievement, 
  size = 'medium', 
  showDetails = false 
}: AchievementBadgeProps) {
  const { darkMode } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'first_lesson': return <BookOpen size={20} />;
      case 'ten_lessons': return <Target size={20} />;
      case 'fifty_lessons': return <Trophy size={20} />;
      case 'hundred_words': return <Star size={20} />;
      case 'streak': return <Zap size={20} />;
      default: return <Award size={20} />;
    }
  };

  const getGradientColor = (type: string) => {
    switch (type) {
      case 'first_lesson': return 'from-blue-500 to-blue-600';
      case 'ten_lessons': return 'from-green-500 to-green-600';
      case 'fifty_lessons': return 'from-purple-500 to-purple-600';
      case 'hundred_words': return 'from-yellow-500 to-yellow-600';
      case 'streak': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} bg-gradient-to-br ${getGradientColor(achievement.achievement_type)} rounded-full flex items-center justify-center shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-xl`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="text-white">
          {achievement.icon ? (
            <span className="text-lg">{achievement.icon}</span>
          ) : (
            getIconComponent(achievement.achievement_type)
          )}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap ${
          darkMode 
            ? 'bg-slate-800 border border-slate-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          <div className="font-semibold text-sm">{achievement.achievement_name}</div>
          <div className={`text-xs ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {achievement.description}
          </div>
          <div className="text-xs text-yellow-500 font-medium">
            +{achievement.points} очков
          </div>
          
          {/* Arrow */}
          <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            darkMode ? 'border-t-slate-800' : 'border-t-white'
          }`}></div>
        </div>
      )}

      {/* Details Card */}
      {showDetails && (
        <div className={`mt-3 p-3 rounded-xl border ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {achievement.achievement_name}
          </div>
          <div className={`text-sm mt-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {achievement.description}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-500 font-medium text-sm">
              +{achievement.points} очков
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {new Date(achievement.unlocked_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}