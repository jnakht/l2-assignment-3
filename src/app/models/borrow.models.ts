
import { Model, model, Schema } from "mongoose";
import { IBorrow, IBorrowInstanceMethods } from "../interfaces/borrow.interface";


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


// BorrowSchema.method('checkBookAvailability', async function checkBookAvailability(bookId) {

// })

const Borrow = model("Borrow", BorrowSchema);


export default Borrow;