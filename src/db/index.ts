import { Pool } from "pg"
import { from } from "rxjs"
import { concatMap, mergeMap } from "rxjs/operators"

/* process.on("beforeExit", async () => {
    console.log("Disconnecting from database...")
    pool.end()
        .then(() => console.log("Succesfully disconnected from database"))
        .catch(reason => console.log("Failed to disconnect from database: " + reason))
}) */

export class RxPool extends Pool {
    query$(queryString: string, parameters?: any[]) {
        return from(this.query(queryString, parameters)).pipe(
            concatMap(req => from(req.rows))
        )
    }
}


/* query$(`
CREATE TABLE IF NOT EXISTS book (
    id      SERIAL PRIMARY KEY,
    title   text
);

CREATE TABLE IF NOT EXISTS author (
    id      SERIAL PRIMARY KEY,
    name    text
);

CREATE TABLE IF NOT EXISTS authorbook (
    book_id     int REFERENCES Book (id),
    author_id    int REFERENCES Author (id),
    primary key (col1, col2)
);
`) */