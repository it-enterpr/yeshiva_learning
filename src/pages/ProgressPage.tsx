import { useState } from 'react';
import { Book, Target, TrendingUp, Clock, Award, Brain, Calendar, Trophy } from 'lucide-react';

export default function ProgressPage() {
  const [stats] = useState({
    totalCourses: 3,
    completedLessons: 12,
    totalLessons: 18,
    knownWords: 245,
    learningWords: 67,
    studyStreak: 15,
    averageScore: 85,
    totalStudyTime: 24
  });

  const progressPercentage = (stats.completedLessons / stats.totalLessons) * 100;
  const wordKnowledgePercentage = (stats.knownWords / (stats.knownWords + stats.learningWords)) * 100;

  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Ваш прогресс
        </h1>
        <p className="text-slate-400 text-lg">Отслеживайте свой путь обучения</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Book size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.completedLessons}</div>
          <div className="text-sm text-slate-400 mb-3">Уроков завершено</div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Brain size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.knownWords}</div>
          <div className="text-sm text-slate-400 mb-3">Изученных слов</div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${wordKnowledgePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Target size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.averageScore}%</div>
          <div className="text-sm text-slate-400">Средний балл</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.studyStreak}</div>
          <div className="text-sm text-slate-400">Дней подряд</div>
        </div>
      </div>

      {/* Study Time Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl mb-8">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Время изучения</h3>
            <p className="text-slate-400">За этот месяц</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-2">{stats.totalStudyTime} часов</div>
        <div className="text-sm text-slate-400">+3 часа с прошлой недели</div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Недавняя активность</h2>
        
        <div className="space-y-4">
          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-600 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
              <Award size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">Урок завершен</div>
              <div className="text-slate-400">Талмуд Бавли - Брахот 2а</div>
              <div className="text-xs text-slate-500 mt-1">2 часа назад</div>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-600 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
              <Brain size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">15 новых слов изучено</div>
              <div className="text-slate-400">Из курса Тора - Берешит</div>
              <div className="text-xs text-slate-500 mt-1">1 день назад</div>
            </div>
          </div>

          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-600 shadow-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mr-4">
              <Trophy size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">Тест пройден</div>
              <div className="text-slate-400">Результат: 92% - Мишна Тора</div>
              <div className="text-xs text-slate-500 mt-1">2 дня назад</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Прогресс словарного запаса</h2>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="flex justify-around mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.knownWords}</div>
              <div className="text-sm text-slate-400 mb-3">Изучено</div>
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.learningWords}</div>
              <div className="text-sm text-slate-400 mb-3">Изучается</div>
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
        <h2 className="text-2xl font-bold text-white mb-6">Цели обучения</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center mb-4">
              <Calendar size={20} className="text-blue-400 mr-3" />
              <div className="font-bold text-white text-lg">Недельная цель</div>
            </div>
            <div className="text-sm text-slate-400 mb-3">5 из 7 уроков завершено</div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: '71%' }}></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center mb-4">
              <Target size={20} className="text-green-400 mr-3" />
              <div className="font-bold text-white text-lg">Месячная цель по словам</div>
            </div>
            <div className="text-sm text-slate-400 mb-3">245 из 300 слов изучено</div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}