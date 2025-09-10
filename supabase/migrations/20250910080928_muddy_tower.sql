/*
  # Complete Database Schema for Hebrew Study App

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `rabbi_id` (uuid, references auth.users)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `content` (text)
      - `audio_url` (text, optional)
      - `youtube_url` (text, optional)
      - `order_number` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Rabbis can manage their courses
    - Students can view active courses

  3. Sample Data
    - Demo courses and lessons for testing
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  rabbi_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Rabbis can manage their courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (auth.uid() = rabbi_id);

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons of active courses"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_active = true
    )
  );

CREATE POLICY "Rabbis can manage lessons of their courses"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.rabbi_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for courses
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
DO $$
DECLARE
  demo_rabbi_id uuid;
  course1_id uuid;
  course2_id uuid;
  course3_id uuid;
BEGIN
  -- Create a demo rabbi user (this will work if auth is set up)
  -- For now, we'll use a fixed UUID for demo purposes
  demo_rabbi_id := '00000000-0000-0000-0000-000000000001';

  -- Insert demo courses
  INSERT INTO courses (id, title, description, rabbi_id, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'תורה - בראשית', 'לימוד ספר בראשית עם פירוש רש"י ותרגום לשפת האם', demo_rabbi_id, true),
    ('22222222-2222-2222-2222-222222222222', 'תלמוד בבלי - ברכות', 'מסכת ברכות עם הסברים מפורטים ותרגום המושגים', demo_rabbi_id, true),
    ('33333333-3333-3333-3333-333333333333', 'תניא - ליקוטי אמרים', 'ספר התניא עם הסברי חסידות ותרגום למתחילים', demo_rabbi_id, true)
  ON CONFLICT (id) DO NOTHING;

  -- Insert demo lessons for first course
  INSERT INTO lessons (course_id, title, content, order_number) VALUES
    ('11111111-1111-1111-1111-111111111111', 'בראשית א׳ א׳-ה׳', 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃', 1),
    ('11111111-1111-1111-1111-111111111111', 'בראשית א׳ ו׳-י׳', 'וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃', 2),
    ('11111111-1111-1111-1111-111111111111', 'בראשית א׳ יא׳-יג׳', 'וַיֹּאמֶר אֱלֹהִים תַּדְשֵׁא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע עֵץ פְּרִי עֹשֶׂה פְּרִי לְמִינוֹ׃', 3);

  -- Insert demo lessons for second course
  INSERT INTO lessons (course_id, title, content, order_number) VALUES
    ('22222222-2222-2222-2222-222222222222', 'ברכות דף ב׳ עמוד א׳', 'מאימתי קורין את שמע בערבית מעת שהכהנים נכנסים לאכול בתרומתן', 1),
    ('22222222-2222-2222-2222-222222222222', 'ברכות דף ב׳ עמוד ב׳', 'עד חצות או עד שיעלה עמוד השחר דברי רבי אליעזר', 2);

  -- Insert demo lessons for third course  
  INSERT INTO lessons (course_id, title, content, order_number) VALUES
    ('33333333-3333-3333-3333-333333333333', 'תניא פרק א׳', 'כל ישראל יש להם נפש אחת בשמים והיא נקראת אדם עליון', 1),
    ('33333333-3333-3333-3333-333333333333', 'תניא פרק ב׳', 'והנה כל מדה ומדה מהמדות הללו כשהיא עולה ומתלבשת בנפש', 2);

END $$;