import express from "express";
import { 
  register, 
  login, 
  promoteToAdmin, 
  demoteToUser, 
  deleteUser 
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import User from "../models/User.js";
import Role from "../models/Role.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Admin or Super Admin: Get all users
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  const users = await User.findAll({ include: Role });
  res.json(users);
});

// Promote user to admin
router.put("/promote/:id", authMiddleware, promoteToAdmin);

// Demote admin to user (super admin only)
router.put("/demote/:id", authMiddleware, demoteToUser);

// Delete user (with super admin protection)
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;