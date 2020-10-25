require("dotenv").config()
import { createServer, httpListener } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';
import { api$ } from './routes';


const server = createServer({
    port: 8000,
    listener: httpListener({
        middlewares: [
            bodyParser$()
        ],
        effects: [
            api$
        ]
    })
})

;(async () => (await server)())()