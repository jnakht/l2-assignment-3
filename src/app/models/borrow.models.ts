
import { Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";


const BorrowSchema = new Schema<IBorrow>({
    book: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    dueDate: {
        type: String,
        required: true
    }
})