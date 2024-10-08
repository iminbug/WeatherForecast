import axios from 'axios';
import { apiKey } from '../constants';

// Base API URL
const BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Generates the forecast endpoint URL.
 * @param {Object} params - Parameters for the request.
 * @param {string} params.cityName - The name of the city.
 * @param {number} params.days - Number of days to forecast.
 * @returns {string} The forecast URL.
 */
const generateForecastUrl = ({ cityName, days }: { cityName: string; days: number; }): string => 
  `${BASE_URL}/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`;

/**
 * Generates the locations endpoint URL.
 * @param {Object} params - Parameters for the request.
 * @param {string} params.cityName - The name of the city.
 * @returns {string} The locations URL.
 */
const generateLocationsUrl = ({ cityName }: { cityName: string; }): string => 
  `${BASE_URL}/search.json?key=${apiKey}&q=${cityName}`;

/**
 * Makes an API call to the specified endpoint.
 * @param {string} endpoint - The API endpoint to call.
 * @returns {Promise<Object>} The API response data.
 */
const apiCall = async (endpoint: string): Promise<object> => {
  try {
    const { data } = await axios.get(endpoint);
    return data;
  } catch (error:any) {
    console.error('API call error: ', error.message || error);
    return { error: error.message || 'An error occurred while fetching data.' };
  }
};

/**
 * Fetches the weather forecast based on parameters.
 * @param {Object} params - Parameters for the request.
 * @returns {Promise<Object>} The weather forecast data.
 */
export const fetchWeatherForecast = async (params: { cityName: any; days: any; }): Promise<object> => {
  const forecastUrl = generateForecastUrl(params);
  return apiCall(forecastUrl);
};

/**
 * Fetches location data based on city name.
 * @param {Object} params - Parameters for the request.
 * @returns {Promise<Object>} The locations data.
 */
export const fetchLocations = async (params: { cityName: any; }): Promise<object> => {
  const locationsUrl = generateLocationsUrl(params);
  return apiCall(locationsUrl);
};
