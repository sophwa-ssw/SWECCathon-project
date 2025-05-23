import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import CrewMateMapView from './CrewMateMapView.js';
import ImposterMapView from './ImposterMapView.js';
import { useEffect } from 'react';
import { supabase } from './supabase';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
import Admin from './components/AdminView.js';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function RoleScreen({ route, navigation }) {
  const { role, gameCode } = route.params;
  return (
    <SafeAreaView style={styles.centerPlaceholder}>
      <Text style={styles.titleSecondary}>Game Code: {gameCode}</Text>
      <View style={styles.roleCard}>
        <Text style={styles.roleText}>You are: {role}</Text>
        <TouchableOpacity
          style={[styles.blackButton, { marginTop: 20 }]}
          onPress={() => navigation.navigate('Tabs', { screen: 'Map', params: { role } })}
        >
          <Text style={styles.blackButtonText}>Proceed to Map</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}




function HomeScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const joinGame = async () => {
    if (!code.trim()) {
      Alert.alert('Enter a code');
      return;
    }

    // Check if the game with the entered code exists and get the UUID of that game
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('id, max_players')  // Select the id (UUID) and max_players from the games table
      .eq('code', code.trim())
      .single();

    if (gameError || !gameData) {
      console.error(gameError);
      Alert.alert('Game not found');
      return;
    }

    // Get the game's UUID (game_id) and max_players from the gameData
    const gameId = gameData.id;
    const maxPlayers = gameData.max_players;

    // Check how many players are currently in the game
    const { data: playersData, error: playersError } = await supabase
      .from('players')
      .select('id')  // Select only the ids of players in this game
      .eq('game_id', gameId);

    if (playersError) {
      console.error(playersError);
      Alert.alert('Error checking current players');
      return;
    }

    // If the number of players has reached the maximum, alert the user and return
    if (playersData.length >= maxPlayers) {
      Alert.alert('The game is full. Please join a different game.');
      return;
    }

    // Randomly assign role
    const role = Math.random() < 0.5 ? 'Crewmate' : 'Imposter';

    // Insert the new player into the players table
    const { error: playerError } = await supabase
      .from('players')
      .insert([
        {
          game_id: gameId,  // Store the UUID in the players table
          role: role,
          created_at: new Date().toISOString(),
          name: name,  // Name of the player
        },
      ]);

    if (playerError) {
      console.error(playerError);
      Alert.alert('Error joining game');
    } else {
      // Navigate to the Role screen with the assigned role and game code
      navigation.navigate('Role', { role, gameCode: code.trim() });
    }
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
        <TextInput
          style={styles.input}
          placeholder= "Enter Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
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
          onPress={() => navigation.navigate('CreateGame')}
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



function GameScreen({ navigation, route }) {
  const { code } = route.params || {};
  const [games, setGames] = useState([]);
  const [nameInputs, setNameInputs] = useState({}); // Tracks name input per game
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('status', 'in_progress');

      if (error) {
        console.error('Error fetching games:', error);
      } else {
        setGames(data || []);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleNameChange = (gameId, value) => {
    setNameInputs(prev => ({ ...prev, [gameId]: value }));
  };

  const joinGame = async (item) => {
    const name = nameInputs[item.id]?.trim();
    if (!name) {
      Alert.alert('Please enter a name');
      return;
    }

    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('code', item.code)
      .single();

    if (gameError || !gameData) {
      console.error(gameError);
      Alert.alert('Game not found');
      return;
    }

    const role = Math.random() < 0.5 ? 'Crewmate' : 'Imposter';

    const { error: playerError } = await supabase
      .from('players')
      .insert([
        {
          name,
          role,
          created_at: new Date().toISOString(),
          game_id: item.id, // <-- use the UUID from the game item
        },
      ]);

    if (playerError) {
      console.error(playerError);
      Alert.alert('Error joining game');
    } else {
      navigation.navigate('Role', { role, gameCode: item.code });
    }
  };

  return (
    <SafeAreaView style={styles.listContainer}>
      <Text style={styles.header}>Available Games</Text>

      {/* Search bar to filter games */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Games..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
      />

      {/* Game list */}
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>Game Code: {item.code}</Text>

            <TextInput
              style={styles.searchBar}
              placeholder="Enter Name"
              placeholderTextColor="#666"
              value={nameInputs[item.id] || ''}
              onChangeText={(text) => handleNameChange(item.id, text)}
              onSubmitEditing={() => joinGame(item)} // Press Enter to join
              returnKeyType="done"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}




const MapScreen = ({ route }) => {
  const role = route?.params?.role || 'Crewmate'; // default to Crewmate

  return (
    <View style={{ flex: 1 }}>
      {role === 'Crewmate' ? <CrewMateMapView /> : <ImposterMapView />}
    </View>
  );
};



function HelpScreen() {
  return (
    <SafeAreaView style={styles.centerPlaceholder}>
      <Text style={styles.titleSecondary}>Help & Instructions</Text>
      <Text style={styles.paragraph}>
        Welcome to Husky Seeker! Join games, complete tasks around campus, and identify the imposter before they sabotage your team.
      </Text>
    </SafeAreaView>
  );
}


function CreateGameScreen({ navigation }) {
  const [innocents, setInnocents] = useState('');
  const [tasks, setTasks] = useState('');
  const [imposters, setImposters] = useState('');

  const isFormComplete = innocents && tasks && imposters;

  const createGame = async () => {
    // Generate a unique game code
    const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          code: gameCode,
          max_players: Number(innocents) + Number(imposters), 
          current_players: 0, 
          imposters: Number(imposters),
          tasks: Number(tasks),
          status: 'in_progress',  
          created_at: new Date().toISOString(), 
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      Alert.alert('Error creating game');
    } else {
      console.log('Game created!', data);
      // Navigate to AdminView with the required parameters
      navigation.navigate('Admin', { 
        gameCode: gameCode,
        games: [data],
        userContext: { currentGame: data, role: 'admin' }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Start a New Round!</Text>
        <View style={styles.card}>
          <Text style={styles.label2}>Number of Innocents:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 5"
            placeholderTextColor="#999"
            value={innocents}
            onChangeText={setInnocents}
          />
          <Text style={styles.label2}>Number of Tasks:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 10"
            placeholderTextColor="#999"
            value={tasks}
            onChangeText={setTasks}
          />
          <Text style={styles.label2}>Number of Imposters:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 2"
            placeholderTextColor="#999"
            value={imposters}
            onChangeText={setImposters}
          />
          {isFormComplete && (
            <TouchableOpacity style={styles.blackButton} onPress={createGame}>
              <Text style={styles.blackButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}



function GameSettingsScreen() {
  return (
    <SafeAreaView style={styles.centerPlaceholder}>
      <Text style={styles.titleSecondary}>Game Settings (Admin)</Text>
      <Text style={styles.paragraph}>Configure tasks, roles, and start your game!</Text>
    </SafeAreaView>
  );
}


function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = { Home: 'home', Game: 'sports-esports', Map: 'map', Help: 'help-outline' };
          return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: { backgroundColor: '#6B46C1' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
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
        <Stack.Screen name="Admin" component={Admin} />
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
  roleCard: { backgroundColor: 'white', borderRadius: 8, padding: 20, alignItems: 'center', width: '90%' },
  roleText: { fontSize: 20, color: '#6B46C1', fontWeight: 'bold' },
});
