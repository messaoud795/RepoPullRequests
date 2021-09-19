import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ConfigDataState {
    authToken: string
}

const initialState: ConfigDataState = {
    authToken: ''
}

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setAuthToken: (state, action: PayloadAction<string>) => {
            state.authToken = action.payload
        }
    }
})

export const { setAuthToken } = configSlice.actions

export default configSlice.reducer
