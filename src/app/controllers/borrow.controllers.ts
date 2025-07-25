
import express, { NextFunction, Request, Response } from "express";
import Borrow from "../models/borrow.models";
import z from 'zod'
import Book from "../models/books.models";

export const borrowsRoutes = express.Router();



const bookNotAvailableError = {
    name : "BookNotAvailableError",
    errors: {
        quantity: {
            message: "This Number Of Book Is Not Available",
            name: "BookNotAvailableError",
            properties: {
                message: "This Number Of Book Is Not Available",
                type: "max"
            },
            path: "quantity",
            kind: "max",
        } 
    }
}


borrowsRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const borrow = await new Borrow(req.body);
        await borrow.save();
        const bookIsAvailable = await Book.checkBookAvailability(req.body.book, req.body.quantity);
        console.log("book is available", bookIsAvailable);
        res.status(200).json({
                "success": true,
                "message": "Book borrowed successfully",
                "data": borrow
            })
        if (bookIsAvailable) {
            
            res.status(200).json({
                "success": true,
                "message": "Book borrowed successfully",
                "data": borrow
            })
        } else {
            res.status(400).json({
                "message": "Book Is Not Available",
                "success" : false,
                "error": bookNotAvailableError
            })
        }
    } catch (error: any) {
        // console.log(error);
        // res.status(400).json({
        //     "message": error.message,
        //     "success": false,
        //     "error": error
        // })
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
                    totalQuantity: { $sum: 1 }
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
        // console.log(error);
        // res.status(400).json({
        //     "message": error.message,
        //     "success": false,
        //     "error": error
        // })
        next();
    }
})
