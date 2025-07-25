import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Error } from "mongoose";



export const errorHandler : ErrorRequestHandler = (err : any, req: Request, res : Response, next: NextFunction) => {
    console.log('❌ - Error Occurred - ❌', err);
    console.log(err.cause.code, "error code");
    console.log(err.name, "error name");

    //validation error
    if (err instanceof Error.ValidationError) {
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
    if (err instanceof Error.CastError) {
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
    if (err.name === 'MongooseError' && err.cause.code === 11000) {
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
    next();
}