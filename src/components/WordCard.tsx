import { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, Send } from 'lucide-react';

interface WordCardProps {
  word: string;
  translation: string;
  gematria: {
    simple: number;
    standard: number;
    ordinal: number;
  };
  onKnown: () => void;
  onUnknown: () => void;
  onRequestTranslation?: () => void;
}

export default function WordCard({ word, translation, gematria, onKnown, onUnknown, onRequestTranslation }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGematria, setShowGematria] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleGematria = () => {
    setShowGematria(!showGematria);
  };

  const handleRequestTranslation = () => {
    if (onRequestTranslation) {
      onRequestTranslation();
    }
  };

  return (
    <div className="p-6">
      <div
        onClick={handleFlip}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 min-h-[350px] flex flex-col justify-center items-center border border-slate-600 cursor-pointer hover:from-slate-750 hover:to-slate-850 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
      >
        <div className="w-full text-center">
          {!isFlipped ? (
            // Hebrew word side
            <div>
              <div className="text-5xl font-bold text-white mb-6 tracking-wide" style={{ direction: 'rtl' }}>
                {word}
              </div>
              <div className="text-sm text-slate-400 italic bg-slate-800/50 px-4 py-2 rounded-full">
                Нажмите, чтобы увидеть перевод
              </div>
            </div>
          ) : (
            // Translation side
            <div className="w-full">
              <div className="text-3xl font-semibold text-white mb-4" style={{ direction: 'rtl' }}>
                {word}
              </div>
              <div className="text-xl text-slate-200 mb-6 leading-relaxed bg-slate-800/30 p-4 rounded-xl">
                {translation}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGematria();
                }}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl text-sm font-semibold mb-6 mx-auto transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <RotateCcw size={16} className="mr-2" />
                {showGematria ? 'Скрыть' : 'Показать'} Гематрию
              </button>

              {showGematria && (
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 w-full border border-slate-600">
                  <div className="text-sm font-semibold text-slate-300 mb-3">Значения Гематрии:</div>
                  <div className="text-sm text-slate-400 space-y-2">
                    <div className="flex justify-between">
                      <span>Простая:</span>
                      <span className="font-mono text-blue-400">{gematria.simple}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Стандартная:</span>
                      <span className="font-mono text-green-400">{gematria.standard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Порядковая:</span>
                      <span className="font-mono text-yellow-400">{gematria.ordinal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Translation request button - always visible */}
      <div className="mt-6">
        <button 
          onClick={handleRequestTranslation}
          className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
        >
          <Send size={20} className="mr-2" />
          Отправить на перевод
        </button>
      </div>

      {isFlipped && (
        <div className="flex gap-4 mt-4">
          <button 
            onClick={onUnknown}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/25"
          >
            <XCircle size={20} className="mr-2" />
            Не знаю
          </button>

          <button 
            onClick={onKnown}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <CheckCircle size={20} className="mr-2" />
            Знаю это
          </button>
        </div>
      )}
    </div>
  );
}