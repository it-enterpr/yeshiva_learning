import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Play, FileText, ArrowRight } from 'lucide-react';
import { Lesson } from '../types/global';

export default function CourseLessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDemoLessons();
    }
  }, [id]);

  const loadDemoLessons = () => {
    const demoLessons: Lesson[] = [
      {
        id: '1',
        course_id: id!,
        title: 'בראשית א׳ א׳-ה׳',
        content: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
        audio_url: 'https://example.com/audio1.mp3',
        youtube_url: 'https://youtube.com/watch?v=example1',
        order_number: 1,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        course_id: id!,
        title: 'בראשית א׳ ו׳-י׳',
        content: 'וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃',
        audio_url: 'https://example.com/audio2.mp3',
        youtube_url: 'https://youtube.com/watch?v=example2',
        order_number: 2,
        created_at: new Date().toISOString()
      }
    ];

    setLessons(demoLessons);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Loading lessons...</div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-16">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <h1 className="text-3xl font-bold text-white">Course Lessons</h1>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.id}
            to={`/lesson/${lesson.id}`}
            className="block bg-slate-800 rounded-xl p-6 border border-slate-700 hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 text-right">
                  {lesson.title}
                </h3>
                <div className="flex items-center justify-end mb-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-400">Not Started</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-end">
                <FileText size={16} className="text-slate-500 mr-2" />
                <span className="text-sm text-slate-400">0 unknown words</span>
              </div>
              
              {lesson.audio_url && (
                <div className="flex items-center justify-end">
                  <Play size={16} className="text-slate-500 mr-2" />
                  <span className="text-sm text-slate-400">Audio available</span>
                </div>
              )}
              
              {lesson.youtube_url && (
                <div className="flex items-center justify-end">
                  <Play size={16} className="text-slate-500 mr-2" />
                  <span className="text-sm text-slate-400">Video explanation</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm flex-1 text-right mr-3" style={{ direction: 'rtl' }}>
                {lesson.content.slice(0, 100)}...
              </p>
              <ArrowRight size={20} className="text-blue-500" />
            </div>
          </Link>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={64} className="text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No lessons available</h3>
          <p className="text-slate-400">Rabbi hasn't added any lessons yet</p>
        </div>
      )}
    </div>
  );
}