# REST API plan

The main resource of the API is `/books/`. Authors and categories should merely be shared tags between books, not full CRUD resources. Every domain specific action (eg. not authorization) should be book-focused.

The API should be high-level. This means providing processes specific to the domain, eg. creating, borrowing, reserving a book. This is in contrast to just providing CRUD operations on database entities. Simply put the API should be abstracted from the implementation and focus on the library-specific parts.

Book has
  - a title
  - one or more categories
  - one or more authors
  - zero or more reservations // maybe, if necessary
  - zero or one borrowing

API processes somewhat in an order of implementation:
  - create a book w/ categories and authors `POST /books/`
  - get ALL information for books (title, categories, authors, reservations, borrowing) `GET /books/`
  - mark a book as borrowed `POST /books/borrowing`
  - mark a book as returned / remove borrowing `DELETE /books/borrowing`
  - find out if a book is currently borrowed `GET /books/borrowing`
  - delete a book `DELETE /books/:bookId`
  - reserve a book and its authors and categories, if they no longer have corresponding books `POST /books/reservations`
