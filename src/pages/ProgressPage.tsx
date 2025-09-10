import { useState, useEffect } from 'react';
import { Book, Target, TrendingUp, Clock, Award, Brain, Calendar, Trophy, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { progressService, achievementService } from '../lib/database';
import AchievementBadge from '../components/AchievementBadge';
import ProgressChart from '../components/ProgressChart';
import ExportCenter from '../components/ExportCenter';

export default function ProgressPage() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 3,
    completedLessons: 12,
    totalLessons: 18,
    knownWords: 245,
    learningWords: 67,
    studyStreak: 15,
    averageScore: 85,
    totalStudyTime: 24
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExportCenter, setShowExportCenter] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Загружаем реальные данные из localStorage
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const realStats = {
    ...stats,
    knownWords: userProfile.knownWords || stats.knownWords,
    studyStreak: userProfile.studyStreak || stats.studyStreak,
    totalLessons: userProfile.totalLessons || stats.totalLessons,
    completedLessons: Math.min(userProfile.totalLessons || stats.completedLessons, stats.totalLessons)
  };

  useEffect(() => {
    loadProgressData();
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;
    
    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (userProfile.id) {
        const [statsData, achievementsData] = await Promise.all([
          progressService.getStudentStats(userProfile.id),
          achievementService.getUserAchievements(userProfile.id)
        ]);
        
        if (statsData) {
          setStats(prev => ({
            ...prev,
            completedLessons: statsData.completedLessons,
            knownWords: statsData.knownWords,
            learningWords: statsData.learningWords,
            averageScore: statsData.averageScore,
            totalStudyTime: Math.round(statsData.totalTime / 60) // convert to hours
          }));
        }
        
        setAchievements(achievementsData);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (realStats.completedLessons / realStats.totalLessons) * 100;
  const wordKnowledgePercentage = (realStats.knownWords / (realStats.knownWords + stats.learningWords)) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Загрузка прогресса...</div>
      </div>
    );
  }

  return (
    <div className={`p-6 pt-16 min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
          Ваш прогресс
        </h1>
        <div className="flex items-center justify-between">
          <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Отслеживайте свой путь обучения</p>
          <button
            onClick={() => setShowExportCenter(true)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 font-medium"
          >
            <Download size={18} className="mr-2" />
            Экспорт данных
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Book size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.completedLessons}</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>Уроков завершено</div>
          <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.knownWords}</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>Изученных слов</div>
          <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${wordKnowledgePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Target size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.averageScore}%</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Средний балл</div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.studyStreak}</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Дней подряд</div>
        </div>
      </div>

      {/* Advanced Analytics Charts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Детальная аналитика</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartPeriod('week')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                chartPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setChartPeriod('month')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                chartPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => setChartPeriod('year')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                chartPeriod === 'year'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Год
            </button>
          </div>
        </div>
        
        <ProgressChart studentId={user?.id || ''} period={chartPeriod} />
      </div>

      {/* Study Time Card */}
      <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl mb-8`}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Время изучения</h3>
            <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>За этот месяц</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.totalStudyTime || stats.totalStudyTime} часов</div>
        <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>+3 часа с прошлой недели</div>
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Достижения</h2>
          
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
              {achievements.map((achievement) => (
                <AchievementBadge 
                  key={achievement.id} 
                  achievement={achievement} 
                  size="medium"
                />
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Общие очки достижений:
                </span>
                <span className="text-yellow-500 font-bold text-lg">
                  {achievements.reduce((sum, a) => sum + (a.points || 0), 0)} очков
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Недавняя активность</h2>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Недавняя активность</h2>
        
        <div className="space-y-4">
          <div className={`flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-5 border shadow-xl`}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
              <Award size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Урок завершен</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Талмуд Бавли - Брахот 2а</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>2 часа назад</div>
            </div>
          </div>

          <div className={`flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-5 border shadow-xl`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <Brain size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>15 новых слов изучено</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Из курса Тора - Берешит</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>1 день назад</div>
            </div>
          </div>

          <div className={`flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-5 border shadow-xl`}>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4">
              <Trophy size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Тест пройден</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Результат: 92% - Мишна Тора</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'} mt-1`}>2 дня назад</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Progress */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Прогресс словарного запаса</h2>
        
        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="flex justify-around mb-8">
            <div className="text-center">
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.knownWords}</div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>Изучено</div>
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{realStats.learningWords || stats.learningWords}</div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>Изучается</div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto"></div>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
            <Clock size={20} className="mr-3" />
            Повторить слова
          </button>
        </div>
      </div>

      {/* Study Goals */}
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Цели обучения</h2>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center mb-4">
              <Calendar size={20} className="text-blue-400 mr-3" />
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Недельная цель</div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>5 из 7 уроков завершено</div>
            <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3`}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '71%' }}></div>
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center mb-4">
              <Target size={20} className="text-green-400 mr-3" />
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Месячная цель по словам</div>
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'} mb-3`}>{realStats.knownWords} из 300 слов изучено</div>
            <div className={`w-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-3`}>
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Center Modal */}
      <ExportCenter 
        isOpen={showExportCenter}
        onClose={() => setShowExportCenter(false)}
      />
    </div>
  );
}