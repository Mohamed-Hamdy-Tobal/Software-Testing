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

  it("should return 500 for invalid book ID", async () => {
    const response = await request(server).get(
      "/api/books/1"
    );
    expect(response.status).toBe(500);
    expect(response.body?.message).toBe("failed to get book");
  });
});

describe("Update Book API Integration Tests", () => {
  it("should update a book and return it correctly via /api/books/:id", async () => {
    // Create a book
    const createdBook = await Book.create({ title: "Book One 1" });
    console.log("createdBook : ", createdBook);

    // Call API to update the book by ID
    const response = await request(server)
      .put(`/api/books/${createdBook._id || createdBook.id}`)
      .send({ title: "Updated Book One" });
    console.log("response after update : ", response?.body);

    // Extract book data from response
    const book = response.body?.data?.book;
    console.log("Book from API:", book);

    // Assertions
    expect(response.status).toBe(200);
    expect(book).toBeDefined();
    expect(book).toMatchObject({ title: "Updated Book One" });
    expect(book.title).toBe("Updated Book One");
    expect(book._id).toBe(String(createdBook._id)); // ensure same ID
  });
});

describe("Delete Book API Integration Tests", () => {
  it("should delete a book and return success message via /api/books/:id", async () => {
    // Create a book
    const createdBook = await Book.create({ title: "Book One 2" });
    console.log("createdBook : ", createdBook);

    // Call API to delete the book by ID
    const response = await request(server).delete(
      `/api/books/${createdBook._id || createdBook.id}`
    );
    console.log("response after delete : ", response?.body);

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body?.message).toBe("book deleted successfully");
  });
});

// 16 completed
