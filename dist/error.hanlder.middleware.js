"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, next) => {
    var _a;
    console.log('❌ - Error Occurred - ❌', err);
    //validation error
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        return res.status(400).json({
            message: "Validation Failed",
            success: false,
            error: {
                name: "ValidationError",
                errors: err.errors
            }
        });
    }
    //cast error
    if (err instanceof mongoose_1.default.Error.CastError) {
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
        });
    }
    //duplicate key error
    if (err.name === 'MongooseError' && (((_a = err === null || err === void 0 ? void 0 : err.cause) === null || _a === void 0 ? void 0 : _a.code) === 11000 || (err === null || err === void 0 ? void 0 : err.code) === 1000)) {
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
        });
    }
    if (err instanceof (mongoose_1.default === null || mongoose_1.default === void 0 ? void 0 : mongoose_1.default.Error)) {
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
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: {
            name: err.name || "Something Went Wrong",
            message: err.message || "Internal Server Error",
            errors: err
        }
    });
};
exports.errorHandler = errorHandler;
