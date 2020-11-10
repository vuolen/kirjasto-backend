import { flow } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db";
import { ServiceResponse } from "../main";
import * as IOTE from "../types/IOTaskEither";

export const getBookService: (db: DatabaseHandle) => IOTE.IOTaskEither<Error, ServiceResponse> = 
    flow(
        db => db.getBooks,
        IOTE.map(books => ({body: books}))
    )