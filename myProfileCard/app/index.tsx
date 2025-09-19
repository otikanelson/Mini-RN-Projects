import { Platform, Text, View, StyleSheet, Button } from "react-native";
import { Image } from 'expo-image';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useContext } from "react";
import { userContext } from "@/constants/userContext";

export default function HomeScreen() {
  const { username, ProfileUri } = useContext(userContext);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.picCont}> 
            <Image 
            style={styles.pic}
            source={ProfileUri}
            />
          </View>
          <View style={styles.greeting}>
            <View style={styles.txtCont}>
              <Text style={styles.txt}> Welcome, {username}</Text>
              <View style={styles.button}> 
                <Link href={"/profile"}>
                  <Text style={styles.btnTxt}>
                    Profile
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  card: {
    width: Platform.OS == "web" ? "40%" : "90%",
    height: Platform.OS == "web" ? "25%" : "20%",
    marginTop: Platform.OS === "web" ? 20 : Platform.OS === "ios" ? 25 : 45,
    marginLeft: 12,
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: "papayawhip",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
  },
  picCont: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    padding: 2,
    margin: 15,
  },
  pic: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  greeting: {
    flex: 1,
  },
  txtCont: {
    width: "auto",
  },
  txt: {
    fontSize: 25,
    fontFamily: "qurovaMedium",
    marginTop: 20,
  },
  button: {
    width: 100,
    height: 40,
    justifyContent: "flex-end",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "red",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    fontSize: 25,
    fontFamily: "qurovaLight",
  },
});