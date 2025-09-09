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
      loadLessonData();
    }
  }, [id]);

  const loadLessonData = () => {
    // Загружаем урок из localStorage или используем демо данные
    const savedLessons = JSON.parse(localStorage.getItem('lessons') || '[]');
    let foundLesson = savedLessons.find((lesson: Lesson) => lesson.id === id);
    
    if (!foundLesson) {
      // Демо урок если не найден сохраненный
      foundLesson = {
        id: id!,
        course_id: '1',
        title: 'בראשית א׳ א׳-ה׳',
        content: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
        audio_url: 'https://example.com/audio1.mp3',
        youtube_url: 'https://youtube.com/watch?v=example1',
        order_number: 1,
        created_at: new Date().toISOString()
      };
    }

    setLesson(foundLesson);
    const uniqueWords = extractUniqueWords(foundLesson.content);
    setWords(uniqueWords);
    setLoading(false);
  };

  const handleWordKnown = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Lesson completed
      alert('Урок завершен! Отличная работа!');
      navigate(-1);
    }
  };

  const handleWordUnknown = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Lesson completed
      alert('Урок завершен! Продолжайте изучать!');
      navigate(-1);
    }
  };

  const handleRequestTranslation = () => {
    alert(`Запрос на перевод слова "${words[currentWordIndex]}" отправлен раввину!`);
  };

  if (loading || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Загрузка урока...</div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const gematria = currentWord ? calculateGematria(currentWord) : { simple: 0, standard: 0, ordinal: 0 };

  // Demo translations for different words
  const translations: { [key: string]: string } = {
    'בְּרֵאשִׁית': 'В начале',
    'בָּרָא': 'сотворил',
    'אֱלֹהִים': 'Бог',
    'אֵת': 'את (определенный артикль)',
    'הַשָּׁמַיִם': 'небеса',
    'וְאֵת': 'и את',
    'הָאָרֶץ': 'земля',
    'וְהָאָרֶץ': 'и земля',
    'הָיְתָה': 'была',
    'תֹהוּ': 'пустота',
    'וָבֹהוּ': 'и хаос',
    'וְחֹשֶׁךְ': 'и тьма',
    'עַל־פְּנֵי': 'на поверхности',
    'תְהוֹם': 'бездна',
    'וְרוּחַ': 'и дух',
    'מְרַחֶפֶת': 'парил',
    'הַמָּיִם': 'воды'
  };

  const currentTranslation = translations[currentWord] || 'Перевод недоступен';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 pt-16">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <h1 className="text-2xl font-bold text-white text-right">{lesson.title}</h1>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 mb-6 border border-slate-600 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-300 mb-4">Текст урока:</h2>
            <p className="text-slate-200 text-xl leading-relaxed text-right mb-6" style={{ direction: 'rtl' }}>
              {lesson.content}
            </p>

            {lesson.audio_url && (
              <div className="flex items-center justify-center">
                <button className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25">
                  <Play size={24} className="mr-3" />
                  Воспроизвести аудио
                </button>
              </div>
            )}
          </div>
        </div>

        {words.length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <span className="text-slate-300 text-lg font-medium bg-slate-800 px-4 py-2 rounded-full">
                Слово {currentWordIndex + 1} из {words.length}
              </span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3 mb-8 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
              ></div>
            </div>

            <WordCard
              word={currentWord}
              translation={currentTranslation}
              gematria={gematria}
              onKnown={handleWordKnown}
              onUnknown={handleWordUnknown}
              onRequestTranslation={handleRequestTranslation}
            />
          </div>
        )}
      </div>
    </div>
  );
}