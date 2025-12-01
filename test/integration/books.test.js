require("dotenv").config();
require("../../config/config");
const booksService = require("../../src/api/resources/books/books.service");
const Book = require("../../src/api/resources/books/books.model");
const mongoose = require("../../config/config");

beforeEach(async () => {
  console.log("Setting up database before test...");
  await Book.deleteMany({});
});

afterAll(async () => {
  console.log("Cleaning up database after test...");
  await Book.deleteMany({});
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe("Books API", () => {
  it("should return all books", async () => {
    const books = await booksService.getBooks();
    console.log("Books:", books);
    expect(books.length).toBe(0); // Adjust expectation based on your test database state
  });

  it("should return 2 books", async () => {
    const book1 = new Book({ title: "Book One" });
    const book2 = new Book({ title: "Book Two" });
    await Book.insertMany([book1, book2]);
    const books = await booksService.getBooks();
    console.log("Books:", books);
    expect(books.length).toBe(2); // Adjust expectation based on your test database state
  });
});
