/*
  # Create audio files table

  1. New Tables
    - `audio_files`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, references lessons, nullable)
      - `word_id` (uuid, references words, nullable)
      - `file_url` (text)
      - `file_type` (text, default 'mp3')
      - `duration_seconds` (integer, nullable)
      - `rabbi_profile_id` (uuid, references user_profiles, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `audio_files` table
    - Add policies for audio file management
*/

-- Create the audio_files table
CREATE TABLE IF NOT EXISTS audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text DEFAULT 'mp3',
  duration_seconds integer,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view audio files"
  ON audio_files
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Rabbis can manage audio files"
  ON audio_files
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );