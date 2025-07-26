import mongoose, { model, Schema } from "mongoose";
import { IBook, IBookInstanceMethods } from "../interfaces/books.interface";
import validator from 'validator'

const BookSchema = new Schema<IBook, IBookInstanceMethods>(
    {
    title: {
        type: String,
        required: [true, "Title Of The Book Is Required"],
        trim: true
    },
    author: {
        type : String,
        required: [true, "Author Name Is Required"],
        trim : true,
        maxlength: [100, 'Max 100 Characters Are Allowed For Author Names. Got {VALUE}'],
        validate: {
            validator: function(v) {
                return /^(?=.*[A-Za-z])[A-Za-z ]+$/.test(v);
            },
            message: props => `Invalid Name Format, Allow Only Letters, Spaces; Must Contain At Least One Letter`
        }
    },
    genre: {
        type: String,
        enum : ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
        required : [true, "Genre Is Required"],
        uppercase: true,
    },
    isbn: {
        type: String,
        required: [true, 'ISBN Is Required'],
        unique: [true, "isbn must be unique"], 
    },
    description: {
        type : String,
        trim: true,
    },
    copies: {
        type: Number,
        min: [0, "Number Of Books Cannot Be Negative"],
        required: [true, "Copies Is Required"],
    },
    available: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    versionKey: false,
    timestamps: true
}
)

BookSchema.static('checkBookAvailability', async function checkBookAvailability(bookId : mongoose.Types.ObjectId, borrowAmount : number) {
    const book : any = await this.findById(bookId).select('copies').lean();
    return book.copies >= borrowAmount;
})

const Book = model<IBook, IBookInstanceMethods> ('Book', BookSchema);

export default Book;

