import * as E from "fp-ts/lib/Either"
import { flow } from "fp-ts/lib/function"
import * as TE from "fp-ts/lib/TaskEither"
import { ServiceResponse } from "../src/main"
import { getBookService } from "../src/services/getBookService"

const getRightOrFail = <E, A>(a: E.Either<E, A>): A => {
    expect(E.isRight(a)).toBeTruthy()
    return (a as E.Right<A>).right
}

// TODO: remove the clash of the type parameter E and the alias import Either as E
const getLeftOrFail = <E, A>(e: E.Either<E, A>): E => {
    expect(E.isLeft(e)).toBeTruthy()
    return (e as E.Left<E>).left
}

test("getBookService returns empty array as body when no books exist", done => {
    const mockDb = {getBooks: TE.fromEither(E.right([]))}
    getBookService(mockDb)().then(
        either => {
            const res = getRightOrFail(either)
            expect(res.body).toEqual([])
            done()
        }
    )
})

test("getBookService returns error when database gives an error", done => {
    const mockDb = {getBooks: TE.fromEither(E.left(new Error("Database error")))}
    getBookService(mockDb)().then(
        either => {
            const res = getLeftOrFail(either)
            expect(res).toBeInstanceOf(Error)
            done()
        }
    )
})