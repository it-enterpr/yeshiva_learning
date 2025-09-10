import { supabase } from './supabase';
import { Course, Lesson, Word, Translation, StudentProgress, StudentWord } from '../types/global';

// Course operations
export const courseService = {
  async getAll(): Promise<Course[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        rabbi_profile:user_profiles(name, user_type)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Course | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        rabbi_profile:user_profiles(name, user_type)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Course>): Promise<Course> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Lesson operations
export const lessonService = {
  async getByCourseId(courseId: string): Promise<Lesson[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Lesson | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(lesson: Omit<Lesson, 'id' | 'created_at'>): Promise<Lesson> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Word operations
export const wordService = {
  async getOrCreate(hebrewWord: string, gematria: any): Promise<Word> {
    if (!supabase) throw new Error('Supabase not configured');
    
    // First try to get existing word
    const { data: existing } = await supabase
      .from('words')
      .select('*')
      .eq('hebrew_word', hebrewWord)
      .single();

    if (existing) return existing;

    // Create new word if doesn't exist
    const { data, error } = await supabase
      .from('words')
      .insert({
        hebrew_word: hebrewWord,
        gematria_simple: gematria.simple,
        gematria_standard: gematria.standard,
        gematria_ordinal: gematria.ordinal
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTranslation(wordId: string, language: string = 'ru'): Promise<Translation | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('word_id', wordId)
      .eq('language', language)
      .eq('is_verified', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};

// Student progress operations
export const progressService = {
  async getStudentProgress(studentProfileId: string): Promise<StudentProgress[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        *,
        lesson:lessons(title, course_id, courses(title))
      `)
      .eq('student_profile_id', studentProfileId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateProgress(
    studentProfileId: string,
    lessonId: string,
    updates: Partial<StudentProgress>
  ): Promise<StudentProgress> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('student_progress')
      .upsert({
        student_profile_id: studentProfileId,
        lesson_id: lessonId,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getStudentStats(studentProfileId: string) {
    if (!supabase) return null;
    
    const [progressData, wordsData, achievementsData] = await Promise.all([
      supabase
        .from('student_progress')
        .select('status, score, time_spent_minutes')
        .eq('student_profile_id', studentProfileId),
      
      supabase
        .from('student_words')
        .select('knowledge_level')
        .eq('student_profile_id', studentProfileId),
      
      supabase
        .from('achievements')
        .select('points')
        .eq('student_profile_id', studentProfileId)
    ]);

    const completedLessons = progressData.data?.filter(p => p.status === 'completed').length || 0;
    const totalTime = progressData.data?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
    const averageScore = progressData.data?.length 
      ? Math.round(progressData.data.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.data.length)
      : 0;
    
    const knownWords = wordsData.data?.filter(w => w.knowledge_level === 'known' || w.knowledge_level === 'mastered').length || 0;
    const learningWords = wordsData.data?.filter(w => w.knowledge_level === 'learning').length || 0;
    
    const totalPoints = achievementsData.data?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;

    return {
      completedLessons,
      totalTime,
      averageScore,
      knownWords,
      learningWords,
      totalPoints
    };
  }
};

// Student word operations
export const studentWordService = {
  async updateWordKnowledge(
    studentProfileId: string,
    wordId: string,
    knowledgeLevel: 'unknown' | 'learning' | 'known' | 'mastered',
    isCorrect?: boolean
  ): Promise<StudentWord> {
    if (!supabase) throw new Error('Supabase not configured');
    
    const updates: any = {
      student_profile_id: studentProfileId,
      word_id: wordId,
      knowledge_level: knowledgeLevel,
      last_reviewed_at: new Date().toISOString(),
      review_count: 1
    };

    if (isCorrect !== undefined) {
      updates.correct_count = isCorrect ? 1 : 0;
    }

    // Calculate next review date based on spaced repetition
    const nextReviewDays = knowledgeLevel === 'learning' ? 1 : 
                          knowledgeLevel === 'known' ? 3 : 7;
    updates.next_review_at = new Date(Date.now() + nextReviewDays * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('student_words')
      .upsert(updates, { 
        onConflict: 'student_profile_id,word_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getWordsForReview(studentProfileId: string, limit: number = 20): Promise<any[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('student_words')
      .select(`
        *,
        word:words(hebrew_word, gematria_simple, gematria_standard, gematria_ordinal),
        translations:words(translations(translation, language))
      `)
      .eq('student_profile_id', studentProfileId)
      .lte('next_review_at', new Date().toISOString())
      .order('next_review_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};

// Translation request operations
export const translationRequestService = {
  async create(studentProfileId: string, wordId: string, lessonId?: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('translation_requests')
      .insert({
        student_profile_id: studentProfileId,
        word_id: wordId,
        lesson_id: lessonId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPendingRequests(): Promise<any[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('translation_requests')
      .select(`
        *,
        student:user_profiles!student_profile_id(name),
        word:words(hebrew_word),
        lesson:lessons(title)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async respond(requestId: string, response: string, rabbiProfileId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('translation_requests')
      .update({
        status: 'answered',
        rabbi_response: response,
        rabbi_profile_id: rabbiProfileId,
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Notification operations
export const notificationService = {
  async getUserNotifications(userProfileId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_profile_id', userProfileId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  async markAsRead(notificationId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async create(userProfileId: string, title: string, message: string, type: string = 'info') {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_profile_id: userProfileId,
        title,
        message,
        type
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Achievement operations
export const achievementService = {
  async getUserAchievements(studentProfileId: string) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('student_profile_id', studentProfileId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};