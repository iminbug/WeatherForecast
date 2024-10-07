import { fetchWeatherForecast as apiFetchWeatherForecast, fetchLocations as apiFetchLocations } from '../../api/weather';

export const fetchWeatherForecast = (params: { cityName: any; days: any; }) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_WEATHER_REQUEST' });
    const data = await apiFetchWeatherForecast(params);
    
    if (data.error) {
      dispatch({ type: 'FETCH_WEATHER_FAILURE', error: data.error });
    } else {
      dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: data });
    }
  };
};

export const fetchLocations = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_LOCATIONS_REQUEST' });
    const data = await apiFetchLocations(params);
    
    if (data.error) {
      dispatch({ type: 'FETCH_LOCATIONS_FAILURE', error: data.error });
    } else {
      dispatch({ type: 'FETCH_LOCATIONS_SUCCESS', payload: data });
    }
  };
};
