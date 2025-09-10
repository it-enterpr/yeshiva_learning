import { useState, useEffect } from 'react';
import { User, Globe, Palette, Bell, Shield, LogOut, ChevronRight, Volume2, BookOpen, Save, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
 
interface UserProfile {
  name: string;
  email: string;
  nativeLanguage: string;
  nativeLanguageCode: string;
  studyStreak: number;
  totalLessons: number;
  knownWords: number;
}

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true); // This state is still local for notifications
  const [autoPlay, setAutoPlay] = useState(false);
  const [rtlMode, setRtlMode] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: user?.name || 'Давид Коэн',
    email: user?.email || 'david.cohen@example.com',
    nativeLanguage: user?.nativeLanguage || 'Русский',
    nativeLanguageCode: 'ru',
    studyStreak: 15,
    totalLessons: 12,
    knownWords: 245
  });

  const [tempProfile, setTempProfile] = useState(userProfile);

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
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
    const selectedLang = languages.find(lang => lang.name === language);
    setTempProfile({ 
      ...tempProfile, 
      nativeLanguage: language,
      nativeLanguageCode: selectedLang?.code || 'ru'
    });
    setShowLanguageSelect(false);
    
    // Update user profile and save to localStorage
    const updatedProfile = { 
      ...userProfile, 
      nativeLanguage: language,
      nativeLanguageCode: selectedLang?.code || 'ru'
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Update interface language based on selection
    const interfaceTexts = {
      'Русский': {
        profile: 'Профиль',
        editButton: 'Редактировать',
        learningSettings: 'Настройки обучения',
        nativeLanguage: 'Родной язык',
        changeButton: 'Изменить',
        darkTheme: 'Темная тема',
        useDarkTheme: 'Использовать темную тему',
        notifications: 'Уведомления',
        pushNotifications: 'Push-уведомления',
        studyReminders: 'Напоминания об учебе и обновления',
        account: 'Аккаунт',
        privacy: 'Приватность и безопасность',
        manageAccount: 'Управление безопасностью аккаунта',
        logout: 'Выйти',
        logoutAccount: 'Выйти из аккаунта',
        appName: 'Приложение изучения иврита',
        version: 'Версия 1.0.0',
        footer: 'Создано it-enterprise.cz'
      },
      'English': {
        profile: 'Profile',
        editButton: 'Edit',
        learningSettings: 'Learning Settings',
        nativeLanguage: 'Native Language',
        changeButton: 'Change',
        darkTheme: 'Dark Theme',
        useDarkTheme: 'Use dark theme',
        notifications: 'Notifications',
        pushNotifications: 'Push Notifications',
        studyReminders: 'Study reminders and updates',
        account: 'Account',
        privacy: 'Privacy and Security',
        manageAccount: 'Manage account security',
        logout: 'Logout',
        logoutAccount: 'Logout from account',
        appName: 'Hebrew Study App',
        version: 'Version 1.0.0',
        footer: 'Created by it-enterprise.cz'
      },
      'עברית': {
        profile: 'פרופיל',
        editButton: 'ערוך',
        learningSettings: 'הגדרות למידה',
        nativeLanguage: 'שפת אם',
        changeButton: 'שנה',
        darkTheme: 'ערכת נושא כהה',
        useDarkTheme: 'השתמש בערכת נושא כהה',
        notifications: 'התראות',
        pushNotifications: 'התראות דחיפה',
        studyReminders: 'תזכורות לימוד ועדכונים',
        account: 'חשבון',
        privacy: 'פרטיות ואבטחה',
        manageAccount: 'נהל אבטחת חשבון',
        logout: 'התנתק',
        logoutAccount: 'התנתק מהחשבון',
        appName: 'אפליקציית לימוד עברית',
        version: 'גרסה 1.0.0',
        footer: 'נוצר על ידי it-enterprise.cz'
      }
    };
    
    // Save interface language to localStorage
    localStorage.setItem('interfaceLanguage', language);
    showSavedMessage(`Язык изменен на ${language}`);
  };

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      logout();
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
    <div className={`p-6 pt-16 min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center">
          <Check size={20} className="mr-2" />
          {savedMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Настройки
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Настройте свой опыт обучения</p>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-6 px-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {(localStorage.getItem('interfaceLanguage') || 'Русский') === 'English' ? 'Profile' : 
           (localStorage.getItem('interfaceLanguage') || 'Русский') === 'עברית' ? 'פרופיל' : 'Профиль'}
        </h2>
        
        <div className={`rounded-2xl p-6 border shadow-xl ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold text-xl break-words ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.name}</div>
              <div className={`break-all text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{userProfile.email}</div>
              <div className={`text-xs sm:text-sm mt-1 flex flex-wrap gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <span>{userProfile.studyStreak} дней подряд</span>
                <span>•</span>
                <span>{userProfile.totalLessons} уроков</span>
                <span>•</span>
                <span>{userProfile.knownWords} слов</span>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <button 
                onClick={() => setShowProfileEdit(!showProfileEdit)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
              >
                Редактировать
              </button>
            </div>
          </div>

          {/* Mobile-friendly stats */}
          <div className="grid grid-cols-3 gap-2 sm:hidden mb-4">
            <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.studyStreak}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>дней</div>
            </div>
            <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.totalLessons}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>уроков</div>
            </div>
            <div className={`text-center p-3 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.knownWords}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>слов</div>
            </div>
          </div>

          {/* Desktop stats - hidden on mobile */}
          <div className="hidden sm:block">
            <div className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {userProfile.studyStreak} дней подряд • {userProfile.totalLessons} уроков • {userProfile.knownWords} слов
            </div>
          </div>

          {showProfileEdit && (
            <div className={`border-t pt-6 space-y-4 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Имя</label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Email</label>
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={saveProfile}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold"
                >
                  <Save size={18} className="mr-2" />
                  Сохранить
                </button>
                <button 
                  onClick={() => {
                    setTempProfile(userProfile);
                    setShowProfileEdit(false);
                  }}
                  className={`px-6 py-3 rounded-xl transition-colors font-semibold ${
                    darkMode 
                      ? 'bg-slate-600 hover:bg-slate-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
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
        <h2 className={`text-xl font-bold mb-6 px-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Настройки обучения</h2>
        
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 border shadow-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Globe size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Родной язык</div>
                <div className={`flex items-center ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="mr-2">{languages.find(l => l.name === userProfile.nativeLanguage)?.flag}</span>
                  {userProfile.nativeLanguage}
                </div>
              </div>
              <button 
                onClick={() => setShowLanguageSelect(!showLanguageSelect)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                Изменить
              </button>
            </div>

            {showLanguageSelect && (
              <div className={`mt-6 border-t pt-6 ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.name)}
                      className={`p-3 rounded-xl border transition-colors font-semibold ${
                        userProfile.nativeLanguage === lang.name
                          ? 'bg-green-600 border-green-500 text-white shadow-lg'
                          : darkMode
                            ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`flex items-center rounded-2xl p-6 border shadow-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Palette size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Темная тема</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Использовать темную тему</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode} // Use darkMode from context
                onChange={toggleDarkMode} // Use toggleDarkMode from context
                className="sr-only peer"
              />
              <div className={`w-14 h-8 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg ${
                darkMode ? 'bg-slate-600' : 'bg-gray-300'
              }`}></div>
            </label>
          </div>

          <div className={`flex items-center rounded-2xl p-6 border shadow-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-blue-400 font-bold text-2xl">א</span>
            </div>
            <div className="flex-1">
              <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Направление текста RTL</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Чтение справа налево</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rtlMode}
                onChange={(e) => toggleSetting('rtlMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-14 h-8 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg ${
                darkMode ? 'bg-slate-600' : 'bg-gray-300'
              }`}></div>
            </label>
          </div>

          <div className={`flex items-center rounded-2xl p-6 border shadow-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Volume2 size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Автовоспроизведение аудио</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Запускать аудио автоматически</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => toggleSetting('autoPlay', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-14 h-8 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg ${
                darkMode ? 'bg-slate-600' : 'bg-gray-300'
              }`}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-6 px-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Уведомления</h2>
        
        <div className={`flex items-center rounded-2xl p-6 border shadow-xl ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Bell size={28} className="text-white" />
          </div>
          <div className="flex-1">
            <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Push-уведомления</div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Напоминания об учебе и обновления</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => toggleSetting('notifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-14 h-8 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-lg ${
              darkMode ? 'bg-slate-600' : 'bg-gray-300'
            }`}></div>
          </label>
        </div>
      </div>

      {/* Account */}
      <div className="mb-8">
        <h2 className={`text-xl font-bold mb-6 px-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Аккаунт</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => alert('Настройки безопасности:\n• Двухфакторная аутентификация: Включена\n• Последний вход: Сегодня в 18:30\n• Активные сессии: 2 устройства')}
            className={`w-full flex items-center rounded-2xl p-6 border transition-all duration-300 shadow-xl ${
              darkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 hover:from-slate-750 hover:to-slate-850 hover:shadow-purple-500/10 hover:border-purple-500/30' 
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-purple-500/10 hover:border-purple-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Приватность и безопасность</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Управление безопасностью аккаунта</div>
            </div>
            <ChevronRight size={24} className={`${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
          </button>

          <button 
            onClick={handleLogout}
            className={`w-full flex items-center rounded-2xl p-6 border transition-all duration-300 shadow-xl ${
              darkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 hover:from-slate-750 hover:to-slate-850 hover:shadow-red-500/10 hover:border-red-500/30' 
                : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-red-500/10 hover:border-red-300'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <LogOut size={28} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className={`font-bold text-lg ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Выйти</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Выйти из аккаунта</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-600 mt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={20} className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Приложение изучения иврита
            </span>
          </div>
          
          <div className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Версия 1.0.0
          </div>
          
          <div className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Создано 
            <a 
              href="https://it-enterprise.cz" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`ml-1 font-bold transition-colors ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              it-enterprise.cz
            </a>
          </div>
          
          <div className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            © 2024 IT Enterprise. Все права защищены.
          </div>
        </div>
      </div>
    </div>
  );
}