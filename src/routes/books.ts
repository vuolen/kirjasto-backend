import { combineRoutes, r } from '@marblejs/core'
import { requestValidator$ } from '@marblejs/middleware-io'
import { map } from 'rxjs/operators'
import { CreateBookRequest } from '../common/types'
import { RxPool } from '../db'
import { createBook } from '../services/books'

/* const getBooksRoute = (db: RxPool) =>  r.pipe(
    r.matchPath("/"),
    r.matchType("GET"),
    r.useEffect(req$ => req$.pipe(
        mergeMapTo(getBooks()),
        toArray(),
        map(books => ({body: books}))
    ))
) */

const createBookRoute = (db: RxPool) =>  r.pipe(
    r.matchPath("/"),
    r.matchType("POST"),
    r.useEffect(reg$ => reg$.pipe(
        requestValidator$({body: CreateBookRequest}),
        map(req => req.body as CreateBookRequest),
        createBook(db),
        map(book => ({body: book}))
    ))
)

export const bookRoutes = (db: RxPool) => combineRoutes("/books", [createBookRoute(db)])