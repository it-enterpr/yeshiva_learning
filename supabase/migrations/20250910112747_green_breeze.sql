/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `title` (text)
      - `content` (text)
      - `audio_url` (text, nullable)
      - `youtube_url` (text, nullable)
      - `order_number` (integer)
      - `estimated_duration_minutes` (integer, default 15)
      - `is_published` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `lessons` table
    - Add policies for lesson management
*/

-- Create the lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
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

-- Create index for course lookups
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id, order_number);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Rabbis can manage lessons in their courses"
  ON lessons
  FOR ALL
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

-- Create trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();