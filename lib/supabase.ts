import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validation with helpful error messages
if (!supabaseUrl) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
  throw new Error('Supabase URL is required. Please check your .env file.');
}

if (!supabaseAnonKey) {
  console.error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
  throw new Error('Supabase Anonymous Key is required. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types for TypeScript
export type { Database } from './database.types';

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