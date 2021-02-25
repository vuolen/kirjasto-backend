import * as t from 'io-ts'
import { APIError } from './APIError'

export const APIResponse = <T extends t.Any>(type: T) =>
    t.union([APIError, type])