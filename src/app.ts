import express, { Application, NextFunction, Request, Response } from "express"
import { booksRoutes } from "./app/controllers/books.controllers";
import { borrowsRoutes } from "./app/controllers/borrow.controllers";
import { errorHandler } from "./error.hanlder.middleware";



const app: Application = express();
app.use(express.json());
app.use('/api/books', booksRoutes);
app.use('/api/borrow', borrowsRoutes);

app.get('/', (req : Request, res : Response, next: NextFunction) => {
    res.send('Welcome to Library Application');
    next();
})


app.use((req : Request, res : Response, next : NextFunction) => {
    res.status(404).json({
        "message" : "Route Not Found",
        "success" : false,
        "error" : {
            "name" : "Invalid Route",
            "errors" : {
                "route" : {
                    "message" : "The Route Is Not A Valid Route",
                    "name" : "Invalid Route",
                    "properties" : {
                        "message" : "The Route Is Not A Valid Route",
                    }
                }
            }
        }
    })
    next();
})

// app.use((error : any, req : Request, res : Response, next : NextFunction) => {
//     if (error) {
//         // console.log(error);
//         // res.status(400).json({
//         //     "message": error.message,
//         //     "success": false,
//         //     "error": error
//         // })
//     }
// })

app.use(errorHandler);

export default app;