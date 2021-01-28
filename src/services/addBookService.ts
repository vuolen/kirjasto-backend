import { Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { createDatabaseHandle, DatabaseHandle } from "../db/db";
import { ServiceResponse } from "../main";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"

import TaskEither = TE.TaskEither
import Option = O.Option

export type AddBookRequest = {
    title: string,
    author?: number | {name: string}
}

interface AddBookResponse {
    id: number,
    title: string, 
    author?: {id: number, name: string}
}

const validate = (request: AddBookRequest): Either<string, AddBookRequest> =>
    pipe(
        E.right(request),
        E.chain(
            req => req.title.length === 0 ? E.left("Title can not be empty") : E.right(req)
        )
    )
    

export const addBookService = (db: Pick<DatabaseHandle, "addBook" | "getAuthor" | "addAuthor">): (req: AddBookRequest) => TaskEither<Error, ServiceResponse<AddBookResponse>> =>
    flow(
        validate,
        E.fold(
            error => TE.right({body: {error}, statusCode: 422} as ServiceResponse),
            req => pipe(
                req.author,
                O.fromNullable,
                O.map(
                    author => typeof author === "number" ? db.getAuthor(author) : db.addAuthor(author)
                ),
                O.sequence(TE.ApplicativePar),
                TE.chain(
                    flow(
                        O.map(
                            author => author.id
                        ),
                        author_id => db.addBook({...req, author_id}),
                    )
                ),
                TE.map(
                    book => ({body: {
                        title: book.title,
                        author: O.toUndefined(book.author)
                    }
                    })
                )
            )
        )
    )