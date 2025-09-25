const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./index");
const request = require("supertest");
const User = require("./model/user.model");
const Sweet = require("./model/sweet.model");

let userToken;
let adminToken;

// ----------------------
// DB Setup / Teardown
// ----------------------
beforeAll(async () => {
  await mongoose.connect(process.env.MONGOURL_TEST, { dbName: "testdb" });

  // ----------------------
  // Regular User
  // ----------------------
  await request(app).post("/api/auth/register").send({
    name: "TDD User",
    email: "tdduser@example.com",
    contact: "1234567890",
    address: "Test Street",
    password: "Password123",
  });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "tdduser@example.com", password: "Password123" });

  userToken = loginRes.body.token;

  // ----------------------
  // Admin User (isAdmin: true)
  // ----------------------
  await User.create({
    name: "Admin User",
    email: "admin@example.com",
    contact: "9876543210",
    address: "Admin Street",
    password: await require("bcrypt").hash("AdminPass123", 10),
    isAdmin: true,
  });

  const adminLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "AdminPass123" });

  adminToken = adminLoginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Sweet.deleteMany({});
});

// ----------------------
// MongoDB Connection Test
// ----------------------
describe("MongoDB connection", () => {
  it("should be connected", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});

// ----------------------
// Auth Flow Tests
// ----------------------
describe("Auth Flow (Red-Green-Refactor)", () => {
  const userData = {
    name: "TDD User 2",
    email: "tdduser2@example.com",
    contact: "1234509876",
    address: "Test Street 2",
    password: "Password123",
  };

  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully!");
  });

  it("should login with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.token).toBeDefined();
  });
});

// ----------------------
// Sweet API Tests
// ----------------------
describe("Sweet API", () => {
  let sweetId;

  it("should add a new sweet (admin only)", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: `Ladoo-${Date.now()}`, price: 100, category: "Dry", quantity: 10 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.name).toMatch(/Ladoo/);
    sweetId = res.body.sweet._id;
  });

  it("should get all sweets (user auth)", async () => {
    await Sweet.create({ name: `Barfi-${Date.now()}`, price: 150, category: "Milk" });

    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBeDefined();
  });

  it("should search sweets by name, category, price range", async () => {
    const name = `Ladoo-${Date.now()}`;
    await Sweet.create({ name, price: 120, category: "Dry" });
    await Sweet.create({ name: `Barfi-${Date.now()}`, price: 200, category: "Milk" });

    const res = await request(app)
  .get("/api/sweets/search")
  .set("Authorization", `Bearer ${userToken}`)
  .send({ name: "Lad", category: "Dry", pricemin: 100, pricemax: 150 });


    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe(name);
  });

  it("should update a sweet (admin only)", async () => {
    const sweet = await Sweet.create({ name: `Jalebi-${Date.now()}`, price: 80, category: "Fried" });

    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 90 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.price).toBe(90);
  });

  it("should delete a sweet (admin only)", async () => {
    const sweet = await Sweet.create({ name: `Rasgulla-${Date.now()}`, price: 50, category: "Milk" });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    const dbSweet = await Sweet.findById(sweet._id);
    expect(dbSweet).toBeNull();
  });

  it("should purchase a sweet if in stock (user only)", async () => {
    const sweet = await Sweet.create({ name: `Kaju-${Date.now()}`, price: 250, category: "Dry", quantity: 5 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(4);
  });

  it("should fail to purchase if out of stock (user only)", async () => {
    const sweet = await Sweet.create({ name: `Peda-${Date.now()}`, price: 60, category: "Milk", quantity: 0 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Sweet is out of stock");
  });

  it("should restock a sweet (admin only)", async () => {
    const sweet = await Sweet.create({ name: `Sandesh-${Date.now()}`, price: 90, category: "Milk", quantity: 2 });

    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(7);
  });
});

