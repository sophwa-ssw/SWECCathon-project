import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import Map from './Map';

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
          onPress={() => code.trim() ? navigation.navigate('Role', { role: Math.random() < 0.5 ? 'Crewmate' : 'Imposter', gameCode: code }) : Alert.alert('Enter a code')}
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
  const sampleGames = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
  ];
  const games = code
    ? [{ id: 'code', name: `Join Game: ${code}` }]
    : sampleGames;

  const [search, setSearch] = useState('');
  const filteredGames = games.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePress = (item) => {
    const role = Math.random() < 0.5 ? 'Crewmate' : 'Imposter';
    const gameCode = code || item.id;
    navigation.navigate('Role', { role, gameCode });
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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

  return (
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
          <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('GameSettings')}>
            <Text style={styles.blackButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
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
        <Stack.Screen name="GameSettings" component={GameSettingsScreen} />
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
