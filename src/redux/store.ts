import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './reducer/weatherReducer'; 
// import { thunk } from 'redux-thunk';

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Disable the serializable state invariant check
    }),
});

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
export default store;
