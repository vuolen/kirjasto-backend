import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { addBookService } from "../src/services/addBookService"

import Either = E.Either
import { getLeftOrFail, getRightOrFail } from "./util"
import { isAPIError } from "../src/main"

const VALID_AUTHOR = {id: 1, name: "Test Testersson"}
const VALID_BOOK = {id: 1, title: "Test Book", author_id: O.some(1), author: O.some(VALID_AUTHOR)}
const VALID_ADDBOOK_REQUEST = {title: "Test Book", author: {name: "Test Testersson"}}

const VALID_BOOK_RESPONSE = {id: 1, title: "Test Book", author_id: 1, author: VALID_AUTHOR}

export const unimpl = (...args: any) => {throw new Error("Unimplemented")}

test("addBookService returns a body with an error given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK), addAuthor: unimpl, getAuthor: unimpl}
    addBookService(mockDb)({...VALID_ADDBOOK_REQUEST, title: ""})().then(
        either => {
            const err = getRightOrFail(either)
            expect(isAPIError(err.body)).toBeTruthy()
            done()
        }
    )
})

test("addBookService returns status code 422 given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK), addAuthor: unimpl, getAuthor: unimpl}
    addBookService(mockDb)({...VALID_ADDBOOK_REQUEST, title: ""})().then(
        either => {
            const err = getRightOrFail(either)
            expect(err.statusCode).toEqual(422)
            done()
        }
    )
})

test("addBookService returns error when database gives an error", done => {
    const mockDb = {addBook: () => TE.left(new Error("Database error")), addAuthor: unimpl, getAuthor: unimpl}
    addBookService(mockDb)(VALID_ADDBOOK_REQUEST)().then(
        either => {
            const res = getLeftOrFail(either)
            expect(res).toBeInstanceOf(Error)
            expect(res.message).toBe("Database error")
            done()
        }
    )
})

test("addBookService returns created book with valid request", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK), addAuthor: () => TE.right(VALID_AUTHOR), getAuthor: unimpl}
    addBookService(mockDb)(VALID_ADDBOOK_REQUEST)().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual(VALID_BOOK_RESPONSE)
            done()
        }
    )
})