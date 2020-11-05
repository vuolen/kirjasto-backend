require('dotenv').config()
import * as express from 'express'
import { pipe } from 'fp-ts/lib/function'
import { of as T_of } from 'fp-ts/lib/Task'
import { fold as TE_fold } from 'fp-ts/lib/TaskEither'
import { createDatabaseHandle } from './db'
import { getBookService } from './services/getBookService'

const db = createDatabaseHandle()

const app = express()

app.use(express.json())

app.get("/books", (req, res) => {
    pipe(
        getBookService(db),
        TE_fold(
            err => T_of({body: {error: "Internal server error: " + err}, statusCode: 500}),
            right => T_of({body: right.body, statusCode: right.statusCode || 200})
        )
    )().then(
        response => {
            res.statusCode = response.statusCode
            res.json(response.body)
        }
    )
})

export interface ServiceResponse {
    statusCode?: number,
    body: any
}

app.listen(8000, () => console.log("Server is running"))