import { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

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
}

export default function WordCard({ word, translation, gematria, onKnown, onUnknown }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGematria, setShowGematria] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const toggleGematria = () => {
    setShowGematria(!showGematria);
  };

  return (
    <div className="p-4">
      <div
        onClick={handleFlip}
        className="bg-slate-800 rounded-2xl p-8 min-h-[300px] flex flex-col justify-center items-center border-2 border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors shadow-lg"
      >
        <div className="w-full text-center">
          {!isFlipped ? (
            // Hebrew word side
            <div>
              <div className="text-4xl font-bold text-white mb-4" style={{ direction: 'rtl' }}>
                {word}
              </div>
              <div className="text-sm text-slate-400 italic">Tap to reveal translation</div>
            </div>
          ) : (
            // Translation side
            <div className="w-full">
              <div className="text-2xl font-semibold text-white mb-3" style={{ direction: 'rtl' }}>
                {word}
              </div>
              <div className="text-xl text-slate-200 mb-5 leading-relaxed">
                {translation}
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleGematria();
                }}
                className="flex items-center justify-center bg-slate-900 border border-blue-500 text-blue-500 px-3 py-2 rounded-lg text-sm font-semibold mb-4 mx-auto hover:bg-blue-500/10 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                {showGematria ? 'Hide' : 'Show'} Gematria
              </button>

              {showGematria && (
                <div className="bg-slate-900 rounded-xl p-4 w-full">
                  <div className="text-sm font-semibold text-slate-400 mb-2">Gematria Values:</div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <div>Simple: {gematria.simple}</div>
                    <div>Standard: {gematria.standard}</div>
                    <div>Ordinal: {gematria.ordinal}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isFlipped && (
        <div className="flex gap-4 mt-5">
          <button 
            onClick={onUnknown}
            className="flex-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition-colors"
          >
            <XCircle size={20} className="mr-2" />
            Don't Know
          </button>

          <button 
            onClick={onKnown}
            className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition-colors"
          >
            <CheckCircle size={20} className="mr-2" />
            I Know This
          </button>
        </div>
      )}
    </div>
  );
}