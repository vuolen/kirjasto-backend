import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { getBookService } from "../src/services/getBookService"

import Either = E.Either
import { getRightOrFail, getLeftOrFail } from "./util"

const VALID_BOOK = {id: 1, title: "Test Book"}

const getBookWithMockedDbValue = (dbValue: any) => {
    const mockDb = {getBooks: TE.right(dbValue)}
    return getBookService(mockDb)
}

test("getBookService returns empty array as body when no books exist", done => {
    getBookWithMockedDbValue([])().then(
        either => {
            expect(getRightOrFail(either).body).toEqual([])
            done()
        }
    )
})

test("getBookService returns correct book as body when a book exist", done => {
    getBookWithMockedDbValue([VALID_BOOK])().then(
        either => {
            expect(getRightOrFail(either).body).toEqual([VALID_BOOK])
            done()
        }
    )
})

test("getBookService returns error when database gives an error", done => {
    const mockDb = {getBooks: TE.left(new Error("Database error"))}
    getBookService(mockDb)().then(
        either => {
            const res = getLeftOrFail(either)
            expect(res).toBeInstanceOf(Error)
            expect(res.message).toBe("Database error")
            done()
        }
    )
})

test("getBookService returns no status code when there is no error", done => {
    getBookWithMockedDbValue([])().then(
        either => {
            expect(getRightOrFail(either).statusCode).toBeUndefined()
            done()
        }
    )
})