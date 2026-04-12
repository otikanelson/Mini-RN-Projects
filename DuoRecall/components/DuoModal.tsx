import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DuoModalButton {
  text: string;
  onPress: () => void;
  style?: 'primary' | 'secondary' | 'destructive';
}

interface DuoModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  buttons: DuoModalButton[];
  onClose?: () => void;
}

const DuoModal: React.FC<DuoModalProps> = ({
  visible,
  title,
  message,
  icon = 'checkmark-circle',
  iconColor = '#58CC02',
  buttons,
  onClose,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return styles.destructiveButton;
      case 'secondary':
        return styles.secondaryButton;
      default:
        return styles.primaryButton;
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'secondary':
        return styles.secondaryButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                <Ionicons name={icon} size={64} color={iconColor} />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              {message && <Text style={styles.message}>{message}</Text>}

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                {buttons.map((button, index) => (
                  <Pressable
                    key={index}
                    style={({ pressed }) => [
                      styles.button,
                      getButtonStyle(button.style),
                      pressed && styles.buttonPressed,
                    ]}
                    onPress={button.onPress}
                  >
                    <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                      {button.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 60,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'FeatherBold',
    color: '#3C3C3C',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontFamily: 'FeatherBold',
    color: '#AFAFAF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  primaryButton: {
    backgroundColor: '#58CC02',
  },
  secondaryButton: {
    backgroundColor: '#F7F7F7',
    borderColor: '#E5E5E5',
  },
  destructiveButton: {
    backgroundColor: '#FF4B4B',
  },
  buttonText: {
    fontSize: 17,
    fontFamily: 'FeatherBold',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#3C3C3C',
  },
});

export default DuoModal;
