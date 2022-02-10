import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {}
}

export const authenticationSlice = createSlice({
    name: 'authenticated',
    initialState,
    reducers: {
        login: (state, action) => {
            action.payload = { ...action.payload, authenticated: true, user: action.payload.user }

            state.value = { ...state.value, ...action.payload }
        },
        logout: (state, action) => {
            state.value = {}
        }
    }
})

export const { login, logout } = authenticationSlice.actions

export default authenticationSlice.reducer