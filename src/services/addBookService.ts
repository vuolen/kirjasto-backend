import { Either } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { createDatabaseHandle, DatabaseHandle } from "../db/db";
import { ServiceResponse } from "../main";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as O from "fp-ts/lib/Option"
import * as t from 'io-ts'
import { failure } from 'io-ts/PathReporter'

import TaskEither = TE.TaskEither
import Option = O.Option

type NonEmptyString = string

const nonemptystring = new t.Type<NonEmptyString, string, unknown>(
    'nonemptystring',
    (input: unknown): input is string => typeof input === 'string' && input.length > 0,

    (input, context) => (typeof input === 'string' && input.length > 0 ? t.success(input) : t.failure(input, context)),

    t.identity
  )

const AddBookRequest = t.type({
    title: nonemptystring,
    author: t.union([t.number, t.type({name: nonemptystring}), t.undefined])
})

type AddBookRequest = t.TypeOf<typeof AddBookRequest>

const AddBookResponse = t.type({
    id: t.number,
    title: nonemptystring,
    author: t.union([t.type({name: nonemptystring}), t.undefined])
})

type AddBookResponse = t.TypeOf<typeof AddBookResponse>


export const addBookService = (db: Pick<DatabaseHandle, "addBook" | "getAuthor" | "addAuthor">): (req: AddBookRequest) => TaskEither<Error, ServiceResponse<AddBookResponse>> =>
    flow(
        AddBookRequest.decode,
        E.fold(
            errors => TE.right({body: {error: failure(errors)}, statusCode: 422} as ServiceResponse),
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
                    ({id, title, author}) => pipe(
                        AddBookResponse.encode({id, title, author: O.toUndefined(author)}),
                        response => ({body: response})
                    )
                )
            )
        )
    )