import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { Author } from './Author'

export const Book = t.type({
    id: t.Int,
    title: NonEmptyString,
    author: t.union([Author, t.undefined])
})

export type Book = t.TypeOf<typeof Book>