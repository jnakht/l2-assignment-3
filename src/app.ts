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
                        "code": 404,
                        "type": "not found"
                    },
                    "kind": "not found",
                    "path": req.path
                }
            }
        }
    })
    next();
})

app.use(errorHandler);

export default app;