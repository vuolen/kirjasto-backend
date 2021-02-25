import * as t from 'io-ts'

export const APIError = t.type({
    error: t.string
})
export type APIError = t.TypeOf<typeof APIError>