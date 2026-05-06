import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackground = () => {
    if (disabled) return '#C0C0C0';
    switch (variant) {
      case 'primary': return Colors.primaryGlass;
      case 'danger': return Colors.danger;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return Colors.primaryGlass;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return Colors.white;
      case 'danger': return Colors.white;
      case 'outline': return Colors.primary;
      case 'ghost': return Colors.primary;
      default: return Colors.white;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'outline': return Colors.primary;
      default: return 'transparent';
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        {
          backgroundColor: getBackground(),
          borderRadius: 16,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: getBorderColor(),
          paddingVertical: 15,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          width: fullWidth ? '100%' : undefined,
          overflow: 'hidden',
        },
      ]}
    >
      {(variant === 'primary' || variant === 'danger') && !disabled && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.35)',
          }}
        />
      )}
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Text
          style={{
            color: getTextColor(),
            fontFamily: FontFamily.heading,
            fontSize: 15,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
};
