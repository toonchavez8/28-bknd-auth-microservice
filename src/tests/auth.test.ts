import { beforeEach, describe, expect, it, afterEach } from "vitest";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../utils/app-data-source";
import request from "supertest";
import app from "../index";

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    // Clean up before each test
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();
    // Add a small delay to ensure cleanup completes
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it("should register a new user successfully", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser1",
      email: "test1@example.com",
      password: "SecurePass123!",
    });

    // Log the response for debugging
    if (response.status !== 201) {
      console.log('Registration failed:', JSON.stringify(response.body, null, 2));
    }

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("userId");
    expect(response.body.data).toHaveProperty("message");
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser2",
      // missing email and password
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("ValidationError");
  });

  it("should return 409 for duplicate username", async () => {
    // First registration
    await request(app).post("/api/auth/register").send({
      username: "duplicateuser",
      email: "duplicateuser1@example.com",
      password: "SecurePass123!",
    });

    // Duplicate registration
    const response = await request(app).post("/api/auth/register").send({
      username: "duplicateuser",
      email: "duplicateuser2@example.com",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("DuplicateError");
  });

  it("should return 409 for duplicate email", async () => {
    // First registration
    await request(app).post("/api/auth/register").send({
      username: "duplicateuser1",
      email: "duplicate@example.com",
      password: "SecurePass123!",
    });

    // Duplicate email
    const response = await request(app).post("/api/auth/register").send({
      username: "duplicateuser2",
      email: "duplicate@example.com",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("DuplicateError");
  });
});

describe("POST /api/auth/login", () => {
  let testUserId: string;

  beforeEach(async () => {
    // Clean up and register a user before each login test
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();
    // Add a small delay to ensure cleanup completes
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await request(app).post("/api/auth/register").send({
      username: "loginuser",
      email: "loginuser@example.com",
      password: "SecurePass123!",
    });
    
    // Add error checking
    if (!response.body.data || !response.body.data.userId) {
      console.error('Failed to register test user in beforeEach:', JSON.stringify(response.body, null, 2));
      throw new Error('Failed to register test user for login tests');
    }
    
    testUserId = response.body.data.userId;
  });

  afterEach(async () => {
    // Delete the test user after each test using the delete route
    if (testUserId) {
      await request(app).delete(`/api/users/${testUserId}`);
    }
  });

  it("should login successfully with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "loginuser",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("accessToken");
    expect(response.body.data).toHaveProperty("tokenType");
    expect(response.body.data).toHaveProperty("expiresIn");
    expect(response.body.data.tokenType).toBe("Bearer");
  });

  it("should return 401 for invalid username", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "wronguser",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("AuthenticationError");
  });

  it("should return 401 for invalid password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "loginuser",
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("AuthenticationError");
  });

  it("should return 401 for missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "loginuser",
      // missing password
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("AuthenticationError");
  });
});