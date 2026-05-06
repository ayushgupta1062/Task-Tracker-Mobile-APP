import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, CreateTaskPayload } from '../../types';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/colors';
import { FontFamily } from '../../constants/fonts';
import { AxiosError } from 'axios';

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;
type Props = NativeStackScreenProps<AppStackParamList, 'CreateTask'>;

export const CreateTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const taskToEdit = route.params?.task;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: taskToEdit?.title ?? '',
      description: taskToEdit?.description ?? '',
    },
  });

  React.useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description ?? '',
      });
    }
  }, [taskToEdit, reset]);

  const titleValue = watch('title');

  const onSubmit = (data: CreateTaskPayload) => {
    if (taskToEdit) {
      updateMutation.mutate(
        {
          id: taskToEdit._id,
          payload: { title: data.title, description: data.description || '' },
        },
        {
          onSuccess: () => {
            navigation.navigate('TaskList', { success: true });
          },
        }
      );
    } else {
      createMutation.mutate(
        { title: data.title, description: data.description || undefined },
        {
          onSuccess: () => {
            navigation.navigate('TaskList', { success: true });
          },
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isError = createMutation.isError || updateMutation.isError;
  const errorObj = createMutation.error || updateMutation.error;

  const errorMessage = isError
    ? ((errorObj as AxiosError<{ message: string }>)?.response?.data?.message ?? 'Failed to save task.')
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          top: -50,
          right: -50,
          backgroundColor: Colors.glowBlue,
          borderRadius: 100,
          opacity: 0.07,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400).delay(0)}>
            <Text
              style={{
                fontFamily: FontFamily.heading,
                fontSize: 22,
                color: Colors.textPrimary,
                marginBottom: 28,
              }}
            >
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(80)}>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.title?.message}
                  maxLength={200}
                />
              )}
            />
            <Text
              style={{
                fontFamily: FontFamily.body,
                fontSize: 12,
                color: Colors.textMuted,
                textAlign: 'right',
                marginTop: -12,
                marginBottom: 16,
              }}
            >
              {titleValue?.length ?? 0}/200
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(160)}>
            <Text
              style={{
                fontFamily: FontFamily.bodyMedium,
                fontSize: 14,
                color: Colors.textSecondary,
                marginBottom: 8,
              }}
            >
              Description (optional)
            </Text>
            <GlassCard style={{ overflow: 'visible', borderRadius: 20, marginBottom: 24 }}>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    placeholder="Add more details about this task..."
                    placeholderTextColor={Colors.textMuted}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    textAlignVertical="top"
                    maxLength={1000}
                    style={{
                      height: 120,
                      padding: 16,
                      fontFamily: FontFamily.body,
                      fontSize: 15,
                      color: Colors.textPrimary,
                    }}
                  />
                )}
              />
            </GlassCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(240)}>
            <Button
              label={taskToEdit ? 'Update Task' : 'Create Task'}
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              fullWidth
            />
          </Animated.View>

          {errorMessage && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <ErrorMessage message={errorMessage} />
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
