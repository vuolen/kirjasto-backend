import { toError } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { chain } from "fp-ts/lib/ReadonlySet";
import { Task } from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Pool, QueryResult } from "pg";

import TaskEither = TE.TaskEither

export interface SQLHandle {
    query: (queryString: string, params?: any[]) => TaskEither<Error, SQLQueryResult>
}

export interface SQLQueryResultRow {
    [column: string]: any
}

export interface SQLQueryResult {
    rows: SQLQueryResultRow[]
}

export const createPSQLHandle: IO<SQLHandle> = 
    () => pipe(
        new Pool({connectionString: process.env.DATABASE_URL}),
        (pool): SQLHandle => ({
            query: flow(
                TE.tryCatchK(
                    pool.query.bind(pool),
                    toError
                )
            ),
        }) as SQLHandle
    )