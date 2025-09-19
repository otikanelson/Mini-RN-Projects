import React, { useState } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

interface toggleButtonProps {
  onPress: (event: any) => void;
  onClick: (event: any) => void;
  buttonStyle?: object;
  imageStyle?: object;
  imageUri: object;
  newImageUri: object;
  visible?: boolean;
}

const ImgButton: React.FC<toggleButtonProps> = ({
  onPress,
  onClick,
  buttonStyle,
  imageStyle,
  imageUri,
  newImageUri,
}) => {
  const [image, setImage] = useState<object>(imageUri);
  const toggleImage = () => {
    setImage(newImageUri);
  }
  const handlePress = (event: any) => {
    onPress && onPress(toggleImage);
    onClick && onClick(event);
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={handlePress}>
      <Image source={ imageUri } style={imageStyle} />
    </TouchableOpacity>
  );
};

export default ImgButton;
