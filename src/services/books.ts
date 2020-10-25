import { Book } from "../common/types";
import { query$ } from "../db";

export const getBooks = () => query$("SELECT * FROM book")

export const createBook = (book: Book) => query$("INSERT INTO book(title) VALUES($1) RETURNING *", [book.title])

export const getBookAuthors = (id: number) => query$("SELECT * FROM authorbook WHERE book_id=$1", [id])