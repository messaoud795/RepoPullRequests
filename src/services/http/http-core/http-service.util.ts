import { ErrorHandlerProps, QueryParamsType } from './http-service.props'
import { isEmpty, isNil } from 'lodash'
import { URLSearchParams as URLSearchParamsType } from 'url'

export function handleError({
    url,
    errorHandler,
    response,
    error,
    errorMessage
}: ErrorHandlerProps): any {
    const getAdditionalErrorMessage = (errorMessage: string | undefined) =>
        !isEmpty(errorMessage) ? ` --- ${ errorMessage }` : ''

    if (!isNil(response)) {
        console.error(
            `${
                response.statusText
            } - Could not fetch data for url: "${ url }"${ getAdditionalErrorMessage(errorMessage) }`
        )
    } else if (!isNil(error)) {
        const prefix = error.name === 'AbortError' ? 'Fetch Aborted! ' : ''
        const msg = getAdditionalErrorMessage(errorMessage)
        console.error(`${ prefix }Error occurred during fetch: "${ url }"${ msg }`)
    }

    return errorHandler ? errorHandler(error, response) : undefined
}

export function getResourceUrl(
    url: string,
    queryParams: URLSearchParamsType | QueryParamsType | undefined
): string {
    let result = url
    if (!isNil(queryParams)) {
        if (queryParams instanceof URLSearchParams) {
            const urlObject = new URL(url)
            urlObject.search = queryParams.toString()
            result = urlObject.toString()
        } else if (!isEmpty(queryParams)) {
            const params = new URLSearchParams()
            for (const [key, value] of Object.entries(queryParams)) {
                if (!isNil(value)) {
                    params.append(key, `${ value }`)
                }
            }
            const urlObject = new URL(url)
            urlObject.search = params.toString()
            result = urlObject.toString()
        }
    }
    return result
}
