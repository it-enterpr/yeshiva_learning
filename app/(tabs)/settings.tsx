import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { User, Globe, Palette, Bell, Shield, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [rtlMode, setRtlMode] = useState(true);

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Settings',
      'Choose your native language for translations',
      [
        { text: 'English', onPress: () => {} },
        { text: 'русский', onPress: () => {} },
        { text: 'עברית', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your learning experience</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <User size={20} color="#3b82f6" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Profile Information</Text>
            <Text style={styles.settingSubtitle}>Update your personal details</Text>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Learning Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Preferences</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
          <View style={styles.settingIcon}>
            <Globe size={20} color="#10b981" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Native Language</Text>
            <Text style={styles.settingSubtitle}>English</Text>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Palette size={20} color="#f59e0b" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingSubtitle}>Use dark theme</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.rtlIcon}>א</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>RTL Text Direction</Text>
            <Text style={styles.settingSubtitle}>Right-to-left reading</Text>
          </View>
          <Switch
            value={rtlMode}
            onValueChange={setRtlMode}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={rtlMode ? '#ffffff' : '#f3f4f6'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Auto-play Audio</Text>
            <Text style={styles.settingSubtitle}>Start audio automatically</Text>
          </View>
          <Switch
            value={autoPlay}
            onValueChange={setAutoPlay}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={autoPlay ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={20} color="#ef4444" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingSubtitle}>Study reminders and updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Shield size={20} color="#8b5cf6" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy & Security</Text>
            <Text style={styles.settingSubtitle}>Manage your account security</Text>
          </View>
          <ChevronRight size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingIcon}>
            <LogOut size={20} color="#ef4444" />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: '#ef4444' }]}>Logout</Text>
            <Text style={styles.settingSubtitle}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Yeshiva Learning App v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for Torah study</Text>
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
  section: {
    padding: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 16,
    paddingLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rtlIcon: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: '600',
  },
  playIcon: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#475569',
  },
});