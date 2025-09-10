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
      id: '11111111-1111-1111-1111-111111111111',
      title: 'תורה - בראשית',
      description: 'לימוד ספר בראשית עם פירוש רש"י ותרגום לשפת האם',
      rabbi_profile_id: '00000000-0000-0000-0000-000000000001',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222', 
      title: 'תלמוד בבלי - ברכות',
      description: 'מסכת ברכות עם הסברים מפורטים ותרגום המושגים',
      rabbi_profile_id: '00000000-0000-0000-0000-000000000001',
      created_at: new Date().toISOString(),
      is_active: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'תניא - ליקוטי אמרים',
      description: 'ספר התניא עם הסברי חסידות ותרגום למתחילים',
      rabbi_profile_id: '00000000-0000-0000-0000-000000000001', 
      created_at: new Date().toISOString(),
      is_active: true
    }
  ],
  lessons: {
    '11111111-1111-1111-1111-111111111111': [
      {
        id: 'a0e1b2c3-d4e5-f6a7-b8c9-d0e1f2a3b4c5',
        course_id: '11111111-1111-1111-1111-111111111111',
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