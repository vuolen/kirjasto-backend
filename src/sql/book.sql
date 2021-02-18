/* @name CreateAuthorTable */
CREATE TABLE IF NOT EXISTS author (
    id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

/* @name CreateBookTable */
CREATE TABLE IF NOT EXISTS book (
    id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    author_id INT,

    CONSTRAINT fk_author
        FOREIGN KEY (author_id)
            REFERENCES author(id)
);

/* @name GetAllBooks */
SELECT * FROM book;

/* @name AddBook */
INSERT INTO book(title, author_id) VALUES(:title, :author_id) RETURNING *;

/* @name GetAuthorById */
SELECT * FROM author WHERE id=:id;

/* @name GetAllAuthors */
SELECT * FROM author;

/* @name AddAuthor */
INSERT INTO author(name) VALUES(:name) RETURNING *;