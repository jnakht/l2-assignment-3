
import express, { Request, Response } from "express";
import Borrow from "../models/borrow.models";

export const borrowsRoutes = express.Router();

borrowsRoutes.post('/', async (req : Request, res : Response) => {
    const body = req.body;
    const borrow = await Borrow.create(body);
    res.status(200).json({
        "success": true,
        "message": "Book borrowed successfully",
        "data": borrow
    })
})
