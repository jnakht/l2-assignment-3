
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

BorrowSchema.post('save', async function(doc, next) {
    if (doc) {
        await Book.findByIdAndUpdate(doc.book, {
            $inc: { copies: -doc.quantity}
        })
    }
    next();
})
// BorrowSchema.method('checkBookAvailability', async function checkBookAvailability(bookId) {

// })

const Borrow = model("Borrow", BorrowSchema);


export default Borrow;