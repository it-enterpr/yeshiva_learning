import { useState } from 'react';
import { Book, Target, TrendingUp, Clock, Award, Brain } from 'lucide-react';

export default function ProgressPage() {
  const [stats] = useState({
    totalCourses: 3,
    completedLessons: 12,
    totalLessons: 18,
    knownWords: 245,
    learningWords: 67,
    studyStreak: 15,
    averageScore: 85
  });

  const progressPercentage = (stats.completedLessons / stats.totalLessons) * 100;
  const wordKnowledgePercentage = (stats.knownWords / (stats.knownWords + stats.learningWords)) * 100;

  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
        <p className="text-slate-400">Track your learning journey</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
            <Book size={24} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.completedLessons}</div>
          <div className="text-sm text-slate-400 mb-2">Lessons Completed</div>
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
            <Brain size={24} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.knownWords}</div>
          <div className="text-sm text-slate-400 mb-2">Known Words</div>
          <div className="w-full bg-slate-700 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full"
              style={{ width: `${wordKnowledgePercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-3">
            <Target size={24} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.averageScore}%</div>
          <div className="text-sm text-slate-400">Average Score</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp size={24} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.studyStreak}</div>
          <div className="text-sm text-slate-400">Day Streak</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        
        <div className="space-y-3">
          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
              <Award size={20} className="text-green-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Lesson Completed</div>
              <div className="text-sm text-slate-400">Talmud Bavli - Berachot 2a</div>
              <div className="text-xs text-slate-500">2 hours ago</div>
            </div>
          </div>

          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
              <Brain size={20} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">15 New Words Learned</div>
              <div className="text-sm text-slate-400">From Torah - Bereishit</div>
              <div className="text-xs text-slate-500">1 day ago</div>
            </div>
          </div>

          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
              <Target size={20} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Test Passed</div>
              <div className="text-sm text-slate-400">Score: 92% - Mishnah Torah</div>
              <div className="text-xs text-slate-500">2 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulary Progress */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Vocabulary Progress</h2>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex justify-around mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.knownWords}</div>
              <div className="text-sm text-slate-400 mb-2">Known</div>
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stats.learningWords}</div>
              <div className="text-sm text-slate-400 mb-2">Learning</div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto"></div>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
            <Clock size={16} className="mr-2" />
            Review Words
          </button>
        </div>
      </div>

      {/* Study Goals */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Study Goals</h2>
        
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="font-semibold text-white mb-1">Weekly Goal</div>
            <div className="text-sm text-slate-400 mb-2">5 / 7 lessons completed</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="font-semibold text-white mb-1">Monthly Words Target</div>
            <div className="text-sm text-slate-400 mb-2">245 / 300 words learned</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}