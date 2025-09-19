import React, { useContext, useState } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { userContext } from "@/constants/userContext";

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Mock data for dashboard sections
const quickStats = [
  { label: "Projects", value: "12", icon: "📁" },
  { label: "Followers", value: "1.2K", icon: "👥" },
  { label: "Reviews", value: "4.8", icon: "⭐" },
  { label: "Completed", value: "98%", icon: "✅" },
];

const recentActivities = [
  {
    id: 1,
    title: "New project inquiry",
    description: "Mobile app development for startup",
    time: "2 hours ago",
    type: "inquiry",
  },
  {
    id: 2,
    title: "Review received",
    description: "5-star review from TechCorp Inc.",
    time: "1 day ago",
    type: "review",
  },
  {
    id: 3,
    title: "Project completed",
    description: "E-commerce website for local business",
    time: "3 days ago",
    type: "completion",
  },
];

const quickActions = [
  { title: "View Profile", route: "/profile", icon: "👤", color: "#007AFF" },
  { title: "Edit Services", route: "/services", icon: "⚙️", color: "#28a745" },
  { title: "Messages", route: "/messages", icon: "💬", color: "#6f42c1" },
  { title: "Analytics", route: "/analytics", icon: "📊", color: "#fd7e14" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Client Meeting",
    description: "Discuss project requirements with new client",
    time: "Today, 2:00 PM",
    priority: "high",
  },
  {
    id: 2,
    title: "Project Deadline",
    description: "Final delivery for React Native app",
    time: "Tomorrow, 5:00 PM",
    priority: "high",
  },
  {
    id: 3,
    title: "Team Standup",
    description: "Weekly progress meeting",
    time: "Friday, 10:00 AM",
    priority: "medium",
  },
];

export default function HomeScreen() {
  const { username, ProfileUri, description } = useContext(userContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return '📧';
      case 'review': return '⭐';
      case 'completion': return '✅';
      default: return '📌';
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.userSection}>
                <Link href="/profile" asChild>
                  <TouchableOpacity style={styles.profileButton}>
                    <View style={styles.profileImageContainer}>
                      <Image source={ProfileUri} style={styles.profileImage} contentFit="cover" />
                      <View style={styles.onlineIndicator} />
                    </View>
                  </TouchableOpacity>
                </Link>
                
                <View style={styles.userInfo}>
                  <Text style={styles.greeting}>{getGreeting()},</Text>
                  <Text style={styles.username}>{username}</Text>
                  <Text style={styles.date}>{formatDate()}</Text>
                </View>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notificationButton}>
                  <Text style={styles.notificationIcon}>🔔</Text>
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          {/* Upcoming Events */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.eventsContainer}>
              {upcomingEvents.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(event.priority) }]} />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Activities */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activitiesContainer}>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Performance Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Overview</Text>
            <View style={styles.overviewCard}>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>8</Text>
                  <Text style={styles.overviewLabel}>New Inquiries</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>3</Text>
                  <Text style={styles.overviewLabel}>Projects Started</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>2</Text>
                  <Text style={styles.overviewLabel}>Completed</Text>
                </View>
              </View>
              <View style={styles.progressSection}>
                <Text style={styles.progressTitle}>Weekly Goals Progress</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '75%' }]} />
                </View>
                <Text style={styles.progressText}>75% completed</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: isWeb ? 40 : 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: isWeb ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: isWeb ? 70 : 60,
    height: isWeb ? 70 : 60,
    borderRadius: isWeb ? 35 : 30,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#28a745',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: isWeb ? 18 : 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  username: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 2,
  },
  date: {
    fontSize: isWeb ? 16 : 14,
    color: '#6c757d',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
  },
  profileButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 10,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: isWeb ? 40 : 20,
    paddingVertical: 20,
    maxWidth: isWeb ? 1200 : '100%',
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isWeb ? 24 : 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isWeb ? 20 : 12,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 24 : 20,
    alignItems: 'center',
    flex: isWeb ? 0 : 1,
    minWidth: isWeb ? 200 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: isWeb ? 32 : 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isWeb ? 16 : 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 20 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: isWeb ? 1 : undefined,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionTitle: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  eventsContainer: {
    gap: 12,
    marginTop: 16,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 20 : 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: isWeb ? 16 : 14,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventTime: {
    fontSize: isWeb ? 14 : 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  activitiesContainer: {
    gap: 12,
    marginTop: 16,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 20 : 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: isWeb ? 16 : 14,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: isWeb ? 14 : 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 24 : 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: isWeb ? 32 : 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: isWeb ? 16 : 14,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  progressSection: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 20,
  },
  progressTitle: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  progressText: {
    fontSize: isWeb ? 16 : 14,
    color: '#6c757d',
    fontWeight: '500',
  },
});