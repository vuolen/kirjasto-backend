import { Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db";
import { ServiceResponse } from "../main";
import * as IOTE from "../types/IOTaskEither";
import * as E from "fp-ts/lib/Either"

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
    

export const addBookService = (db: Pick<DatabaseHandle, "addBook">) => (req: AddBookRequest): IOTE.IOTaskEither<Error, ServiceResponse> =>
    pipe(
        req,
        validate,
        E.fold(
            error => IOTE.right({body: {error}, statusCode: 422} as ServiceResponse),
            flow(
                db.addBook,
                IOTE.map(books => ({body: books}))
            )
        )
    )