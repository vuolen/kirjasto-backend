import { combineRoutes } from '@marblejs/core';
import { RxPool } from '../db';
import { bookRoutes } from './books';

export const api$ = (db: RxPool) => combineRoutes("/api", [bookRoutes(db)])