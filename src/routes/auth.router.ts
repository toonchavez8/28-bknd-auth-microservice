import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { loginRateLimiter, registerRateLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", registerRateLimiter, register);

/**
 * POST /api/auth/login
 * Authenticate user and return access token
 */
router.post("/login", loginRateLimiter, login);

export default router;
