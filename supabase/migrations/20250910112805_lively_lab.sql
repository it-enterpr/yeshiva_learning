/*
  # Create translations table

  1. New Tables
    - `translations`
      - `id` (uuid, primary key)
      - `word_id` (uuid, references words)
      - `language` (text, default 'ru')
      - `translation` (text)
      - `context` (text, nullable)
      - `rabbi_profile_id` (uuid, references user_profiles, nullable)
      - `is_verified` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `translations` table
    - Add policies for translation management
*/

-- Create the translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid REFERENCES words(id) ON DELETE CASCADE NOT NULL,
  language text NOT NULL DEFAULT 'ru',
  translation text NOT NULL,
  context text,
  rabbi_profile_id uuid REFERENCES user_profiles(id),
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for word and language lookups
CREATE INDEX IF NOT EXISTS idx_translations_word_lang ON translations(word_id, language);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view verified translations"
  ON translations
  FOR SELECT
  TO authenticated
  USING (is_verified = true);

CREATE POLICY "Rabbis can manage all translations"
  ON translations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.user_type = 'rabbi'
    )
  );