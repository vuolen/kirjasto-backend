import { t } from '@marblejs/middleware-io';

export const Author = t.type({
    name: t.string
})
export type Author = t.TypeOf<typeof Author>;

export const AuthorReference = t.type({
    id: t.number
})
export type AuthorReference = t.TypeOf<typeof AuthorReference>;

export const Category = t.type({
    name: t.string
})
export type Category = t.TypeOf<typeof Author>;

export const CategoryReference = t.type({
    id: t.number
})
export type CategoryReference = t.TypeOf<typeof CategoryReference>;

export const Book  = t.type({
    id: t.number,
    title: t.string,
    authors: t.array(Author),
    categories: t.array(Category)
})
export type Book = t.TypeOf<typeof Book>;

export const CreateBookRequest  = t.type({
    title: t.string,
    authors: t.array(t.union([
        Author, AuthorReference
    ])),
    categories: t.array(t.union([
        Category, CategoryReference
    ]))
})
export type CreateBookRequest = t.TypeOf<typeof CreateBookRequest>;
