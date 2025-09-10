/*
  # Complete Hebrew Study App Database Schema

  1. New Tables
    - `courses` - Course management with rabbi assignments
    - `lessons` - Individual lessons within courses
    - `words` - Hebrew words with gematria values
    - `translations` - Word translations in different languages
    - `student_progress` - Track student lesson completion
    - `student_words` - Track individual word knowledge
    - `translation_requests` - Student requests for word translations
    - `audio_files` - Audio file management
    - `achievements` - Student achievements system
    - `notifications` - Real-time notifications

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for students and rabbis
    - Secure data access based on user roles

  3. Functions
    - Automatic progress tracking
    - Achievement calculation
    - Notification triggers
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  rabbi_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  audio_url text,
  youtube_url text,
  order_number integer NOT NULL,
  estimated_duration_minutes integer DEFAULT 15,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create words table
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hebrew_word text NOT NULL UNIQUE,
  transliteration text,
  gematria_simple integer DEFAULT 0,
  gematria_standard integer DEFAULT 0,
  gematria_ordinal integer DEFAULT 0,
  frequency_rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'ru',
  translation text NOT NULL,
  context text,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent_minutes integer DEFAULT 0,
  score integer CHECK (score >= 0 AND score <= 100),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_profile_id, lesson_id)
);

ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Create student_words table
CREATE TABLE IF NOT EXISTS student_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  word_id uuid NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  knowledge_level text DEFAULT 'unknown' CHECK (knowledge_level IN ('unknown', 'learning', 'known', 'mastered')),
  last_reviewed_at timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  next_review_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_profile_id, word_id)
);

ALTER TABLE student_words ENABLE ROW LEVEL SECURITY;

-- Create translation_requests table
CREATE TABLE IF NOT EXISTS translation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  word_id uuid NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'rejected')),
  rabbi_response text,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- Create audio_files table
CREATE TABLE IF NOT EXISTS audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text DEFAULT 'mp3',
  duration_seconds integer,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Rabbis can manage their courses"
  ON courses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.user_type = 'rabbi'
      AND user_profiles.id = courses.rabbi_profile_id
    )
  );

-- RLS Policies for lessons
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Rabbis can manage lessons in their courses"
  ON lessons FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      JOIN user_profiles up ON up.id = c.rabbi_profile_id
      WHERE c.id = lessons.course_id
      AND up.user_id = auth.uid()
      AND up.user_type = 'rabbi'
    )
  );

-- RLS Policies for words
CREATE POLICY "Anyone can view words"
  ON words FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Rabbis can manage words"
  ON words FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

-- RLS Policies for translations
CREATE POLICY "Anyone can view verified translations"
  ON translations FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Rabbis can manage all translations"
  ON translations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

-- RLS Policies for student_progress
CREATE POLICY "Students can view own progress"
  ON student_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Students can update own progress"
  ON student_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Students can modify own progress"
  ON student_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Rabbis can view progress of their students"
  ON student_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN courses c ON c.rabbi_profile_id = up.id
      JOIN lessons l ON l.course_id = c.id
      WHERE up.user_id = auth.uid()
      AND up.user_type = 'rabbi'
      AND l.id = student_progress.lesson_id
    )
  );

-- RLS Policies for student_words
CREATE POLICY "Students can manage own word progress"
  ON student_words FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_words.student_profile_id
    )
  );

-- RLS Policies for translation_requests
CREATE POLICY "Students can manage own translation requests"
  ON translation_requests FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = translation_requests.student_profile_id
    )
  );

CREATE POLICY "Rabbis can view and respond to translation requests"
  ON translation_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

CREATE POLICY "Rabbis can update translation requests"
  ON translation_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

-- RLS Policies for audio_files
CREATE POLICY "Anyone can view audio files"
  ON audio_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Rabbis can manage audio files"
  ON audio_files FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

-- RLS Policies for achievements
CREATE POLICY "Students can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = achievements.student_profile_id
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = notifications.user_profile_id
    )
  );

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = notifications.user_profile_id
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_rabbi ON courses(rabbi_profile_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, order_number);
CREATE INDEX IF NOT EXISTS idx_words_hebrew ON words(hebrew_word);
CREATE INDEX IF NOT EXISTS idx_translations_word_lang ON translations(word_id, language);
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_student_words_student ON student_words(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_student_words_next_review ON student_words(next_review_at);
CREATE INDEX IF NOT EXISTS idx_translation_requests_status ON translation_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_profile_id, is_read);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS TRIGGER AS $$
DECLARE
    lesson_count INTEGER;
    word_count INTEGER;
    streak_days INTEGER;
BEGIN
    -- Check for lesson completion achievements
    SELECT COUNT(*) INTO lesson_count
    FROM student_progress
    WHERE student_profile_id = NEW.student_profile_id
    AND status = 'completed';

    -- Award achievements based on lesson count
    IF lesson_count = 1 THEN
        INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
        VALUES (NEW.student_profile_id, 'first_lesson', 'Первый урок', 'Завершили свой первый урок!', '🎯', 10)
        ON CONFLICT DO NOTHING;
    ELSIF lesson_count = 10 THEN
        INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
        VALUES (NEW.student_profile_id, 'ten_lessons', 'Десять уроков', 'Завершили 10 уроков!', '🏆', 50)
        ON CONFLICT DO NOTHING;
    ELSIF lesson_count = 50 THEN
        INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
        VALUES (NEW.student_profile_id, 'fifty_lessons', 'Пятьдесят уроков', 'Завершили 50 уроков!', '👑', 200)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Check for word mastery achievements
    SELECT COUNT(*) INTO word_count
    FROM student_words
    WHERE student_profile_id = NEW.student_profile_id
    AND knowledge_level = 'mastered';

    IF word_count = 100 THEN
        INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
        VALUES (NEW.student_profile_id, 'hundred_words', 'Сто слов', 'Изучили 100 слов!', '📚', 100)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievement_trigger_progress
    AFTER INSERT OR UPDATE ON student_progress
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION check_and_award_achievements();

CREATE TRIGGER achievement_trigger_words
    AFTER INSERT OR UPDATE ON student_words
    FOR EACH ROW
    WHEN (NEW.knowledge_level = 'mastered')
    EXECUTE FUNCTION check_and_award_achievements();

-- Function to create notification when translation request is answered
CREATE OR REPLACE FUNCTION notify_translation_answered()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'answered' AND OLD.status = 'pending' THEN
        INSERT INTO notifications (user_profile_id, title, message, type)
        VALUES (
            NEW.student_profile_id,
            'Перевод готов!',
            'Раввин ответил на ваш запрос перевода слова',
            'success'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER translation_answered_notification
    AFTER UPDATE ON translation_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_translation_answered();