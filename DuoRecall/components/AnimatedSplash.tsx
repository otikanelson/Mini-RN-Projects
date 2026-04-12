import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.sequence([
      // Slide up
      Animated.timing(translateY, {
        toValue: height * 0.35,
        duration: 600,
        useNativeDriver: true,
      }),
      // Bounce
      Animated.spring(translateY, {
        toValue: height * 0.4,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      // Wait a moment
      Animated.delay(800),
      // Slide down
      Animated.timing(translateY, {
        toValue: -height,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...styles.logoContainer,
          transform: [{ translateY }],
        }}
      >
        <Image
          source={require('@/assets/images/RecallIcon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
