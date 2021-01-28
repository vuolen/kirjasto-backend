import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { getBookService } from "../src/services/getBookService"

import Either = E.Either
import { getRightOrFail, getLeftOrFail } from "./util"
import { unimpl } from "./addBookService.test"

const VALID_AUTHOR = {id: 1, name: "Test Testersson"}
const VALID_BOOK = {id: 1, title: "Test Book", author_id: O.some(1), author: O.some(VALID_AUTHOR)}

const getBookWithMockedDbValue = (dbValue: any) => {
    const mockDb = {getBooks: TE.right(dbValue), getAuthor: () => TE.right(VALID_AUTHOR)}
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
    const mockDb = {getBooks: TE.left(new Error("Database error")), getAuthor: unimpl}
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