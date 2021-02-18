import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { getBooksService } from "../src/services/getBooksService"
import { getRightOrFail, getLeftOrFail, unimpl } from "./util"
import { Request } from "express"

import Either = E.Either

const VALID_AUTHOR = {id: 1, name: "Test Testersson"}
const VALID_BOOK = {id: 1, title: "Test Book", author_id: O.some(1), author: O.some(VALID_AUTHOR)}

const VALID_GETBOOKS_RESPONSE = [{id: 1, title: "Test Book", author: VALID_AUTHOR}]

const MOCK_REQ = {} as Request

const getBookWithMockedDbValue = (dbValue: any) => {
    const mockDb = {getBooks: TE.right(dbValue), getAuthor: () => TE.right(VALID_AUTHOR)}
    return getBooksService(mockDb)
}

test("getBookService returns empty array as body when no books exist", done => {
    getBookWithMockedDbValue([])(MOCK_REQ)().then(
        either => {
            expect(getRightOrFail(either).body).toEqual([])
            done()
        }
    )
})

test("getBookService returns correct book as body when a book exists", done => {
    getBookWithMockedDbValue([VALID_BOOK])(MOCK_REQ)().then(
        either => {
            expect(getRightOrFail(either).body).toEqual(VALID_GETBOOKS_RESPONSE)
            done()
        }
    )
})

test("getBookService returns error when database gives an error", done => {
    const mockDb = {getBooks: TE.left(new Error("Database error")), getAuthor: unimpl}
    getBooksService(mockDb)(MOCK_REQ)().then(
        either => {
            const res = getLeftOrFail(either)
            expect(res).toBeInstanceOf(Error)
            expect(res.message).toBe("Database error")
            done()
        }
    )
})

test("getBookService returns no status code when there is no error", done => {
    getBookWithMockedDbValue([])(MOCK_REQ)().then(
        either => {
            expect(getRightOrFail(either).statusCode).toBeUndefined()
            done()
        }
    )
})