import { toError } from "fp-ts/lib/Either";
import  * as IOTE from "./types/IOTaskEither"
import { Pool, QueryResult } from "pg";
import { pipe } from "fp-ts/lib/function";

export interface DatabaseHandle {
    getBooks: IOTE.IOTaskEither<Error, DbBook[]>
}

interface DbBook {
    id: number,
    title: string
}

export function createDatabaseHandle() {
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

const query = (pool: Pool) => (queryString: string): IOTE.IOTaskEither<Error, QueryResult<any>> =>
    IOTE.tryCatch(
        () => pool.query(queryString),
        toError
    )

export const getBooks = (pool: Pool) =>
    pipe(
        query(pool)("SELECT * FROM book"),
        IOTE.map(query => query.rows as DbBook[])
    )