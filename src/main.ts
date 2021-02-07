import * as express from 'express'
import * as cors from 'cors'
import { flow, pipe } from 'fp-ts/lib/function'
import { createDatabaseHandle, DatabaseHandle } from './db/db'
import { getBookService } from './services/getBookService'
import { addBookService } from './services/addBookService'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as I from 'fp-ts/lib/IO'
import * as A from 'fp-ts/lib/Array'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'
import { Service } from './types/Service'


import IO = I.IO

const PORT = process.env.PORT || 8000

const main: IO<void> =
    pipe(
        createDatabaseHandle(),
        T.map(
            flow(
                createExpress,
                app => app.listen(PORT, () => console.log("Backend server is running on " + PORT))
            )
        )
    )


const serviceToHandler = (service: Service): express.RequestHandler =>
    (req, res) => pipe(
        req,
        service,
        TE.fold(
            err => T.of({body: {error: "Internal server error: " + err}, statusCode: 500}),
            right => T.of({body: right.body, statusCode: right.statusCode || 200})
        ),
        taskEither => taskEither().then(
            response => {
                res.statusCode = response.statusCode
                res.json(response.body)
            }
        )
    )

const requirePermissions = (service: Service, permissions: Array<string>): Service =>
    (req) => pipe(
        permissions,
        A.map(
            permission => req.user && req.user.scope && req.user.scope.includes(permission) ? E.right(req) : E.left(`Invalid permissions: ${permission}`)
        ),
        A.sequence(E.either),
        E.mapLeft(
            err => new Error(err)
        ),
        TE.fromEither,
        TE.chain(
            () => service(req)
        ),
    )
    

function createExpress(db: DatabaseHandle) {
    return pipe(
        express(),
        app => app.use(cors()),
        app => app.use(express.json()),
        app => app.get("/books", serviceToHandler(getBookService(db))),
        app => app.post("/books",
            jwt({secret: jwksRsa.expressJwtSecret({
                jwksUri: "https://kirjasto-e2e.eu.auth0.com/.well-known/jwks.json"
            }), algorithms: ["RS256"]}),
            serviceToHandler(
                requirePermissions(addBookService(db), ["add:book"])
            )
/*                 pipe(
                    req.user.scope && req.user.scope.includes("add:book") ? E.right(req) : E.left("Invalid permissions: add:book"),
                    E.map(
                        serviceToHandler(addBookService(db))
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
                ) */
        )
    )
}

main()