import React from 'react';
import { TouchableOpacity, Image, StyleSheet, DimensionValue } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  size?: DimensionValue;
  color?: string; 
}

const Button: React.FC<ButtonProps> = ({ 
  onPress, 
  size = 50, 
  color = '#59c903ff',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          width: size, 
          height: size, 
          borderRadius: typeof size === 'number' ? size / 2 : 999,
          backgroundColor: color,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <Image
        source={require("../../assets/images/plus.png")}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: '50%',
    height: '50%',
  },
});

export default Button;