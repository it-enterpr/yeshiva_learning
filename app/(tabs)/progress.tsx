import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Book, Target, TrendingUp, Clock, Award, Brain } from 'lucide-react-native';

export default function ProgressScreen() {
  const [stats, setStats] = useState({
    totalCourses: 3,
    completedLessons: 12,
    totalLessons: 18,
    knownWords: 245,
    learningWords: 67,
    studyStreak: 15,
    averageScore: 85
  });

  const progressPercentage = (stats.completedLessons / stats.totalLessons) * 100;
  const wordKnowledgePercentage = (stats.knownWords / (stats.knownWords + stats.learningWords)) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your learning journey</Text>
      </View>

      {/* Overview Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Book size={24} color="#3b82f6" />
          </View>
          <Text style={styles.statNumber}>{stats.completedLessons}</Text>
          <Text style={styles.statLabel}>Lessons Completed</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
            />
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Brain size={24} color="#10b981" />
          </View>
          <Text style={styles.statNumber}>{stats.knownWords}</Text>
          <Text style={styles.statLabel}>Known Words</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${wordKnowledgePercentage}%`, backgroundColor: '#10b981' }]} 
            />
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Target size={24} color="#f59e0b" />
          </View>
          <Text style={styles.statNumber}>{stats.averageScore}%</Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#ef4444" />
          </View>
          <Text style={styles.statNumber}>{stats.studyStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Award size={20} color="#10b981" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Lesson Completed</Text>
            <Text style={styles.activitySubtitle}>Talmud Bavli - Berachot 2a</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Brain size={20} color="#3b82f6" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>15 New Words Learned</Text>
            <Text style={styles.activitySubtitle}>From Torah - Bereishit</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Target size={20} color="#f59e0b" />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Test Passed</Text>
            <Text style={styles.activitySubtitle}>Score: 92% - Mishnah Torah</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>
      </View>

      {/* Word Learning Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vocabulary Progress</Text>
        
        <View style={styles.vocabularyCard}>
          <View style={styles.vocabularyStats}>
            <View style={styles.vocabularyStat}>
              <Text style={styles.vocabularyNumber}>{stats.knownWords}</Text>
              <Text style={styles.vocabularyLabel}>Known</Text>
              <View style={[styles.vocabularyDot, { backgroundColor: '#10b981' }]} />
            </View>
            
            <View style={styles.vocabularyStat}>
              <Text style={styles.vocabularyNumber}>{stats.learningWords}</Text>
              <Text style={styles.vocabularyLabel}>Learning</Text>
              <View style={[styles.vocabularyDot, { backgroundColor: '#f59e0b' }]} />
            </View>
          </View>
          
          <TouchableOpacity style={styles.reviewButton}>
            <Clock size={16} color="#ffffff" />
            <Text style={styles.reviewButtonText}>Review Words</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Study Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Goals</Text>
        
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Weekly Goal</Text>
          <Text style={styles.goalProgress}>5 / 7 lessons completed</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '71%' }]} />
          </View>
        </View>
        
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Monthly Words Target</Text>
          <Text style={styles.goalProgress}>245 / 300 words learned</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '82%', backgroundColor: '#10b981' }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    width: '47%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e40af20',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
  vocabularyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  vocabularyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  vocabularyStat: {
    alignItems: 'center',
  },
  vocabularyNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  vocabularyLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  vocabularyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  reviewButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
});