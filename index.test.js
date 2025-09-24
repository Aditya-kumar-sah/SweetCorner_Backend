const mongoose = require("mongoose");
require("dotenv").config();

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
