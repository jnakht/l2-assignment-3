import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose, { Error } from "mongoose";



export const errorHandler : ErrorRequestHandler = (err : any, req: Request, res : Response, next: NextFunction) => {
    console.log('❌ - Error Occurred - ❌', err);


    //validation error
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            message: "Validation Failed",
            success: false,
            error: {
                name: "ValidationError",
                errors: err.errors
            }
        })
    }

    //cast error
    if (err instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            message: "Validation Failed",
            success: false,
            error: {
                name: "CastError",
                errors: {
                    [err.path]: {
                        message: err.message,
                        name: err.name,
                        properties: {
                            message: err.message,
                            stringValue: err.stringValue,
                            reason: err.reason,
                        },
                        kind: err.kind,
                        path: err.path,
                        value: err.value
                    }
                }
            }
        })
    }

    //duplicate key error
    console.log(err?.name , err?.cause?.code , err?.code);
    if (err.name === 'MongooseError' && (err?.cause?.code === 11000 || err?.code === 1000)) {
        console.log(err);
        console.log("duplicate key function");
        res.status(400).json({
            message: "Validation Error",
            success: false,
            error: {
                name: "ValidationError",
                errors: {
                    isbn: {
                        message: "isbn must be unique",
                        name: "validationError",
                        properties: err.cause
                    }
                }
            }
        })
    }

    if(err instanceof mongoose?.Error) {
        return res.status(400).json({
            message: "Validation Failed",
            success: false,
            error: {
                name: err.name,
                errors: {
                    message: err.message,
                    name: err.name,  
                }
            }
        })
    }


    return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: {
            name: err.name || "Something Went Wrong",
            message: err.message || "Internal Server Error",
            errors: err
        }
    })

}