import React from 'react';
import { View, ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 20,
          shadowColor: Colors.black,
          shadowOpacity: 0.06,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
