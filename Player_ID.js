import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from './supabase'; // or '../supabase' depending on file structure


const Tasks = () => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace '1' with the actual player_id you're fetching
    const fetchPlayerData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('players')
        .select('player_id, name') // Adjust fields based on your table schema
        .eq('player_id', 11) // Filter by player_id (you can change this)
        .single(); // Use `.single()` if you're expecting a single player

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setPlayer(data);
      setLoading(false);
    };

    fetchPlayerData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.newElement}>
      {player ? (
        <Text style={styles.text}>{`Player ID: ${player.player_id}`}</Text>
      ) : (
        <Text>No player found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  newElement: {
    height: 50,
    width: 200,
    backgroundColor: '#b7a57a',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 105,
    left: 105,
    alignItems: 'center'
  },
  text: {
    fontSize: 30
  }
});

export default Tasks;
