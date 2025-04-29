import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../supabase';

const TaskList = ({ gameId, userId }) => {
  const [tasks, setTasks] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchTasks();
    const subscription = supabase
      .channel('task-updates')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_task_progress' 
      }, () => fetchTasks())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [gameId, userId]);

  const fetchTasks = async () => {
    // Fetch all tasks for the game
    const { data: tasksData, error: tasksError } = await supabase
      .from('game_tasks')
      .select('*')
      .eq('game_id', gameId);

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return;
    }

    // Fetch user's progress
    const { data: progressData, error: progressError } = await supabase
      .from('user_task_progress')
      .select('*')
      .eq('game_id', gameId)
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return;
    }

    // Create a map of task progress
    const progress = {};
    progressData?.forEach(item => {
      progress[item.task_id] = {
        completed: item.completed,
        verified: item.verified
      };
    });

    setTasks(tasksData || []);
    setUserProgress(progress);
  };

  const toggleTaskCompletion = async (taskId) => {
    const currentProgress = userProgress[taskId] || { completed: false, verified: false };
    const newStatus = !currentProgress.completed;

    const { error } = await supabase
      .from('user_task_progress')
      .upsert({
        user_id: userId,
        game_id: gameId,
        task_id: taskId,
        completed: newStatus,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setUserProgress(prev => ({
        ...prev,
        [taskId]: { ...currentProgress, completed: newStatus }
      }));
    }
  };

  const getTaskStatus = (task) => {
    const progress = userProgress[task.id] || { completed: false, verified: false };
    if (progress.verified) return 'verified';
    if (progress.completed) return 'completed';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return { name: 'verified', color: '#4CAF50' };
      case 'completed':
        return { name: 'check-circle', color: '#FFC107' };
      default:
        return { name: 'radio-button-unchecked', color: '#757575' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.taskList}>
        {tasks.map((task) => {
          const status = getTaskStatus(task);
          const icon = getStatusIcon(status);
          
          return (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => toggleTaskCompletion(task.id)}
              disabled={status === 'verified'}
            >
              <View style={styles.taskContent}>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={[styles.taskLocation, styles.smallText]}>
                  📍 {task.location || 'Location not specified'}
                </Text>
              </View>
              <MaterialIcons
                name={icon.name}
                size={24}
                color={icon.color}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <MaterialIcons name="radio-button-unchecked" size={16} color="#757575" />
          <Text style={styles.smallText}>Pending</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialIcons name="check-circle" size={16} color="#FFC107" />
          <Text style={styles.smallText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialIcons name="verified" size={16} color="#4CAF50" />
          <Text style={styles.smallText}>Verified</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  taskContent: {
    flex: 1,
  },
  taskDescription: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 4,
  },
  taskLocation: {
    color: '#757575',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallText: {
    fontSize: 12,
    color: '#757575',
  },
});

export default TaskList; 
