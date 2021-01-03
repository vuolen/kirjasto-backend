import { Do } from "fp-ts-contrib/lib/Do"
import { Applicative2 } from "fp-ts/lib/Applicative"
import * as E from "fp-ts/lib/Either"
import { flow, Lazy, pipe } from "fp-ts/lib/function"
import { Functor2 } from "fp-ts/lib/Functor"
import { Kind2, URIS2 } from "fp-ts/lib/HKT"
import * as I from "fp-ts/lib/IO"
import { IOEither } from "fp-ts/lib/IOEither"
import { Monad2 } from "fp-ts/lib/Monad"
import * as T from "fp-ts/lib/Task"
import * as TE from "fp-ts/lib/TaskEither"

import TaskEither = TE.TaskEither
import IO = I.IO

export const URI = 'IOTaskEither'

export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    readonly IOTaskEither: IOTaskEither<E, A>
  }
}

export interface IOTaskEither<E, A> extends IO<TE.TaskEither<E, A>> {}

export function tryCatch<E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): IOTaskEither<E, A> {
  return () => TE.tryCatch(f, onRejected)
}

const map_: Monad2<URI>['map'] = (fa, f) => pipe(fa, map(f))
const apPar_: Monad2<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
const chain_: Monad2<URI>['chain'] = (ma, f) => pipe(ma, chain(f))

export const left: <E, A = never>(e: E) => IOTaskEither<E, A> = flow(E.left, T.of, I.of)

export const of: Monad2<URI>['of'] = flow(TE.right, I.of)

export const apW = <D, A>(fa: IOTaskEither<D, A>): (<E, B>(fab: IOTaskEither<E, (a: A) => B>) => IOTaskEither<D | E, B>) =>
  flow(
    I.map((gab) => (ga: TE.TaskEither<D, A>) => TE.apW(ga)(gab)),
    I.ap(fa)
  )

export const ap: <E, A>(fa: IOTaskEither<E, A>) => <B>(fab: IOTaskEither<E, (a: A) => B>) => IOTaskEither<E, B> = apW

export const map: <A, B>(f: (a: A) => B) => <E>(fa: IOTaskEither<E, A>) => IOTaskEither<E, B> = (f) => I.map(TE.map(f))

export const chain = <E, A, B>(f: (a: A) => IOTaskEither<E, B>) => (ma: IOTaskEither<E, A>): IOTaskEither<E, B> =>
    pipe(
      ma(),
      TE.chain(
        a => f(a)()
      ),
      I.of
    )

export const fold: <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B) => (ma: IOTaskEither<E, A>) => IO<T.Task<B>> =
  flow(
    E.fold,
    T.map,
    I.map
  )

export const fromEither: <E, A>(ma: E.Either<E, A>) => (IOTaskEither<E, A>) = flow(TE.fromEither, I.of)

export const ioTaskEither: Monad2<URI> & Functor2<URI> = {
  URI,
  map: map_,
  of,
  ap: apPar_,
  chain: chain_,
}