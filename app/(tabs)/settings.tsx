import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Moon, Bell, Smartphone, Shield, CircleHelp as HelpCircle, Star, MessageSquare, Trash2, ChevronRight } from 'lucide-react-native';
import { setGoogleApiKey, getGoogleApiKey } from '@/services/chatService';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);

  React.useEffect(() => {
    setGoogleApiKey(getGoogleApiKey());
  }, []);

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    destructive = false,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingsItemTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement && <View style={styles.settingsItemRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your chat history and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Thank you for using our AI Chat app! Would you like to rate us on the App Store?',
      [
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
        {
          text: 'Rate Now',
          onPress: () => {
            Alert.alert('Thank You!', 'Redirecting to App Store...');
          },
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We\'d love to hear your thoughts! What would you like to tell us?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Email',
          onPress: () => {
            Alert.alert('Thank You!', 'Opening email client...');
          },
        },
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'Need help? Check our FAQ or contact our support team.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'View FAQ',
          onPress: () => {
            Alert.alert('FAQ', 'Opening FAQ page...');
          },
        },
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy & Security',
      'Your privacy is important to us. View our privacy policy and security settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'View Policy',
          onPress: () => {
            Alert.alert('Privacy Policy', 'Opening privacy policy...');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Appearance">
          <SettingsItem
            icon={<Moon size={20} color="#007AFF" />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsItem
            icon={<Bell size={20} color="#FF9500" />}
            title="Push Notifications"
            subtitle="Get notified about new messages and updates"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsItem
            icon={<Smartphone size={20} color="#30D158" />}
            title="Haptic Feedback"
            subtitle="Feel vibrations for interactions"
            rightElement={
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon={<Shield size={20} color="#5856D6" />}
            title="Privacy & Security"
            subtitle="Manage your data and security settings"
            onPress={handlePrivacy}
            rightElement={<ChevronRight size={16} color="#C7C7CC" />}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle size={20} color="#007AFF" />}
            title="Help & Support"
            subtitle="Get help and find answers to your questions"
            onPress={handleHelp}
            rightElement={<ChevronRight size={16} color="#C7C7CC" />}
          />
          <SettingsItem
            icon={<Star size={20} color="#FF9500" />}
            title="Rate Our App"
            subtitle="Share your experience with others"
            onPress={handleRateApp}
            rightElement={<ChevronRight size={16} color="#C7C7CC" />}
          />
          <SettingsItem
            icon={<MessageSquare size={20} color="#30D158" />}
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={handleFeedback}
            rightElement={<ChevronRight size={16} color="#C7C7CC" />}
          />
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsItem
            icon={<Trash2 size={20} color="#FF3B30" />}
            title="Clear All Data"
            subtitle="Delete all conversations and reset settings"
            onPress={handleClearData}
            destructive
            rightElement={<ChevronRight size={16} color="#C7C7CC" />}
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerText}>AI Chat Assistant</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#FFF2F0',
  },
  textContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  destructiveText: {
    color: '#FF3B30',
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 18,
  },
  settingsItemRight: {
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  footerVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});