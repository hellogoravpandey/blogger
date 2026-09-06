import { Router } from "express";
import { getAdminBlogs, getAdminDashboard, getAdminUsers, updateUserRole } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(requireAdmin);
router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.patch("/users/:userId/role", updateUserRole);
router.get("/blogs", getAdminBlogs);
export default router;