import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/api/auth/register", register);

/**
 * POST /api/auth/login
 * Authenticate user and return access token
 */
router.post("/api/auth/login", login);

export default router;
