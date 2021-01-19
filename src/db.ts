import { toError } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { retrying } from 'retry-ts/lib/Task'
import { Pool, Query, QueryResult } from "pg";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either"
import * as T from "fp-ts/lib/Task"
import * as IO from "fp-ts/lib/IO"
import { constantDelay } from "retry-ts";
import { log } from "fp-ts/lib/Console";

import Task = T.Task
import TaskEither = TE.TaskEither

export interface DatabaseHandle {
    getBooks: TaskEither<Error, DbBook[]>,
    addBook: (book: DbBookInput) => TaskEither<Error, DbBook>
}

interface DbBook {
    id: number,
    title: string
}

interface DbBookInput {
    title: string
}

const createTable = (pool: Pool) => () => pipe(
    query(`
        CREATE TABLE IF NOT EXISTS book (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL
        )
    `)(pool)
)

export const createDatabaseHandle = (): Task<DatabaseHandle> => {
    const pool = new Pool({connectionString: process.env.DATABASE_URL})
    return pipe(
        retrying(
            constantDelay(2000),
            createTable(pool),
            E.isLeft
        ),
        T.map(() => ({
            getBooks: getBooks(pool),
            addBook: addBook(pool)
        }))
    )
}

const query: (queryString: string, values?: any[]) => (pool: Pool) => TaskEither<Error, QueryResult<any>> = 
    (queryString, values) => flow(
        pool => () => pool.query(queryString, values),
        promise => TE.tryCatch(
            promise,
            toError
        )
    )

export const getBooks: (pool: Pool) => TaskEither<Error, DbBook[]> = 
    flow(
        query("SELECT * FROM book"),
        TE.map(query => query.rows as DbBook[])
    )

export const addBook: (pool: Pool) => (book: DbBookInput) => TaskEither<Error, DbBook> = (pool) => (book) =>
    pipe(
        pool,
        query("INSERT INTO book(title) VALUES($1) RETURNING *", [book.title]),
        TE.map(query => query.rows[0] as DbBook)
    )