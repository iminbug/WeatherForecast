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
  Dimensions,
  StatusBar,
  ImageBackground,
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
import { getData, storeData } from '../utils/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { weatherImages } from '../constants';
import { AppDispatch } from '../redux/store';



const selectWeatherState = (state: { weather: any; }) => state.weather;

const selectWeatherData = createSelector(
  [selectWeatherState],
  (weather) => ({
    loading: weather.loading,
    weather: weather.current,
    locations: weather.locations,
    error: weather.error,
  })
);

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState<any>(false);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { loading, weather, locations = [], error } = useSelector(selectWeatherData);

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
    } else {
      dispatch(fetchLocations([]));
    }
  };

  const handleLocation = (loc: { name: any; }) => {
    toggleSearch(false);
    dispatch(fetchWeatherForecast({ cityName: loc.name, days: '7' }));
    storeData('city', loc.name);
    dispatch(fetchLocations([]));
  };

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

  const renderItem = ({ item }: any) => {
    const date = new Date(item.date);
    const options = { weekday: 'long' };
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }).split(',')[0];

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('WeatherDetail', { forecastItem: item })}
        style={styles.forecastDailyItem}
      >
        <Image
          source={weatherImages[item?.day?.condition?.text || 'other']}
          style={styles.forecastDailyIcon}
        />
        <Text style={styles.forecastDailyDayName}>{dayName}</Text>
        <Text style={styles.forecastDailyTemp}>{item?.day?.temp_c}&#176;</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <View style={styles.forecastDailyContainer}>
      <View style={styles.forecastDailyHeader}>
        <CalendarDaysIcon size={30} color="white" />
        <Text style={styles.forecastDailyHeaderText}>Daily forecast</Text>
      </View>
      <FlatList
        data={weather?.forecast?.forecastday}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
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
            style={styles.searchButton}
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
            {locations.map((loc: { name: string; country: string }, index: number) => (
              <TouchableOpacity
                key={index?.toString()}
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
          </View>
        ) : (
          <>
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
              <Text style={styles.forecastDegreeText}>{current?.temp_c}&#176;</Text>
              <Text style={styles.forecastConditionText}>{current?.condition?.text}</Text>
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
                <Text style={styles.forecastStatText}>{current?.wind_kph} km</Text>
              </View>
              <View style={styles.forecastStatItem}>
                <LottieView
                  source={require('../assets/animations/humidity.json')}
                  style={styles.forecastStatIcon}
                  autoPlay
                  loop
                />
                <Text style={styles.forecastStatText}>{current?.humidity}%</Text>
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
          </>
        )}
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/images/bg1.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'transparent']} style={styles.gradientOverlay} />
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            data={current||[]}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </SafeAreaView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  loadingContainer: {
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginTop: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: theme.bgWhite(0.1),
    elevation: 5,
    width: '90%'
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'white',
  },
  searchButton: {
    padding: 10,
  },
  locationList: {
    marginTop: 5,
    maxHeight: 150,
    backgroundColor: theme.bgWhite(0.2),
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,
    width: '90%',
    alignSelf: 'center',
  },
  locationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  locationListItemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  locationListItemText: {
    marginLeft: 10,
    color: 'white',
  },
  errorContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  forecastContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 10,
    paddingVertical: 15,
    borderRadius: 10,
    width: '95%'
  },
  forecastLocationContainer: {
    marginBottom: 10,

  },
  forecastLocationText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  forecastWeatherIconContainer: {
    marginBottom: 10,
  },
  forecastWeatherIcon: {
    width: 80,
    height: 80,
  },
  forecastDegreeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  forecastDegreeText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  forecastConditionText: {
    fontSize: 18,
    color: 'white',
  },
  forecastStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  forecastStatItem: {
    alignItems: 'center',
  },
  forecastStatIcon: {
    width: 50,
    height: 50,
  },
  forecastStatText: {
    color: 'white',
  },
  forecastDailyContainer: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
    width: '95%'
  },
  forecastDailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  forecastDailyHeaderText: {
    marginLeft: 15,
    color: 'white',
    fontSize: 26,
    fontWeight:'bold',
  },
  forecastDailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    backgroundColor: theme.bgWhite(0.2),
    margin: 10
  },
  forecastDailyIcon: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  forecastDailyDayName: {
    color: 'white',
    fontWeight: 'bold',
  },
  forecastDailyTemp: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
