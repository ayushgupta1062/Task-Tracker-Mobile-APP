import React from 'react';
import { TouchableOpacity, Text, View, Modal, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { TaskListScreen } from '../screens/tasks/TaskListScreen';
import { CreateTaskScreen } from '../screens/tasks/CreateTaskScreen';
import { Colors } from '../constants/colors';
import { FontFamily } from '../constants/fonts';
import { useLogout } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const logout = useLogout();
  const { user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: FontFamily.heading,
          fontSize: 18,
          color: Colors.textPrimary,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          headerTitle: () => (
            <Text
              style={{
                fontFamily: FontFamily.heading,
                fontSize: 20,
                color: Colors.textPrimary,
              }}
            >
              My Tasks
            </Text>
          ),
          headerRight: () => {
            const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
            return (
              <>
                <TouchableOpacity
                  onPress={() => setIsProfileOpen(true)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: Colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: Colors.primary,
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontFamily: FontFamily.heading, fontSize: 14, color: Colors.white }}>
                    {firstLetter}
                  </Text>
                </TouchableOpacity>

                <Modal
                  visible={isProfileOpen}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setIsProfileOpen(false)}
                >
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setIsProfileOpen(false)}
                  >
                    <Pressable
                      style={{
                        width: 280,
                        backgroundColor: Colors.white,
                        borderRadius: 24,
                        padding: 24,
                        alignItems: 'center',
                        shadowColor: Colors.black,
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 5,
                      }}
                    >
                      {/* User Avatar Big */}
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <Text style={{ fontFamily: FontFamily.heading, fontSize: 24, color: Colors.primary }}>
                          {firstLetter}
                        </Text>
                      </View>

                      {/* Name */}
                      <Text
                        style={{
                          fontFamily: FontFamily.heading,
                          fontSize: 18,
                          color: Colors.textPrimary,
                          marginBottom: 4,
                        }}
                      >
                        {user?.name ?? 'User Name'}
                      </Text>

                      {/* Email */}
                      <Text
                        style={{
                          fontFamily: FontFamily.body,
                          fontSize: 14,
                          color: Colors.textSecondary,
                          marginBottom: 24,
                        }}
                      >
                        {user?.email ?? 'user@example.com'}
                      </Text>

                      <View
                        style={{
                          width: '100%',
                          height: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.06)',
                          marginBottom: 20,
                        }}
                      />

                      {/* Logout Button */}
                      <TouchableOpacity
                        onPress={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          paddingVertical: 12,
                          borderRadius: 16,
                          backgroundColor: 'rgba(239, 68, 68, 0.08)',
                          borderWidth: 1,
                          borderColor: 'rgba(239, 68, 68, 0.15)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontFamily: FontFamily.bodyMedium, fontSize: 14, color: Colors.danger }}>
                          Logout
                        </Text>
                      </TouchableOpacity>
                    </Pressable>
                  </Pressable>
                </Modal>
              </>
            );
          },
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={({ route }) => ({
          headerTitle: () => (
            <Text
              style={{
                fontFamily: FontFamily.heading,
                fontSize: 18,
                color: Colors.textPrimary,
              }}
            >
              {route.params?.task ? 'Edit Task' : 'New Task'}
            </Text>
          ),
          headerBackTitle: '',
          headerTintColor: Colors.primary,
        })}
      />
    </Stack.Navigator>
  );
};
