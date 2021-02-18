import { flow, pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as A from "fp-ts/lib/Array";
import { DatabaseHandle } from "../db/db";
import { Service } from "../types/Service";


export const getAuthorsService = (db: Pick<DatabaseHandle, "getAuthors">): Service<any> => 
    () => pipe(
        db.getAuthors,
        TE.map(
            flow(
                A.map(
                    author => ({
                        id: author.id,
                        name: author.name
                    })
                ),
                authors => ({body: authors})
            )
        )
    )