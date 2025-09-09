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
  rabbi_id: string;
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
  created_at: string;
}

export interface Word {
  id: string;
  hebrew_word: string;
  transliteration: string;
  gematria_values: GematriaValue[];
  created_at: string;
}

export interface Translation {
  id: string;
  word_id: string;
  language: string;
  translation: string;
  course_id?: string;
  lesson_id?: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  completed_at?: string;
  test_score?: number;
  notes: string;
}

export interface StudentWord {
  id: string;
  student_id: string;
  word_id: string;
  knowledge_level: 'unknown' | 'learning' | 'known';
  last_reviewed: string;
  review_count: number;
}

export interface GematriaValue {
  type: 'simple' | 'standard' | 'ordinal';
  value: number;
}

export interface TestQuestion {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: number;
}