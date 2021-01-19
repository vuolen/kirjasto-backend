import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { addBookService } from "../src/services/addBookService"

import Either = E.Either
import { DatabaseHandle } from "../src/db"
import { getLeftOrFail, getRightOrFail } from "./util"

const VALID_BOOK = {id: 1, title: "Test Book"}
const VALID_ADDBOOK_REQUEST = {title: "Test Book"}

test("addBookService returns a body with an error given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK)}
    addBookService(mockDb)({...VALID_ADDBOOK_REQUEST, title: ""})().then(
        either => {
            const err = getRightOrFail(either)
            expect(err.body.error).toBeDefined()
            done()
        }
    )
})

test("addBookService returns status code 422 given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK)}
    addBookService(mockDb)({...VALID_ADDBOOK_REQUEST, title: ""})().then(
        either => {
            const err = getRightOrFail(either)
            expect(err.statusCode).toEqual(422)
            done()
        }
    )
})

test("addBookService returns error when database gives an error", done => {
    const mockDb = {addBook: () => TE.left(new Error("Database error"))}
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
    const mockDb = {addBook: () => TE.right(VALID_BOOK)}
    addBookService(mockDb)(VALID_ADDBOOK_REQUEST)().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual(VALID_BOOK)
            done()
        }
    )
})