
import { Model, model, Schema } from "mongoose";
import { IBorrow, IBorrowInstanceMethods } from "../interfaces/borrow.interface";
import Book from "./books.models";


const BorrowSchema = new Schema<IBorrow, Model<IBorrow>, IBorrowInstanceMethods>(
    {
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
// BorrowSchema.method('checkBookAvailability', async function checkBookAvailability(bookId) {

// })

const Borrow = model("Borrow", BorrowSchema);


export default Borrow;