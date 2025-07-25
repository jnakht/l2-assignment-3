import express, { Application, NextFunction, Request, Response } from "express"
import { booksRoutes } from "./app/controllers/books.controllers";
import { borrowsRoutes } from "./app/controllers/borrow.controllers";


const app: Application = express();
app.use(express.json());
app.use('/api/books', booksRoutes);
app.use('/api/borrow', borrowsRoutes);

app.get('/', (req : Request, res : Response) => {
    res.send('Welcome to Library Application');
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
})

app.use((error : any, req : Request, res : Response, next : NextFunction) => {
    if (error) {
        console.log(error);
        res.status(400).json({
            "message": error._message,
            "success": false,
            "error": error
        })
    }
})

export default app;