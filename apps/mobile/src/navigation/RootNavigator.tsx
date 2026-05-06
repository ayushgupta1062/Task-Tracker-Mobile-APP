import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { Loader } from '../components/ui/Loader';

export const RootNavigator: React.FC = () => {
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
