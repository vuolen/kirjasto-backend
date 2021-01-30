import { flow, pipe } from "fp-ts/lib/function";
import { retrying } from 'retry-ts/lib/Task'
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as T from "fp-ts/lib/Task"
import * as I from "fp-ts/lib/IO"
import * as O from "fp-ts/lib/Option"
import * as A from "fp-ts/lib/Array"

import { constantDelay } from "retry-ts";

import Task = T.Task
import TaskEither = TE.TaskEither
import Option = O.Option
import { createPSQLHandle, SQLHandle, SQLQueryResult } from "./sqlHandle";
import * as sql from "../sql/book.queries";

export interface DatabaseHandle {
    getBooks: TaskEither<Error, Array<Book>>,
    addBook: (book: BookInput) => TaskEither<Error, Book>
    getAuthor: (id: Author["id"]) => TaskEither<Error, Author>,
    addAuthor: (author: AuthorInput) => TaskEither<Error, Author>
}

interface Book {
    id: number,
    title: string,
    author: Option<Author>
}

interface BookInput {
    title: string
    author_id: Option<number>
}

interface Author {
    id: number,
    name: string
}

interface AuthorInput {
    name: string
}

const createTable = (handle: SQLHandle) => 
    flow(
        () => console.log(`Trying to connect to database ${process.env.DATABASE_URL}`),
        () => handle.run(sql.createAuthorTable, undefined),
        TE.chain(
            () => handle.run(sql.createBookTable, undefined)
        )
    )

export const createDatabaseHandle = (): Task<DatabaseHandle> => {
    const sqlHandle = createPSQLHandle()
    return pipe(
        retrying(
            constantDelay(2000),
            createTable(sqlHandle),
            E.isLeft
        ),
        T.map(() => ({
            getBooks: getBooks(sqlHandle),
            addBook: addBook(sqlHandle),
            getAuthor: getAuthor(sqlHandle),
            addAuthor: addAuthor(sqlHandle)
        }))
    )
}

const removeNulls = (obj: any) => {
    for (var propName in obj) {
        if (obj[propName] === null) {
            delete obj[propName];
        }
    }
    return obj
}

export const getBooks: (handle: SQLHandle) => DatabaseHandle["getBooks"] =
    (handle) => pipe(
        handle.run(sql.getAllBooks, undefined),
        TE.chain(flow(
            A.map(
                row => ({...row, author_id: O.fromNullable(row.author_id)})
            ),
            A.map(
                row => pipe(
                    row.author_id,
                    O.map(
                        flow(
                            getAuthor(handle),
                        )
                    ),
                    O.sequence(TE.ApplicativePar),
                    TE.map(
                        author => ({...row, author} as Book)
                    )
                )
            ),
            A.sequence(TE.ApplicativePar)
        ))
    )


export const addBook: (handle: SQLHandle) => DatabaseHandle["addBook"] =
    (handle) => ({title, author_id}) => pipe(
        handle.run(sql.addBook, {title, author_id: O.toUndefined(author_id)}),
        TE.chain(
            flow(
                rows => rows[0],
                row => pipe(
                    row.author_id,
                    O.fromNullable,
                    O.map(
                        flow(
                            getAuthor(handle),
                        )
                    ),
                    O.sequence(TE.ApplicativePar),
                    TE.map(
                        author => ({title: row.title, author} as Book)
                    )
                )
            )
        )
    )

export const getAuthor: (handle: SQLHandle) => DatabaseHandle["getAuthor"] = 
    (handle) => (id) => pipe(
        handle.run(sql.getAuthorById, {id}),
        TE.map(rows => rows[0] as Author)
    )

export const addAuthor: (handle: SQLHandle) => DatabaseHandle["addAuthor"] =
    (handle) => ({name}) => pipe(
        handle.run(sql.addAuthor, {name}),
        TE.map(rows => rows[0] as Author)
    )
