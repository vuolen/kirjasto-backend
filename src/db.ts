import { toError } from "fp-ts/lib/Either";
import { flow } from "fp-ts/lib/function";
import { Pool, QueryResult } from "pg";
import * as IOTE from "./types/IOTaskEither";

export interface DatabaseHandle {
    getBooks: IOTE.IOTaskEither<Error, DbBook[]>
}

interface DbBook {
    id: number,
    title: string
}

export const createDatabaseHandle = () => {
    const pool = new Pool()
    pool.query(`
        CREATE TABLE IF NOT EXISTS book (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL
        )
    `)
    return {
        getBooks: getBooks(pool)
    }
}

const query: (queryString: string) => (pool: Pool) => IOTE.IOTaskEither<Error, QueryResult<any>> = 
    queryString => flow(
        pool => () => pool.query(queryString),
        promise => IOTE.tryCatch(
            promise,
            toError
        )
    )

export const getBooks: (pool: Pool) => IOTE.IOTaskEither<Error, DbBook[]> = 
    flow(
        query("SELECT * FROM book"),
        IOTE.map(query => query.rows as DbBook[])
    )