

import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';

let server : Server;
const PORT = 5000;


async function main() {
    try {
        await mongoose.connect('mongodb+srv://libraryuser:libraryuser@cluster0.gtqywnt.mongodb.net/libraryDB?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected To Mongodb');
        server = app.listen(PORT, () => {
            console.log(`App is running on port : ${PORT}`);
        })

    } catch (error) {
        console.log(error);
    }
}
main();

