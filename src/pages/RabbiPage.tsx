import { useState } from 'react';
import { Users, BookOpen, Plus, BarChart3, MessageSquare, X, Save, Check } from 'lucide-react';

interface NewLesson {
  title: string;
  content: string;
  courseId: string;
  audioUrl: string;
  youtubeUrl: string;
}

export default function RabbiPage() {
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTranslationRequests, setShowTranslationRequests] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
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

  const translationRequests = [
    { id: 1, word: 'מְרַחֶפֶת', student: 'Моше', lesson: 'Берешит 1:1-5', status: 'pending' },
    { id: 2, word: 'תֹהוּ', student: 'Сара', lesson: 'Берешит 1:1-5', status: 'pending' },
    { id: 3, word: 'בָּרָא', student: 'Давид', lesson: 'Берешит 1:1-5', status: 'completed' }
  ];

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

  const handleCreateLesson = () => {
    if (!newLesson.title || !newLesson.content) {
      alert('Пожалуйста, заполните название и содержание урока');
      return;
    }

    // Save lesson to localStorage for demo
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
  };

  const handleTranslationResponse = (requestId: number, translation: string) => {
    if (!translation.trim()) {
      alert('Пожалуйста, введите перевод');
      return;
    }
    
    showSuccessMessage(`Перевод отправлен студенту!`);
  };

  return (
    <div className="p-6 pt-16">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center">
          <Check size={20} className="mr-2" />
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Панель раввина
        </h1>
        <p className="text-slate-400 text-lg">Управляйте курсами и отслеживайте прогресс студентов</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Users size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{analytics.totalStudents}</div>
          <div className="text-sm text-slate-400">Активных студентов</div>
          <div className="text-xs text-green-400 mt-1">+3 за неделю</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{analytics.activeCourses}</div>
          <div className="text-sm text-slate-400">Активных курсов</div>
          <div className="text-xs text-blue-400 mt-1">{analytics.completedLessons} уроков всего</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Быстрые действия</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => alert('Создание нового курса:\n• Название курса\n• Описание\n• Уровень сложности\n• Категория (Тора, Талмуд, Мишна)')}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Plus size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Создать новый курс</div>
              <div className="text-slate-400">Добавить новый курс изучения Торы</div>
            </div>
          </button>

          <button 
            onClick={() => setShowCreateLesson(true)}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-green-500/10 hover:border-green-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Добавить новый урок</div>
              <div className="text-slate-400">Создать урок с аудио контентом</div>
            </div>
          </button>

          <button 
            onClick={() => setShowAnalytics(true)}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Просмотреть аналитику</div>
              <div className="text-slate-400">Отследить прогресс и вовлеченность студентов</div>
            </div>
          </button>

          <button 
            onClick={() => setShowTranslationRequests(true)}
            className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Запросы на перевод</div>
              <div className="text-slate-400">Ответить на запросы студентов ({translationRequests.filter(r => r.status === 'pending').length} новых)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Недавняя активность студентов</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Сара завершила урок 3</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">2 часа назад</div>
            </div>
            <div className="text-slate-400">Тора - Берешит • Результат: 95%</div>
            <div className="text-xs text-green-400 mt-2">Изучено 12 новых слов</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Давид начал новый курс</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">5 часов назад</div>
            </div>
            <div className="text-slate-400">Талмуд Бавли - Брахот</div>
            <div className="text-xs text-blue-400 mt-2">Первый урок в процессе</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Рахель изучила 15 новых слов</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">1 день назад</div>
            </div>
            <div className="text-slate-400">Тания - Ликутей Амарим</div>
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

      {/* Translation Requests Modal */}
      {showTranslationRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Запросы на перевод</h3>
              <button 
                onClick={() => setShowTranslationRequests(false)}
                className="p-2 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              {translationRequests.map((request) => (
                <div key={request.id} className="bg-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold text-white mb-1" style={{ direction: 'rtl' }}>
                        {request.word}
                      </div>
                      <div className="text-slate-400">
                        Студент: {request.student} • Урок: {request.lesson}
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
                        className="flex-1 bg-slate-600 border border-slate-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
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

                  {request.status === 'completed' && (
                    <div className="bg-green-600/20 border border-green-600/30 rounded-xl p-3">
                      <div className="text-green-400 text-sm font-medium">Перевод отправлен студенту</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}