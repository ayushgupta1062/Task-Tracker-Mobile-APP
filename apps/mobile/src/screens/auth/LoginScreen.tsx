import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, LoginPayload } from '../../types';
import { useLogin } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const loginMutation = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data);
  };

  const errorMessage = loginMutation.isError
    ? ((loginMutation.error as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Login failed. Please try again.')
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          top: -100,
          left: -80,
          backgroundColor: Colors.glowBlue,
          borderRadius: 150,
          opacity: 0.15,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          top: 50,
          left: 100,
          backgroundColor: Colors.glowBlueDark,
          borderRadius: 100,
          opacity: 0.1,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 48,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(0)}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: Colors.primaryGlass,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                alignSelf: 'center',
              }}
            >
              <Text style={{ fontSize: 32 }}>⚡</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(80)}>
            <Text
              style={{
                fontFamily: FontFamily.heading,
                fontSize: 30,
                color: Colors.textPrimary,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Task Tracker
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(140)}>
            <Text
              style={{
                fontFamily: FontFamily.body,
                fontSize: 15,
                color: Colors.textSecondary,
                textAlign: 'center',
                marginBottom: 40,
              }}
            >
              Sign in to manage your tasks
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Email Address"
                  placeholder="you@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={errors.email?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(260)}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  error={errors.password?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(320)} style={{ marginTop: 8 }}>
            <Button
              label="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loginMutation.isPending}
              fullWidth
            />
          </Animated.View>

          {errorMessage && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <ErrorMessage message={errorMessage} />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.duration(500).delay(380)}
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: FontFamily.body, fontSize: 14, color: Colors.textSecondary }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text
                style={{
                  fontFamily: FontFamily.bodyMedium,
                  fontSize: 14,
                  color: Colors.primary,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
