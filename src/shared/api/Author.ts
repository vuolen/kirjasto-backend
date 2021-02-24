import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'

export const Author = t.type({
    id: t.Int,
    name: NonEmptyString
})

export type Author = t.TypeOf<typeof Author>