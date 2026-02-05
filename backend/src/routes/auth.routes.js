import express from "express";
import { login, signup, updatePassword } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/password", authenticate, updatePassword); // <--- Added

export default router;