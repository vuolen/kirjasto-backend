import * as express from 'express'
import * as cors from 'cors'
import { flow, pipe } from 'fp-ts/lib/function'
import { createDatabaseHandle, DatabaseHandle } from './db'
import { getBookService } from './services/getBookService'
import * as IOTE from './types/IOTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as I from 'fp-ts/lib/IO'

import IO = I.IO

export interface ServiceResponse {
    statusCode?: number,
    body: any
}

const PORT = process.env.PORT || 8000

const main: IO<void> =
    pipe(
        createDatabaseHandle(),
        T.map(
            createExpress
        ),
        T.map(
            app => app.listen(PORT, () => console.log("Backend server is running on " + PORT))
        )
    )

function createExpress(db: DatabaseHandle) {
    return pipe(
        express(),
        app => app.use(cors()),
        app => app.use(express.json()),
        app => app.get("/books", (req, res) => 
            pipe(
                getBookService(db),
                IOTE.fold(
                    err => ({body: {error: "Internal server error: " + err}, statusCode: 500}),
                    right => ({body: right.body, statusCode: right.statusCode || 200})
                ),
                iote => iote()()
            ).then(
                response => {
                    res.statusCode = response.statusCode
                    res.json(response.body)
                }
            )
        )
    )
}

main()