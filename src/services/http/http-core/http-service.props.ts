import HttpMethodTypes from './http-method-types.enum'
import { FetchInitCredentialsTypes, HttpServiceReturnTypes } from './http-service.constants'

export interface QueryParamsType {
    [key: string]: string | number
}

export type ErrorHandlerType = (error: any, response?: Response) => any

export interface ErrorHandlerProps {
    url: string
    errorHandler?: ErrorHandlerType
    response?: Response
    error?: any
    errorMessage?: string
}

type Primitive =
    | bigint
    | boolean
    | null
    | number
    | string
    | symbol
    | undefined;

type PlainObject = Record<string, Primitive>;

interface HttpServiceProps {
    url: string
    queryParams?: URLSearchParams | QueryParamsType
    headers?: PlainObject
    methodType?: HttpMethodTypes
    data?: any
    returnType?: HttpServiceReturnTypes
    errorHandler?: ErrorHandlerType
    errorMessage?: string
    credentialsType?: FetchInitCredentialsTypes
    returnHeader?: boolean
}

export default HttpServiceProps
