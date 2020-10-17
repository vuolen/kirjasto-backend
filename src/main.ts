import * as express from 'express';
import { apiRouter } from './api'

const api = express()

api.use("/api", apiRouter)

api.listen(8000);