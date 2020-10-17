import { Router } from 'express'

export const booksRouter = Router()

booksRouter.get("/", (req, res) => {
    res.json()
})