import RepositoriesComponent from '../components/repositories/repositories.component'
import AuthTokenInputComponent from '../components/auth-token-input/auth-token-input.component'
import SelectedRepoPrAnalyticsComponent
    from '../pages/selected-repo-pr-analytics/selected-repo-pr-analytics.component'
import { RoutingDetailsListType, RoutingPaths } from '../types/app.types'
import IconSettings from '../images/svg/icon-settings.svg'

export const RoutingDetails: RoutingDetailsListType = [
    {
        path: RoutingPaths.REPOSITORIES,
        exact: true,
        title: 'Repositories',
        component: RepositoriesComponent
    },
    {
        path: RoutingPaths.ANALYTICS,
        exact: true,
        title: 'PR Analytics',
        component: SelectedRepoPrAnalyticsComponent
    },
    {
        path: RoutingPaths.SETTINGS,
        exact: true,
        title: 'Settings',
        component: AuthTokenInputComponent,
        icon: <IconSettings />
    },
    {
        path: RoutingPaths.WILDCARD,
        component: RepositoriesComponent
    }
]
