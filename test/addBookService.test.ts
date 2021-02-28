import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import * as O from "fp-ts/lib/Option"
import { addBookService } from "../src/services/addBookService"
import { getLeftOrFail, getRightOrFail, unimpl } from "./util"
import { Request } from "express"
import { APIError } from "kirjasto-shared"

const VALID_AUTHOR = {id: 1, name: "Test Testersson"}
const VALID_BOOK = {id: 1, title: "Test Book", author_id: O.some(1), author: O.some(VALID_AUTHOR)}
const VALID_ADDBOOK_REQUEST = {title: "Test Book", author: {name: "Test Testersson"}}
const VALID_ADDBOOK_RESPONSE = {id: 1, title: "Test Book", author: VALID_AUTHOR}

test("addBookService returns a body with an error given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK), addAuthor: unimpl, getAuthor: unimpl}
    const mockReq = {body: {...VALID_ADDBOOK_REQUEST, title: ""}} as any as Request
    addBookService(mockDb)(mockReq)().then(
        either => {
            const err = getRightOrFail(either)
            expect(APIError.is(err.body)).toBeTruthy()
            done()
        }
    )
})

test("addBookService returns status code 422 given an empty title", done => {
    const mockDb = {addBook: () => TE.right(VALID_BOOK), addAuthor: unimpl, getAuthor: unimpl}
    const mockReq = {body: {...VALID_ADDBOOK_REQUEST, title: ""}} as any as Request
    addBookService(mockDb)(mockReq)().then(
        either => {
            const err = getRightOrFail(either)
            expect(err.statusCode).toEqual(422)
            done()
        }
    )
})

test("addBookService returns error when database gives an error", done => {
    const mockDb = {addBook: () => TE.left(new Error("Database error")), addAuthor: () => TE.left(new Error("Database error")), getAuthor: () => TE.left(new Error("Database error"))}
    const mockReq = {body: VALID_ADDBOOK_REQUEST} as any as Request
    addBookService(mockDb)(mockReq)().then(
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
    const mockReq = {body: VALID_ADDBOOK_REQUEST} as any as Request
    addBookService(mockDb)(mockReq)().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual(VALID_ADDBOOK_RESPONSE)
            done()
        }
    )
})