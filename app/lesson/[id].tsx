import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowRight, BookOpen, Play, FileText, MessageCircle } from 'lucide-react-native';

export default function CourseLessons() {
  const { id } = useLocalSearchParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: StudentProgress }>({});
  const [unknownWordsCount, setUnknownWordsCount] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const courseId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (courseId) {
      loadDemoLessons();
    }
  }, [courseId]);

  const loadDemoLessons = () => {
    // Demo lessons data
    const demoLessons: Lesson[] = [
      {
        id: '1',
        course_id: courseId!,
        title: 'בראשית א׳ א׳-ה׳',
        content: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃',
        audio_url: 'https://example.com/audio1.mp3',
        youtube_url: 'https://youtube.com/watch?v=example1',
        order_number: 1,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        course_id: courseId!,
        title: 'בראשית א׳ ו׳-י׳',
        content: 'וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃',
        audio_url: 'https://example.com/audio2.mp3',
        youtube_url: 'https://youtube.com/watch?v=example2',
        order_number: 2,
        created_at: new Date().toISOString()
      }
    ];

    setLessons(demoLessons);
    setLoading(false);
  };

  const navigateToLesson = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  const getLessonStatusColor = (lessonId: string) => {
    const lessonProgress = progress[lessonId];
    if (!lessonProgress) return '#64748b';
    if (lessonProgress.completed) return '#10b981';
    if (lessonProgress.started) return '#f59e0b';
    return '#64748b';
  };

  const getLessonStatusText = (lessonId: string) => {
    const lessonProgress = progress[lessonId];
    if (!lessonProgress) return 'Not started';
    if (lessonProgress.completed) return 'Completed';
    if (lessonProgress.started) return 'In progress';
    return 'Not started';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading lessons...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowRight size={24} color="#e2e8f0" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Lessons</Text>
      </View>

      <View style={styles.lessonsContainer}>
        {lessons.map((lesson, index) => (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lessonCard}
            onPress={() => navigateToLesson(lesson.id)}
            activeOpacity={0.7}
          >
            <View style={styles.lessonHeader}>
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <View style={styles.lessonMeta}>
                  <View style={[styles.statusIndicator, { backgroundColor: getLessonStatusColor(lesson.id) }]} />
                  <Text style={styles.statusText}>{getLessonStatusText(lesson.id)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.lessonStats}>
              <View style={styles.statItem}>
                <FileText size={16} color="#94a3b8" />
                <Text style={styles.statText}>
                  {unknownWordsCount[lesson.id] || 0} unknown words
                </Text>
              </View>
              
              {lesson.audio_url && (
                <View style={styles.statItem}>
                  <Play size={16} color="#94a3b8" />
                  <Text style={styles.statText}>Audio available</Text>
                </View>
              )}
              
              {lesson.youtube_url && (
                <View style={styles.statItem}>
                  <Play size={16} color="#94a3b8" />
                  <Text style={styles.statText}>Video explanation</Text>
                </View>
              )}
            </View>

            <View style={styles.lessonFooter}>
              <Text style={styles.lessonPreview} numberOfLines={2}>
                {lesson.content.slice(0, 100)}...
              </Text>
              <ArrowRight size={20} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {lessons.length === 0 && (
        <View style={styles.emptyState}>
          <BookOpen size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No lessons available</Text>
          <Text style={styles.emptySubtitle}>Rabbi hasn't added any lessons yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  lessonsContainer: {
    padding: 16,
    gap: 16,
  },
  lessonCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
    textAlign: 'right',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  lessonStats: {
    marginBottom: 16,
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  statText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  lessonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonPreview: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    textAlign: 'right',
    marginRight: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});