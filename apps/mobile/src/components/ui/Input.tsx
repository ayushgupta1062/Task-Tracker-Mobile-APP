import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { GlassCard } from './GlassCard';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderAnim.value === 1
      ? Colors.primary
      : error
        ? Colors.danger
        : Colors.border,
    borderWidth: borderAnim.value === 1 ? 1.5 : 1,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderAnim.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderAnim.value = withTiming(0, { duration: 200 });
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: FontFamily.bodyMedium,
          fontSize: 14,
          color: Colors.textSecondary,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <Animated.View
        style={[
          animatedStyle,
          {
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: Colors.white,
            shadowColor: Colors.black,
            shadowOpacity: isFocused ? 0.08 : 0.04,
            shadowRadius: isFocused ? 12 : 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: isFocused ? 3 : 1,
          },
        ]}
      >
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.textMuted}
          style={[
            {
              height: 52,
              paddingHorizontal: 16,
              fontFamily: FontFamily.body,
              fontSize: 15,
              color: Colors.textPrimary,
            },
            style,
          ]}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text
          style={{
            fontFamily: FontFamily.body,
            fontSize: 12,
            color: Colors.danger,
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
