import { pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db";
import { ServiceResponse } from "../main";
import * as IOTE from "../types/IOTaskEither";

export const getBookService = (db: DatabaseHandle): IOTE.IOTaskEither<Error, ServiceResponse> => pipe(
    db.getBooks,
    IOTE.map(books => ({body: books}))
)