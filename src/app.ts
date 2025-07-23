import express, { Application, Request, Response } from "express"
import { booksRoutes } from "./app/controllers/books.controllers";


const app: Application = express();
app.use(express.json());
app.use('/books', booksRoutes);

app.get('/', (req : Request, res : Response) => {
    res.send('Welcome to Library Application');
})

export default app;