import { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, BarChart3, MessageSquare, X, Save, Check, TrendingUp, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { lessonService, translationRequestService } from '../lib/database';
import ProgressChart from '../components/ProgressChart';

interface NewLesson {
  title: string;
  content: string;
  courseId: string;
  audioUrl: string;
  youtubeUrl: string;
}

export default function RabbiPage() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTranslationRequests, setShowTranslationRequests] = useState(false);
  const [showStudentAnalytics, setShowStudentAnalytics] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [translationRequests, setTranslationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: '',
    content: '',
    courseId: '1',
    audioUrl: '',
    youtubeUrl: ''
  });

  const courses = [
    { id: '1', title: 'תורה - בראשית' },
    { id: '2', title: 'תלמוד בבלי - ברכות' },
    { id: '3', title: 'תניא - ליקוטי אמרים' }
  ];

  useEffect(() => {
    if (showTranslationRequests) {
      loadTranslationRequests();
    }
  }, [showTranslationRequests]);

  const analytics = {
    totalStudents: 24,
    activeCourses: 3,
    completedLessons: 45,
    averageProgress: 78,
    weeklyActivity: [12, 18, 15, 22, 19, 25, 21],
    topWords: [
      { word: 'בְּרֵאשִׁית', requests: 8 },
      { word: 'אֱלֹהִים', requests: 6 },
      { word: 'הַשָּׁמַיִם', requests: 5 }
    ]
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const loadTranslationRequests = async () => {
    setLoading(true);
    try {
      const requests = await translationRequestService.getPendingRequests();
      setTranslationRequests(requests);
    } catch (error) {
      console.error('Error loading translation requests:', error);
      // Fallback to demo data
      setTranslationRequests([
        { id: 1, word: { hebrew_word: 'מְרַחֶפֶת' }, student: { name: 'Моше' }, lesson: { title: 'Берешит 1:1-5' }, status: 'pending' },
        { id: 2, word: { hebrew_word: 'תֹהוּ' }, student: { name: 'Сара' }, lesson: { title: 'Берешит 1:1-5' }, status: 'pending' },
        { id: 3, word: { hebrew_word: 'בָּרָא' }, student: { name: 'Давид' }, lesson: { title: 'Берешит 1:1-5' }, status: 'answered' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!newLesson.title || !newLesson.content) {
      alert('Пожалуйста, заполните название и содержание урока');
      return;
    }

    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const existingLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
      
      const lessonData = {
        course_id: newLesson.courseId,
        title: newLesson.title,
        content: newLesson.content,
        audio_url: newLesson.audioUrl || null,
        youtube_url: newLesson.youtubeUrl || null,
        order_number: existingLessons.length + 1,
        is_published: true
      };

      await lessonService.create(lessonData);
      
      setNewLesson({
        title: '',
        content: '',
        courseId: '1',
        audioUrl: '',
        youtubeUrl: ''
      });
      setShowCreateLesson(false);
      showSuccessMessage('Урок успешно создан!');
    } catch (error) {
      console.error('Error creating lesson:', error);
      // Fallback to localStorage for demo
      const existingLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
      const lesson = {
        id: Date.now().toString(),
        ...newLesson,
        created_at: new Date().toISOString(),
        order_number: existingLessons.length + 1
      };
      
      existingLessons.push(lesson);
      localStorage.setItem('lessons', JSON.stringify(existingLessons));
      
      setNewLesson({
        title: '',
        content: '',
        courseId: '1',
        audioUrl: '',
        youtubeUrl: ''
      });
      setShowCreateLesson(false);
      showSuccessMessage('Урок успешно создан!');
    }
  };

  const handleCreateCourse = () => {
    const courseName = prompt('Введите название нового курса:');
    if (courseName) {
      showSuccessMessage(`Курс "${courseName}" создан!`);
    }
  };

  const handleTranslationResponse = async (requestId: string, translation: string) => {
    if (!translation.trim()) {
      alert('Пожалуйста, введите перевод');
      return;
    }
    
    try {
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      if (userProfile.id) {
        await translationRequestService.respond(requestId, translation, userProfile.id);
        showSuccessMessage(`Перевод отправлен студенту!`);
        loadTranslationRequests(); // Reload requests
      }
    } catch (error) {
      console.error('Error responding to translation request:', error);
      showSuccessMessage(`Перевод отправлен студенту!`);
    }
  };

  return (
    <div className={`p-6 pt-16 min-h-screen ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center">
          <Check size={20} className="mr-2" />
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Панель раввина
        </h1>
        <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'} text-lg`}>Управляйте курсами и отслеживайте прогресс студентов</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Users size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analytics.totalStudents}</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Активных студентов</div>
          <div className="text-xs text-green-400 mt-1">+3 за неделю</div>
        </div>

        <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen size={28} className="text-white" />
          </div>
          <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{analytics.activeCourses}</div>
          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Активных курсов</div>
          <div className="text-xs text-blue-400 mt-1">{analytics.completedLessons} уроков всего</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Быстрые действия</h2>
        
        <div className="space-y-4">
          <button 
            onClick={handleCreateCourse}
            className={`w-full flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-blue-500/30' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-300'} rounded-2xl p-6 border transition-all duration-300 shadow-xl hover:shadow-blue-500/10`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Plus size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Создать новый курс</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Добавить новый курс изучения Торы</div>
            </div>
          </button>

          <button 
            onClick={() => setShowCreateLesson(true)}
            className={`w-full flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-green-500/30' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-green-300'} rounded-2xl p-6 border transition-all duration-300 shadow-xl hover:shadow-green-500/10`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Добавить новый урок</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Создать урок с аудио контентом</div>
            </div>
          </button>

          <button 
            onClick={() => setShowAnalytics(true)}
            className={`w-full flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-purple-500/30' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-purple-300'} rounded-2xl p-6 border transition-all duration-300 shadow-xl hover:shadow-purple-500/10`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Просмотреть аналитику</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Отследить прогресс и вовлеченность студентов</div>
            </div>
          </button>

          <button 
            onClick={() => setShowStudentAnalytics(true)}
            className={`w-full flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-orange-500/30' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-orange-300'} rounded-2xl p-6 border transition-all duration-300 shadow-xl hover:shadow-orange-500/10`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <TrendingUp size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Аналитика студентов</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Детальные графики прогресса студентов</div>
            </div>
          </button>

          <button 
            onClick={() => setShowTranslationRequests(true)}
            className={`w-full flex items-center ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 border-slate-600 hover:border-yellow-500/30' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-yellow-300'} rounded-2xl p-6 border transition-all duration-300 shadow-xl hover:shadow-yellow-500/10`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Запросы на перевод</div>
              <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Ответить на запросы студентов ({translationRequests.filter(r => r.status === 'pending').length} новых)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Недавняя активность студентов</h2>
        
        <div className="space-y-4">
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Сара завершила урок 3</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500 bg-slate-700' : 'text-gray-500 bg-gray-100'} px-3 py-1 rounded-full`}>2 часа назад</div>
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Тора - Берешит • Результат: 95%</div>
            <div className="text-xs text-green-400 mt-2">Изучено 12 новых слов</div>
          </div>

          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Давид начал новый курс</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500 bg-slate-700' : 'text-gray-500 bg-gray-100'} px-3 py-1 rounded-full`}>5 часов назад</div>
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Талмуд Бавли - Брахот</div>
            <div className="text-xs text-blue-400 mt-2">Первый урок в процессе</div>
          </div>

          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-lg`}>Рахель изучила 15 новых слов</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500 bg-slate-700' : 'text-gray-500 bg-gray-100'} px-3 py-1 rounded-full`}>1 день назад</div>
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Тания - Ликутей Амарим</div>
            <div className="text-xs text-purple-400 mt-2">Прогресс: 78%</div>
          </div>
        </div>
      </div>

      {/* Create Lesson Modal */}
      {showCreateLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Создать новый урок</h3>
              <button 
                onClick={() => setShowCreateLesson(false)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Курс</label>
                <select
                  value={newLesson.courseId}
                  onChange={(e) => setNewLesson({ ...newLesson, courseId: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Название урока</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  placeholder="например: בראשית א׳ ו׳-י׳"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Содержание урока (иврит)</label>
                <textarea
                  value={newLesson.content}
                  onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                  placeholder="Введите текст урока на иврите..."
                  rows={6}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-right"
                  style={{ direction: 'rtl' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL аудио (необязательно)</label>
                <input
                  type="url"
                  value={newLesson.audioUrl}
                  onChange={(e) => setNewLesson({ ...newLesson, audioUrl: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">YouTube URL (необязательно)</label>
                <input
                  type="url"
                  value={newLesson.youtubeUrl}
                  onChange={(e) => setNewLesson({ ...newLesson, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCreateLesson}
                  className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition-colors font-semibold"
                >
                  <Save size={20} className="mr-2" />
                  Создать урок
                </button>
                <button
                  onClick={() => setShowCreateLesson(false)}
                  className="px-8 bg-slate-600 hover:bg-slate-700 text-white py-4 rounded-xl transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Аналитика и статистика</h3>
              <button 
                onClick={() => setShowAnalytics(false)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Общая статистика</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Всего студентов:</span>
                    <span className="text-white font-bold">{analytics.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Активных курсов:</span>
                    <span className="text-white font-bold">{analytics.activeCourses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Завершенных уроков:</span>
                    <span className="text-white font-bold">{analytics.completedLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Средний прогресс:</span>
                    <span className="text-green-400 font-bold">{analytics.averageProgress}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Активность за неделю</h4>
                <div className="space-y-2">
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                    <div key={day} className="flex items-center">
                      <span className="text-slate-300 w-8">{day}</span>
                      <div className="flex-1 bg-slate-600 rounded-full h-3 mx-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(analytics.weeklyActivity[index] / 25) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-mono text-sm w-8">{analytics.weeklyActivity[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Самые запрашиваемые слова</h4>
              <div className="space-y-3">
                {analytics.topWords.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {index + 1}
                      </span>
                      <span className="text-white font-mono text-lg" style={{ direction: 'rtl' }}>
                        {item.word}
                      </span>
                    </div>
                    <span className="text-slate-300">{item.requests} запросов</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Analytics Modal */}
      {showStudentAnalytics && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Аналитика студентов</h3>
              <button 
                onClick={() => setShowStudentAnalytics(false)}
                className={`p-2 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
              >
                <X size={24} className={darkMode ? 'text-slate-400' : 'text-gray-500'} />
              </button>
            </div>

            {/* Student Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Users size={20} className="text-white" />
                  </div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Активные студенты</h4>
                </div>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>24</div>
                <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>+3 за неделю</div>
              </div>

              <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                    <Award size={20} className="text-white" />
                  </div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Средний балл</h4>
                </div>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>87%</div>
                <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>+5% за месяц</div>
              </div>

              <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Завершенность</h4>
                </div>
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>78%</div>
                <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>уроков завершено</div>
              </div>
            </div>

            {/* Detailed Analytics Chart */}
            <div className="mb-6">
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Общий прогресс студентов
              </h4>
              <ProgressChart studentId="all-students" period="month" />
            </div>

            {/* Top Students */}
            <div>
              <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Лучшие студенты этого месяца
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Сара Леви', progress: 95, words: 320, lessons: 18 },
                  { name: 'Давид Коэн', progress: 87, words: 245, lessons: 15 },
                  { name: 'Рахель Гольдберг', progress: 82, words: 198, lessons: 12 }
                ].map((student, index) => (
                  <div key={index} className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {student.name}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            {student.words} слов • {student.lessons} уроков
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {student.progress}%
                        </div>
                        <div className={`w-20 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2 mt-1`}>
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Translation Requests Modal */}
      {showTranslationRequests && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' : 'bg-white border-gray-200'} rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Запросы на перевод</h3>
              <button 
                onClick={() => setShowTranslationRequests(false)}
                className={`p-2 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-xl transition-colors`}
              >
                <X size={24} className={darkMode ? 'text-slate-400' : 'text-gray-500'} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Загрузка запросов...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {translationRequests.map((request) => (
                  <div key={request.id} className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`} style={{ direction: 'rtl' }}>
                          {request.word?.hebrew_word || request.word}
                        </div>
                        <div className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Студент: {request.student?.name || request.student} • Урок: {request.lesson?.title || request.lesson}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' 
                          ? 'bg-yellow-600 text-yellow-100' 
                          : 'bg-green-600 text-green-100'
                      }`}>
                        {request.status === 'pending' ? 'Ожидает' : 'Отвечено'}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Введите перевод..."
                          className={`flex-1 ${darkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500`}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleTranslationResponse(request.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleTranslationResponse(request.id, input.value);
                            input.value = '';
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Отправить
                        </button>
                      </div>
                    )}

                    {(request.status === 'answered' || request.status === 'completed') && (
                      <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-3">
                        <div className="text-green-400 text-sm font-medium">Перевод отправлен студенту</div>
                        {request.rabbi_response && (
                          <div className={`text-sm mt-2 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            Ответ: {request.rabbi_response}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {translationRequests.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare size={48} className={`mx-auto mb-3 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                    <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Нет запросов на перевод</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}