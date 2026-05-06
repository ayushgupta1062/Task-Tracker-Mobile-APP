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
import { AuthStackParamList, SignupPayload } from '../../types';
import { useSignup } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { AxiosError } from 'axios';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((v) => /[A-Z]/.test(v), 'Must contain at least one uppercase letter')
    .refine((v) => /[0-9]/.test(v), 'Must contain at least one number')
    .refine((v) => /[^A-Za-z0-9]/.test(v), 'Must contain at least one special character'),
});

type SignupForm = z.infer<typeof signupSchema>;
type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const signupMutation = useSignup();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupPayload) => {
    signupMutation.mutate(data);
  };

  const errorMessage = signupMutation.isError
    ? ((signupMutation.error as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Sign up failed. Please try again.')
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
          opacity: 0.12,
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
          opacity: 0.08,
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
                fontSize: 28,
                color: Colors.textPrimary,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(140)}>
            <Text
              style={{
                fontFamily: FontFamily.body,
                fontSize: 15,
                color: Colors.textSecondary,
                textAlign: 'center',
                marginBottom: 36,
              }}
            >
              Start organizing your day
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.name?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(260)}>
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
                  error={errors.email?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(320)}>
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
                  error={errors.password?.message}
                />
              )}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(380)} style={{ marginTop: 8 }}>
            <Button
              label="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={signupMutation.isPending}
              fullWidth
            />
          </Animated.View>

          {errorMessage && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <ErrorMessage message={errorMessage} />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.duration(500).delay(440)}
            style={{
              marginTop: 24,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: FontFamily.body, fontSize: 14, color: Colors.textSecondary }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  fontFamily: FontFamily.bodyMedium,
                  fontSize: 14,
                  color: Colors.primary,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
