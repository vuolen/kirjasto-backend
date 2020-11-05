import { toError } from "fp-ts/lib/Either";
import { TaskEither, tryCatch } from "fp-ts/lib/TaskEither";
import { Pool } from "pg";

export interface DatabaseHandle {
    getBooks: TaskEither<Error, {id: number, title: string}[]>
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

const query = (pool: Pool) => (queryString: string): TaskEither<Error, any[]> =>
    tryCatch(
        () => pool.query(queryString).then(res => res.rows),
        toError
    )

export const getBooks = (pool: Pool) => 
    query(pool)("SELECT * FROM book") as TaskEither<Error, DbBook[]>