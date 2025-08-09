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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const books_models_1 = __importDefault(require("./books.models"));
const BorrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
//deduct from the copies
BorrowSchema.post('save', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            // decrement the copies
            yield books_models_1.default.findByIdAndUpdate(doc.book, {
                $inc: { copies: -doc.quantity }
            });
            //if copies becomes zero, set available to false
            const book = yield books_models_1.default.findById(doc.book).select('copies').lean();
            if (book.copies === 0) {
                yield books_models_1.default.findByIdAndUpdate(doc.book, {
                    available: false
                });
            }
        }
        // next();
    });
});
const Borrow = (0, mongoose_1.model)("Borrow", BorrowSchema);
exports.default = Borrow;
