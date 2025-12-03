// 3rd party libraries
const express = require("express");

// own libraries
const booksRouter = require("./resources/books/books.router");
const authRouter = require("./resources/auth/auth.router");

// create the rest router
const restRouter = express.Router();

// map the api routes
restRouter.use("/books", booksRouter);
restRouter.use("/auth", authRouter);

module.exports = restRouter;
