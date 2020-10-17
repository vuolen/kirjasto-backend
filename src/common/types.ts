
export interface Author {
    name: string;
    books: [Book];
}

export interface Book {
    title: string;
    authors: [Author];
}
