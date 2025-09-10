/*
  # Insert demo data

  1. Demo Data
    - Sample rabbi profile
    - Sample courses
    - Sample lessons
    - Sample words with translations
*/

-- Insert demo rabbi profile (this will be created when a rabbi signs up)
-- We'll create some demo courses that can be associated with any rabbi

-- Insert demo words
INSERT INTO words (hebrew_word, transliteration, gematria_simple, gematria_standard, gematria_ordinal) VALUES
('בְּרֵאשִׁית', 'bereshit', 913, 913, 64),
('בָּרָא', 'bara', 203, 203, 21),
('אֱלֹהִים', 'elohim', 86, 86, 40),
('אֵת', 'et', 401, 401, 23),
('הַשָּׁמַיִם', 'hashamayim', 395, 395, 58),
('וְאֵת', 'v''et', 407, 407, 29),
('הָאָרֶץ', 'ha''aretz', 296, 296, 46),
('וְהָאָרֶץ', 'v''ha''aretz', 302, 302, 52),
('הָיְתָה', 'hayetah', 420, 420, 38),
('תֹהוּ', 'tohu', 411, 411, 23),
('וָבֹהוּ', 'vavohu', 17, 17, 29),
('וְחֹשֶׁךְ', 'v''choshech', 334, 334, 44),
('עַל־פְּנֵי', 'al-pnei', 160, 160, 42),
('תְהוֹם', 'tehom', 454, 454, 26),
('וְרוּחַ', 'v''ruach', 220, 220, 32),
('מְרַחֶפֶת', 'merachefet', 728, 728, 56),
('הַמָּיִם', 'hamayim', 95, 95, 32)
ON CONFLICT (hebrew_word) DO NOTHING;

-- Insert demo translations
INSERT INTO translations (word_id, language, translation, is_verified) 
SELECT w.id, 'ru', t.translation, true
FROM words w
JOIN (VALUES
  ('בְּרֵאשִׁית', 'В начале'),
  ('בָּרָא', 'сотворил'),
  ('אֱלֹהִים', 'Бог'),
  ('אֵת', 'את (определенный артикль)'),
  ('הַשָּׁמַיִם', 'небеса'),
  ('וְאֵת', 'и את'),
  ('הָאָרֶץ', 'земля'),
  ('וְהָאָרֶץ', 'и земля'),
  ('הָיְתָה', 'была'),
  ('תֹהוּ', 'пустота'),
  ('וָבֹהוּ', 'и хаос'),
  ('וְחֹשֶׁךְ', 'и тьма'),
  ('עַל־פְּנֵי', 'на поверхности'),
  ('תְהוֹם', 'бездна'),
  ('וְרוּחַ', 'и дух'),
  ('מְרַחֶפֶת', 'парил'),
  ('הַמָּיִם', 'воды')
) AS t(hebrew_word, translation) ON w.hebrew_word = t.hebrew_word
ON CONFLICT DO NOTHING;