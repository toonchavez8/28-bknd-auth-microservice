import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/users.controller";
import { register } from "../controllers/auth.controller";

const router = Router();

/**
 * GET /api/users
 * Fetch all users
 */
router.get("/", getAllUsers);

/**
 * GET /api/users/:id
 * Fetch a single user by ID
 */
router.get("/:id", getUserById);

/**
 * POST /api/users
 * Create a new user (register)
 */
router.post("/", register);

/**
 * PUT /api/users/:id
 * Update an existing user
 */
router.put("/:id", updateUser);

/**
 * DELETE /api/users/:id
 * Delete a user
 */
router.delete("/:id", deleteUser);

export default router;