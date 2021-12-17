import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') config();

export const PORT = `${process.env.PORT}`;
export const MONGODB_URI = `${process.env.MONGODB_URI}`;
export const SECRETORKEY = `${process.env.SECRETORKEY}`;
