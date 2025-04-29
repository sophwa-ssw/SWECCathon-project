import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';
import Tasks from './Tasks'; 
import Emergency_Button from './Emergency_Button';
import Chat from './Chat';

const CrewmateMapView = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeElement, setActiveElement] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Location not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />
      <Polygon
        coordinates={[
          { latitude: 47.65398481113922, longitude: -122.30864467183413 },
          { latitude: 47.65432769973483, longitude: -122.30752567082219 },
          { latitude: 47.653620196282056, longitude: -122.3070234762712 },
          { latitude: 47.65337174526234, longitude: -122.30749720756806 },
          { latitude: 47.65326418600036, longitude: -122.30815318903672 },

        ]}
        fillColor="rgba(255, 0, 0, 0.5)" // Greenish shaded area with opacity
        strokeColor="rgba(0,0,0,0.5)"    // Border color
        strokeWidth={2}                  // Border thickness
      />

      </MapView>

      {/* Conditionally render the new element */}
    {activeElement === 'emergency' && <Emergency_Button />}
    {activeElement === 'tasks' && <Tasks />}
    {activeElement === 'chat' && <Chat />}



      {/* Buttons Overlay */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button1} onPress={() => setActiveElement(prev => prev === 'emergency' ? null : 'emergency')}>
          <Image
            source={require('./assets/emergency_button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => setActiveElement(prev => prev === 'tasks' ? null : 'tasks')}>
          <Image
            source={require('./assets/tasks_button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button3} onPress={() => setActiveElement(prev => prev === 'chat' ? null : 'chat')}>
          <Image
            source={require('./assets/chat_button.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button4} onPress={() => setActiveElement(prev => prev === 'death' ? null : 'death')}>
          <Image
            source={require('./assets/kill_icon.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'transparent',
  },
  button1: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 470,
    left: 130
  },
  button2: {
    backgroundColor: '#4b2e83',
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 540,
    left: 130
  },
  button3: {
    backgroundColor: '#4b2e83',
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 610,
    left: 130
  },
  button4: {
    backgroundColor: '#4b2e83',
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    top: 610,
    left: 130
  },
  buttonImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  }
});

export default CrewmateMapView;
