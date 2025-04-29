import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Tasks = ({ gameId, userId, isAdmin }) => {
  const [tasks, setTasks] = useState([
    { id: 1, description: 'Find the hidden key', verified: false },
    { id: 2, description: 'Solve the puzzle', verified: false },
    { id: 3, description: 'Complete the maze', verified: false },
  ]);
  const [userProgress, setUserProgress] = useState({});

  const toggleTaskCompletion = (taskId) => {
    if (isAdmin) {
      // Admin verifying task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, verified: true } : task
        )
      );
    } else {
      // User marking personal progress
      setUserProgress(prev => ({
        ...prev,
        [taskId]: !prev[taskId]
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isAdmin ? 'Task Verification' : 'My Tasks'}</Text>
      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskItem}
            onPress={() => toggleTaskCompletion(task.id)}
          >
            <Text style={styles.taskText}>{task.description}</Text>
            <View style={styles.statusContainer}>
              {isAdmin ? (
                <MaterialIcons
                  name={task.verified ? "verified" : "pending"}
                  size={24}
                  color={task.verified ? "#4CAF50" : "#FFC107"}
                />
              ) : (
                <MaterialIcons
                  name={userProgress[task.id] ? "check-circle" : "radio-button-unchecked"}
                  size={24}
                  color={userProgress[task.id] ? "#4CAF50" : "#757575"}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
  statusContainer: {
    marginLeft: 10,
  },
});

export default Tasks;
