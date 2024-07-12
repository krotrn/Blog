import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';


const store = configureStore({
    reducer: {
        // Reducer
        auth: authSlice
    }
})

export default store;