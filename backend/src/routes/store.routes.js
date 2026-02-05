import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { listStores } from "../controllers/store.controller.js";

const router = express.Router();
router.get("/", authenticate, listStores);
export default router;
