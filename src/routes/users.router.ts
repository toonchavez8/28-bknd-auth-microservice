import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/users.controller";
import { register } from "../controllers/auth.controller";
import { apiRateLimiter } from "../middleware/rate-limit.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { validateUpdateUser } from "../middleware/validate-request.middleware";

const router = Router();
// Apply rate limiting and authentication to all routes
router.use(apiRateLimiter);
router.use(authenticate);
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
router.put("/:id",validateUpdateUser, updateUser);

/**
 * DELETE /api/users/:id
 * Delete a user
 */
router.delete("/:id", deleteUser);

export default router;