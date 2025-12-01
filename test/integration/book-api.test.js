const server = require("../../app");
const mongoose = require("../../config/config");
const Book = require("../../src/api/resources/books/books.model");
const request = require("supertest");

beforeEach(async () => {
  await Book.deleteMany({});
});

afterAll(async () => {
  await Book.deleteMany({});
  server.close();
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe("Books API Integration Tests", () => {
  it("should return all books via API", async () => {
    const response = await request(server).get("/api/books");
    const books = response.body?.data?.books;
    expect(response.status).toBe(200);
    expect(Array.isArray(books)).toBe(true);
  });

  it("should create a book and return it correctly via /api/books/:id", async () => {
    // Create a book
    const createdBook = await Book.create({ title: "Book One" });
    console.log("createdBook : ", createdBook);

    // Call API to fetch the book by ID
    const response = await request(server).get(
      `/api/books/${createdBook._id || createdBook.id}`
    );
    console.log("response : ", response?.body);

    // Extract book data from response
    const book = response.body?.data?.book;
    console.log("Book from API:", book);

    // Assertions
    expect(response.status).toBe(200);
    expect(book).toBeDefined();
    expect(book).toMatchObject({ title: "Book One" });
    expect(book.title).toBe("Book One");
    expect(book._id).toBe(String(createdBook._id)); // ensure same ID
  });
  it("should return 404 for non-existent book ID", async () => {
    const response = await request(server).get(
      "/api/books/66f4f5f5f5f5f5f5f5f5f5f5"
    );
    expect(response.status).toBe(404);
    expect(response.body?.message).toBe("404 not found");
  });
});

// 15 completed