import { beforeEach, describe, expect } from "vitest";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../utils/app-data-source";
import { it } from "node:test";
import request from "supertest";
import app from "../index";
import chalk from "chalk";

describe("POST /api/auth/register", () => {
  it("should register a new user successfully", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("userId");
    expect(response.body.data).toHaveProperty("message");
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      // missing email and password
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("ValidationError");
  });

  it("should return 409 for duplicate username", async () => {
    // First registration
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test1@example.com",
      password: "SecurePass123!",
    });

    // Duplicate registration
    const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        email: "test2@example.com",
        password: "SecurePass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("DuplicateError");
  });

  it("should return 409 for duplicate email", async () => {
    // First registration
    await request(app).post("/api/auth/register").send({
      username: "testuser1",
      email: "test@example.com",
      password: "SecurePass123!",
    });

    // Duplicate email
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser2",
      email: "test@example.com",
      password: "SecurePass123!",
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("DuplicateError");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    // Register a user before each login test
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "SecurePass123!",
    });
  });

  it("should login successfully with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "testuser",
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
      username: "testuser",
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe("AuthenticationError");
  });

  it("should return 400 for missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "testuser",
      // missing password
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
