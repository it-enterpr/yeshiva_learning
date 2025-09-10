export interface User {
  id: string;
  email: string;
  role: 'student' | 'rabbi';
  name: string;
  nativeLanguage: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  rabbi_profile_id: string;
  created_at: string;
  is_active: boolean;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  audio_url?: string;
  youtube_url?: string;
  order_number: number;
  estimated_duration_minutes?: number;
  is_published?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Word {
  id: string;
  hebrew_word: string;
  transliteration: string;
  gematria_simple: number;
  gematria_standard: number;
  gematria_ordinal: number;
  frequency_rank?: number;
  created_at: string;
}

export interface Translation {
  id: string;
  word_id: string;
  language: string;
  translation: string;
  context?: string;
  rabbi_profile_id?: string;
  is_verified?: boolean;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_profile_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  time_spent_minutes: number;
  score?: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentWord {
  id: string;
  student_profile_id: string;
  word_id: string;
  knowledge_level: 'unknown' | 'learning' | 'known' | 'mastered';
  last_reviewed_at: string;
  review_count: number;
  correct_count: number;
  next_review_at: string;
  created_at: string;
}

export interface TranslationRequest {
  id: string;
  student_profile_id: string;
  word_id: string;
  lesson_id?: string;
  status: 'pending' | 'answered' | 'rejected';
  rabbi_response?: string;
  rabbi_profile_id?: string;
  responded_at?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  student_profile_id: string;
  achievement_type: string;
  achievement_name: string;
  description: string;
  icon: string;
  points: number;
  unlocked_at: string;
}

export interface Notification {
  id: string;
  user_profile_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface TestQuestion {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: number;
}