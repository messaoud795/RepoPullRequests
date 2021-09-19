import React, { Suspense, useEffect } from 'react'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import './App.css'
import Loader from './components/loader/loader.component'
import { RoutingDetails } from './constants/routing.constants'
import NavigationComponent from './components/navigation/navigation.component'
import { createStructuredSelector } from 'reselect'
import { authTokenSelector } from './redux/config/config.selector'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty } from 'lodash'
import { AppDispatch } from './redux/store'
import { setAuthToken } from './redux/config/config.reducer'
import {
    getAuthTokenFromLocalStorage,
    isAuthTokenValid
} from './components/auth-token-input/auth-token-input.utils'
import { RoutingPaths } from './types/app.types'

export interface AppProps extends AppPropsFromRedux {
}

function App({
    authToken = '',
    setAuthToken,
}: AppProps) {
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if (isEmpty(authToken)) {
            const authTokenFromLs = getAuthTokenFromLocalStorage()
            if (isAuthTokenValid(authTokenFromLs)) {
                setAuthToken(authTokenFromLs)
            } else {
                history.push(RoutingPaths.SETTINGS)
            }
        }
    }, [authToken, history, location.pathname, setAuthToken])

    return (
        <Suspense fallback={ <Loader /> }>
            <NavigationComponent />
            <Switch>
                {
                    RoutingDetails.map(({ path, exact, component }, index) => (
                        <Route
                            component={ component }
                            path={ path }
                            exact={ exact }
                            key={ index }
                        />
                    ))
                }
            </Switch>
        </Suspense>
    )
}

const mapStateToProps = createStructuredSelector({
    authToken: authTokenSelector
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    setAuthToken: (token: string) => {
        dispatch(setAuthToken(token))
    }
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type AppPropsFromRedux = ConnectedProps<typeof connector>

export default connector(App)
