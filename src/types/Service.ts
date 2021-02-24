import { TaskEither } from "fp-ts/lib/TaskEither";
import { Request } from "express"

export type Service<T = any> = (req: Request) => TaskEither<Error, ServiceResponse<T>>

export interface ServiceResponse<T = any> {
    statusCode?: number,
    body: T | APIError
}

export type APIError = {error: any}

export function isAPIError(response: any): response is APIError {
    return response.error !== undefined
}