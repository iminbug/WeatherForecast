import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { theme } from '../theme';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations, fetchWeatherForecast } from '../redux/action/weatherAction';
import * as Progress from 'react-native-progress';
import { weatherImages } from '../constants';
import { getData, storeData } from '../utils/asyncStorage';
import { useNavigation } from '@react-navigation/native';




const selectWeatherState = (state: { weather: any; }) => state.weather;

const selectWeatherData = createSelector(
  [selectWeatherState],
  weather => ({
    loading: weather.loading,
    weather: weather.current,
    locations: weather.locations,
    error: weather.error,
  })
);

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [searchText, setSearchText] = useState(''); 
  const dispatch = useDispatch<any>();
  const navigation = useNavigation()
  const { loading, weather, locations = [], error } = useSelector(selectWeatherData);
  console.log({ loading, weather, locations, error });

  useEffect(() => {
    fetchMyWeatherData();
  
    
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = myCity || 'Delhi';
    dispatch(fetchWeatherForecast({ cityName, days: 7 }));
  };

  const handleSearch = (search: string | any[]) => {
    if (search && search.length > 2) {
      dispatch(fetchLocations({ cityName: search }));
    }
  };

  const handleLocation = (loc: { name: any; }) => {
    toggleSearch(false);
    dispatch(fetchWeatherForecast({ cityName: loc.name, days: '7' }));
    storeData('city', loc.name);
  };

  // Debounce the search function to avoid too many requests
  const handleTextDebounce = useCallback(
    debounce((text) => {
      handleSearch(text);
    }, 1200),
    []
  );

  useEffect(() => {
    if (!showSearch) {
      setSearchText(''); 
    }
  }, [showSearch]);

  const { location, current } = weather || {};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150}
    >
      <View style={styles.container}>
        <Image
          blurRadius={2}
          source={require('../assets/images/bg1.png')}
          style={styles.backgroundImage}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
          </View>
        ) : (
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.searchContainer}>
              <View
                style={[
                  styles.searchInputContainer,
                  {
                    backgroundColor: showSearch
                      ? theme.bgWhite(0.3)
                      : 'transparent',
                  },
                ]}
              >
                {showSearch && (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search City"
                    placeholderTextColor={'lightgray'}
                    style={styles.searchInput}
                  />
                )}
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={[
                    styles.searchButton,
                    {
                      backgroundColor: theme.bgWhite(0.4),
                    },
                  ]}
                >
                  {showSearch ? (
                    <XMarkIcon size={30} color="white" />
                  ) : (
                    <MagnifyingGlassIcon size={30} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch && (
                <View style={styles.locationList}>
                  {locations.map((loc: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; country: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleLocation(loc)}
                      style={[
                        styles.locationListItem,
                        index + 1 !== locations.length && styles.locationListItemWithBorder,
                      ]}
                    >
                      <MapPinIcon size="20" color="gray" />
                      <Text style={styles.locationListItemText}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.forecastContainer}>
              <View style={styles.forecastLocationContainer}>
                <Text style={styles.forecastLocationText}>
                  {location?.name}, {location?.region}
                </Text>
              </View>

              <View style={styles.forecastWeatherIconContainer}>
                <Image
                  source={weatherImages[current?.condition?.text || 'other']}
                  style={styles.forecastWeatherIcon}
                />
              </View>

              <View style={styles.forecastDegreeContainer}>
                <Text style={styles.forecastDegreeText}>
                  {current?.temp_c}&#176;
                </Text>
                <Text style={styles.forecastConditionText}>
                  {current?.condition?.text}
                </Text>
              </View>

              <View style={styles.forecastStatsContainer}>
                <View style={styles.forecastStatItem}>
                  <LottieView
                    source={require('../assets/animations/wind.json')}
                    style={styles.forecastStatIcon}
                    autoPlay
                    loop
                    speed={0.5}
                  />
                  <Text style={styles.forecastStatText}>
                    {current?.wind_kph} km
                  </Text>
                </View>
                <View style={styles.forecastStatItem}>
                  <LottieView
                    source={require('../assets/animations/humidity.json')}
                    style={styles.forecastStatIcon}
                    autoPlay
                    loop
                  />
                  <Text style={styles.forecastStatText}>
                    {current?.humidity}%
                  </Text>
                </View>
                <View style={styles.forecastStatItem}>
                  <LottieView
                    source={require('../assets/animations/sunrise.json')}
                    style={styles.forecastStatIcon}
                    autoPlay
                    loop
                  />
                  <Text style={styles.forecastStatText}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.forecastDailyContainer}>
              <View style={styles.forecastDailyHeader}>
                <CalendarDaysIcon size={22} color="white" />
                <Text style={styles.forecastDailyHeaderText}>
                  Daily forecast
                </Text>
              </View>

              <FlatList
                data={weather?.forecast?.forecastday}
                renderItem={({ item }) => {
                  const date = new Date(item.date);
                  const options = { weekday: 'long' };
                  const dayName = date.toLocaleDateString('en-US', options).split(',')[0];

                  return (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('WeatherDetail', { forecastItem: item })}
                      style={[
                        styles.forecastDailyItem,
                        { backgroundColor: theme.bgWhite(0.15) },
                      ]}
                    >
                      <Image
                        source={weatherImages[item?.day?.condition?.text || 'other']}
                        style={styles.forecastDailyIcon}
                      />
                      <Text style={styles.forecastDailyDayName}>{dayName}</Text>
                      <Text style={styles.forecastDailyTemp}>
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastDailyScrollView}
              />
            </View>

          </SafeAreaView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    height: '10%',
    marginHorizontal: 20,
    zIndex: 50,
    top: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    paddingLeft: 16,
    height: 30,
    paddingBottom: 1,
    fontSize: 20,
    color: 'white',
  },
  searchButton: {
    borderRadius: 999,
    padding: 10,
    margin: 5,
    backgroundColor: 'transparent',
  },
  locationList: {
    width: '100%',
    marginTop: 10,
  },
  locationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  locationListItemText: {
    color: '#333',
    fontSize: 18,
    marginLeft: 10,
  },
  locationListItemWithBorder: {
    borderBottomWidth: 2,
  },
  forecastContainer: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  forecastLocationText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold', //
  },
  forecastCountryText: {
    color: 'gray',
    fontSize: 17,
    fontWeight: 'bold',
  },
  forecastWeatherIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
  },
  forecastWeatherIcon: {
    width: 170,
    height: 170,
  },
  forecastDegreeContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastLocationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  forecastDegreeText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 75,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  forecastConditionText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  forecastStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  forecastStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    marginLeft: -5,
  },
  forecastStatIcon: {
    width: 50,
    height:50,
  },
  forecastStatText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 2,
  },

  forecastDailyContainer: {
    marginBottom: 20,
  },
  forecastDailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  forecastDailyHeaderText: {
    color: 'white',
    fontSize: 18,
    margin: 10,
  },
  forecastDailyScrollView: {
    paddingHorizontal: 15,
  },
  forecastDailyItem: {
    width: 95,
    borderRadius: 18,
    paddingVertical: 20,
    marginRight: 15,
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forecastDailyIcon: {
    width: 50,
    height: 50,
  },
  forecastDailyDayName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  forecastDailyTemp: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer:{
    width: 'auto',
  height:'auto'
  },
  errorText:{
    color:'red'
  }
});

export default HomeScreen;
