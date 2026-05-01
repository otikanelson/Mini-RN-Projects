import React from "react";
import {TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  title: string;
  onPress: (event: any) => void;
  buttonStyle?: object;
  textStyle?: object;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
