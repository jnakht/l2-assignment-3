import { model, Schema } from "mongoose";
import { IAuthor, IBook, IBookInstanceMethods } from "../interfaces/books.interface";
import validator from 'validator'

// const AuthorSchema = new Schema<IAuthor>({
//     firstName : { 
//         type : String,
//         required: [true, "First Name Is Required"],
//         trim : true,
//     },
//     lastName: {
//         type : String,
//         required: [true, "Last Name Is Required"],
//         trim: true,
//     }
// })

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
        validate: {
            validator: function(v) {
                return validator.isAlpha(v);
            },
            message: props => `Name Must Only Contain Alphabets. Got ${props.value}`
        },
        maxlength: [100, 'Max 100 Characters Are Allowed For Author Names. Got {VALUE}'] 
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
        unique: [true, "ISBN Must Be Unique For Each Book"]
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


BookSchema.static('checkBookAvailability', async function checkBookAvailability(bookId, borrowAmount) {
    const book : any = await this.findById(bookId).select('copies').lean();
    // console.log(book, "in the static method");
    return book.copies >= borrowAmount;
})


const Book = model<IBook, IBookInstanceMethods> ('Book', BookSchema);

export default Book;

