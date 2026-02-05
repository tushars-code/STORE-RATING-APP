import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { ownerDashboard } from "../controllers/owner.controller.js";

const router = express.Router();
router.get("/dashboard", authenticate, authorize("STORE_OWNER"), ownerDashboard);
export default router;
