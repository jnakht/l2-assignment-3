import express, { Request, Response } from "express"
import Book from "../models/books.models";
import { parse } from "zod";


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

// get all books, query books
booksRoutes.get('/', async (req: Request, res: Response) => {
   const filter = req.query.filter;
   const sortBy = req.query.sortBy as string;
   const sort = req.query.sort;
   const limit = req.query.limit as string;

//    option 1 
//    let query : any = {};
//    if (filter) {
//     query.genre = filter;
//    }

//    let booksQuery = Book.find(query);

//    const one = 1, minusOne = -1;
//    const sortOrder = sort === 'desc' ? minusOne : one;
//    if (sortBy && sort) {
//     booksQuery = booksQuery.sort({[sortBy] : sortOrder});
//    }
//    if (limit) {
//     booksQuery = booksQuery.limit(parseInt(limit));
//    }
//    const books = await booksQuery;



            // option - 2
    const one = 1, minusOne = -1;
    const sortOrder = sort === 'desc' ? minusOne : one;
    const books = await Book.find(
        filter ? {genre : filter} : {}
    ).sort(
        sortBy && sort ? 
        {[sortBy] : sortOrder} : {}
    ).limit(limit ? parseInt(limit) : 0);


    res.status(200).json({
        "success": true,
        "message": "Books retrieved successfully",
        "data": books
    })
})
// get a single book by id
booksRoutes.get('/:bookId', async (req : Request, res : Response) => {
    const id = req.params.bookId;
    const book = await Book.findById(id);
    res.status(200).json({
        "success": true,
        "message": "Book retrieved successfully",
        "data": book
    })
})
// update a single book by id
booksRoutes.patch('/:bookId', async (req : Request, res : Response) => {
    const id = req.params.bookId;
    const body = req.body;
    const updatedBook = await Book.findByIdAndUpdate(id, body, { new : true });
    res.status(200).json({
        "success": true,
        "message": "Book updated successfully",
        "data": updatedBook
    });
})

// delete a single book by id
booksRoutes.delete('/:bookId', async (req : Request, res : Response) => {
    const id = req.params.bookId;
    const deletedBook = await Book.findByIdAndDelete(id);
    res.status(200).json({
        "success": true,
        "message": "Book deleted successfully",
        "data": null
    });
})

