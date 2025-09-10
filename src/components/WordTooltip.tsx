import { useState } from 'react';
import { Volume2, BookOpen, Calculator } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { calculateGematria } from '../utils/hebrew';

interface WordTooltipProps {
  word: string;
  translation: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function WordTooltip({ word, translation, isVisible, position, onClose }: WordTooltipProps) {
  const { darkMode } = useTheme();
  const [showGematria, setShowGematria] = useState(false);
  
  if (!isVisible) return null;

  const gematria = calculateGematria(word);

  const playAudio = () => {
    // Демо функция для воспроизведения аудио
    console.log(`Playing audio for word: ${word}`);
  };

  return (
    <div 
      className={`fixed z-50 max-w-xs p-4 rounded-xl shadow-2xl border transition-all duration-200 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}
      style={{
        left: Math.min(position.x, window.innerWidth - 300),
        top: Math.max(position.y - 100, 10)
      }}
    >
      {/* Hebrew Word */}
      <div className={`text-2xl font-bold mb-2 text-center hebrew-text ${
        darkMode ? 'text-blue-400' : 'text-blue-600'
      }`} style={{ direction: 'rtl' }}>
        {word}
      </div>

      {/* Translation */}
      <div className={`text-lg font-medium mb-3 text-center ${
        darkMode ? 'text-slate-200' : 'text-gray-800'
      }`}>
        {translation}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-2 mb-3">
        <button
          onClick={playAudio}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title="Прослушать произношение"
        >
          <Volume2 size={16} />
        </button>
        
        <button
          onClick={() => setShowGematria(!showGematria)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title="Показать гематрию"
        >
          <Calculator size={16} />
        </button>
      </div>

      {/* Gematria Values */}
      {showGematria && (
        <div className={`border-t pt-3 mt-3 ${
          darkMode ? 'border-slate-600' : 'border-gray-200'
        }`}>
          <div className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Гематрия:
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Простая:</span>
              <span className={`font-mono font-bold ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>{gematria.simple}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Стандартная:</span>
              <span className={`font-mono font-bold ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>{gematria.standard}</span>
            </div>
            <div className="flex justify-between">
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Порядковая:</span>
              <span className={`font-mono font-bold ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>{gematria.ordinal}</span>
            </div>
          </div>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          darkMode 
            ? 'bg-slate-600 hover:bg-slate-500 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        ×
      </button>
    </div>
  );
}