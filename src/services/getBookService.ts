import { flow } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db";
import { ServiceResponse } from "../main";
import * as TE from "fp-ts/lib/TaskEither";

import TaskEither = TE.TaskEither

export const getBookService: (db: Pick<DatabaseHandle, "getBooks">) => TaskEither<Error, ServiceResponse> = 
    flow(
        db => db.getBooks,
        TE.map(books => ({body: books}))
    )