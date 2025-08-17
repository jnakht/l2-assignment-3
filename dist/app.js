"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controllers_1 = require("./app/controllers/books.controllers");
const borrow_controllers_1 = require("./app/controllers/borrow.controllers");
const error_hanlder_middleware_1 = require("./error.hanlder.middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// app.use(
//   cors({
//     origin: "*",
//     // methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://library-management-frontend-omega-ten.vercel.app']
}));
app.use(express_1.default.json());
app.use('/api/books', books_controllers_1.booksRoutes);
app.use('/api/borrow', borrow_controllers_1.borrowsRoutes);
app.get('/', (req, res, next) => {
    res.send('Welcome to Library Application');
    next();
});
app.use((req, res, next) => {
    res.status(404).json({
        "message": "Route Not Found",
        "success": false,
        "error": {
            "name": "Invalid Route",
            "errors": {
                "route": {
                    "message": "The Route Is Not A Valid Route",
                    "name": "Invalid Route",
                    "properties": {
                        "message": "The Route Is Not A Valid Route",
                        "code": 404,
                        "type": "not found"
                    },
                    "kind": "not found",
                    "path": req.path
                }
            }
        }
    });
    // next();
});
app.use(error_hanlder_middleware_1.errorHandler);
exports.default = app;
