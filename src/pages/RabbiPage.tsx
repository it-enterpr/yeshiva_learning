import { Users, BookOpen, Plus, BarChart3 } from 'lucide-react';

export default function RabbiPage() {
  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Rabbi Panel</h1>
        <p className="text-slate-400">Manage courses and track student progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
            <Users size={24} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">24</div>
          <div className="text-sm text-slate-400">Active Students</div>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
            <BookOpen size={24} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">3</div>
          <div className="text-sm text-slate-400">Active Courses</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        
        <div className="space-y-3">
          <button className="w-full flex items-center bg-slate-800 hover:bg-slate-700 rounded-xl p-4 border border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
              <Plus size={20} className="text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Create New Course</div>
              <div className="text-sm text-slate-400">Add a new Torah study course</div>
            </div>
          </button>

          <button className="w-full flex items-center bg-slate-800 hover:bg-slate-700 rounded-xl p-4 border border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
              <BookOpen size={20} className="text-green-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Add New Lesson</div>
              <div className="text-sm text-slate-400">Create lesson content with audio</div>
            </div>
          </button>

          <button className="w-full flex items-center bg-slate-800 hover:bg-slate-700 rounded-xl p-4 border border-slate-700 transition-colors">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
              <BarChart3 size={20} className="text-purple-500" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">View Analytics</div>
              <div className="text-sm text-slate-400">Track student progress and engagement</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Student Activity</h2>
        
        <div className="space-y-3">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-white">Sarah completed Lesson 3</div>
              <div className="text-xs text-slate-500">2 hours ago</div>
            </div>
            <div className="text-sm text-slate-400">Torah - Bereishit • Score: 95%</div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-white">David started new course</div>
              <div className="text-xs text-slate-500">5 hours ago</div>
            </div>
            <div className="text-sm text-slate-400">Talmud Bavli - Berachot</div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-white">Rachel learned 15 new words</div>
              <div className="text-xs text-slate-500">1 day ago</div>
            </div>
            <div className="text-sm text-slate-400">Tanya - Likutei Amarim</div>
          </div>
        </div>
      </div>
    </div>
  );
}