import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseDiscoveryReducer from './slices/courseDiscoverySlice';
import enquiryModalReducer from './slices/enquiryModalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courseDiscovery: courseDiscoveryReducer,
    enquiryModal: enquiryModalReducer,
  },
});

export default store;
