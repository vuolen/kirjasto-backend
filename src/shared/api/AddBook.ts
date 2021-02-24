import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { Book } from './Book'

const AuthorInput = t.union([t.number, t.type({name: NonEmptyString}), t.undefined])
type AuthorInput = t.TypeOf<typeof AuthorInput>

export const AddBookRequest = t.type({
    title: NonEmptyString,
    author: AuthorInput
})

export type AddBookRequest = t.TypeOf<typeof AddBookRequest>

export const AddBookResponse = Book
export type AddBookResponse = t.TypeOf<typeof AddBookResponse>