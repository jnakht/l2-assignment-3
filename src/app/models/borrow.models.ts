
import { Model, model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import Book from "./books.models";

const BorrowSchema = new Schema<IBorrow, Model<IBorrow>>(
    {
    book: {
        type: Schema.Types.ObjectId,
        required: [true, "Book Is Required"],
        ref: "Book",
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, "Quantity Is Required"],
        min: [1, "The Borrow Quantity Must Be At Least One"],
    },
    dueDate: {
        type: String,
        required: [true, "Due Date Is Required"]
    }
}, {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: {virtuals: true} 
}
)
//deduct from the copies
BorrowSchema.post('save', async function(doc, next) {
    if (doc) {
        // decrement the copies
        await Book.findByIdAndUpdate(doc.book, {
            $inc: { copies: -doc.quantity}
        })
        //if copies becomes zero, set available to false
        const book : any = await Book.findById(doc.book).select('copies').lean();
        if (book.copies === 0) {
            await Book.findByIdAndUpdate(doc.book, {
                available: false
            });
        }
    }
    next();
})

const Borrow = model("Borrow", BorrowSchema);

export default Borrow;