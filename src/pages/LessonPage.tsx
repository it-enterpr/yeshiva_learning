import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { Lesson } from '../types/global';
import WordCard from '../components/WordCard';
import { extractUniqueWords, calculateGematria } from '../utils/hebrew';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = () => {
    // Demo lesson data
    const demoLesson: Lesson = {
      id: id!,
      course_id: '1',
      title: 'בראשית א׳ א׳-ה׳',
      content: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
      audio_url: 'https://example.com/audio1.mp3',
      youtube_url: 'https://youtube.com/watch?v=example1',
      order_number: 1,
      created_at: new Date().toISOString()
    };

    setLesson(demoLesson);
    const uniqueWords = extractUniqueWords(demoLesson.content);
    setWords(uniqueWords);
    setLoading(false);
  };

  const handleWordKnown = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Lesson completed
      navigate(-1);
    }
  };

  const handleWordUnknown = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Lesson completed
      navigate(-1);
    }
  };

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Loading lesson...</div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const gematria = currentWord ? calculateGematria(currentWord) : { simple: 0, standard: 0, ordinal: 0 };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="p-6 pt-16">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <h1 className="text-xl font-bold text-white text-right">{lesson.title}</h1>
        </div>

        <div className="mb-6">
          <div className="bg-slate-800 rounded-lg p-4 mb-4">
            <p className="text-slate-300 text-lg leading-relaxed text-right" style={{ direction: 'rtl' }}>
              {lesson.content}
            </p>
          </div>

          {lesson.audio_url && (
            <div className="flex items-center justify-center mb-6">
              <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                <Play size={20} className="mr-2" />
                Play Audio
              </button>
            </div>
          )}
        </div>

        {words.length > 0 && (
          <div className="mb-6">
            <div className="text-center mb-4">
              <span className="text-slate-400">
                Word {currentWordIndex + 1} of {words.length}
              </span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
              ></div>
            </div>

            <WordCard
              word={currentWord}
              translation="In the beginning" // Demo translation
              gematria={gematria}
              onKnown={handleWordKnown}
              onUnknown={handleWordUnknown}
            />
          </div>
        )}
      </div>
    </div>
  );
}