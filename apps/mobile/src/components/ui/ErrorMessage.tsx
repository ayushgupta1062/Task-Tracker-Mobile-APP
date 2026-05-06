import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <View
      style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
      }}
    >
      <Text style={{ fontSize: 16, marginRight: 8 }}>⚠️</Text>
      <Text
        style={{
          fontFamily: FontFamily.body,
          fontSize: 14,
          color: Colors.danger,
          flex: 1,
        }}
      >
        {message}
      </Text>
    </View>
  );
};
