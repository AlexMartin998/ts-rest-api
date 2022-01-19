import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') config();

export const PORT = `${process.env.PORT}`;
export const MONGODB_URI = `${process.env.MONGODB_URI}`;
export const SECRETORKEY = `${process.env.SECRETORKEY}`;
export const GOOGLE_CLIENT_ID = `${process.env.GOOGLE_CLIENT_ID}`;
export const CLOUDINARY_URL = `${process.env.CLOUDINARY_URL}`;
