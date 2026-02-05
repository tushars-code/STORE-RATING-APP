import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { submitRating } from "../controllers/rating.controller.js";

const router = express.Router();
router.post("/", authenticate, authorize("USER"), submitRating);
export default router;
