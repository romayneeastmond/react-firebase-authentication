import { configureStore } from '@reduxjs/toolkit'
import authenticationSliceReducer from './authenticationSlice'

export const store = configureStore({
    reducer: {
        authentication: authenticationSliceReducer
    }
})