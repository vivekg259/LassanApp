import React, { useRef } from 'react';
import { Animated, Platform, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

import { THEME } from '@/constants/theme';

interface NeuButtonProps {
  children?: React.ReactNode;
  size?: number;
  width?: number;
  height?: number;
  onPress?: () => void;
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const NeuButton = ({ children, size = 50, width, height, onPress, rounded = false, style }: NeuButtonProps) => {
  const w = width || size;
  const h = height || size;
  const r = rounded ? w / 2 : 14;

  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8
    }).start();
  };

  const handlePressOut = () => {
    if (onPress) onPress();
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ width: w, height: h }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], width: w, height: h }}>
        <View style={[{
          width: w, height: h,
          borderRadius: r,
          backgroundColor: THEME.bg,
          alignItems: 'center',
          justifyContent: 'center',
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 6, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 10,
              shadowColor: '#5a4a3a',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.5)',
            }
          }),
        }, style]}>
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default NeuButton;
