/*
  # Fix Foreign Key Constraint Issue

  1. Problem Analysis
    - courses table references auth.users via rabbi_id
    - Demo data uses non-existent user ID
    - Need to create proper user or modify constraint

  2. Solution
    - Modify courses table to reference user_profiles instead
    - Create demo rabbi profile
    - Maintain referential integrity

  3. Changes
    - Update foreign key to reference user_profiles
    - Insert demo rabbi profile
    - Add demo courses with valid references
*/

-- First, ensure user_profiles table exists and has proper structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('student', 'rabbi')),
  native_language text NOT NULL DEFAULT 'Русский',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Rabbis can view student profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles rabbi_profile 
      WHERE rabbi_profile.user_id = auth.uid() 
      AND rabbi_profile.user_type = 'rabbi'
    )
  );

-- Create courses table with proper foreign key reference
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  rabbi_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies for courses
CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Rabbis can manage their courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = courses.rabbi_profile_id 
      AND user_profiles.user_id = auth.uid()
    )
  );

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  audio_url text,
  youtube_url text,
  order_number integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for lessons
CREATE POLICY "Anyone can view lessons of active courses" ON lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_active = true
    )
  );

CREATE POLICY "Rabbis can manage lessons for their courses" ON lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM courses 
      JOIN user_profiles ON user_profiles.id = courses.rabbi_profile_id
      WHERE courses.id = lessons.course_id 
      AND user_profiles.user_id = auth.uid()
    )
  );

-- Insert demo rabbi profile (this will work without auth.users dependency)
INSERT INTO user_profiles (id, user_id, name, user_type, native_language) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001', -- This can be a placeholder
  'Раввин Демо',
  'rabbi',
  'עברית'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo courses
INSERT INTO courses (id, title, description, rabbi_profile_id, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'תורה - בראשית',
  'לימוד ספר בראשית עם פירוש רש"י ותרגום לשפת האם',
  '00000000-0000-0000-0000-000000000001',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'תלמוד בבלי - ברכות',
  'מסכת ברכות עם הסברים מפורטים ותרגום המושגים',
  '00000000-0000-0000-0000-000000000001',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'תניא - ליקוטי אמרים',
  'ספר התניא עם הסברי חסידות ותרגום למתחילים',
  '00000000-0000-0000-0000-000000000001',
  true
) ON CONFLICT (id) DO NOTHING;

-- Insert demo lessons
INSERT INTO lessons (id, course_id, title, content, order_number) VALUES
(
  '1',
  '11111111-1111-1111-1111-111111111111',
  'בראשית א׳ א׳-ה׳',
  'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
  1
),
(
  '2',
  '11111111-1111-1111-1111-111111111111',
  'בראשית א׳ ו׳-י׳',
  'וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃',
  2
),
(
  '3',
  '11111111-1111-1111-1111-111111111111',
  'בראשית א׳ יא׳-יג׳',
  'וַיֹּאמֶר אֱלֹהִים תַּדְשֵׁא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע עֵץ פְּרִי עֹשֶׂה פְּרִי לְמִינוֹ׃',
  3
) ON CONFLICT (id) DO NOTHING;