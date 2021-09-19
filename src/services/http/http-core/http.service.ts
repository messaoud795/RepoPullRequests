import { isEmpty } from 'lodash'
import HttpMethodTypes from './http-method-types.enum'
import HttpServiceProps from './http-service.props'
import { FetchInitCredentialsTypes, HttpServiceReturnTypes } from './http-service.constants'
import { getResourceUrl, handleError } from './http-service.util'

function httpService<Type>({
    url,
    queryParams,
    headers,
    methodType = HttpMethodTypes.GET,
    data,
    returnType = HttpServiceReturnTypes.JSON,
    errorHandler,
    errorMessage,
    credentialsType = FetchInitCredentialsTypes.INCLUDE,
    returnHeader = false
}: HttpServiceProps): Promise<Type> {
    let responseHeader: Headers
    const resource: string = getResourceUrl(url, queryParams)
    const initData: any = {
        method: methodType,
        credentials: credentialsType,
        ...(!isEmpty(headers) && { headers }),
        ...(
            (!isEmpty(data) && methodType !== HttpMethodTypes.GET)
            && { body: JSON.stringify(data) }
        )
    }

    return fetch(resource, initData)
        .then((response: Response) => {
            if (!response.ok) {
                return handleError({
                    url,
                    errorHandler,
                    response,
                    errorMessage
                })
            } else {
                responseHeader = response.headers
                if (returnType === HttpServiceReturnTypes.BLOB) {
                    return response.blob()
                } else if (returnType === HttpServiceReturnTypes.JSON) {
                    return response.json()
                } else if (returnType === HttpServiceReturnTypes.TEXT) {
                    return response.text()
                }
            }
        })
        .then((response) => {
            return returnHeader
                ? {
                    body: response,
                    header: responseHeader
                }
                : response
        })
        .catch((error: any) =>
            handleError({
                url,
                errorHandler,
                error,
                errorMessage
            })
        )
}

export default httpService
