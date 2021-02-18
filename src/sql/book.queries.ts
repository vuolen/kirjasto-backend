/** Types generated for queries found in "src/sql/book.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateAuthorTable' parameters type */
export type ICreateAuthorTableParams = void;

/** 'CreateAuthorTable' return type */
export type ICreateAuthorTableResult = void;

/** 'CreateAuthorTable' query type */
export interface ICreateAuthorTableQuery {
  params: ICreateAuthorTableParams;
  result: ICreateAuthorTableResult;
}

const createAuthorTableIR: any = {"name":"CreateAuthorTable","params":[],"usedParamSet":{},"statement":{"body":"CREATE TABLE IF NOT EXISTS author (\n    id INT UNIQUE GENERATED ALWAYS AS IDENTITY,\n    name TEXT NOT NULL\n)","loc":{"a":30,"b":137,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * CREATE TABLE IF NOT EXISTS author (
 *     id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
 *     name TEXT NOT NULL
 * )
 * ```
 */
export const createAuthorTable = new PreparedQuery<ICreateAuthorTableParams,ICreateAuthorTableResult>(createAuthorTableIR);


/** 'CreateBookTable' parameters type */
export type ICreateBookTableParams = void;

/** 'CreateBookTable' return type */
export type ICreateBookTableResult = void;

/** 'CreateBookTable' query type */
export interface ICreateBookTableQuery {
  params: ICreateBookTableParams;
  result: ICreateBookTableResult;
}

const createBookTableIR: any = {"name":"CreateBookTable","params":[],"usedParamSet":{},"statement":{"body":"CREATE TABLE IF NOT EXISTS book (\n    id INT UNIQUE GENERATED ALWAYS AS IDENTITY,\n    title TEXT NOT NULL,\n    author_id INT,\n\n    CONSTRAINT fk_author\n        FOREIGN KEY (author_id)\n            REFERENCES author(id)\n)","loc":{"a":169,"b":387,"line":8,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * CREATE TABLE IF NOT EXISTS book (
 *     id INT UNIQUE GENERATED ALWAYS AS IDENTITY,
 *     title TEXT NOT NULL,
 *     author_id INT,
 * 
 *     CONSTRAINT fk_author
 *         FOREIGN KEY (author_id)
 *             REFERENCES author(id)
 * )
 * ```
 */
export const createBookTable = new PreparedQuery<ICreateBookTableParams,ICreateBookTableResult>(createBookTableIR);


/** 'GetAllBooks' parameters type */
export type IGetAllBooksParams = void;

/** 'GetAllBooks' return type */
export interface IGetAllBooksResult {
  id: number;
  title: string;
  author_id: number | null;
}

/** 'GetAllBooks' query type */
export interface IGetAllBooksQuery {
  params: IGetAllBooksParams;
  result: IGetAllBooksResult;
}

const getAllBooksIR: any = {"name":"GetAllBooks","params":[],"usedParamSet":{},"statement":{"body":"SELECT * FROM book","loc":{"a":415,"b":432,"line":19,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM book
 * ```
 */
export const getAllBooks = new PreparedQuery<IGetAllBooksParams,IGetAllBooksResult>(getAllBooksIR);


/** 'AddBook' parameters type */
export interface IAddBookParams {
  title: string | null | void;
  author_id: number | null | void;
}

/** 'AddBook' return type */
export interface IAddBookResult {
  id: number;
  title: string;
  author_id: number | null;
}

/** 'AddBook' query type */
export interface IAddBookQuery {
  params: IAddBookParams;
  result: IAddBookResult;
}

const addBookIR: any = {"name":"AddBook","params":[{"name":"title","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":499,"b":503,"line":22,"col":43}]}},{"name":"author_id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":507,"b":515,"line":22,"col":51}]}}],"usedParamSet":{"title":true,"author_id":true},"statement":{"body":"INSERT INTO book(title, author_id) VALUES(:title, :author_id) RETURNING *","loc":{"a":456,"b":528,"line":22,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO book(title, author_id) VALUES(:title, :author_id) RETURNING *
 * ```
 */
export const addBook = new PreparedQuery<IAddBookParams,IAddBookResult>(addBookIR);


/** 'GetAuthorById' parameters type */
export interface IGetAuthorByIdParams {
  id: number | null | void;
}

/** 'GetAuthorById' return type */
export interface IGetAuthorByIdResult {
  id: number;
  name: string;
}

/** 'GetAuthorById' query type */
export interface IGetAuthorByIdQuery {
  params: IGetAuthorByIdParams;
  result: IGetAuthorByIdResult;
}

const getAuthorByIdIR: any = {"name":"GetAuthorById","params":[{"name":"id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":589,"b":590,"line":25,"col":31}]}}],"usedParamSet":{"id":true},"statement":{"body":"SELECT * FROM author WHERE id=:id","loc":{"a":558,"b":590,"line":25,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM author WHERE id=:id
 * ```
 */
export const getAuthorById = new PreparedQuery<IGetAuthorByIdParams,IGetAuthorByIdResult>(getAuthorByIdIR);


/** 'GetAllAuthors' parameters type */
export type IGetAllAuthorsParams = void;

/** 'GetAllAuthors' return type */
export interface IGetAllAuthorsResult {
  id: number;
  name: string;
}

/** 'GetAllAuthors' query type */
export interface IGetAllAuthorsQuery {
  params: IGetAllAuthorsParams;
  result: IGetAllAuthorsResult;
}

const getAllAuthorsIR: any = {"name":"GetAllAuthors","params":[],"usedParamSet":{},"statement":{"body":"SELECT * FROM author","loc":{"a":620,"b":639,"line":28,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM author
 * ```
 */
export const getAllAuthors = new PreparedQuery<IGetAllAuthorsParams,IGetAllAuthorsResult>(getAllAuthorsIR);


/** 'AddAuthor' parameters type */
export interface IAddAuthorParams {
  name: string | null | void;
}

/** 'AddAuthor' return type */
export interface IAddAuthorResult {
  id: number;
  name: string;
}

/** 'AddAuthor' query type */
export interface IAddAuthorQuery {
  params: IAddAuthorParams;
  result: IAddAuthorResult;
}

const addAuthorIR: any = {"name":"AddAuthor","params":[{"name":"name","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":698,"b":701,"line":31,"col":33}]}}],"usedParamSet":{"name":true},"statement":{"body":"INSERT INTO author(name) VALUES(:name) RETURNING *","loc":{"a":665,"b":714,"line":31,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO author(name) VALUES(:name) RETURNING *
 * ```
 */
export const addAuthor = new PreparedQuery<IAddAuthorParams,IAddAuthorResult>(addAuthorIR);


