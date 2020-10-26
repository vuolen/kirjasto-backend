import { Observable } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { Book, CreateBookRequest } from "../common/types";
import { RxPool } from "../db";

export const createBook = (db: RxPool) => (src: Observable<CreateBookRequest>): Observable<Book> => (
    src.pipe(
        mergeMap(req => db.query$("INSERT INTO book(title) VALUES($1) RETURNING *", [req.title])),
    )
)