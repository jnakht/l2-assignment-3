
# 📚Library Management API
A full-featured Library Management API built with **Express.js**, **Typescript**, **Mongodb(Mongoose)**

--

## 🔗 Live Links

-**Live API**: [l2-assignment-3-library-management.vercel.app](https://l2-assignment-3-library-management.vercel.app/)

-**Original Requirements**: [Appollo-Level2-Web-Dev](https://github.com/Apollo-Level2-Web-Dev/B5A3.git) 

 you can check the original requirements for better understanding.


## 🚀 Features

- 📙 Book CRUD operations (`Create`, `Read`, `Update`, `Delete`)
- 🔎 Filtering, Sorting, and Limiting book queries
- 📥 Borrowing books with `bookId`, and quantity
- 📊 Aggregation pipeline to get borrow summaries
- 🧠 Mongoose middleware (`pre`, `post`)
- ⚙️ Custom `static` and `instance` methods
- ✅ Robust `schema` validation and error handling


---

## 📦 Technologies Used

- **Node.js** + **Express.js**
- **Typescript**
- **MongoDB** + **Mongoose**
- **validator (npm)**
- **nodemon (npm)**
- **ts-node-dev (npm)**
- **dotenv** for environment config
- **Vercel** for deployment


---


## 📦 Book Model Fields & Schema

- **title** (string) — Mandatory. The book’s title.
- **author** (string) — Mandatory. The book’s author.
- **genre** (string) — Mandatory. Must be one of: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY`.
- **isbn** (string) — Mandatory and ***unique***. The book’s International Standard Book Number.
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
    ```json 
    {
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true
    }
    ```
- **Get All Books**: `/api/books` (GET). Query Parameters are: 

    - `filter`: Filter by genre
    - `sort`: `asc` or `desc`
    - `limit`: Number of results (default: 10)

    You can add no, any number, or all query from this example: 

    - `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5` 

- **Get Book by ID**: `/api/books/:bookId` (GET)
- **Update A Book**: `/api/books/:bookId` (PUT). For Example, you  can hit  a request sending this : 

    ```json 
    {
        "copies": 10
    }
    ```

- **Delete a Book by ID**: `/api/books/:bookId` (DELETE)
- **Borrow a Book**: `/api/books/:bookId` (POST)
    Example: 

    ```json 
    {
        "book": "64bc4a0f9e1c2d3f4b5a6789",
        "quantity": 4,
        "dueDate": "2025-04-18T00:01:00.000Z"
    }
    ```

- **Borrowed Books Summary**: `/api/borrow` (GET)


---


## 📦 Business Logic

- In the **Borrow Book** route, the `book` property must be a valid MongoDB ObjectId and must reference an existing document in the Books collection.
- When a book is borrowed, the specified `quantity` is deducted from the `copies` field of the corresponding book. Therefore, the book must have at least that many copies available at the time of borrowing.
- If borrowing reduces the `copies` to `0`, the `available` field of that book will automatically be set to `false`.


---


## ⚙️ Setup Instructions

1. **Clone the repo**

    ```bash
    git clone https://github.com/jnakht/l2-assignment-3.git
    cd l2-assignment-3
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Setup .env file**

    Create a `.env` file in the root directory with:

    ```env
    MONGO_URI=your_mongo_connection_string
    ```

4. **Run Locally**

    ```bash
    npm start
    ```

## 🧪 Testing the API

You can test the endpoints using:
- **Postman**
- **Thunder Client** (extension)
- Or any HTTP client of your choice

> Example base URL: `https://l2-assignment-3-library-management.vercel.app/api/books`



