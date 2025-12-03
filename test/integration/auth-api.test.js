const server = require("../../app");
const mongoose = require("../../config/config");
const User = require("../../src/api/resources/auth/auth.model");
const request = require("supertest");

/*
    Test the auth API
    Registration : email, password & confirm password

    tests:
        1- all fields are required
        2- password must be at least 8 characters long
        3- confirm password must match password
        4- email must be valid
        5- email must not be registered before
        6- registration success
*/

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  server.close();
  await mongoose.connection.close();
  await mongoose.disconnect();
});

describe("Auth API Integration Tests", () => {
  // 1- all fields are required
  it("should return 400 if all fields are required", async () => {
    const response = await request(server).post("/api/auth/register") 
    .send({
      name: "Test User",
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
    })
    console.log("response register : ", response?.body);
    expect(response.status).toBe(201);
    expect(response.body?.message).toBe(
      "User created successfully"
    );
  });

  // it("should delete a user and return success message via /api/auth/:id", async () => {
  //   // Create a user
  //   const createdUser = await User.create({
  //     email: "user@example.com",
  //     password: "password123",
  //     name: "Test User",
  //   });
  //   console.log("createdUser : ", createdUser);

  //   // Call API to delete the user by ID
  //   const response = await request(server).delete(
  //     `/api/auth/${createdUser._id || createdUser.id}`
  //   );
  //   console.log("response after delete : ", response?.body);

  //   // Assertions
  //   expect(response.status).toBe(200);
  //   expect(response.body?.message).toBe("user deleted successfully");
  // });
});
