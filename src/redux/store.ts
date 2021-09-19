import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import configReducer from './config/config.reducer'
import repositoriesReducer from './repositories/repositories.reducer'

export const store = configureStore({
    reducer: {
        repositories: repositoriesReducer,
        config: configReducer
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
