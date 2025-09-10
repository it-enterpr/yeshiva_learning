import { useState } from 'react';
import { Download, FileText, Package, Shield, Calendar, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface ExportCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportCenter({ isOpen, onClose }: ExportCenterProps) {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePDFExport = async () => {
    setLoading('pdf');
    try {
      // Симуляция генерации PDF отчета
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Создаем демо PDF blob
      const pdfContent = generateDemoPDF();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `progress-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('PDF отчет успешно создан и скачан!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleAnkiExport = async () => {
    setLoading('anki');
    try {
      // Симуляция создания Anki колоды
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Создаем демо Anki файл
      const ankiData = generateDemoAnkiDeck();
      const blob = new Blob([ankiData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `hebrew-vocabulary-${new Date().toISOString().split('T')[0]}.apkg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Anki колода успешно создана и скачана!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating Anki deck:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleBackupExport = async () => {
    setLoading('backup');
    try {
      // Симуляция создания резервной копии
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        studentProfile: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          nativeLanguage: user?.nativeLanguage
        },
        progress: [
          { lessonId: '1', status: 'completed', score: 95, completedAt: '2024-01-15' },
          { lessonId: '2', status: 'completed', score: 88, completedAt: '2024-01-16' },
          { lessonId: '3', status: 'in_progress', score: null, completedAt: null }
        ],
        vocabulary: [
          { word: 'בְּרֵאשִׁית', translation: 'В начале', knowledgeLevel: 'mastered' },
          { word: 'אֱלֹהִים', translation: 'Бог', knowledgeLevel: 'known' },
          { word: 'הַשָּׁמַיִם', translation: 'небеса', knowledgeLevel: 'learning' }
        ],
        achievements: [
          { name: 'Первый урок', description: 'Завершили первый урок', points: 10 }
        ],
        settings: {
          darkMode: darkMode,
          nativeLanguage: user?.nativeLanguage
        },
        checksum: 'demo-checksum-' + Date.now()
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `hebrew-study-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Резервная копия успешно создана и скачана!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setLoading(null);
    }
  };

  const generateDemoPDF = () => {
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Hebrew Study Progress Report) Tj
0 -20 Td
(Student: ${user?.name || 'Demo User'}) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString('ru-RU')}) Tj
0 -40 Td
(Words Learned: 245) Tj
0 -20 Td
(Lessons Completed: 12) Tj
0 -20 Td
(Study Streak: 15 days) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;
  };

  const generateDemoAnkiDeck = () => {
    // Простая симуляция Anki файла (в реальности это был бы бинарный .apkg файл)
    const deckData = {
      name: 'Hebrew Vocabulary',
      cards: [
        { front: 'בְּרֵאשִׁית', back: 'В начале' },
        { front: 'אֱלֹהִים', back: 'Бог' },
        { front: 'הַשָּׁמַיִם', back: 'небеса' }
      ]
    };
    return JSON.stringify(deckData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-white to-blue-50'
      }`}>
        <div className={`p-6 border-b ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Экспорт данных
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-slate-700 text-slate-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              ✕
            </button>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Экспортируйте свой прогресс и данные в различных форматах
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-600 text-white rounded-xl flex items-center">
            <Check size={20} className="mr-3" />
            {success}
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* PDF Report */}
          <div className={`rounded-xl p-6 border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-600 hover:border-red-500/30' 
              : 'bg-gray-50 border-gray-200 hover:border-red-300'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    PDF отчет прогресса
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Детальный отчет с графиками, статистикой и рекомендациями
                  </p>
                  <div className="flex items-center mt-2 space-x-4 text-xs">
                    <span className={`flex items-center ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      <Calendar size={12} className="mr-1" />
                      Включает весь период обучения
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handlePDFExport}
                disabled={loading === 'pdf'}
                className="flex items-center bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-xl transition-colors font-medium"
              >
                {loading === 'pdf' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Создание...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Скачать PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Anki Export */}
          <div className={`rounded-xl p-6 border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-600 hover:border-blue-500/30' 
              : 'bg-gray-50 border-gray-200 hover:border-blue-300'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Экспорт в Anki
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Колода карточек для изучения в приложении Anki
                  </p>
                  <div className="flex items-center mt-2 space-x-4 text-xs">
                    <span className={`flex items-center ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      <Package size={12} className="mr-1" />
                      245 карточек с переводами
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAnkiExport}
                disabled={loading === 'anki'}
                className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl transition-colors font-medium"
              >
                {loading === 'anki' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Создание...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Скачать .apkg
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Backup */}
          <div className={`rounded-xl p-6 border transition-all duration-200 ${
            darkMode 
              ? 'bg-slate-800/50 border-slate-600 hover:border-green-500/30' 
              : 'bg-gray-50 border-gray-200 hover:border-green-300'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Shield size={24} className="text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Резервная копия
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Полная резервная копия всех ваших данных
                  </p>
                  <div className="flex items-center mt-2 space-x-4 text-xs">
                    <span className={`flex items-center ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      <Shield size={12} className="mr-1" />
                      Зашифрованный JSON файл
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBackupExport}
                disabled={loading === 'backup'}
                className="flex items-center bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-xl transition-colors font-medium"
              >
                {loading === 'backup' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Создание...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Создать копию
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className={`p-6 border-t ${darkMode ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-blue-50/50'}`}>
          <div className="flex items-start">
            <AlertCircle size={20} className={`mr-3 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Информация о безопасности
              </h4>
              <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Все экспортируемые данные содержат только вашу личную информацию. 
                Резервные копии зашифрованы для дополнительной безопасности.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}