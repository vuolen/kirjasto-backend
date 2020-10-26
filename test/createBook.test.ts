import { id } from "fp-ts/lib/Reader"
import { of } from "rxjs"
import { Author, Book, Category, CreateBookRequest } from "../src/common/types"
import { RxPool } from "../src/db"
import { createBook } from "../src/services/books"

test('createBook should return an object with the correct id', done => {
    const req: CreateBookRequest = {title: "TestBook", authors: [{name: "A. U. Thor"}], categories: [{name: "Software"}]}
    
    const db = new RxPool()
    db.query$ = jest.fn(() => of({id: 2}))

    of(req).pipe(
        createBook(db)
    ).subscribe(book => {
        expect(book.id).toBe(2)
        done()
    })
    
})
