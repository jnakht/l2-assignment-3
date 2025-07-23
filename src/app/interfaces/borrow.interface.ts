import { Types } from "mongoose";



export interface IBorrow {
    book : Types.ObjectId,
    quantity: number,
    dueDate: string,
}

// export interface IBorrowInstanceMethods {
//     checkBookAvailability(bookId: string) : boolean;
// }