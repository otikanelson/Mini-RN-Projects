import React, { useContext, useState, useEffect } from "react";
import { Modal, View, TextInput, Button, StyleSheet, Platform, Alert, Text, TouchableOpacity } from "react-native";
import ImgButton from "./ImgButton"; 
import { userContext } from "@/constants/userContext"; 
import { Image, ImageBackground } from "expo-image"; 
import * as ImagePicker from 'expo-image-picker'; 

type ImageUriType = number | string;

const pickImage = async (setImageUri: React.Dispatch<React.SetStateAction<ImageUriType>>) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
    }
};

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
};

function CustomModal({ visible, onClose }: CustomModalProps) {
  const {
    username: initialUsername,
    description: initialDescription,
    Bio: initialBio,
    ProfileUri: initialProfileUri,
    BannerUri: initialBannerUri,
    setUser,
  } = useContext(userContext);

  const [username, setUsername] = useState(initialUsername || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [bio, setBio] = useState(initialBio || "");
  
  // Local state for image URIs so they can be changed before saving
  const [profileUri, setProfileUri] = useState(initialProfileUri);
  const [bannerUri, setBannerUri] = useState(initialBannerUri);


  useEffect(() => {
    if (visible) {
      // Reset text inputs to initial context values
      setUsername(initialUsername || "");
      setDescription(initialDescription || "");
      setBio(initialBio || "");
      // Reset image URIs to initial context values
      setProfileUri(initialProfileUri);
      setBannerUri(initialBannerUri);
    }
  }, [visible, initialUsername, initialDescription, initialBio, initialProfileUri, initialBannerUri]);


  const handleSave = () => {
    const trimmedUsername = username.trim();
    const trimmedDescription = description.trim();
    const trimmedBio = bio.trim();

    if (!trimmedUsername || !trimmedDescription || !trimmedBio) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setUser({
      username: trimmedUsername,
      description: trimmedDescription,
      Bio: trimmedBio,
      // Pass the potentially new local URIs back to context
      ProfileUri: profileUri, 
      BannerUri: bannerUri,
    });
    
    Alert.alert("Success", "Profile updated successfully!");
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modalView}>
          
          <View style={styles.header}>
            <ImgButton
              buttonStyle={styles.closeBtn}
              imageStyle={styles.closeBtnImg}
              imageUri={require("../../assets/images/left.png")}
              onPress={onClose}
            />
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <Button title="Save" onPress={handleSave} color="#007AFF" /> 
          </View>
          
          <View style={styles.formCont}>
            
            {/* Banner Editor */}
            <View style={styles.bannerEditContainer}>
              <ImageBackground 
                source={bannerUri} 
                style={styles.bannerPreview}
                contentFit="cover"
              />
              <TouchableOpacity style={styles.bannerOverlay} onPress={() => pickImage(setBannerUri)}>
                <Image
                  source={require("../../assets/images/camera.png")}
                  style={styles.bannerCameraIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Profile Image Row */}
            <View style={styles.profileRow}>
              <TouchableOpacity style={styles.profileImageContainer} onPress={() => pickImage(setProfileUri)}>
                <Image
                  source={profileUri}
                  style={styles.profileImg}
                  contentFit="cover"
                />
                <Image
                  source={require("../../assets/images/camera.png")}
                  style={styles.cameraIcon}
                />
              </TouchableOpacity>
              
              <View style={styles.nameInputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  maxLength={50}
                />
              </View>
            </View>

            {/* Description/Title Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description / Title</Text>
                <TextInput
                    style={styles.textInput}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="e.g., Software Developer"
                    maxLength={100}
                />
            </View>

            {/* Bio Input */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    textAlignVertical="top"
                />
            </View>
                        
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // ... (Your existing styles for container, modalView, header, closeBtn, etc.)
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Platform.OS === "web" ? 110 : 20, 
    paddingVertical: Platform.OS === "web" ? 90 : 80, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: Platform.OS === "web" ? 600 : "100%",
    height: Platform.OS === "web" ? 550 : "95%", // Increased height to fit banner
    maxHeight: 550,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: { padding: 5, },
  closeBtnImg: { width: 20, height: 20, tintColor: '#333', },
  
  formCont: {
    flex: 1,
    paddingTop: 10,
    gap: 15,
  },
  
  // --- New Banner Styles ---
  bannerEditContainer: {
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ccc',
  },
  bannerPreview: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerCameraIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  // --- End New Banner Styles ---

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'white',
    padding: 2,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  
  nameInputContainer: { flex: 1, },
  inputGroup: { },
  
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  
  multilineInput: {
    height: 100, // Slightly reduced for modal fit
    paddingTop: 10,
  },
});

export default CustomModal;