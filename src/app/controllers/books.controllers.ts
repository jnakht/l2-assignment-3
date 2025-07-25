import express, { NextFunction, Request, Response } from "express"
import Book from "../models/books.models";

export const booksRoutes = express.Router();

//create a book route
booksRoutes.post('/create-book', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const book = await Book.create(req.body);

        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
            // console.log(error);
            // res.status(400).json({
            //     message: "Validation Failed",
            //     success: false,
            //     error,
            // });
            next(error)
    }
});

// get all books, query books
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy as string;
        const sort = req.query.sort;
        const limit = req.query.limit as string;

        const one = 1, minusOne = -1;
        const sortOrder = sort === 'desc' ? minusOne : one;
        const books = await Book.find(
            filter ? { genre: filter } : {}
        ).sort(
            sortBy && sort ?
                { [sortBy]: sortOrder } : {}
        ).limit(limit ? parseInt(limit) : 0);


        res.status(200).json({
            "success": true,
            "message": "Books retrieved successfully",
            "data": books
        })
    } catch (error: any) {
        // console.log(error);
        // res.status(400).json({
        //     "message": error._message,
        //     "success": false,
        //     "error": error
        // })
        next(error);
    }
})
// get a single book by id
booksRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id);
        res.status(200).json({
            "success": true,
            "message": "Book retrieved successfully",
            "data": book
        })
    } catch (error: any) {
        // console.log(error);
        // res.status(400).json({
        //     "message": error._message,
        //     "success": false,
        //     "error": error
        // })
        next(error);
    }
})
// update a single book by id
booksRoutes.patch('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const body = req.body;
        const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });
        res.status(200).json({
            "success": true,
            "message": "Book updated successfully",
            "data": updatedBook
        });
    } catch (error: any) {
        // console.log(error);
        // res.status(400).json({
        //     "message": error._message,
        //     "success": false,
        //     "error": error
        // })
        next(error);
    }
})

// delete a single book by id
booksRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const deletedBook = await Book.findByIdAndDelete(id);
        res.status(200).json({
            "success": true,
            "message": "Book deleted successfully",
            "data": null
        });
    } catch (error: any) {
        // console.log(error);
        // res.status(400).json({
        //     "message": error._message,
        //     "success": false,
        //     "error": error
        // })
        next(error);
    }
})

