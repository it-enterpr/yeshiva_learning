import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export Supabase client (will be null if not configured)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Demo data fallback for development
export const demoData = {
  courses: [
    {
      id: '1',
      title: 'תורה - בראשית',
      description: 'לימוד ספר בראשית עם פירוש רש"י ותרגום לשפת האם',
      rabbi_id: 'rabbi1',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: '2', 
      title: 'תלמוד בבלי - ברכות',
      description: 'מסכת ברכות עם הסברים מפורטים ותרגום המושגים',
      rabbi_id: 'rabbi1',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: '3',
      title: 'תניא - ליקוטי אמרים',
      description: 'ספר התניא עם הסברי חסידות ותרגום למתחילים',
      rabbi_id: 'rabbi1', 
      created_at: new Date().toISOString(),
      is_active: true
    }
  ],
  lessons: {
    '1': [
      {
        id: '1',
        course_id: '1',
        title: 'בראשית א׳ א׳-ה׳',
        content: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
        audio_url: 'https://example.com/audio1.mp3',
        youtube_url: 'https://youtube.com/watch?v=example1',
        order_number: 1,
        created_at: new Date().toISOString()
      }
    ]
  }
};