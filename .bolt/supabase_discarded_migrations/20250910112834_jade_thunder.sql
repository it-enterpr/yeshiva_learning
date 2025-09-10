/*
  # Create translation requests table

  1. New Tables
    - `translation_requests`
      - `id` (uuid, primary key)
      - `student_profile_id` (uuid, references user_profiles)
      - `word_id` (uuid, references words)
      - `lesson_id` (uuid, references lessons, nullable)
      - `status` (text, default 'pending')
      - `rabbi_response` (text, nullable)
      - `rabbi_profile_id` (uuid, references user_profiles, nullable)
      - `responded_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `translation_requests` table
    - Add policies for translation request management
*/

-- Create the translation_requests table
CREATE TABLE IF NOT EXISTS translation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'rejected')),
  rabbi_response text,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create index for status lookups
CREATE INDEX IF NOT EXISTS idx_translation_requests_status ON translation_requests(status);

-- Enable RLS
ALTER TABLE translation_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can manage own translation requests"
  ON translation_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = translation_requests.student_profile_id
    )
  );

CREATE POLICY "Rabbis can view and respond to translation requests"
  ON translation_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );

CREATE POLICY "Rabbis can update translation requests"
  ON translation_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );