/*
  # Create triggers and functions

  1. Functions
    - `handle_new_user()` - Creates user profile on signup
    - `check_and_award_achievements()` - Awards achievements based on progress
    - `notify_translation_answered()` - Sends notification when translation is answered

  2. Triggers
    - User signup trigger
    - Achievement triggers
    - Translation notification trigger
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, name, user_type, native_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'native_language', 'Русский')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS TRIGGER AS $$
DECLARE
  student_id uuid;
  completed_lessons_count integer;
  mastered_words_count integer;
BEGIN
  student_id := NEW.student_profile_id;
  
  -- Check for lesson completion achievements
  IF TG_TABLE_NAME = 'student_progress' AND NEW.status = 'completed' THEN
    SELECT COUNT(*) INTO completed_lessons_count
    FROM student_progress
    WHERE student_profile_id = student_id AND status = 'completed';
    
    -- First lesson achievement
    IF completed_lessons_count = 1 THEN
      INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
      VALUES (student_id, 'first_lesson', 'Первый урок', 'Завершили первый урок изучения', '🎓', 10)
      ON CONFLICT DO NOTHING;
    END IF;
    
    -- Ten lessons achievement
    IF completed_lessons_count = 10 THEN
      INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
      VALUES (student_id, 'ten_lessons', 'Десять уроков', 'Завершили 10 уроков', '📚', 50)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  -- Check for word mastery achievements
  IF TG_TABLE_NAME = 'student_words' AND NEW.knowledge_level = 'mastered' THEN
    SELECT COUNT(*) INTO mastered_words_count
    FROM student_words
    WHERE student_profile_id = student_id AND knowledge_level = 'mastered';
    
    -- Hundred words achievement
    IF mastered_words_count = 100 THEN
      INSERT INTO achievements (student_profile_id, achievement_type, achievement_name, description, icon, points)
      VALUES (student_id, 'hundred_words', '100 слов', 'Изучили 100 слов на иврите', '📖', 100)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for achievements
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

-- Function to notify when translation is answered
CREATE OR REPLACE FUNCTION notify_translation_answered()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'answered' AND OLD.status = 'pending' THEN
    INSERT INTO notifications (user_profile_id, title, message, type)
    VALUES (
      NEW.student_profile_id,
      'Перевод получен',
      'Раввин ответил на ваш запрос перевода',
      'success'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for translation notifications
CREATE TRIGGER translation_answered_notification
  AFTER UPDATE ON translation_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_translation_answered();