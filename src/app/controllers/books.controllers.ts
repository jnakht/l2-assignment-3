import express, { NextFunction, Request, Response } from "express"
import Book from "../models/books.models";

export const booksRoutes = express.Router();


const bookNotFound = {
        name : "BookNotFoundError",
        errors: {
            objectId: {
                message: "This Book Is Not Found",
                name: "BookNotFoundError",
                properties: {
                message: "This Book Is Not Found",
                type: "not found"
                },
                path: "bookId",
                kind: "not found",
            }
    }    
}


//create a book route
booksRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Book.syncIndexes();
        const book = await Book.create(req.body);
        
        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {
            next(error)
    }
});

// get all books, query books
// booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const filter = req.query.filter;
//         const sortBy = req.query.sortBy as string;
//         const sort = req.query.sort;
//         const limit = req.query.limit as string;

//         const one = 1, minusOne = -1;
//         const sortOrder = sort === 'desc' ? minusOne : one;
//         const books = await Book.find(
//             filter ? { genre: filter } : {}
//         ).sort(
//             sortBy && sort ?
//                 { [sortBy]: sortOrder } : {}
//         ).limit(limit ? parseInt(limit) : 0);

//         res.status(200).json({
//             "success": true,
//             "message": "Books retrieved successfully",
//             "data": books
//         })
//     } catch (error: any) {
//         next(error);
//     }
// })


//get all books with pagination
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await Book.countDocuments();
        const books = await Book.find().skip(skip).limit(limit);

        res.status(200).json({
            "success": true,
            "message": "Books retrieved successfully",
            "data": books,
            total,
            page,
            totalPages: Math.ceil(total/limit)
        })
    } catch (error: any) {
        next(error);
    }
})




// get a single book by id
booksRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(400).json({
                message : "Book Not Found",
                success: false,
                error: bookNotFound
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Book retrieved successfully",
            "data": book
        })
    } catch (error: any) {
        next(error);
    }
})
// update a single book by id
booksRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const body = req.body;
        const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });
        if (!updatedBook) {
            return res.status(400).json({
                message : "Book Not Found",
                success: false,
                error: bookNotFound
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Book updated successfully",
            "data": updatedBook
        });
    } catch (error: any) {
        next(error);
    }
})

// delete a single book by id
booksRoutes.delete('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.bookId;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(400).json({
                message : "Book Not Found",
                success: false,
                error: bookNotFound
            })
        }
        res.status(200).json({
            "success": true,
            "message": "Book deleted successfully",
            "data": null
        });
    } catch (error: any) {
        next(error);
    }
})
