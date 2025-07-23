import express, { Request, Response } from "express"
import Book from "../models/books.models";


export const booksRoutes = express.Router();

//create a book route
booksRoutes.post('/create-book', async (req: Request, res: Response) => {
    const body = req.body;
    console.log("Book BOdy", body);
    const book = await Book.create(body);
    res.status(200).json({
        "success": true,
        "message": "Book created successfully",
        "data": book 
    })
})





