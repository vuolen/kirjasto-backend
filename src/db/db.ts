import { flow, pipe } from "fp-ts/lib/function";
import { retrying } from 'retry-ts/lib/Task'
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as T from "fp-ts/lib/Task"
import * as O from "fp-ts/lib/Option"
import * as A from "fp-ts/lib/Array"
import { createPSQLHandle, SQLHandle } from "./sqlHandle";
import * as sql from "../sql/book.queries";

import { constantDelay } from "retry-ts";

import Task = T.Task
import TaskEither = TE.TaskEither
import Option = O.Option

export interface DatabaseHandle {
    getBooks: TaskEither<Error, Array<Book>>,
    addBook: (book: BookInput) => TaskEither<Error, Book>
    getAuthor: (id: Author["id"]) => TaskEither<Error, Author>,
    getAuthors: TaskEither<Error, Array<Author>>,
    addAuthor: (author: AuthorInput) => TaskEither<Error, Author>
}

interface Book {
    id: number,
    title: string,
    author: Option<Author>
}

interface BookInput {
    title: string
    author_id: Option<Author["id"]>
}

interface Author {
    id: number,
    name: string
}

interface AuthorInput {
    name: string
}

const createTables = (handle: SQLHandle) => 
    flow(
        () => console.log(`Trying to connect to database ${process.env.DATABASE_URL}`),
        () => handle.run(sql.createAuthorTable, undefined),
        TE.chain(
            () => handle.run(sql.createBookTable, undefined)
        )
    )

const databaseRowToBook = (handle: SQLHandle) => (row: any) => 
    pipe(
        row.author_id,
        O.fromNullable,
        O.map(
            getAuthor(handle),
        ),
        O.sequence(TE.ApplicativePar),
        TE.map(
            author => ({id: row.id, title: row.title, author} as Book)
        )
    )


// EXPORTS

export const createDatabaseHandle = (): Task<DatabaseHandle> => {
    const sqlHandle = createPSQLHandle()
    return pipe(
        retrying(
            constantDelay(2000),
            createTables(sqlHandle),
            E.isLeft
        ),
        T.map(() => ({
            getBooks: getBooks(sqlHandle),
            addBook: addBook(sqlHandle),
            getAuthor: getAuthor(sqlHandle),
            getAuthors: getAuthors(sqlHandle),
            addAuthor: addAuthor(sqlHandle)
        }))
    )
}
 
const getBooks: (handle: SQLHandle) => DatabaseHandle["getBooks"] =
    (handle) => pipe(
        handle.run(sql.getAllBooks, undefined),
        TE.chain(
            flow(
                A.map(
                    databaseRowToBook(handle)
                ),
                A.sequence(TE.ApplicativePar)
            )
        )
    )

const addBook: (handle: SQLHandle) => DatabaseHandle["addBook"] =
    (handle) => ({title, author_id}) => pipe(
        handle.run(sql.addBook, {title, author_id: O.toUndefined(author_id)}),
        TE.chain(
            flow(
                rows => rows[0],
                databaseRowToBook(handle)
            )
        )
    )

const getAuthor: (handle: SQLHandle) => DatabaseHandle["getAuthor"] = 
    (handle) => (id) => pipe(
        handle.run(sql.getAuthorById, {id}),
        TE.map(rows => rows[0] as Author)
    )

const getAuthors: (handle: SQLHandle) => DatabaseHandle["getAuthors"] =
    (handle) => pipe(
        handle.run(sql.getAllAuthors, undefined)
    )

const addAuthor: (handle: SQLHandle) => DatabaseHandle["addAuthor"] =
    (handle) => ({name}) => pipe(
        handle.run(sql.addAuthor, {name}),
        TE.map(rows => rows[0] as Author)
    )
