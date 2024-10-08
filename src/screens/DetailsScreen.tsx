import React from 'react';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

import { weatherImages } from '../constants';

const WeatherDetailScreen = ({ route, navigation }) => {
  const { forecastItem } = route.params;

  return (
    <ImageBackground
      source={require('../assets/images/bg1.png')} 
      style={styles.background}
    >
      <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'transparent']} style={styles.gradientOverlay} />
      <View style={styles.container}>
        <Text style={styles.dayName}>{forecastItem.date.toString()}</Text>
        <Image
          source={weatherImages[forecastItem.day.condition.text || 'other']}
          style={styles.weatherIcon}
        />

       
        <View style={styles.box}>
          <Text style={styles.tempText}>
            Avg Temp: {forecastItem.day.avgtemp_c}&#176;
          </Text>
        </View>


        <View style={styles.box}>
          <Text style={styles.conditionText}>
            Condition: {forecastItem.day.condition.text}
          </Text>
        </View>

        {/* Stats Box */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Humidity</Text>
            <LottieView
              source={require('../assets/animations/humidity.json')} 
              autoPlay
              loop
              speed={0.5}  
              style={styles.statImage} 
            />
            <Text style={styles.statValue}>{forecastItem.day.avghumidity}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Wind</Text>
            <LottieView
              source={require('../assets/animations/wind.json')} 
              autoPlay
              speed={0.5}  
              loop
              style={styles.statImage} 
            />
            <Text style={styles.statValue}>{forecastItem.day.maxwind_kph} km/h</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Sunrise</Text>
            <LottieView
              source={require('../assets/animations/sunrise.json')} 
              autoPlay
              speed={0.5}  
              loop
              style={styles.statImage} 
            />
            <Text style={styles.statValue}>{forecastItem.astro.sunrise}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Sunset</Text>
            <LottieView
              source={require('../assets/animations/sunset.json')} 
              autoPlay
              speed={0.5}  
              loop
              style={styles.statImage} 
             />
            <Text style={styles.statValue}>{forecastItem.astro.sunset}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    width: '90%',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  dayName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 130,
    height: 130,
    marginVertical: 15,
  },
  tempText: {
    fontSize: 22,
    color: '#fff', 
    marginVertical: 5,
    textAlign: 'center'
  },
  conditionText: {
    fontSize: 30,
    color: '#fff', 
    marginVertical: 5,
    textAlign: 'center'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    flexWrap: 'wrap', 
    marginTop: 20,
  },
  box: {
    padding: 15,
    marginVertical: 5,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statBox: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    height: 120,
    width: '45%',
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  statImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    color: '#fff',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WeatherDetailScreen;
