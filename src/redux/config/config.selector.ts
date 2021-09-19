import { ConfigDataState } from './config.reducer'
import { createSelector } from 'reselect'

const selectConfig = (state: any): ConfigDataState => state.config

export const selectConfigData = createSelector(
    [selectConfig],
    (config: ConfigDataState): ConfigDataState | undefined => config
)

export const authTokenSelector = createSelector(
    [selectConfig],
    (config: ConfigDataState): string | undefined => config.authToken
)
