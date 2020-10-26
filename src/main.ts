require("dotenv").config()
import { createServer, httpListener } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';
import { RxPool } from './db';
import { api$ } from './routes';


const server = createServer({
    port: 8000,
    listener: httpListener({
        middlewares: [
            bodyParser$()
        ],
        effects: [
            api$(new RxPool())
        ]
    })
})

;(async () => (await server)())()