import express, { Request, Response } from "express"
import Book from "../models/books.models";
import z, { any, ZodError } from "zod"


export const booksRoutes = express.Router();


//zod validation
const createBookZodSchema = z.object({
    title: z.string({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message
            return `The Title Must Be Of String Type`
        }
    }),
    author: z.string({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message
            return `The Author Name Must Be A String`
        }
    }),
    genre: z.string({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message
            return `The Genre Must Be A String`
        }
    }),
    isbn: z.string({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message
            return `The ISBN Name Must Be A String`
        }
    }),
    description: z.string({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message
            return `The Description Name Must Be A String`
        }
    }).optional(),
    copies: z.number({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message;
            iss.minimum;
            return `The Copies Must Be A Boolean`
        }
    }),
    available: z.boolean({
        error: (iss) => {
            iss.code;
            iss.input;
            iss.path;
            iss.expected;
            iss.inst;
            iss.message;
            
            return `The Available Must Be A Boolean`
        }
    })
})
    .refine((data) => !(data.copies === 0 && data.available === true), {
        message: "If Copies is 0, available must be false",
        path: ["confirm"],
    })

// function formatZodError(error: z.ZodError) {
//     return error.issues.map(issue => ({
//         message: "Validation Failed",
//         success: false,
//         error: {
//             name: "ValidationError",
//             errors: {
//                 [issue.path.join('.')]: {
//                     message: issue.message,
//                     name: "ValidatiorError",
//                     properties: {
//                         message: issue.message,
//                         type: issue.code,
//                         value: issue.input
//                     },
//                     kind: issue.code,
//                     path: issue.path.join('.'),
//                 }
//             }
//         },
//         path: issue.path.join('.'),
//         code: issue.code
//     }));
// }


//create a book route
booksRoutes.post('/create-book', async (req: Request, res: Response) => {
    try {
        const zodResult = await createBookZodSchema.safeParseAsync(req.body);

        //  if (!zodResult.success) {
        //     const formatted = formatZodError(zodResult.error);
        //     return res.status(400).json(formatted);
        // }



        const book = await Book.create(zodResult);

        res.status(200).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    } catch (error) {

            res.status(400).json({
                message: "Validation Failed",
                success: false,
                error,
            });
    }
});

// get all books, query books
booksRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy as string;
        const sort = req.query.sort;
        const limit = req.query.limit as string;

        //    option 1 
        //    let query : any = {};
        //    if (filter) {
        //     query.genre = filter;
        //    }

        //    let booksQuery = Book.find(query);

        //    const one = 1, minusOne = -1;
        //    const sortOrder = sort === 'desc' ? minusOne : one;
        //    if (sortBy && sort) {
        //     booksQuery = booksQuery.sort({[sortBy] : sortOrder});
        //    }
        //    if (limit) {
        //     booksQuery = booksQuery.limit(parseInt(limit));
        //    }
        //    const books = await booksQuery;



        // option - 2
        const one = 1, minusOne = -1;
        const sortOrder = sort === 'desc' ? minusOne : one;
        const books = await Book.find(
            filter ? { genre: filter } : {}
        ).sort(
            sortBy && sort ?
                { [sortBy]: sortOrder } : {}
        ).limit(limit ? parseInt(limit) : 0);


        res.status(200).json({
            "success": true,
            "message": "Books retrieved successfully",
            "data": books
        })
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})
// get a single book by id
booksRoutes.get('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const book = await Book.findById(id);
        res.status(200).json({
            "success": true,
            "message": "Book retrieved successfully",
            "data": book
        })
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})
// update a single book by id
booksRoutes.patch('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const body = req.body;
        const updatedBook = await Book.findByIdAndUpdate(id, body, { new: true });
        res.status(200).json({
            "success": true,
            "message": "Book updated successfully",
            "data": updatedBook
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})

// delete a single book by id
booksRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const deletedBook = await Book.findByIdAndDelete(id);
        res.status(200).json({
            "success": true,
            "message": "Book deleted successfully",
            "data": null
        });
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})

