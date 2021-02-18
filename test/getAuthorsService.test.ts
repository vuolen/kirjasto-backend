import { getAuthorsService } from "../src/services/getAuthorsService"
import { getRightOrFail, unimpl } from "./util"
import { Request } from "express"
import * as TE from "fp-ts/lib/TaskEither";


describe("getAuthorsService", () => {
    it("returns empty array when no authors exist", () => {
        const mockDb = {getAuthors: TE.right([])}
        const mockReq = {} as Request
        getAuthorsService(mockDb)(mockReq)().then(
            res => {
                expect(getRightOrFail(res).body).toEqual([])
            }
        )
    })

    it("returns an author from the database", done => {
        const mockDb = {getAuthors: TE.right([{id: 1, name: "Test Author"}])}
        const mockReq = {} as Request
        getAuthorsService(mockDb)(mockReq)().then(
            res => {
                const authors = getRightOrFail(res).body
                expect(authors.length).toBe(1)
                expect(authors[0].id).toEqual(1)
                expect(authors[0].name).toEqual("Test Author")
                done()
            }
        )
    })
})