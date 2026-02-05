import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { 
  dashboard, 
  addUser, 
  addStore, 
  getAllUsers, 
  getAllStores 
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply middleware to all admin routes
router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", dashboard);
router.get("/users", getAllUsers);   // <--- Added
router.get("/stores", getAllStores); // <--- Added
router.post("/users", addUser);
router.post("/stores", addStore);

export default router;