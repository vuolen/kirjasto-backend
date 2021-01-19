import { Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db";
import { ServiceResponse } from "../main";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"

import TaskEither = TE.TaskEither

export type AddBookRequest = {
    title: string
}

const validate = (request: AddBookRequest): Either<string, AddBookRequest> =>
    pipe(
        E.right(request),
        E.chain(
            req => req.title.length === 0 ? E.left("Title can not be empty") : E.right(req)
        )
    )
    

export const addBookService = (db: Pick<DatabaseHandle, "addBook">) => (req: AddBookRequest): TaskEither<Error, ServiceResponse> =>
    pipe(
        req,
        validate,
        E.fold(
            error => TE.right({body: {error}, statusCode: 422} as ServiceResponse),
            flow(
                db.addBook,
                TE.map(books => ({body: books}))
            )
        )
    )