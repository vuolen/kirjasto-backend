import { TaskEither } from "fp-ts/lib/TaskEither";
import { Request } from "express"
import { APIError } from "kirjasto-shared";

export type Service<T = any> = (req: Request) => TaskEither<Error, ServiceResponse<T>>

export interface ServiceResponse<T = any> {
    statusCode?: number,
    body: T | APIError
}