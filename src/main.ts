import * as express from 'express'
import * as cors from 'cors'
import { flow, pipe } from 'fp-ts/lib/function'
import { createDatabaseHandle, DatabaseHandle } from './db/db'
import { getBookService } from './services/getBookService'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as I from 'fp-ts/lib/IO'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'


import IO = I.IO
import { addBookService } from './services/addBookService'
import JwksRsa = require('jwks-rsa')

export interface ServiceResponse<T = any> {
    statusCode?: number,
    body: T | APIError
}

export type APIError = {error: string}

export function isAPIError(response: any): response is APIError {
    return response.error !== undefined
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
        app => app.get("/books", (_, res) => 
            pipe(
                getBookService(db),
                TE.fold(
                    err => T.of({body: {error: "Internal server error: " + err}, statusCode: 500}),
                    right => T.of({body: right.body, statusCode: right.statusCode || 200})
                ),
                taskEither => taskEither()
            ).then(
                response => {
                    res.statusCode = response.statusCode
                    res.json(response.body)
                }
            )
        ),
        app => app.post("/books",
            jwt({secret: jwksRsa.expressJwtSecret({
                jwksUri: "https://kirjasto-e2e.eu.auth0.com/.well-known/jwks.json"
            }), algorithms: ["RS256"]}),
            (req, res) => 
                pipe(
                    req.user.scope.includes("add:book") ? E.right(req.body) : E.left("Invalid permissions: add:book"),
                    asd => {
                        return asd
                    },
                    E.map(
                        flow(
                            addBookService(db),
                            TE.fold(
                                err => T.of({body: {error: "Internal server error: " + err}, statusCode: 500}),
                                right => T.of({body: right.body, statusCode: right.statusCode || 200})
                            ),
                            taskEither => taskEither()
                        )
                    ),
                    E.fold(
                        err => Promise.resolve({body: {error: err}, statusCode: 401}),
                        right => right
                    )
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