import { toError } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { retrying } from 'retry-ts/lib/Task'
import { Pool, Query, QueryResult } from "pg";
import {IOTaskEither} from "./types/IOTaskEither";
import * as IOTE from "./types/IOTaskEither";
import * as E from "fp-ts/lib/Either"
import * as T from "fp-ts/lib/Task"
import * as IO from "fp-ts/lib/IO"
import { constantDelay } from "retry-ts";
import { log } from "fp-ts/lib/Console";
import { Do } from "fp-ts-contrib/lib/Do";

import Task = T.Task

export interface DatabaseHandle {
    getBooks: IOTaskEither<Error, DbBook[]>
}

interface DbBook {
    id: number,
    title: string
}

const createTable = (pool: Pool) => pipe(
    query(`
        CREATE TABLE IF NOT EXISTS book (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL
        )
    `)(pool),
    IO.chainFirst(() => log("Trying to connect to database"))
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
            getBooks: getBooks(pool)
        }))
    )
}

const query: (queryString: string) => (pool: Pool) => IOTaskEither<Error, QueryResult<any>> = 
    queryString => flow(
        pool => () => pool.query(queryString),
        promise => IOTE.tryCatch(
            promise,
            toError
        )
    )

export const getBooks: (pool: Pool) => IOTaskEither<Error, DbBook[]> = 
    flow(
        query("SELECT * FROM book"),
        IOTE.map(query => query.rows as DbBook[])
    )