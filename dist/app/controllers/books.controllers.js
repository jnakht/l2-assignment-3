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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_models_1 = __importDefault(require("../models/books.models"));
exports.booksRoutes = express_1.default.Router();
const bookNotFound = {
    name: "BookNotFoundError",
    errors: {
        objectId: {
            message: "This Book Is Not Found",
            name: "BookNotFoundError",
            properties: {
                message: "This Book Is Not Found",
                type: "not found"
            },
            path: "bookId",
            kind: "not found",
        }
    }
};
//create a book route
exports.booksRoutes.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield books_models_1.default.syncIndexes();
        const book = yield books_models_1.default.create(req.body);
        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// get all books, query books
// booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const filter = req.query.filter;
//         const sortBy = req.query.sortBy as string;
//         const sort = req.query.sort;
//         const limit = req.query.limit as string;
//         const one = 1, minusOne = -1;
//         const sortOrder = sort === 'desc' ? minusOne : one;
//         const books = await Book.find(
//             filter ? { genre: filter } : {}
//         ).sort(
//             sortBy && sort ?
//                 { [sortBy]: sortOrder } : {}
//         ).limit(limit ? parseInt(limit) : 0);
//         res.status(200).json({
//             "success": true,
//             "message": "Books retrieved successfully",
//             "data": books
//         })
//     } catch (error: any) {
//         next(error);
//     }
// })
//get all books with pagination
exports.booksRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = yield books_models_1.default.countDocuments();
        const books = yield books_models_1.default.find().skip(skip).limit(limit);
        res.status(200).json({
            "success": true,
            "message": "Books retrieved successfully",
            "data": books,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        next(error);
    }
}));
// get a single book by id
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield books_models_1.default.findById(id);
        if (!book) {
            return res.status(400).json({
                message: "Book Not Found",
                success: false,
                error: bookNotFound
            });
        }
        res.status(200).json({
            "success": true,
            "message": "Book retrieved successfully",
            "data": book
        });
    }
    catch (error) {
        next(error);
    }
}));
// update a single book by id
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const body = req.body;
        const updatedBook = yield books_models_1.default.findByIdAndUpdate(id, body, { new: true });
        if (!updatedBook) {
            return res.status(400).json({
                message: "Book Not Found",
                success: false,
                error: bookNotFound
            });
        }
        res.status(200).json({
            "success": true,
            "message": "Book updated successfully",
            "data": updatedBook
        });
    }
    catch (error) {
        next(error);
    }
}));
// delete a single book by id
exports.booksRoutes.delete('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const deletedBook = yield books_models_1.default.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(400).json({
                message: "Book Not Found",
                success: false,
                error: bookNotFound
            });
        }
        res.status(200).json({
            "success": true,
            "message": "Book deleted successfully",
            "data": null
        });
    }
    catch (error) {
        next(error);
    }
}));
