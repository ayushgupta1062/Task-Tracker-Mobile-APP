import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonLabel?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: Colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 40,
            color: Colors.primary,
          }}
        >
          ✓
        </Text>
      </View>
      <Text
        style={{
          fontFamily: FontFamily.heading,
          fontSize: 20,
          color: Colors.textPrimary,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: FontFamily.body,
          fontSize: 15,
          color: Colors.textSecondary,
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: 32,
        }}
      >
        {subtitle}
      </Text>
      {buttonLabel && onButtonPress && (
        <Button label={buttonLabel} onPress={onButtonPress} variant="primary" />
      )}
    </Animated.View>
  );
};
