import { Platform, View, StyleSheet } from "react-native";
import { ImageBackground } from "expo-image";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ImgButton from "../components/ui/ImgButton";
import { useState, useRef, useContext } from "react";
import CustomModal from "../components/ui/modal";
import ProfileCard from "../components/ui/ProfileCard";
import { userContext } from "@/constants/userContext";

export default function ProfileScreen() {
  const toggleModalRef = useRef<() => void>(() => {});
  const [isModalVisible, setModalVisible] = useState(false);
  const { BannerUri } = useContext(userContext);

  const toggleModal = () => {
    setModalVisible((prev) => !prev);
  };

  toggleModalRef.current = toggleModal;

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
            <View style={styles.tabs}></View>
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
    backgroundColor: "blue",
  },
  tabsContainer: {
    width: "100%",
    height: "100%",
    bottom: Platform.OS == "web" ? 65 : 45,
    backgroundColor: "purple",
  },
  tabs: {},
});