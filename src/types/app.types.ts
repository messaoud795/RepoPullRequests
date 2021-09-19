export type TimeOutType = ReturnType<typeof setTimeout>;

export type RoutingDetailsListType = Array<RoutingDetailType>

export interface RoutingDetailType {
    path: RoutingPaths,
    title?: string,
    exact?: boolean,
    component: any,
    icon?: any
}

export enum RoutingPaths {
    REPOSITORIES = '/repositories',
    ANALYTICS = '/pr-analytics',
    SETTINGS = '/github-token',
    WILDCARD = '*'
}

export const RoutingPathsSet: Set<string> = new Set(Object.values(RoutingPaths))
