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
    title: string,
    author?: string
}

interface DbBookInput {
    title: string
    author?: string
}

const createTable = (pool: Pool) => () => pipe(
    query(`
        CREATE TABLE IF NOT EXISTS book (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT
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

const removeNulls = (obj: any) => {
    for (var propName in obj) {
        if (obj[propName] === null) {
            delete obj[propName];
        }
    }
    return obj
}

export const getBooks: (pool: Pool) => TaskEither<Error, DbBook[]> = 
    flow(
        query("SELECT * FROM book"),
        TE.map(flow(
            query => query.rows as DbBook[],
            books => books.map(removeNulls)
        )),
    )

export const addBook: (pool: Pool) => (book: DbBookInput) => TaskEither<Error, DbBook> = (pool) => (book) =>
    pipe(
        pool,
        query("INSERT INTO book(title, author) VALUES($1, $2) RETURNING *", [book.title, book.author]),
        TE.map(query => query.rows[0] as DbBook)
    )