import { flow, identity, pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db/db";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import { failure } from 'io-ts/PathReporter'
import { Service, ServiceResponse } from "../types/Service";
import { Errors } from "io-ts";
import { AddBookRequest, AddBookResponse } from "kirjasto-shared";

const trace = <T>(log: string) => (val: T) => {
    console.log(log, val)
    return val
}

export const addBookService = (db: Pick<DatabaseHandle, "addBook" | "getAuthor" | "addAuthor">): Service<AddBookResponse> =>
    ({body}) => pipe(
        body,
        AddBookRequest.decode,
        E.map(
            flow(
                TE.right,
                TE.chainW(
                    req => pipe(
                        req.author,
                        addOrGetExistingAuthor(db),
                    )
                ),
                TE.chainW(
                    flow(
                        O.map(
                            author => author.id
                        ),
                        author_id => db.addBook({...body, author_id}),
                    )
                ),
                TE.chainW(
                    ({id, title, author}) => pipe(
                        AddBookResponse.decode({id, title, author: O.toUndefined(author)}),
                        E.mapLeft(E.toError),
                        TE.fromEither
                    )
                )
            )
        ),
        E.fold(
            errors => TE.right(validationErrorsToAPIError(errors)),
            TE.map(response => ({body: response}))
        )
    )

const validationErrorsToAPIError = <T>(errors: Errors): ServiceResponse<T> => ({body: {error: JSON.stringify(failure(errors))}, statusCode: 422})

/*
    Creates a new author or gets an existing one
*/
const addOrGetExistingAuthor = (db: Pick<DatabaseHandle, "getAuthor" | "addAuthor">) => (author: AddBookRequest["author"]) =>
    pipe(
        author,
        O.fromNullable,
        O.map(
            author => typeof author === "number" ? db.getAuthor(author) : db.addAuthor(author)
        ),
        O.sequence(TE.ApplicativePar)
    )
