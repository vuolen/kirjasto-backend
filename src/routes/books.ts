import { combineRoutes, r } from '@marblejs/core'
import { map, mergeMap, mergeMapTo, toArray } from 'rxjs/operators'
import { createBook, getBookAuthors, getBooks } from '../services/books'

const getBooksRoute = r.pipe(
    r.matchPath("/"),
    r.matchType("GET"),
    r.useEffect(req$ => req$.pipe(
        mergeMapTo(getBooks()),
        toArray(),
        map(books => ({body: books}))
    ))
)

const createBookRoute = r.pipe(
    r.matchPath("/"),
    r.matchType("POST"),
    r.useEffect(reg$ => reg$.pipe(
        map(req => req.body as {title: string}),
        mergeMap(createBook),
        map(book => ({body: book}))
    ))
)

export const bookRoutes = combineRoutes("/books", [getBooksRoute, createBookRoute])