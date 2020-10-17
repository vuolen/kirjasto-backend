import { Router, json } from 'express'
import { booksRouter } from './books'

export const apiRouter = Router()

apiRouter.use(json())

apiRouter.use("/books", booksRouter)