
import express, { Request, Response } from "express";
import Borrow from "../models/borrow.models";
import z from 'zod'
import Book from "../models/books.models";

export const borrowsRoutes = express.Router();

const createBorrowZodSchema = z.object({
    book: z.string("Not A Valid UUID Of Mongodb").regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
    quantity: z.number("Quantity Must Be A Number").gt(0, "Quantity Must Be At Least 1"),
    dueDate: z.iso.datetime("This Is Not A Valid Date")
})

borrowsRoutes.post('/', async (req: Request, res: Response) => {
    // const body = req.body;
    try {
        const bookIsAvailable = await Book.checkBookAvailability(req.body.book, req.body.quantity);
        console.log("book is available", bookIsAvailable);
        if (bookIsAvailable) {
            const zodBody = await createBorrowZodSchema.parseAsync(req.body);
            const borrow = await Borrow.create(zodBody);
            res.status(200).json({
                "success": true,
                "message": "Book borrowed successfully",
                "data": borrow
            })
        } else {
            res.status(400).json({
                "success": false,
                "message": "Book Is Not Available",
                "data": null
            })
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})
