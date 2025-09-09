import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Users, Clock, ArrowRight } from 'lucide-react-native';
import { Course } from '@/types/global';
import { supabase, demoData, isSupabaseConfigured } from '@/lib/supabase';

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      if (isSupabaseConfigured()) {
        // Try to load from Supabase
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase error, falling back to demo data:', error);
          setCourses(demoData.courses);
        } else {
          setCourses(data || []);
        }
      } else {
        // Use demo data if Supabase is not configured
        console.log('Using demo data - Supabase not configured');
        setCourses(demoData.courses);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback to demo data on any error
      setCourses(demoData.courses);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Torah Study Courses</Text>
        <Text style={styles.headerSubtitle}>Choose a course to begin your learning journey</Text>
      </View>

      <View style={styles.coursesContainer}>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => navigateToCourse(course.id)}
            activeOpacity={0.7}
          >
            <View style={styles.courseHeader}>
              <BookOpen size={24} color="#3b82f6" />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription}>{course.description}</Text>
              </View>
            </View>

            <View style={styles.courseStats}>
              <View style={styles.statItem}>
                <Users size={16} color="#94a3b8" />
                <Text style={styles.statText}>Active students</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={16} color="#94a3b8" />
                <Text style={styles.statText}>Self-paced</Text>
              </View>
            </View>

            <View style={styles.courseFooter}>
              <Text style={styles.startText}>Start Learning</Text>
              <ArrowRight size={20} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {courses.length === 0 && (
        <View style={styles.emptyState}>
          <BookOpen size={64} color="#94a3b8" />
          <Text style={styles.emptyTitle}>No courses available</Text>
          <Text style={styles.emptySubtitle}>Check back later for new courses</Text>
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
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  coursesContainer: {
    padding: 16,
    gap: 16,
  },
  courseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
    textAlign: 'right',
  },
  courseDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    textAlign: 'right',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
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