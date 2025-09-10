/*
  # Create student progress table

  1. New Tables
    - `student_progress`
      - `id` (uuid, primary key)
      - `student_profile_id` (uuid, references user_profiles)
      - `lesson_id` (uuid, references lessons)
      - `status` (text, default 'not_started')
      - `completion_percentage` (integer, default 0)
      - `time_spent_minutes` (integer, default 0)
      - `score` (integer, nullable)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `student_progress` table
    - Add policies for progress management
*/

-- Create the student_progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent_minutes integer DEFAULT 0,
  score integer CHECK (score >= 0 AND score <= 100),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_profile_id, lesson_id)
);

-- Create index for student lookups
CREATE INDEX IF NOT EXISTS idx_student_progress_student ON student_progress(student_profile_id);

-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view own progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Students can update own progress"
  ON student_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Students can modify own progress"
  ON student_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_progress.student_profile_id
    )
  );

CREATE POLICY "Rabbis can view progress of their students"
  ON student_progress
  FOR SELECT
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

-- Create trigger for updated_at
CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON student_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();