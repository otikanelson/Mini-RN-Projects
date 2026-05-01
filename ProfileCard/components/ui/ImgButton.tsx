import React from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

interface ButtonProps {
  onPress: (event: any) => void;
  buttonStyle?: object;
  imageStyle?: object;
  imageUri: object;
}

const ImgButton: React.FC<ButtonProps> = ({
  onPress,
  buttonStyle,
  imageStyle,
  imageUri
}) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Image source={ imageUri } style={imageStyle} />
    </TouchableOpacity>
  );
};

export default ImgButton;
