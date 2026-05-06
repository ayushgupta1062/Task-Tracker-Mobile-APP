import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';

type Props = NativeStackScreenProps<AuthStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  // Pomodoro Focus Timer State (25 minutes default)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 25 * 60; // Reset to 25m
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Glow Circles */}
      <View
        style={{
          position: 'absolute',
          width: 350,
          height: 350,
          top: -100,
          left: -100,
          backgroundColor: Colors.glowBlue,
          borderRadius: 175,
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          bottom: -50,
          right: -50,
          backgroundColor: Colors.glowBlueDark,
          borderRadius: 125,
          opacity: 0.08,
        }}
      />

      {/* Top Header Row */}
      <Animated.View
        entering={FadeInUp.duration(600)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 56,
          paddingBottom: 20,
          zIndex: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: Colors.primaryGlass,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 16 }}>⚡</Text>
          </View>
          <Text
            style={{
              fontFamily: FontFamily.heading,
              fontSize: 18,
              color: Colors.textPrimary,
            }}
          >
            HRX Studio
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: 'transparent',
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.bodyMedium,
                fontSize: 14,
                color: Colors.textPrimary,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: Colors.primary,
              shadowColor: Colors.primary,
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.bodyMedium,
                fontSize: 14,
                color: Colors.white,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Hero Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontFamily: FontFamily.heading,
              fontSize: 34,
              lineHeight: 42,
              color: Colors.textPrimary,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Master Your Day,{'\n'}
            <Text style={{ color: Colors.primary }}>Elevate Productivity</Text>
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.body,
              fontSize: 15,
              lineHeight: 22,
              color: Colors.textSecondary,
              textAlign: 'center',
              paddingHorizontal: 16,
            }}
          >
            Welcome to HRX Studio Task Tracker. Seamlessly manage tasks, track progress, and stay focused with our integrated productivity tools.
          </Text>
        </Animated.View>

        {/* Interactive Pomodoro Timer Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(250)} style={{ marginBottom: 36 }}>
          <GlassCard style={{ padding: 24, alignItems: 'center' }}>
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 16,
                backgroundColor: isRunning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.bodyMedium,
                  fontSize: 11,
                  color: isRunning ? Colors.danger : Colors.primary,
                  textTransform: 'uppercase',
                }}
              >
                {isRunning ? '• Focusing' : 'Focus Timer'}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: FontFamily.heading,
                fontSize: 48,
                color: Colors.textPrimary,
                letterSpacing: 2,
                marginVertical: 16,
              }}
            >
              {formatTimer(timeLeft)}
            </Text>

            <View style={{ flexDirection: 'row', gap: 16, marginTop: 4 }}>
              <TouchableOpacity
                onPress={handleStartStop}
                style={{
                  backgroundColor: isRunning ? 'rgba(239, 68, 68, 0.1)' : Colors.primaryGlass,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isRunning ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)',
                  minWidth: 100,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.bodyMedium,
                    fontSize: 14,
                    color: isRunning ? Colors.danger : Colors.primary,
                  }}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReset}
                style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.08)',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                  minWidth: 100,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.bodyMedium,
                    fontSize: 14,
                    color: Colors.textSecondary,
                  }}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontFamily: FontFamily.body,
                fontSize: 12,
                color: Colors.textMuted,
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              Use the built-in focus timer to work in intervals and stay productive!
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Features/Details */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ marginBottom: 40 }}>
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18 }}>🎯</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FontFamily.bodyMedium,
                    fontSize: 15,
                    color: Colors.textPrimary,
                  }}
                >
                  Task Organization
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.body,
                    fontSize: 13,
                    color: Colors.textSecondary,
                  }}
                >
                  Create, edit, complete, and delete your tasks effortlessly.
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18 }}>📈</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: FontFamily.bodyMedium,
                    fontSize: 15,
                    color: Colors.textPrimary,
                  }}
                >
                  Interactive UI
                </Text>
                <Text
                  style={{
                    fontFamily: FontFamily.body,
                    fontSize: 13,
                    color: Colors.textSecondary,
                  }}
                >
                  A glassmorphism-based premium UI with fluid animations.
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Primary CTA button */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 24,
              paddingVertical: 16,
              alignItems: 'center',
              shadowColor: Colors.primary,
              shadowOpacity: 0.4,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.bodyMedium,
                fontSize: 16,
                color: Colors.white,
                fontWeight: '600',
              }}
            >
              Get Started for Free
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
