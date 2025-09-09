import { useState, useEffect } from 'react';
import { User, Globe, Palette, Bell, Shield, LogOut, ChevronRight, Volume2, BookOpen, Save, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
 
interface UserProfile {
  name: string;
  email: string;
  nativeLanguage: string;
  studyStreak: number;
  totalLessons: number;
  knownWords: number;
}

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true); // This state is still local for notifications
  const [autoPlay, setAutoPlay] = useState(false);
  const [rtlMode, setRtlMode] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Давид Коэн',
    email: 'david.cohen@example.com',
    nativeLanguage: 'Русский',
    studyStreak: 15,
    totalLessons: 12,
    knownWords: 245
  });

  const [tempProfile, setTempProfile] = useState(userProfile);

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'he', name: 'עברית' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' }
  ];

  useEffect(() => {
    // Load user data from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setTempProfile(JSON.parse(savedProfile));
    }

    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setNotifications(settings.notifications ?? true);
      // darkMode is now managed by ThemeContext, no need to load here
      setAutoPlay(settings.autoPlay ?? false);
      setRtlMode(settings.rtlMode ?? true);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      notifications,
      // darkMode is saved by ThemeContext
      autoPlay,
      rtlMode
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
    showSavedMessage('Настройки сохранены!');
  };

  const saveProfile = () => {
    setUserProfile(tempProfile);
    localStorage.setItem('userProfile', JSON.stringify(tempProfile));
    setShowProfileEdit(false);
    showSavedMessage('Профиль обновлен!');
  };

  const showSavedMessage = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleLanguageChange = (language: string) => {
    setTempProfile({ ...tempProfile, nativeLanguage: language });
    setShowLanguageSelect(false);
    showSavedMessage(`Язык изменен на ${language}`);
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      localStorage.clear();
      alert('Вы вышли из системы');
    }
  };

  const toggleSetting = (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'autoPlay':
        setAutoPlay(value);
        break;
      case 'rtlMode':
        setRtlMode(value);
        break;
    }
    setTimeout(saveSettings, 100);
  };

  return (
    <div className="p-6 pt-16">
      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center">
          <Check size={20} className="mr-2" />
          {savedMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Настройки
        </h1>
        <p className="text-slate-400 text-lg">Настройте свой опыт обучения</p>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Профиль</h2>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-xl">{userProfile.name}</div>
              <div className="text-slate-400">{userProfile.email}</div>
              <div className="text-sm text-blue-400 mt-1">
                {userProfile.studyStreak} дней подряд • {userProfile.totalLessons} уроков • {userProfile.knownWords} слов
              </div>
            </div>
            <button 
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Редактировать
            </button>
          </div>

          {showProfileEdit && (
            <div className="border-t border-slate-600 pt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={saveProfile}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  Сохранить
                </button>
                <button 
                  onClick={() => {
                    setTempProfile(userProfile);
                    setShowProfileEdit(false);
                  }}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 px-1">Настройки обучения</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Globe size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-lg">Родной язык</div>
                <div className="text-slate-400">{userProfile.nativeLanguage}</div>
              </div>
              <button 
                onClick={() => setShowLanguageSelect(!showLanguageSelect)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Изменить
              </button>
            </div>

            {showLanguageSelect && (
              <div className="mt-6 border-t border-slate-600 pt-6">
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.name)}
                      className={`p-3 rounded-xl border transition-colors ${
                        userProfile.nativeLanguage === lang.name
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                checked={darkMode} // Use darkMode from context
                onChange={toggleDarkMode} // Use toggleDarkMode from context
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
                onChange={(e) => toggleSetting('rtlMode', e.target.checked)}
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
                onChange={(e) => toggleSetting('autoPlay', e.target.checked)}
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
              onChange={(e) => toggleSetting('notifications', e.target.checked)}
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
          <button 
            onClick={() => alert('Настройки безопасности:\n• Двухфакторная аутентификация: Включена\n• Последний вход: Сегодня в 18:30\n• Активные сессии: 2 устройства')}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30"
          >
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