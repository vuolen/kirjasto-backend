import * as E from "fp-ts/lib/Either"
import * as IOTE from "../src/types/IOTaskEither"
import { getBookService } from "../src/services/getBookService"

import Either = E.Either

const getRightOrFail = <E, A>(a: Either<E, A>): A => {
    expect(E.isRight(a)).toBeTruthy()
    return (a as E.Right<A>).right
}

// TODO: remove the clash of the type parameter E and the alias import Either as E
const getLeftOrFail = <E, A>(e: Either<E, A>): E => {
    expect(E.isLeft(e)).toBeTruthy()
    return (e as E.Left<E>).left
}

const VALID_BOOK = {id: 1, title: "Test Book"}

test("getBookService returns empty array as body when no books exist", done => {
    const mockDb = {getBooks: IOTE.right([])}
    getBookService(mockDb)()().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual([])
            done()
        }
    )
})

test("getBookService returns correct book as body when a book exist", done => {
    const mockDb = {getBooks: IOTE.right([VALID_BOOK])}
    getBookService(mockDb)()().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual([VALID_BOOK])
            done()
        }
    )
})

test("getBookService returns error when database gives an error", done => {
    const mockDb = {getBooks: IOTE.left(new Error("Database error"))}
    getBookService(mockDb)()().then(
        either => {
            const res = getLeftOrFail(either)
            expect(res).toBeInstanceOf(Error)
            expect(res.message).toBe("Database error")
            done()
        }
    )
})

test("getBookService returns no status code when there is no error", done => {
    const mockDb = {getBooks: IOTE.right([])}
    getBookService(mockDb)()().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.statusCode).toBeUndefined()
            done()
        }
    )
})