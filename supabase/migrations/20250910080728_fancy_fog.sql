/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `rabbi_id` (uuid, foreign key to user_profiles)
      - `created_at` (timestamp)
      - `is_active` (boolean, default true)

  2. Security
    - Enable RLS on `courses` table
    - Add policy for authenticated users to read active courses
    - Add policy for rabbis to manage their own courses
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  rabbi_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read active courses
CREATE POLICY "Users can view active courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Allow rabbis to manage their own courses
CREATE POLICY "Rabbis can manage own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    rabbi_id IN (
      SELECT id FROM user_profiles 
      WHERE user_id = auth.uid() AND user_type = 'rabbi'
    )
  );

-- Add foreign key constraint
ALTER TABLE courses 
ADD CONSTRAINT courses_rabbi_id_fkey 
FOREIGN KEY (rabbi_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Insert some demo data
INSERT INTO courses (title, description, rabbi_id, is_active) VALUES
  ('תורה - בראשית', 'לימוד ספר בראשית עם פירוש רש"י ותרגום לשפת האם', 
   (SELECT id FROM user_profiles WHERE user_type = 'rabbi' LIMIT 1), true),
  ('תלמוד בבלי - ברכות', 'מסכת ברכות עם הסברים מפורטים ותרגום המושגים', 
   (SELECT id FROM user_profiles WHERE user_type = 'rabbi' LIMIT 1), true),
  ('תניא - ליקוטי אמרים', 'ספר התניא עם הסברי חסידות ותרגום למתחילים', 
   (SELECT id FROM user_profiles WHERE user_type = 'rabbi' LIMIT 1), true)
ON CONFLICT DO NOTHING;