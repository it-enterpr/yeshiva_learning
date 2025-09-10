/*
  # Create lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text, not null)
      - `content` (text)
      - `audio_url` (text, optional)
      - `youtube_url` (text, optional)
      - `order_number` (integer, not null)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `lessons` table
    - Add policy for authenticated users to read lessons from active courses
    - Add policy for rabbis to manage lessons in their courses
*/

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  title text NOT NULL,
  content text,
  audio_url text,
  youtube_url text,
  order_number integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read lessons from active courses
CREATE POLICY "Users can view lessons from active courses"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    course_id IN (
      SELECT id FROM courses WHERE is_active = true
    )
  );

-- Allow rabbis to manage lessons in their courses
CREATE POLICY "Rabbis can manage lessons in own courses"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    course_id IN (
      SELECT c.id FROM courses c
      JOIN user_profiles up ON c.rabbi_id = up.id
      WHERE up.user_id = auth.uid() AND up.user_type = 'rabbi'
    )
  );

-- Add foreign key constraint
ALTER TABLE lessons 
ADD CONSTRAINT lessons_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Add unique constraint for order within course
ALTER TABLE lessons 
ADD CONSTRAINT lessons_course_order_unique 
UNIQUE (course_id, order_number);