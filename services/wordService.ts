import { supabase } from '@/lib/supabase';
import { Word, Translation, StudentWord } from '@/types/global';
import { calculateGematria, extractUniqueWords } from '@/utils/hebrew';

export class WordService {
  static async processLessonWords(lessonContent: string, studentId: string) {
    const uniqueWords = extractUniqueWords(lessonContent);
    const newWords: string[] = [];
    
    for (const hebrewWord of uniqueWords) {
      // Check if word exists in database
      const { data: existingWord } = await supabase
        .from('words')
        .select('*')
        .eq('hebrew_word', hebrewWord)
        .single();

      let wordId: string;

      if (!existingWord) {
        // Create new word with gematria
        const gematria = calculateGematria(hebrewWord);
        const { data: newWord } = await supabase
          .from('words')
          .insert({
            hebrew_word: hebrewWord,
            transliteration: '', // Can be filled later
            gematria_values: [
              { type: 'simple', value: gematria.simple },
              { type: 'standard', value: gematria.standard },
              { type: 'ordinal', value: gematria.ordinal }
            ]
          })
          .select()
          .single();
        
        wordId = newWord?.id;
        newWords.push(hebrewWord);
      } else {
        wordId = existingWord.id;
      }

      // Check student's knowledge of this word
      const { data: studentWord } = await supabase
        .from('student_words')
        .select('*')
        .eq('student_id', studentId)
        .eq('word_id', wordId)
        .single();

      if (!studentWord) {
        // Add as unknown word for student
        await supabase
          .from('student_words')
          .insert({
            student_id: studentId,
            word_id: wordId,
            knowledge_level: 'unknown',
            last_reviewed: new Date().toISOString(),
            review_count: 0
          });
      }
    }

    return {
      totalWords: uniqueWords.length,
      newWords: newWords.length
    };
  }

  static async getWordTranslation(wordId: string, language: string, courseId?: string, lessonId?: string) {
    let query = supabase
      .from('translations')
      .select('*')
      .eq('word_id', wordId)
      .eq('language', language);

    // Prioritize lesson-specific, then course-specific, then general translations
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    } else if (courseId) {
      query = query.eq('course_id', courseId);
    } else {
      query = query.is('course_id', null).is('lesson_id', null);
    }

    const { data } = await query.single();
    return data?.translation || 'Translation not found';
  }

  static async updateStudentWordKnowledge(studentId: string, wordId: string, level: 'unknown' | 'learning' | 'known') {
    await supabase
      .from('student_words')
      .upsert({
        student_id: studentId,
        word_id: wordId,
        knowledge_level: level,
        last_reviewed: new Date().toISOString(),
        review_count: 1
      });
  }

  static async getStudentUnknownWords(studentId: string, lessonContent: string) {
    const words = extractUniqueWords(lessonContent);
    const unknownWords: string[] = [];

    for (const hebrewWord of words) {
      const { data: word } = await supabase
        .from('words')
        .select('id')
        .eq('hebrew_word', hebrewWord)
        .single();

      if (word) {
        const { data: studentWord } = await supabase
          .from('student_words')
          .select('knowledge_level')
          .eq('student_id', studentId)
          .eq('word_id', word.id)
          .single();

        if (!studentWord || studentWord.knowledge_level === 'unknown') {
          unknownWords.push(hebrewWord);
        }
      }
    }

    return unknownWords;
  }
}