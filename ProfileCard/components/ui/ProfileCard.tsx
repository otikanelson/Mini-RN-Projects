import React, { useContext, useState } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Button from "./button";
import ImgButton from "./ImgButton";
import { userContext } from "@/constants/userContext";

export default function ProfileCard() {
  const { username, description, Bio, ProfileUri } = useContext(userContext);
  const [isVisible, setVisible] = useState(true);

  const toggleDescr = () => {
    setVisible(!isVisible);
  };

  return (
    <View style={styles.profileCard}>
      <View style={styles.Cont}>
        <View style={styles.profileImgCont}>
          <Image source={ProfileUri} style={styles.img} />
        </View>
        <View style={styles.details}>
          <View style={styles.btnsCont}>
            <Button
              title="Follow"
              onPress={toggleDescr}
              buttonStyle={styles.Btn}
              textStyle={styles.btnTxt}
            />
            <Button
              title="Like"
              onPress={toggleDescr}
              buttonStyle={styles.Btn}
              textStyle={styles.btnTxt}
            />
            <ImgButton
              onPress={toggleDescr}
              buttonStyle={[styles.tgBtn, { marginLeft: 0 }]}
              imageStyle={styles.tgBtnImg}
              imageUri={
                isVisible
                  ? require("../../assets/images/down.png")
                  : require("../../assets/images/right.png")
              }
            />
          </View>
          <View style={styles.descrCont}>
            <Text
              style={[
                styles.descrTxt,
                { fontSize: Platform.OS == "web" ? 25 : 20 },
              ]}
            >
              {description}
            </Text>
            {isVisible && <Text style={styles.descrTxt}>{Bio}</Text>}
          </View>
        </View>
      </View>
      <Text style={styles.name}>{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: Platform.OS == "web" ? "40%" : "95%",
    height: Platform.OS == "web" ? "40%" : "32%",
    zIndex: 2,
    bottom: Platform.OS == "web" ? 70 : 50,
    display: "flex",
    marginLeft: 10,
    padding: 5,
    flexDirection: "column",
  },
  Cont: {
    flex: 1,
    zIndex: 2,
    height: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  profileImgCont: {
    width: 130,
    height: "100%",
    borderRadius: 120,
    borderWidth: 3,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 80,
  },
  details: {
    flex: 1,
    height: "100%",
    marginLeft: 5,
  },
  btnsCont: {
    width: "auto",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 5,
  },
  Btn: {
    width: "auto",
    height: "auto",
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 2,
    backgroundColor: "white",
  },
  btnTxt: {
    width: "auto",
    height: "auto",
    fontSize: 16,
    fontFamily: "qurovaMedium",
    alignSelf: "center",
    justifyContent: "center",
  },
  tgBtn: {
    width: "auto",
    height: "auto",
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginLeft: 5,
  },
  tgBtnImg: {
    width: 20,
    height: 20,
  },
  descrCont: {},
  descrTxt: {
    width: Platform.OS == "web" ? 300 : 200,
    height: "auto",
    fontSize: Platform.OS == "web" ? 15 : 13,
    marginLeft: 5,
    fontFamily: "qurovaMedium",
    padding: 2,
    alignSelf: Platform.OS == "web" ? "auto" : "center",
  },
  name: {
    width: "auto",
    height: "auto",
    fontSize: 20,
    fontFamily: "qurovaBold",
    alignItems: "center",
    marginLeft: 6,
  },
});
