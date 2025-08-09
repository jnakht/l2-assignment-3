

import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import Book from './app/models/books.models';
import dotenv from 'dotenv'
dotenv.config();

let server : Server;
const PORT = 8080;
// const PORT = 5000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected To Mongodb');
        await Book.syncIndexes(); // Will recreate missing indexes based on your schema

        server = app.listen(PORT, () => {
            console.log(`App is running on port : ${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}
main();
