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
exports.borrowsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_models_1 = __importDefault(require("../models/borrow.models"));
const books_models_1 = __importDefault(require("../models/books.models"));
exports.borrowsRoutes = express_1.default.Router();
const bookNotAvailableError = {
    name: "BookNotAvailableError",
    errors: {
        quantity: {
            message: "Book Is Not Available",
            name: "BookNotAvailableError",
            properties: {
                message: "Book Is Not Available",
                type: "max"
            },
            path: "quantity",
            kind: "max",
        }
    }
};
const bookNotExists = {
    name: "BookNotExistsError",
    errors: {
        book: {
            message: "Book Does Not Exists",
            name: "BookNotExistsError",
            properties: {
                message: "Book Does Not Exists",
                type: "not exists"
            },
            path: "book",
            kind: "not exists",
        }
    }
};
exports.borrowsRoutes.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let borrow;
        if (!req.body.book || !req.body.quantity || !req.body.dueDate) {
            borrow = yield new borrow_models_1.default(req.body);
            yield borrow.save();
            return;
        }
        //check if that referenced book exists
        const bookExists = yield books_models_1.default.countDocuments({ _id: req.body.book }, { limit: 1 });
        if (!bookExists) {
            return res.status(400).json({
                "message": "Book Does Not Exists",
                "success": false,
                "error": bookNotExists
            });
        }
        const bookIsAvailable = yield books_models_1.default.checkBookAvailability(req.body.book, req.body.quantity);
        if (bookIsAvailable) {
            borrow = yield new borrow_models_1.default(req.body);
            yield borrow.save();
            return res.status(200).json({
                "success": true,
                "message": "Book borrowed successfully",
                "data": borrow
            });
        }
        else {
            res.status(400).json({
                "message": "Book Is Not Available",
                "success": false,
                "error": bookNotAvailableError
            });
        }
    }
    catch (error) {
        next(error);
    }
}));
// get borrow summary
// borrowsRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //aggregate pipeline
//         const borrows = await Borrow.aggregate([
//             {
//                 $lookup: {
//                     from: "books",
//                     localField: "book",
//                     foreignField: "_id",
//                     as: "bookData"
//                 }
//             },
//             {
//                 $group: {
//                     _id: "$bookData",
//                     totalQuantity: { $sum: "$quantity" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     book: {
//                         title: { $first: "$_id.title" },
//                         isbn: { $first: "$_id.isbn" }
//                     },
//                     totalQuantity: 1
//                 }
//             }
//         ])
//         res.status(200).json({
//             "success": true,
//             "message": "Borrowed books summary retrieved successfully",
//             "data": borrows
//         })
//     } catch (error: any) {
//         next();
//     }
// })
// get borrow summary with pagination
exports.borrowsRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        //aggregate pipeline
        const borrowAgg = yield borrow_models_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            {
                $unwind: "$bookData"
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookData.title",
                        isbn: "$bookData.isbn"
                    },
                    totalQuantity: 1
                }
            },
            // Pagination
            { $skip: skip },
            { $limit: limit }
        ]);
        const borrows = yield borrowAgg;
        const totalAgg = yield borrow_models_1.default.aggregate([
            { $group: { _id: "$book" } },
            { $count: "total" }
        ]);
        const total = totalAgg.length > 0 ? totalAgg[0].total : 0;
        res.status(200).json({
            "success": true,
            "message": "Borrowed books summary retrieved successfully",
            "data": borrows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    }
    catch (error) {
        next(error);
    }
}));
