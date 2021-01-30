import { PreparedQuery } from "@pgtyped/query";
import { toError } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import { IO } from "fp-ts/lib/IO";
import { chain } from "fp-ts/lib/ReadonlySet";
import { Task } from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import { Pool, QueryResult } from "pg";

import TaskEither = TE.TaskEither

export interface SQLHandle {
    run<TParamType, TResultType>(query: PreparedQuery<TParamType, TResultType>, parameters: TParamType): TaskEither<Error, TResultType[]>
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
            run: flow(
                TE.tryCatchK(
                    (query, params) => query.run(params, pool),
                    toError
                )
            ),
        }) as SQLHandle
    )