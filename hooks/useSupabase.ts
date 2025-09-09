import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useSupabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setError('Supabase not configured - using demo mode');
          setIsReady(true);
          return;
        }

        // Test the connection
        const { error: testError } = await supabase.from('courses').select('count').limit(1);
        
        if (testError) {
          console.warn('Supabase connection test failed:', testError);
          setError('Supabase connection failed - using demo mode');
        } else {
          setError(null);
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Supabase initialization error:', err);
        setError('Supabase initialization failed - using demo mode');
        setIsReady(true);
      }
    };

    checkSupabase();
  }, []);

  return {
    supabase: isSupabaseConfigured() ? supabase : null,
    isReady,
    error,
    isConfigured: isSupabaseConfigured(),
  };
}