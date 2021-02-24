import { flow, pipe } from "fp-ts/lib/function";
import { DatabaseHandle } from "../db/db";
import * as TE from "fp-ts/lib/TaskEither";
import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import * as E from "fp-ts/lib/Either";
import { Service } from "../types/Service";

import TaskEither = TE.TaskEither
import { Book, GetBooksResponse } from "kirjasto-shared";

export const getBooksService: (db: Pick<DatabaseHandle, "getBooks" | "getAuthor">) => Service<GetBooksResponse> = 
    (db) => () => pipe(
        db.getBooks,
        TE.chain(
            flow(
                A.map(
                    book => ({
                        id: book.id,
                        title: book.title,
                        author: O.toUndefined(book.author)
                    })
                ),
                GetBooksResponse.decode,
                E.bimap(
                    E.toError,
                    response => ({body: response})
                ),
                TE.fromEither
            )
        ),
    )