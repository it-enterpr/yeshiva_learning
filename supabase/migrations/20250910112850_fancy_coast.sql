/*
  # Create achievements table

  1. New Tables
    - `achievements`
      - `id` (uuid, primary key)
      - `student_profile_id` (uuid, references user_profiles)
      - `achievement_type` (text)
      - `achievement_name` (text)
      - `description` (text, nullable)
      - `icon` (text, default '🏆')
      - `points` (integer, default 0)
      - `unlocked_at` (timestamp, default now)

  2. Security
    - Enable RLS on `achievements` table
    - Add policies for achievement management
*/

-- Create the achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can view own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = achievements.student_profile_id
    )
  );