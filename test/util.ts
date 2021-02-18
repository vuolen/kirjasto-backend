import * as E from "fp-ts/lib/Either"

import Either = E.Either

export const getRightOrFail = <E, A>(a: Either<E, A>): A => {
    expect(E.isRight(a)).toBeTruthy()
    return (a as E.Right<A>).right
}

// TODO: remove the clash of the type parameter E and the alias import Either as E
export const getLeftOrFail = <E, A>(e: Either<E, A>): E => {
    expect(E.isLeft(e)).toBeTruthy()
    return (e as E.Left<E>).left
}

export const unimpl = (...args: any) => { throw new Error("Unimplemented"); };