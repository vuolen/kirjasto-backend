import * as t from 'io-ts'
import { Book } from './Book'

export const GetBooksRequest = t.void
export type GetBooksRequest = t.TypeOf<typeof GetBooksRequest>

export const GetBooksResponse = t.array(Book)
export type GetBooksResponse = t.TypeOf<typeof GetBooksResponse>