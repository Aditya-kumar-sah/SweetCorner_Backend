const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./index")
const request = require("supertest"); 
const User = require("./model/user.model");

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGOURL_TEST, { dbName: "testdb" });
});

afterAll(async () => {
  // Clean up test DB and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Test MongoDB connection
describe("MongoDB connection", () => {
  it("should be connected", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});




describe("Auth Flow (Red-Green-Refactor)", () => {
  const userData = {
    name: "TDD User",
    email: "tdduser@example.com",
    contact: "1234567890",
    address: "Test Street",
    password: "Password123",
  };

  it("should register a user ", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    // expected behavior
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully!");
  });

  it("should login with correct credentials ", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.token).toBeDefined();
  });

  
});