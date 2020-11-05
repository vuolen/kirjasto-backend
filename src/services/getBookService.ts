import { identity, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither"
import { isRight } from "fp-ts/lib/These";
import { DatabaseHandle, getBooks } from "../db";
import { ServiceResponse } from "../main";

export const getBookService = (db: DatabaseHandle): TE.TaskEither<Error, ServiceResponse> => pipe(
    () => db.getBooks(),
    TE.map(books => ({body: books}))
)