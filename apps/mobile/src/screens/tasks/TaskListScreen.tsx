import React, { useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Task } from '../../types';
import { useTasks, useUpdateTask, useDeleteTask } from '../../hooks/useTasks';
import { TaskCard } from '../../components/TaskCard';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';

type Props = NativeStackScreenProps<AppStackParamList, 'TaskList'>;

export const TaskListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { data: tasks, isLoading, isError, refetch, isFetching } = useTasks();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();
  const fabScale = useSharedValue(1);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showToast, setShowToast] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'completed'>('all');

  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const deletingId = deleteMutation.isPending ? (deleteMutation.variables as string) : null;
  const togglingId = updateMutation.isPending ? (updateMutation.variables as { id: string } | undefined)?.id ?? null : null;

  const filteredTasks = tasks?.filter((task) => {
    if (activeTab === 'pending') return !task.isCompleted;
    if (activeTab === 'completed') return task.isCompleted;
    return true;
  }) ?? [];

  const handleToggle = (id: string, payload: { isCompleted: boolean }) => {
    updateMutation.mutate({ id, payload });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    if (route.params?.success) {
      setShowToast(true);
      toastTimeout.current = setTimeout(() => setShowToast(false), 2500);
    }
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [route.params]);

  if (isLoading) return <Loader />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          top: -60,
          left: -60,
          backgroundColor: Colors.glowBlue,
          borderRadius: 125,
          opacity: 0.08,
        }}
      />

      {showToast && (
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: 24,
            right: 24,
            backgroundColor: Colors.success,
            borderRadius: 12,
            padding: 14,
            zIndex: 100,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: Colors.black,
            shadowOpacity: 0.12,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, marginRight: 8 }}>✅</Text>
          <Text style={{ color: Colors.white, fontSize: 14, fontWeight: '600' }}>
            Task created successfully!
          </Text>
        </View>
      )}

      {isError ? (
        <View style={{ padding: 16 }}>
          <ErrorMessage message="Failed to load tasks. Pull down to retry." />
        </View>
      ) : !tasks || tasks.length === 0 ? (
        <EmptyState
          title="Your tasks are empty"
          subtitle="Tap the button below to create your first task and start being productive."
          buttonLabel="Create Task"
          onButtonPress={() => navigation.navigate('CreateTask')}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Segmented Tabs */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: 16,
              padding: 4,
              marginHorizontal: 16,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {(['all', 'pending', 'completed'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'all' ? 'All' : tab === 'pending' ? 'Pending' : 'Completed';
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderRadius: 12,
                    backgroundColor: isActive ? Colors.white : 'transparent',
                    shadowColor: isActive ? Colors.black : 'transparent',
                    shadowOpacity: isActive ? 0.05 : 0,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: isActive ? 2 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isActive ? FontFamily.bodyMedium : FontFamily.body,
                      fontSize: 13,
                      color: isActive ? Colors.primary : Colors.textSecondary,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredTasks.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🎯</Text>
              <Text style={{ fontFamily: FontFamily.heading, fontSize: 16, color: Colors.textPrimary, marginBottom: 4 }}>
                {activeTab === 'pending' ? 'All caught up!' : 'No completed tasks yet'}
              </Text>
              <Text style={{ fontFamily: FontFamily.body, fontSize: 13, color: Colors.textSecondary, textAlign: 'center' }}>
                {activeTab === 'pending'
                  ? "You don't have any pending tasks. Great job!"
                  : 'Tasks you mark as completed will appear here.'}
              </Text>
            </View>
          ) : (
            <FlatList<Task>
              data={filteredTasks}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TaskCard
                  task={item}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onPress={() => navigation.navigate('CreateTask', { task: item })}
                  isDeletingId={deletingId}
                  isTogglingId={togglingId}
                />
              )}
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isFetching}
                  onRefresh={refetch}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                />
              }
            />
          )}
        </View>
      )}

      <Animated.View
        style={[
          fabAnimStyle,
          {
            position: 'absolute',
            bottom: 32,
            right: 24,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateTask')}
          onPressIn={() => { fabScale.value = withSpring(0.9); }}
          onPressOut={() => { fabScale.value = withSpring(1); }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: Colors.primaryGlass,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Colors.primary,
            shadowOpacity: 0.4,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 8,
          }}
        >
          <Text style={{ color: Colors.white, fontSize: 28, fontWeight: '300', lineHeight: 32 }}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
