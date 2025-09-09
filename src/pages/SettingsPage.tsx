import { useState } from 'react';
import { User, Globe, Palette, Bell, Shield, LogOut, ChevronRight, Volume2, BookOpen } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [rtlMode, setRtlMode] = useState(true);

  const handleLanguageChange = () => {
    alert('Настройки языка откроются здесь');
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      // Handle logout
    }
  };

  return (
    <div className="p-6 pt-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Настройки
        </h1>
        <p className="text-slate-400 text-lg">Настройте свой опыт обучения</p>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Профиль</h2>
        
        <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-white text-lg">Информация профиля</div>
            <div className="text-slate-400">Обновить личные данные</div>
          </div>
          <ChevronRight size={24} className="text-slate-500" />
        </button>
      </div>

      {/* Learning Preferences */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Настройки обучения</h2>
        
        <div className="space-y-4">
          <button 
            onClick={handleLanguageChange}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-xl hover:shadow-green-500/10 hover:border-green-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Globe size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-white text-lg">Родной язык</div>
              <div className="text-slate-400">Русский</div>
            </div>
            <ChevronRight size={24} className="text-slate-500" />
          </button>

          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Palette size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">Темная тема</div>
              <div className="text-slate-400">Использовать темную тему</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
            </label>
          </div>

          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-blue-400 font-bold text-2xl">א</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">Направление текста RTL</div>
              <div className="text-slate-400">Чтение справа налево</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rtlMode}
                onChange={(e) => setRtlMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
            </label>
          </div>

          <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Volume2 size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-lg">Автовоспроизведение аудио</div>
              <div className="text-slate-400">Запускать аудио автоматически</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Уведомления</h2>
        
        <div className="flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Bell size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-white text-lg">Push-уведомления</div>
            <div className="text-slate-400">Напоминания об учебе и обновления</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg"></div>
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Аккаунт</h2>
        
        <div className="space-y-4">
          <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-white text-lg">Приватность и безопасность</div>
              <div className="text-slate-400">Управление безопасностью аккаунта</div>
            </div>
            <ChevronRight size={24} className="text-slate-500" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-xl hover:shadow-red-500/10 hover:border-red-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <LogOut size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-red-400 text-lg">Выйти</div>
              <div className="text-slate-400">Выйти из аккаунта</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <div className="flex items-center justify-center mb-3">
          <BookOpen size={24} className="text-blue-400 mr-2" />
          <span className="text-lg font-bold text-white">Приложение изучения иврита</span>
        </div>
        <div className="text-sm text-slate-500 mb-1">Версия 1.0.0</div>
        <div className="text-xs text-slate-600">Создано с ❤️ для изучения Торы</div>
      </div>
    </div>
  );
}