import { Users, BookOpen, Plus, BarChart3, MessageSquare, Settings } from 'lucide-react';

export default function RabbiPage() {
  return (
    <div className="p-6 pt-16">
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
          <div className="text-3xl font-bold text-white mb-2">24</div>
          <div className="text-sm text-slate-400">Активных студентов</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <BookOpen size={28} className="text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">3</div>
          <div className="text-sm text-slate-400">Активных курсов</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Быстрые действия</h2>
        
        <div className="space-y-4">
          <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Plus size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Создать новый курс</div>
              <div className="text-slate-400">Добавить новый курс изучения Торы</div>
            </div>
          </button>

          <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-green-500/10 hover:border-green-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Добавить новый урок</div>
              <div className="text-slate-400">Создать урок с аудио контентом</div>
            </div>
          </button>

          <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Просмотреть аналитику</div>
              <div className="text-slate-400">Отследить прогресс и вовлеченность студентов</div>
            </div>
          </button>

          <button className="w-full flex items-center bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-850 rounded-2xl p-6 border border-slate-600 transition-all duration-300 shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/30">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Запросы на перевод</div>
              <div className="text-slate-400">Ответить на запросы студентов (3 новых)</div>
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
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Давид начал новый курс</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">5 часов назад</div>
            </div>
            <div className="text-slate-400">Талмуд Бавли - Брахот</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Рахель изучила 15 новых слов</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">1 день назад</div>
            </div>
            <div className="text-slate-400">Тания - Ликутей Амарим</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold text-white text-lg">Моше запросил перевод слова</div>
              <div className="text-xs text-slate-500 bg-slate-700 px-3 py-1 rounded-full">2 дня назад</div>
            </div>
            <div className="text-slate-400">Слово: "מְרַחֶפֶת" из урока Берешит</div>
          </div>
        </div>
      </div>
    </div>
  );
}