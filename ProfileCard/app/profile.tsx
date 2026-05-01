import React, { useState, useRef, useContext } from "react";
import {
  Platform,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { ImageBackground } from "expo-image";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ImgButton from "../components/ui/ImgButton";
import CustomModal from "../components/ui/modal";
import ProfileCard from "../components/ui/ProfileCard";
import { userContext } from "@/constants/userContext";

const isWeb = Platform.OS === 'web';

type TabType = 'work' | 'services';

// Mock data - replace with actual data from your context or API
const workData = [
  {
    id: 1,
    title: "Senior React Native Developer",
    company: "TechCorp Inc.",
    duration: "2022 - Present",
    description: "Lead mobile app development team, built 5+ production apps",
    skills: ["React Native", "TypeScript", "Redux", "Firebase"]
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "StartupXYZ",
    duration: "2020 - 2022",
    description: "Developed responsive web applications using React and Vue.js",
    skills: ["React", "Vue.js", "JavaScript", "CSS3"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    duration: "2019 - 2020",
    description: "Created user-centered designs for mobile and web applications",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
  }
];

const servicesData = [
  {
    id: 1,
    title: "Mobile App Development",
    price: "$150/hour",
    description: "Custom React Native apps for iOS and Android",
    features: ["Cross-platform", "Native performance", "API integration", "App store deployment"]
  },
  {
    id: 2,
    title: "UI/UX Design",
    price: "$100/hour",
    description: "User-centered design for web and mobile applications",
    features: ["Wireframing", "Prototyping", "User testing", "Design systems"]
  },
  {
    id: 3,
    title: "Web Development",
    price: "$120/hour",
    description: "Full-stack web applications with modern technologies",
    features: ["React/Next.js", "Node.js", "Database design", "Cloud deployment"]
  }
];

export default function ProfileScreen() {
  const toggleModalRef = useRef<() => void>(() => {});
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('work');
  const { BannerUri } = useContext(userContext);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  toggleModalRef.current = toggleModal;

  const renderWorkTab = () => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.sectionTitle}>Work Experience</Text>
      {workData.map((work) => (
        <View key={work.id} style={styles.workCard}>
          <View style={styles.workHeader}>
            <Text style={styles.workTitle}>{work.title}</Text>
            <Text style={styles.workDuration}>{work.duration}</Text>
          </View>
          <Text style={styles.workCompany}>{work.company}</Text>
          <Text style={styles.workDescription}>{work.description}</Text>
          <View style={styles.skillsContainer}>
            {work.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      
      <Text style={styles.sectionTitle}>Skills & Expertise</Text>
      <View style={styles.skillsGrid}>
        {["React Native", "TypeScript", "UI/UX Design", "Node.js", "Firebase", "GraphQL", "AWS", "Figma"].map((skill, index) => (
          <View key={index} style={styles.expertiseTag}>
            <Text style={styles.expertiseText}>{skill}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderServicesTab = () => (
    <ScrollView 
      style={styles.tabContent} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.sectionTitle}>Services Offered</Text>
      {servicesData.map((service) => (
        <View key={service.id} style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.servicePrice}>{service.price}</Text>
          </View>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          <View style={styles.featuresContainer}>
            {service.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Get Quote</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      <View style={styles.availabilityCard}>
        <Text style={styles.availabilityTitle}>Availability</Text>
        <Text style={styles.availabilityText}>
          Currently accepting new projects. Response time: within 24 hours.
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Preferred Contact:</Text>
          <Text style={styles.contactMethod}>Email • LinkedIn • Phone</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.Container}>
        <View style={styles.banner}>
          <ImageBackground source={BannerUri} style={styles.bannerImg} />
          <ImgButton
            onPress={toggleModal}
            buttonStyle={styles.settingsBtn}
            imageStyle={styles.btnImg}
            imageUri={require("../assets/images/Settings.png")}
          />
        </View>
        <View style={styles.container}>
          <ProfileCard />
          <View style={styles.tabsContainer}>
            {/* Tab Navigation */}
            <View style={styles.tabNavigation}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'work' && styles.activeTab]}
                onPress={() => setActiveTab('work')}
              >
                <Text style={[styles.tabText, activeTab === 'work' && styles.activeTabText]}>
                  Work
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'services' && styles.activeTab]}
                onPress={() => setActiveTab('services')}
              >
                <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
                  Services
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.tabs}>
              {activeTab === 'work' ? renderWorkTab() : renderServicesTab()}
            </View>
          </View>
        </View>
        <CustomModal visible={isModalVisible} onClose={toggleModal} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "grey",
    flex: 1,
  },
  banner: {
    flex: 1,
    position: "relative",
  },
  bannerImg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  settingsBtn: {
    position: "absolute",
    top: 5,
    right: 10,
    width: 20,
    height: 40,
    zIndex: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  btnImg: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: Platform.OS == "web" ? 2 : 3,
    backgroundColor: "#f8f9fa",
  },
  tabsContainer: {
    width: "100%",
    flex: 1,
    bottom: Platform.OS == "web" ? 65 : 45,
    backgroundColor: "#ffffff",
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingHorizontal: isWeb ? 40 : 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabs: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContent: {
    paddingHorizontal: isWeb ? 40 : 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra padding for better scrolling
  },
  sectionTitle: {
    fontSize: isWeb ? 24 : 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  workCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 24 : 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workHeader: {
    flexDirection: isWeb ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isWeb ? 'center' : 'flex-start',
    marginBottom: 8,
  },
  workTitle: {
    fontSize: isWeb ? 20 : 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: isWeb ? 1 : undefined,
  },
  workDuration: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    marginTop: isWeb ? 0 : 4,
  },
  workCompany: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  expertiseTag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  expertiseText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 24 : 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: isWeb ? 20 : 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  servicePrice: {
    fontSize: isWeb ? 18 : 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureBullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  availabilityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: isWeb ? 24 : 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'center' : 'flex-start',
    gap: isWeb ? 8 : 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  contactMethod: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});