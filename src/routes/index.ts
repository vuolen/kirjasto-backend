import { combineRoutes } from '@marblejs/core';
import { bookRoutes } from './books';

export const api$ = combineRoutes("/api", [bookRoutes])