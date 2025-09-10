/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `rabbi_profile_id` (uuid, references user_profiles)
      - `is_active` (boolean, default true)
      - `difficulty_level` (text, default 'beginner')
      - `estimated_duration_hours` (integer, default 10)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `courses` table
    - Add policies for course management
*/

-- Create the courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  rabbi_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  is_active boolean DEFAULT true,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration_hours integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create index for rabbi lookups
CREATE INDEX IF NOT EXISTS idx_courses_rabbi ON courses(rabbi_profile_id);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Rabbis can insert courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

CREATE POLICY "Rabbis can manage their courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
      AND user_profiles.id = courses.rabbi_profile_id
    )
  );

CREATE POLICY "Rabbis can update own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

CREATE POLICY "Rabbis can delete own courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();