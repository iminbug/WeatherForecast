interface WeatherAction {
  type: string;
  payload?: any; 
  error?: string; 
}

interface WeatherState {
  loading: boolean;
  current: any | null;
  locations: any[];
  error: any;
}

const initialState: WeatherState = {
  loading: false,
  current: null,
  locations: [],
  error: null,
};

const weatherReducer = (state = initialState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'FETCH_WEATHER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_WEATHER_SUCCESS':
      return { ...state, loading: false, current: action.payload };
    case 'FETCH_WEATHER_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'FETCH_LOCATIONS_REQUEST':
      return { ...state, loading: true, error: null, locations: [] };
    case 'FETCH_LOCATIONS_SUCCESS':
      return { ...state, loading: false, locations: action.payload };
    case 'FETCH_LOCATIONS_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default weatherReducer;
