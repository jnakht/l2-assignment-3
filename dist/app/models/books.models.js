"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title Of The Book Is Required"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author Name Is Required"],
        trim: true,
        maxlength: [100, 'Max 100 Characters Are Allowed For Author Names. Got {VALUE}'],
        validate: {
            validator: function (v) {
                return /^(?=.*[A-Za-z])[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(v);
            },
            message: props => `Invalid Name Format, Allow Only Letters, Accented letters, Apostrophes ', Hyphens -, Spaces; Must Contain At Least One Letter`
        }
    },
    genre: {
        type: String,
        enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
        required: [true, "Genre Is Required"],
        uppercase: true,
    },
    isbn: {
        type: String,
        required: [true, 'ISBN Is Required'],
        unique: [true, "isbn must be unique"],
    },
    description: {
        type: String,
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
});
BookSchema.static('checkBookAvailability', function checkBookAvailability(bookId, borrowAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId).select('copies').lean();
        return (book === null || book === void 0 ? void 0 : book.copies) >= borrowAmount;
    });
});
const Book = (0, mongoose_1.model)('Book', BookSchema);
exports.default = Book;
