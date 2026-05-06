import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from './ui/GlassCard';
import { Colors } from '../constants/colors';
import { FontFamily } from '../constants/fonts';
import { Task, UpdateTaskPayload } from '../types';
import { formatDate } from '../utils/date';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, payload: UpdateTaskPayload) => void;
  onDelete: (id: string) => void;
  onPress?: () => void;
  isDeletingId: string | null;
  isTogglingId: string | null;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onPress,
  isDeletingId,
  isTogglingId,
}) => {
  const cardScale = useSharedValue(1);
  const checkScale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleToggle = () => {
    checkScale.value = withSpring(0.85, {}, () => {
      checkScale.value = withSpring(1);
    });
    onToggle(task._id, { isCompleted: !task.isCompleted });
  };

  const handleDelete = () => {
    onDelete(task._id);
  };

  const isDeleting = isDeletingId === task._id;

  return (
    <Animated.View entering={SlideInRight.duration(400).springify()} style={[cardAnimStyle, { marginBottom: 12 }]}>
      <Animated.View
        onTouchStart={() => { cardScale.value = withSpring(0.985); }}
        onTouchEnd={() => { cardScale.value = withSpring(1); }}
      >
        <GlassCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
            <Animated.View style={checkAnimStyle}>
              <TouchableOpacity
                onPress={handleToggle}
                disabled={isTogglingId === task._id}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: Colors.primary,
                  backgroundColor: task.isCompleted ? Colors.primaryGlass : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {task.isCompleted && (
                  <Text style={{ color: Colors.white, fontSize: 12, fontWeight: '700' }}>✓</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FontFamily.heading,
                  fontSize: 15,
                  color: Colors.textPrimary,
                  textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                  opacity: task.isCompleted ? 0.5 : 1,
                  marginBottom: 2,
                }}
                numberOfLines={1}
              >
                {task.title}
              </Text>
              {task.description && (
                <Text
                  style={{
                    fontFamily: FontFamily.body,
                    fontSize: 13,
                    color: Colors.textSecondary,
                    marginBottom: 4,
                  }}
                  numberOfLines={2}
                >
                  {task.description}
                </Text>
              )}
              <Text
                style={{
                  fontFamily: FontFamily.body,
                  fontSize: 12,
                  color: Colors.textMuted,
                }}
              >
                {formatDate(task.createdAt)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(239,68,68,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={Colors.danger} />
              ) : (
                <Text style={{ fontSize: 16 }}>🗑️</Text>
              )}
            </TouchableOpacity>
          </View>
        </GlassCard>
      </Animated.View>
    </Animated.View>
  );
};
