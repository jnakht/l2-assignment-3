
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
        const bookExists = await Book.countDocuments({_id : req.body.book}, {limit : 1});
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
borrowsRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        //aggregate pipeline
        const borrows = await Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            {
                $group: {
                    _id: "$bookData",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: { $first: "$_id.title" },
                        isbn: { $first: "$_id.isbn" }
                    },
                    totalQuantity: 1
                }
            }

        ])

        res.status(200).json({
            "success": true,
            "message": "Borrowed books summary retrieved successfully",
            "data": borrows
        })
    } catch (error: any) {
        next();
    }
})
