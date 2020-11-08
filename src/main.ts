require('dotenv').config()
import * as express from 'express'
import { pipe } from 'fp-ts/lib/function'
import { createDatabaseHandle } from './db'
import { getBookService } from './services/getBookService'
import * as IOTE from './types/IOTaskEither'

const db = createDatabaseHandle()

const app = express()

app.use(express.json())

app.get("/books", (req, res) => {
    
    pipe(
        getBookService(db),
        IOTE.fold(
            err => ({body: {error: "Internal server error: " + err}, statusCode: 500}),
            right => ({body: right.body, statusCode: right.statusCode || 200})
        )
    )()().then(
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