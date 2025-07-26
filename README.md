
# 📚Library Management API
A full-featured Library Management API built with **Express.js**, **Typescript**, **Mongodb(Mongoose)**

--

## 🔗 Live Links

-**Live API**: [l2-assignment-3-library-management.vercel.app](https://l2-assignment-3-library-management.vercel.app/)



## 🚀 Features

- 📙 Book CRUD operations (Create, Read, Update, Delete)
- 🔎 Filtering, Sorting, and Limiting book queries
- 📥 Borrowing books with bookId, and quantity
- 📊 Aggregation pipeline to get borrow summaries
- 🧠 Mongoose middleware (`pre`, `post`)
- ⚙️ Custom static and instance methods
- ✅ Robust schema validation and error handling


---

## 📦 Technologies Used

- **Node.js** + **Express.js**
- **Typescript**
- **MongoDB** + **Mongoose**
- **Validator npm**
- **Nodemon**
- **ts-node-dev**
- **Dotenv** for environment config
- **Vercel** for deployment


---


## 📦 Book Model Fields & Schema

- **title** (string) — Mandatory. The book’s title.
- **author** (string) — Mandatory. The book’s author.
- **genre** (string) — Mandatory. Must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY.
- **isbn** (string) — Mandatory and unique. The book’s International Standard Book Number.
- **description** (string) — Optional. A brief summary or description of the book.
- **copies** (number) — Mandatory. Non-negative integer representing total copies available.
- **available** (boolean) — Defaults to true. Indicates if the book is currently available for borrowing.


---


## 📦 Borrow Model Fields & Schema

- **book** (objectId) — Mandatory. References the borrowed book’s ID.
- **quantity** (number) — Mandatory. Positive integer representing the number of copies borrowed.
- **dueDate** (date) — Mandatory. The date by which the book must be returned.


---


## 📦 All The Routes(API endpoints)

- **Create Book**: `/api/books`(POST)
    For example, hit this request: 
    ```ts 
    {
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true
    }
- **Get All Books**: `/api/books` (GET). Query Parameters are: 
    `filter`: Filter by genre
    `sort`: `asc` or `desc`
    `limit`: Number of results (default: 10)
    You can add no, any number, or all query from this example: `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5` 
- **Get Book by ID**: `/api/books/:bookId` (GET)
- **Update A Book**: /api/books/:bookId (PUT). For Example, you  can hit  a request sending this : 

    ```ts 
    {
        "copies": 10
    }
- **Delete a Book by ID**: `/api/books/:bookId` (DELETE)
- **Borrow a Book**: `/api/books/:bookId` (POST)
    Example: 
    ```ts 
    {
        "book": "64bc4a0f9e1c2d3f4b5a6789",
        "quantity": 4,
        "dueDate": "2025-04-18T00:01:00.000Z"
    }
- **Borrowed Books Summary**: `/api/borrow` (GET)


---


## 📦 Business Logic

- In Borrow Book route, the book property must be a valid mongoDB ObjectId. Also this id must exists on books collection.
- While borrowing a book, the quantity will be deducted from that book on the books collection, so while borrowing, that book must have at least that number of books available
- Also, if borrow book leads to a book number to zero( i.e copies = 0), the available status on books collection of that book will be set to false. 






