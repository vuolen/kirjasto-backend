import { flow, pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db/db";
import { ServiceResponse } from "../main";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";



import TaskEither = TE.TaskEither

export const getBookService: (db: Pick<DatabaseHandle, "getBooks" | "getAuthor">) => TaskEither<Error, ServiceResponse> = 
    (db) => pipe(
        db.getBooks,
        TE.map(
            flow(
                A.map(
                    book => ({
                        title: book.title,
                        author: O.toUndefined(book.author)
                    })
                ),
                books => ({body: books})
            )
        )
    )