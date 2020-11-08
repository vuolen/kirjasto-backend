import { flow, Lazy, pipe } from "fp-ts/lib/function"
import * as IO from "fp-ts/lib/IO"
import * as T from "fp-ts/lib/Task"
import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { IOEither } from "fp-ts/lib/IOEither"

export type IOTaskEither<E,A> = IO.IO<TE.TaskEither<E,A>>

export function tryCatch<E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): IOTaskEither<E, A> {
    return () => TE.tryCatch(f, onRejected)
}

export const map: <A, B>(f: (a: A) => B) => <E>(fa: IOTaskEither<E, A>) => IOTaskEither<E, B> = (f) => IO.map(TE.map(f))

export const fold: <E, A, B>(
    onLeft: (e: E) => B,
    onRight: (a: A) => B,
) => (ma: IOTaskEither<E, A>) => IO.IO<T.Task<B>> =
    flow(
        E.fold,
        T.map,
        IO.map
    )

export const fromEither: <E, A>(ma: E.Either<E, A>) => (IOTaskEither<E, A>) = flow(TE.fromEither, IO.of)