import { Pool } from "pg";

const pool = new Pool()

pool.query(`
    CREATE TABLE books {
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL
    }
`)