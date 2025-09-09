import React, { useState } from 'react';
import { User, Globe, Palette, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [rtlMode, setRtlMode] = useState(true);

  const handleLanguageChange = () => {
    alert('Language settings would open here');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      // Handle logout
    }
  };

  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your learning experience</p>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 px-1">Profile</h2>
        
        <button className="w-full flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-750 transition-colors">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
            <User size={20} className="text-blue-500" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-white">Profile Information</div>
            <div className="text-sm text-slate-400">Update your personal details</div>
          </div>
          <ChevronRight size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Learning Preferences */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 px-1">Learning Preferences</h2>
        
        <div className="space-y-3">
          <button 
            onClick={handleLanguageChange}
            className="w-full flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
              <Globe size={20} className="text-green-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-white">Native Language</div>
              <div className="text-sm text-slate-400">English</div>
            </div>
            <ChevronRight size={20} className="text-slate-500" />
          </button>

          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
              <Palette size={20} className="text-yellow-500" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Dark Mode</div>
              <div className="text-sm text-slate-400">Use dark theme</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-500 font-semibold">א</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">RTL Text Direction</div>
              <div className="text-sm text-slate-400">Right-to-left reading</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rtlMode}
                onChange={(e) => setRtlMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-500 font-semibold">▶</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">Auto-play Audio</div>
              <div className="text-sm text-slate-400">Start audio automatically</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 px-1">Notifications</h2>
        
        <div className="flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
            <Bell size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">Push Notifications</div>
            <div className="text-sm text-slate-400">Study reminders and updates</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 px-1">Account</h2>
        
        <div className="space-y-3">
          <button className="w-full flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-750 transition-colors">
            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
              <Shield size={20} className="text-purple-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-white">Privacy & Security</div>
              <div className="text-sm text-slate-400">Manage your account security</div>
            </div>
            <ChevronRight size={20} className="text-slate-500" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
              <LogOut size={20} className="text-red-500" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-red-500">Logout</div>
              <div className="text-sm text-slate-400">Sign out of your account</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <div className="text-sm text-slate-500 mb-1">Yeshiva Learning App v1.0.0</div>
        <div className="text-xs text-slate-600">Made with ❤️ for Torah study</div>
      </div>
    </div>
  );
}