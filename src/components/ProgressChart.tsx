import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Calendar, TrendingUp, Users, Target } from 'lucide-react';

interface ChartData {
  date: string;
  wordsLearned: number;
  lessonsCompleted: number;
  studyTime: number;
  averageScore: number;
}

interface ProgressChartProps {
  studentId: string;
  period: 'week' | 'month' | 'year';
}

export default function ProgressChart({ studentId, period }: ProgressChartProps) {
  const { darkMode } = useTheme();
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'progress' | 'comparison' | 'distribution'>('progress');

  useEffect(() => {
    loadChartData();
  }, [studentId, period]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      // Генерируем демо данные для графиков
      const demoData = generateDemoData(period);
      setData(demoData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = (period: string): ChartData[] => {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const data: ChartData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        wordsLearned: Math.floor(Math.random() * 15) + 5,
        lessonsCompleted: Math.floor(Math.random() * 3) + 1,
        studyTime: Math.floor(Math.random() * 60) + 15,
        averageScore: Math.floor(Math.random() * 30) + 70
      });
    }
    
    return data;
  };

  const comparisonData = [
    { name: 'Вы', value: 245, color: '#3b82f6' },
    { name: 'Средний студент', value: 180, color: '#6b7280' },
    { name: 'Топ 10%', value: 420, color: '#10b981' }
  ];

  const distributionData = [
    { name: 'Изучено', value: 245, color: '#10b981' },
    { name: 'В процессе', value: 67, color: '#f59e0b' },
    { name: 'Не начато', value: 188, color: '#6b7280' }
  ];

  if (loading) {
    return (
      <div className={`rounded-2xl p-6 border shadow-xl ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className={`h-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded mb-4`}></div>
          <div className={`h-64 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 border shadow-xl ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveChart('progress')}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
            activeChart === 'progress'
              ? 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp size={16} className="mr-2" />
          Прогресс
        </button>
        <button
          onClick={() => setActiveChart('comparison')}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
            activeChart === 'comparison'
              ? 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users size={16} className="mr-2" />
          Сравнение
        </button>
        <button
          onClick={() => setActiveChart('distribution')}
          className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
            activeChart === 'distribution'
              ? 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Target size={16} className="mr-2" />
          Распределение
        </button>
      </div>

      {/* Progress Chart */}
      {activeChart === 'progress' && (
        <div>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Прогресс изучения
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('ru-RU')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="wordsLearned" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Слова изучены"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="lessonsCompleted" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Уроки завершены"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="studyTime" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Время изучения (мин)"
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Comparison Chart */}
      {activeChart === 'comparison' && (
        <div>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Сравнение с другими студентами
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
              <Bar dataKey="value" name="Изученных слов">
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                245
              </div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Ваш результат
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                78%
              </div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Ваш процентиль
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                #12
              </div>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Место в рейтинге
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Chart */}
      {activeChart === 'distribution' && (
        <div>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Распределение словарного запаса
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#ffffff' : '#000000'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}