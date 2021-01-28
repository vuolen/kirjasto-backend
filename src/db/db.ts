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

export interface DatabaseHandle {
    getBooks: TaskEither<Error, Array<DbBook>>,
    addBook: (book: DbBookInput) => TaskEither<Error, DbBook>
    getAuthor: (id: DbAuthor["id"]) => TaskEither<Error, DbAuthor>,
    addAuthor: (author: DbAuthorInput) => TaskEither<Error, DbAuthor>
}

interface DbBook {
    id: number,
    title: string,
    author_id: Option<number>
    author: Option<DbAuthor>
}

interface DbBookInput {
    title: string
    author_id: Option<number>
}

interface DbAuthor {
    id: number,
    name: string
}

interface DbAuthorInput {
    name: string
}

const createTable = (handle: SQLHandle) => 
    flow(
        () => console.log(`Trying to connect to database ${process.env.DATABASE_URL}`),
        () => handle.query(`
            CREATE TABLE IF NOT EXISTS author (
                id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
                name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS book (
                id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
                title TEXT NOT NULL,
                author_id INT,

                CONSTRAINT fk_author
                    FOREIGN KEY (author_id)
                        REFERENCES author(id)
            );
        `)
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
        handle.query("SELECT * FROM book"),
        TE.chain(flow(
            query => query.rows,
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
                        author => ({...row, author} as DbBook)
                    )
                )
            ),
            A.sequence(TE.ApplicativePar)
        ))
    )

export const addBook: (handle: SQLHandle) => DatabaseHandle["addBook"] =
    (handle) => (book) => pipe(
        handle.query("INSERT INTO book(title, author_id) VALUES($1, $2) RETURNING *", [book.title, O.toUndefined(book.author_id)]),
        TE.chain(
            flow(
                query => query.rows[0],
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
                        author => ({...row, author} as DbBook)
                    )
                )
            )
        )
    )

export const getAuthor: (handle: SQLHandle) => DatabaseHandle["getAuthor"] = 
    (handle) => (id) => pipe(
        handle.query("SELECT * FROM author WHERE id=$1", [id]),
        TE.map(query => query.rows[0] as DbAuthor)
    )

export const addAuthor: (handle: SQLHandle) => DatabaseHandle["addAuthor"] =
    (handle) => (author) => pipe(
        handle.query("INSERT INTO author(name) VALUES($1) RETURNING *", [author.name]),
        TE.map(query => query.rows[0] as DbAuthor)
    )
