import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, StatusBar, Dimensions } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function AdminView({ route }) {
  const { gameCode, games, userContext } = route.params;
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, taskId: 1, playerId: 1, playerName: 'Player 1', taskName: 'Task 1', location: 'Location 1', timestamp: '10:30 AM' },
    { id: 2, taskId: 3, playerId: 2, playerName: 'Player 2', taskName: 'Task 3', location: 'Location 3', timestamp: '10:45 AM' }
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [gameStats, setGameStats] = useState({
    totalPlayers: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    gameDuration: '00:00'
  });

  // Find the current game
  const currentGame = games.find(game => game.code === gameCode);

  useEffect(() => {
    if (currentGame) {
      setPlayers(currentGame.players || []);
      setTasks(currentGame.tasks || []);
      updateGameStats();
    }
  }, [currentGame]);

  const updateGameStats = () => {
    if (currentGame) {
      const totalPlayers = currentGame.players?.length || 0;
      const totalTasks = currentGame.tasks?.length || 0;
      const tasksCompleted = currentGame.players?.reduce((acc, player) => 
        acc + (player.completedTasks?.length || 0), 0) || 0;
      
      setGameStats({
        totalPlayers,
        tasksCompleted,
        totalTasks,
        gameDuration: '00:00' // Default duration
      });
    }
  };

  const verifyTask = (taskId, playerId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, verified: true } : task
    );
    setTasks(updatedTasks);
    
    // Update player's completed tasks
    setPlayers(players.map(player => 
      player.id === playerId 
        ? { ...player, tasks_completed: player.tasks_completed + 1 }
        : player
    ));
    
    Alert.alert('Success', 'Task verified successfully');
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }
    const newPlayer = {
      id: players.length + 1,
      name: newPlayerName.trim(),
      role: 'Crewmate',
      tasks_completed: 0,
      status: 'active',
      color: '#4CAF50'
    };
    setPlayers([...players, newPlayer]);
    setGameStats(prev => ({ ...prev, totalPlayers: prev.totalPlayers + 1 }));
    setShowAddPlayerModal(false);
    setNewPlayerName('');
  };

  const removePlayer = (playerId) => {
    Alert.alert(
      'Remove Player',
      'Are you sure you want to remove this player?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPlayers(players.filter(p => p.id !== playerId));
            setGameStats(prev => ({ ...prev, totalPlayers: prev.totalPlayers - 1 }));
          }
        }
      ]
    );
  };

  const endGame = () => {
    Alert.alert(
      'End Game',
      'Are you sure you want to end this game?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: () => {
            // Find and remove the game from the games array
            const gameIndex = games.findIndex(game => game.code === gameCode);
            if (gameIndex !== -1) {
              games.splice(gameIndex, 1);
            }
            
            // Reset user context
            userContext.currentGame = null;
            userContext.role = null;
            
            // Navigate to home screen and close admin view
            navigation.reset({
              index: 0,
              routes: [{ name: 'Tabs', params: { screen: 'Home' } }],
            });
            
            Alert.alert('Success', 'Game ended successfully');
          },
        },
      ]
    );
  };

  const approveTask = (pendingTask) => {
    // Update the task as verified
    setTasks(tasks.map(task => 
      task.id === pendingTask.taskId ? { ...task, verified: true } : task
    ));

    // Update player's completed tasks
    setPlayers(players.map(player => 
      player.id === pendingTask.playerId 
        ? { ...player, tasks_completed: player.tasks_completed + 1 }
        : player
    ));

    // Update game stats
    setGameStats(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
      pendingVerifications: prev.pendingVerifications - 1
    }));

    // Remove from pending tasks
    setPendingTasks(pendingTasks.filter(pt => pt.id !== pendingTask.id));

    Alert.alert('Success', 'Task approved successfully');
  };

  const rejectTask = (pendingTask) => {
    // Update game stats
    setGameStats(prev => ({
      ...prev,
      pendingVerifications: prev.pendingVerifications - 1
    }));

    // Remove from pending tasks
    setPendingTasks(pendingTasks.filter(pt => pt.id !== pendingTask.id));

    Alert.alert('Task Rejected', 'The task verification has been rejected');
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={['#6B46C1', '#805AD5']}
        style={styles.statCard}
      >
        <MaterialIcons name="people" size={24} color="white" />
        <Text style={styles.statValue}>{gameStats.totalPlayers}</Text>
        <Text style={styles.statLabel}>Players</Text>
      </LinearGradient>
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
        style={styles.statCard}
      >
        <MaterialIcons name="task" size={24} color="white" />
        <Text style={styles.statValue}>{gameStats.tasksCompleted}/{gameStats.totalTasks}</Text>
        <Text style={styles.statLabel}>Tasks</Text>
      </LinearGradient>
      <LinearGradient
        colors={['#FF9800', '#FFA726']}
        style={styles.statCard}
      >
        <MaterialIcons name="timer" size={24} color="white" />
        <Text style={styles.statValue}>{gameStats.gameDuration}</Text>
        <Text style={styles.statLabel}>Duration</Text>
      </LinearGradient>
    </View>
  );

  const renderPlayers = () => (
    <View style={styles.playersList}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Players</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddPlayerModal(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {players.map(player => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerItem,
              selectedPlayer?.id === player.id && styles.selectedPlayer,
              player.status === 'inactive' && styles.inactivePlayer
            ]}
            onPress={() => setSelectedPlayer(player)}
          >
            <View style={[styles.playerColorIndicator, { backgroundColor: player.color }]} />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <View style={styles.playerDetails}>
                <View style={styles.roleBadge}>
                  <Text style={styles.playerRole}>{player.role}</Text>
                </View>
                <View style={styles.tasksBadge}>
                  <MaterialIcons name="task" size={16} color="#4CAF50" />
                  <Text style={styles.tasksCompleted}>{player.tasks_completed}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePlayer(player.id)}
            >
              <MaterialIcons name="remove-circle" size={24} color="#f44336" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTasks = () => (
    <View style={styles.tasksList}>
      <Text style={styles.sectionTitle}>Tasks</Text>
      <ScrollView>
        {tasks.map(task => (
          <View key={task.id} style={[
            styles.taskItem,
            task.verified && styles.verifiedTask
          ]}>
            <View style={styles.taskInfo}>
              <Text style={styles.taskName}>{task.name}</Text>
              <View style={styles.taskDetails}>
                <View style={styles.locationBadge}>
                  <MaterialIcons name="location-on" size={16} color="#666" />
                  <Text style={styles.taskLocation}>{task.location}</Text>
                </View>
                <View style={styles.pointsBadge}>
                  <MaterialIcons name="star" size={16} color="#FFC107" />
                  <Text style={styles.taskPoints}>{task.points} pts</Text>
                </View>
              </View>
            </View>
            {selectedPlayer && !task.verified && (
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={() => verifyTask(task.id, selectedPlayer.id)}
              >
                <MaterialIcons name="verified" size={24} color="#4CAF50" />
              </TouchableOpacity>
            )}
            {task.verified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderPendingTasks = () => (
    <View style={styles.pendingTasksList}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pending Verifications</Text>
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingCount}>{gameStats.pendingVerifications}</Text>
        </View>
      </View>
      <ScrollView>
        {pendingTasks.map((pendingTask, index) => (
          <View key={`pending-${pendingTask.id}-${index}`} style={styles.pendingTaskItem}>
            <View style={styles.pendingTaskHeader}>
              <View style={styles.playerInfo}>
                <View style={[styles.playerColorIndicator, { backgroundColor: players.find(p => p.id === pendingTask.playerId)?.color || '#666' }]} />
                <Text style={styles.playerName}>{pendingTask.playerName}</Text>
              </View>
              <Text style={styles.timestamp}>{pendingTask.timestamp}</Text>
            </View>
            <View style={styles.pendingTaskContent}>
              <Text style={styles.taskName}>{pendingTask.taskName}</Text>
              <View style={styles.locationBadge}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.taskLocation}>{pendingTask.location}</Text>
              </View>
            </View>
            <View style={styles.pendingTaskActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => approveTask(pendingTask)}
              >
                <MaterialIcons name="check" size={24} color="white" />
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => rejectTask(pendingTask)}
              >
                <MaterialIcons name="close" size={24} color="white" />
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {pendingTasks.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyStateText}>No pending verifications</Text>
            <Text style={styles.emptyStateSubtext}>All tasks are up to date</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6B46C1', '#805AD5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Game Admin Panel</Text>
          <Text style={styles.gameCode}>Game Code: {gameCode}</Text>
        </View>
      </LinearGradient>

      {renderStats()}

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <MaterialIcons name="pending-actions" size={24} color={activeTab === 'pending' ? '#6B46C1' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'players' && styles.activeTab]}
          onPress={() => setActiveTab('players')}
        >
          <MaterialIcons name="people" size={24} color={activeTab === 'players' ? '#6B46C1' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>Players</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
          onPress={() => setActiveTab('tasks')}
        >
          <MaterialIcons name="task" size={24} color={activeTab === 'tasks' ? '#6B46C1' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>Tasks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'pending' ? renderPendingTasks() : 
         activeTab === 'players' ? renderPlayers() : 
         renderTasks()}
      </View>

      <TouchableOpacity style={styles.endGameButton} onPress={endGame}>
        <LinearGradient
          colors={['#f44336', '#e53935']}
          style={styles.endGameGradient}
        >
          <MaterialIcons name="stop-circle" size={24} color="white" />
          <Text style={styles.endGameText}>End Game</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showAddPlayerModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Player</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter player name"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              placeholderTextColor="#999"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddPlayerModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addPlayer}
              >
                <Text style={styles.modalButtonText}>Add Player</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  gameCode: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F3E8FF',
  },
  tabText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#6B46C1',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6B46C1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playerItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  playerColorIndicator: {
    width: 8,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  selectedPlayer: {
    borderColor: '#6B46C1',
    borderWidth: 2,
  },
  inactivePlayer: {
    opacity: 0.5,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  playerDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  roleBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  tasksBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  playerRole: {
    fontSize: 12,
    color: '#6B46C1',
    fontWeight: '500',
  },
  tasksCompleted: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 10,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  verifiedTask: {
    backgroundColor: '#E8F5E9',
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDetails: {
    flexDirection: 'row',
    marginTop: 5,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  taskPoints: {
    fontSize: 12,
    color: '#FFA000',
    marginLeft: 4,
    fontWeight: '500',
  },
  verifyButton: {
    padding: 5,
  },
  verifiedBadge: {
    padding: 5,
  },
  endGameButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  endGameGradient: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endGameText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pendingTasksList: {
    flex: 1,
  },
  pendingBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingCount: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pendingTaskItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pendingTaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pendingTaskContent: {
    marginBottom: 10,
  },
  pendingTaskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
}); 