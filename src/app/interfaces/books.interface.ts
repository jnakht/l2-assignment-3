import { Model, Types } from "mongoose";

export interface IBook {
    title: string,
    author: string,
    genre: 'FICTION' | 'NON_FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY',
    isbn: string,
    description: string,
    copies: number,
    available: boolean,
}

export interface IBookInstanceMethods extends Model<IBook>{
    checkBookAvailability(bookId: Types.ObjectId, borrowAmount: number) : boolean;
}