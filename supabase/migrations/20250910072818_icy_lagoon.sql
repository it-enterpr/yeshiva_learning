/*
  # Update Courses Schema for Multi-User Support

  1. Schema Updates
    - Add `created_by` column to courses table to track which rabbi created the course
    - Update RLS policies to allow rabbis to manage their own courses
    - Allow students to view all active courses

  2. Security Updates
    - Update existing RLS policies
    - Add new policies for course management
*/

-- Add created_by column to courses if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE courses ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Update courses table structure if needed
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id),
  rabbi_id text, -- Keep for backward compatibility
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active courses" ON courses;
DROP POLICY IF EXISTS "Rabbis can manage courses" ON courses;

-- New policies for courses
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
      WHERE user_id = auth.uid()
      AND user_type = 'rabbi'
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
      WHERE user_id = auth.uid()
      AND user_type = 'rabbi'
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
      WHERE user_id = auth.uid()
      AND user_type = 'rabbi'
    )
  );

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();