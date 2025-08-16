
import express, { NextFunction, Request, Response } from "express";
import Borrow from "../models/borrow.models";
import z from 'zod'
import Book from "../models/books.models";

export const borrowsRoutes = express.Router();

const bookNotAvailableError = {
    name: "BookNotAvailableError",
    errors: {
        quantity: {
            message: "Book Is Not Available",
            name: "BookNotAvailableError",
            properties: {
                message: "Book Is Not Available",
                type: "max"
            },
            path: "quantity",
            kind: "max",
        }
    }
}


const bookNotExists = {
    name: "BookNotExistsError",
    errors: {
        book: {
            message: "Book Does Not Exists",
            name: "BookNotExistsError",
            properties: {
                message: "Book Does Not Exists",
                type: "not exists"
            },
            path: "book",
            kind: "not exists",
        }
    }
}


borrowsRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let borrow: any;
        if (!req.body.book || !req.body.quantity || !req.body.dueDate) {
            borrow = await new Borrow(req.body);
            await borrow.save();
            return;
        }

        //check if that referenced book exists
        const bookExists = await Book.countDocuments({ _id: req.body.book }, { limit: 1 });
        if (!bookExists) {
            return res.status(400).json({
                "message": "Book Does Not Exists",
                "success": false,
                "error": bookNotExists
            })
        }

        const bookIsAvailable = await Book.checkBookAvailability(req.body.book, req.body.quantity);
        if (bookIsAvailable) {
            borrow = await new Borrow(req.body);
            await borrow.save();

            return res.status(200).json({
                "success": true,
                "message": "Book borrowed successfully",
                "data": borrow
            })
        } else {
            res.status(400).json({
                "message": "Book Is Not Available",
                "success": false,
                "error": bookNotAvailableError
            })
        }
    } catch (error: any) {
        next(error);
    }
})

// get borrow summary
// borrowsRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //aggregate pipeline
//         const borrows = await Borrow.aggregate([
//             {
//                 $lookup: {
//                     from: "books",
//                     localField: "book",
//                     foreignField: "_id",
//                     as: "bookData"
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$bookData",
//                     totalQuantity: { $sum: "$quantity" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     book: {
//                         title: { $first: "$_id.title" },
//                         isbn: { $first: "$_id.isbn" }
//                     },
//                     totalQuantity: 1
//                 }
//             }

//         ])

//         res.status(200).json({
//             "success": true,
//             "message": "Borrowed books summary retrieved successfully",
//             "data": borrows
//         })
//     } catch (error: any) {
//         next();
//     }
// })



// get borrow summary with pagination
borrowsRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;


        //aggregate pipeline
        const borrowAgg = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            {
                $unwind: "$bookData"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookData.title",
                        isbn: "$bookData.isbn"
                    },
                    totalQuantity: 1
                }
            },
            // Pagination
            { $skip: skip },
            { $limit: limit }
        ]);
        const borrows = await borrowAgg;

        const totalAgg = await Borrow.aggregate([
            { $group: { _id: "$book" } },
            { $count: "total" }
        ]);
        const total = totalAgg.length > 0 ? totalAgg[0].total : 0;
        
        res.status(200).json({
            "success": true,
            "message": "Borrowed books summary retrieved successfully",
            "data": borrows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error: any) {
        next(error);
    }
})
