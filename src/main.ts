require("dotenv").config()
import { createServer, httpListener, r } from '@marblejs/core';
import { bodyParser$ } from '@marblejs/middleware-body';


const server = createServer({
    port: 8000,
    listener: httpListener({
        middlewares: [
        ],
        effects: [
            r.pipe(
                r.matchPath("/books"),
                r.matchType("GET"),
                r.useEffect(req$ => req$.pipe(
                    
                ))
            )
        ]
    })
})

;(async () => (await server)())()