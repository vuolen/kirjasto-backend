require('dotenv').config()
import * as express from 'express'
import * as cors from 'cors'
import { flow, pipe } from 'fp-ts/lib/function'
import { createDatabaseHandle } from './db'
import { getBookService } from './services/getBookService'
import * as IOTE from './types/IOTaskEither'

const db = createDatabaseHandle()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/books", (req, res) => 
    flow(
        getBookService,
        IOTE.fold(
            err => ({body: {error: "Internal server error: " + err}, statusCode: 500}),
            right => ({body: right.body, statusCode: right.statusCode || 200})
        ),
        io => io(),
        task => task(),
    )(db).then(
        response => {
            res.statusCode = response.statusCode
            res.json(response.body)
        }
    )
)

export interface ServiceResponse {
    statusCode?: number,
    body: any
}

const HOST = "localhost"
const PORT = process.env.PORT || 8000

app.listen(HOST + ":" + PORT, () => console.log("Backend server is running."))
