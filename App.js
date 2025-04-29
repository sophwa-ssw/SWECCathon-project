import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Map from './Map';
import AdminView from './components/AdminView';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Mock data store
const games = [];
const userContext = {
  currentGame: null,
  name: null,
  role: null
};

function RoleScreen({ route, navigation }) {
  const { role, gameCode } = route.params;
  const isAdmin = role === 'Administrator';

  return (
    <SafeAreaView style={styles.roleContainer}>
      <ScrollView contentContainerStyle={styles.roleScrollContent}>
        <View style={styles.roleHeader}>
          <Text style={styles.roleTitle}>Welcome, {userContext.name}!</Text>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.gameInfoSection}>
            <Text style={styles.gameCode}>Game Code: {gameCode}</Text>
            <Text style={styles.roleText}>You are: {role}</Text>
            
            {isAdmin && (
              <View style={styles.adminInfoSection}>
                <Text style={styles.adminInfoTitle}>As Administrator, you can:</Text>
                <View style={styles.adminInfoItem}>
                  <View style={styles.infoIconContainer}>
                    <MaterialIcons name="verified" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.adminInfoText}>Verify player tasks</Text>
                </View>
                <View style={styles.adminInfoItem}>
                  <View style={styles.infoIconContainer}>
                    <MaterialIcons name="group" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.adminInfoText}>Manage players</Text>
                </View>
                <View style={styles.adminInfoItem}>
                  <View style={styles.infoIconContainer}>
                    <MaterialIcons name="settings" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.adminInfoText}>Control game settings</Text>
                </View>
              </View>
            )}
          </View>

          {isAdmin && (
            <View style={styles.shareSection}>
              <Text style={styles.shareTitle}>Share Game Code</Text>
              <View style={styles.shareCodeBox}>
                <Text style={styles.shareCodeText}>{gameCode}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={async () => {
                    await Clipboard.setStringAsync(gameCode);
                    Alert.alert('Copied!', 'Game code copied to clipboard');
                  }}
                >
                  <MaterialIcons name="content-copy" size={24} color="#6B46C1" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.proceedButton, isAdmin && styles.adminProceedButton]}
            onPress={() => {
              if (isAdmin) {
                navigation.navigate('Tabs', { 
                  screen: 'AdminView',
                  params: { role, gameCode } 
                });
              } else {
                navigation.navigate('Tabs', { 
                  screen: 'Map',
                  params: { role, gameCode } 
                });
              }
            }}
          >
            <MaterialIcons 
              name={isAdmin ? "admin-panel-settings" : "map"} 
              size={24} 
              color="white" 
            />
            <Text style={styles.proceedButtonText}>
              {isAdmin ? 'Go to Admin Panel' : 'View Map'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
  const [code, setCode] = useState('');

  const joinGame = () => {
    if (!code.trim()) {
      Alert.alert('Enter a code');
      return;
    }
    navigation.navigate('NameInput', { action: 'join', gameCode: code.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Husky Seeker</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Join a game:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Code"
          placeholderTextColor="#999"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          style={styles.blackButton}
          onPress={joinGame}
        >
          <Text style={styles.blackButtonText}>Join Game With Code</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.blackButtonText}>Join Public Game</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.navigate('NameInput', { action: 'create' })}
        >
          <Text style={styles.blackButtonText}>Create a Game</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.blackButtonText}>Help</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function GameScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const filteredGames = games.filter(game => 
    game.status === 'in_progress' && 
    game.code.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = (game) => {
    navigation.navigate('NameInput', { action: 'join', gameCode: game.code });
  };

  return (
    <SafeAreaView style={styles.listContainer}>
      <Text style={styles.header}>Available Games</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Games..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handlePress(item)}
          >
            <View style={styles.gameListItem}>
              <Text style={styles.gameCode}>Game Code: {item.code}</Text>
              <Text style={styles.gamePlayers}>
                Players: {item.currentPlayers}/{item.maxPlayers}
              </Text>
              <Text style={styles.gameAdmin}>Host: {item.admin}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <MaterialIcons name="sports-esports" size={48} color="#6B46C1" />
            <Text style={styles.emptyListText}>No games available</Text>
            <Text style={styles.emptyListSubtext}>Create a new game to get started!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function CreateGameScreen({ navigation }) {
  const [innocents, setInnocents] = useState('');
  const [tasks, setTasks] = useState('');
  const [imposters, setImposters] = useState('');

  const isFormComplete = innocents && tasks && imposters;

  const createGame = () => {
    if (!isFormComplete) {
      Alert.alert('Please fill in all fields');
      return;
    }

    // Generate a unique game code
    const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create new game
    const newGame = {
      id: games.length + 1,
      code: gameCode,
      maxPlayers: Number(innocents) + Number(imposters),
      currentPlayers: 1,
      imposters: Number(imposters),
      tasks: Number(tasks),
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      admin: userContext.name
    };

    games.push(newGame);
    userContext.currentGame = gameCode;
    userContext.role = 'Administrator';

    // Navigate directly to AdminView
    navigation.navigate('Tabs', { 
      screen: 'AdminView',
      params: { role: 'Administrator', gameCode: gameCode }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleSecondary}>Create New Game</Text>
      <View style={styles.card}>
        <Text style={styles.welcomeText}>Welcome, {userContext.name}!</Text>
        <Text style={styles.subtitleText}>Configure your game settings:</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of Innocents"
          placeholderTextColor="#999"
          value={innocents}
          onChangeText={setInnocents}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Tasks"
          placeholderTextColor="#999"
          value={tasks}
          onChangeText={setTasks}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Imposters"
          placeholderTextColor="#999"
          value={imposters}
          onChangeText={setImposters}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.blackButton, !isFormComplete && styles.disabledButton]}
          onPress={createGame}
          disabled={!isFormComplete}
        >
          <Text style={styles.blackButtonText}>Create Game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MapScreen({ route }) {
  const role = route?.params?.role ?? 'Player';
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Map />
    </SafeAreaView>
  );
}

function HelpScreen() {
  return (
    <SafeAreaView style={styles.helpContainer}>
      <Text style={styles.helpHeader}>Welcome to Husky Seeker!</Text>
      
      <ScrollView style={styles.helpContent}>
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <MaterialIcons name="play-circle-filled" size={40} color="#6B46C1" />
          </View>
          <Text style={styles.helpCardTitle}>Getting Started</Text>
          <View style={styles.helpStep}>
            <Text style={styles.helpStepNumber}>1</Text>
            <Text style={styles.helpStepText}>Create a new game as an administrator or join an existing game</Text>
          </View>
          <View style={styles.helpStep}>
            <Text style={styles.helpStepNumber}>2</Text>
            <Text style={styles.helpStepText}>Enter your name to join the game</Text>
          </View>
          <View style={styles.helpStep}>
            <Text style={styles.helpStepNumber}>3</Text>
            <Text style={styles.helpStepText}>Share the game code with other players</Text>
          </View>
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <MaterialIcons name="person" size={40} color="#6B46C1" />
          </View>
          <Text style={styles.helpCardTitle}>Roles</Text>
          <View style={styles.roleCard}>
            <MaterialIcons name="admin-panel-settings" size={24} color="#6B46C1" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Administrator</Text>
              <Text style={styles.roleDescription}>Creates and manages the game, verifies completed tasks</Text>
            </View>
          </View>
          <View style={styles.roleCard}>
            <MaterialIcons name="person" size={24} color="#4CAF50" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Crewmate</Text>
              <Text style={styles.roleDescription}>Completes tasks and identifies imposters</Text>
            </View>
          </View>
          <View style={styles.roleCard}>
            <MaterialIcons name="warning" size={24} color="#f44336" />
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Imposter</Text>
              <Text style={styles.roleDescription}>Sabotages the team's progress</Text>
            </View>
          </View>
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <MaterialIcons name="map" size={40} color="#6B46C1" />
          </View>
          <Text style={styles.helpCardTitle}>Gameplay</Text>
          <View style={styles.gameplayInfo}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={styles.gameplayText}>Complete tasks around campus</Text>
          </View>
          <View style={styles.gameplayInfo}>
            <MaterialIcons name="verified" size={20} color="#2196F3" />
            <Text style={styles.gameplayText}>Get tasks verified by administrators</Text>
          </View>
          <View style={styles.gameplayInfo}>
            <MaterialIcons name="group" size={20} color="#FF9800" />
            <Text style={styles.gameplayText}>Work together with other players</Text>
          </View>
          <View style={styles.gameplayInfo}>
            <MaterialIcons name="security" size={20} color="#f44336" />
            <Text style={styles.gameplayText}>Watch out for imposters!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NameInputScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const { action, gameCode } = route.params;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Please enter your name');
      return;
    }

    userContext.name = name.trim();

    if (action === 'join') {
      const game = games.find(g => g.code === gameCode);
      if (!game) {
        Alert.alert('Game not found');
        return;
      }

      const role = Math.random() < 0.5 ? 'Crewmate' : 'Imposter';
      userContext.currentGame = gameCode;
      userContext.role = role;
      game.currentPlayers += 1;

      navigation.navigate('Role', { role, gameCode });
    } else if (action === 'create') {
      navigation.navigate('CreateGame');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titleSecondary}>
          {action === 'join' ? 'Join Game' : 'Create Game'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <TouchableOpacity
          style={[styles.blackButton, !name.trim() && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Text style={styles.blackButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = { 
            Home: 'home', 
            Game: 'sports-esports', 
            Map: 'map', 
            Help: 'help-outline',
            AdminView: 'admin-panel-settings'
          };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: { backgroundColor: '#6B46C1' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => {
                if (!userContext.currentGame) {
                  Alert.alert('Join a Game', 'You need to join a game first to access the map.');
                  return;
                }
                props.onPress();
              }}
            />
          )
        }}
      />
      {userContext.currentGame && (
        <Tab.Screen 
          name="AdminView" 
          component={AdminView}
          initialParams={{ 
            gameCode: userContext.currentGame,
            games: games,
            userContext: userContext
          }}
        />
      )}
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={MainTabs} />
        <Stack.Screen name="CreateGame" component={CreateGameScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="Role" component={RoleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  // placeholder
  centerPlaceholder: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 20 },
  // home/creategame
  container: { flex: 1, backgroundColor: '#6B46C1', justifyContent: 'center', alignItems: 'center', padding: 20 },
  // game list
  listContainer: { flex: 1, backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 16 },
  // join/create
  card: { width: '90%', marginVertical: 20, padding: 16, backgroundColor: 'white', borderRadius: 8 },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  titleSecondary: { fontSize: 20, color: '#6B46C1', fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  header: { fontSize: 22, color: '#333', fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  label: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  label2: { color: 'black', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  input: { backgroundColor: '#f2f2f2', borderRadius: 20, paddingHorizontal: 16, height: 40, marginBottom: 12, borderWidth: 1, borderColor: '#6B46C1', width: '100%' },
  searchBar: { backgroundColor: '#f2f2f2', borderRadius: 20, paddingHorizontal: 16, height: 40, marginBottom: 12, borderWidth: 1, borderColor: '#6B46C1', width: '100%' },
  blackButton: { backgroundColor: 'black', borderRadius: 8, padding: 14, alignItems: 'center', marginVertical: 8, width: '100%' },
  blackButtonText: { color: 'white', fontSize: 16 },
  spacer: { height: 12 },
  listItem: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginVertical: 8, borderWidth: 1, borderColor: '#6B46C1', width: '100%' },
  listItemText: { fontSize: 18, color: '#6B46C1', textAlign: 'center' },
  listContent: { paddingBottom: 80 },
  paragraph: { fontSize: 16, color: '#333', textAlign: 'center', marginVertical: 8 },
  roleContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  roleScrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  roleCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameInfoSection: {
    marginBottom: 20,
  },
  gameCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  adminInfoSection: {
    marginTop: 20,
  },
  adminInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  adminInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIconContainer: {
    marginRight: 10,
  },
  adminInfoText: {
    fontSize: 14,
    color: '#666',
  },
  shareSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  shareCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  shareCodeText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  adminProceedButton: {
    backgroundColor: '#4CAF50',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  roleHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  helpContent: {
    flex: 1,
    padding: 15,
  },
  helpCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  helpIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  helpCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  helpStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B46C1',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  helpStepText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  roleInfo: {
    marginLeft: 10,
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
  },
  gameplayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameplayText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  gameListItem: {
    padding: 15,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyListText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  helpContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  helpHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B46C1',
    textAlign: 'center',
    padding: 20,
  },
});
