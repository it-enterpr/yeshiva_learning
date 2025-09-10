/*
  # Create words table

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `hebrew_word` (text, unique)
      - `transliteration` (text, nullable)
      - `gematria_simple` (integer, default 0)
      - `gematria_standard` (integer, default 0)
      - `gematria_ordinal` (integer, default 0)
      - `frequency_rank` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `words` table
    - Add policies for word management
*/

-- Create the words table
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hebrew_word text UNIQUE NOT NULL,
  transliteration text,
  gematria_simple integer DEFAULT 0,
  gematria_standard integer DEFAULT 0,
  gematria_ordinal integer DEFAULT 0,
  frequency_rank integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create index for hebrew word lookups
CREATE INDEX IF NOT EXISTS idx_words_hebrew ON words(hebrew_word);

-- Enable RLS
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view words"
  ON words
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Rabbis can manage words"
  ON words
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );