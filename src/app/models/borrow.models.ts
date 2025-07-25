
import { Model, model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";
import Book from "./books.models";
import { isMongoId } from "validator";


const BorrowSchema = new Schema<IBorrow, Model<IBorrow>>(
    {
    book: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Book",
        validate: {
            validator: function(v) {
                return isMongoId(v);
            },
            message: props => `${props.value} Is Not A Valid MongoDB ObjectId`
        },
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

const Borrow = model("Borrow", BorrowSchema);

export default Borrow;