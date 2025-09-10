/*
  # Create student words table

  1. New Tables
    - `student_words`
      - `id` (uuid, primary key)
      - `student_profile_id` (uuid, references user_profiles)
      - `word_id` (uuid, references words)
      - `knowledge_level` (text, default 'unknown')
      - `last_reviewed_at` (timestamp, default now)
      - `review_count` (integer, default 0)
      - `correct_count` (integer, default 0)
      - `next_review_at` (timestamp, default now)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `student_words` table
    - Add policies for word progress management
*/

-- Create the student_words table
CREATE TABLE IF NOT EXISTS student_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE NOT NULL,
  knowledge_level text DEFAULT 'unknown' CHECK (knowledge_level IN ('unknown', 'learning', 'known', 'mastered')),
  last_reviewed_at timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  next_review_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_profile_id, word_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_words_student ON student_words(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_student_words_next_review ON student_words(next_review_at);

-- Enable RLS
ALTER TABLE student_words ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Students can manage own word progress"
  ON student_words
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.id = student_words.student_profile_id
    )
  );