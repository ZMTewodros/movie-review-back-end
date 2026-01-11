import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Role from "../models/Role.js";

const SUPER_ADMIN_EMAIL = "tewodrosayalew111@gmail.com";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const targetRoleName = role || "user";
    const userRole = await Role.findOne({ where: { name: targetRoleName } });

    if (!userRole) return res.status(400).json({ error: `Role '${targetRoleName}' does not exist.` });

    const user = await User.create({
      name,
      email,
      password: hashed,
      role_id: userRole.id 
    });
    res.json({ message: "Registered successfully!" });
  } catch (e) {
    res.status(400).json({ error: "Registration failed. Email may already be in use." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email }, include: [{ model: Role }] });
    if (!user) return res.status(401).json({ error: "user not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credential" });
    
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.Role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.Role.name } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// ... existing imports ...

export const promoteToAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Look for lowercase 'admin' as per your pgAdmin screenshot
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) return res.status(500).json({ error: "Admin role not found" });

    await user.update({ role_id: adminRole.id });
    res.json({ message: "User promoted to Admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const demoteToUser = async (req, res) => {
  const { id } = req.params;
  const requester = req.user; 

  try {
    // Ensure only the specific super admin email can trigger this
    if (requester.email.toLowerCase() !== SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ error: "Unauthorized: Only Super Admin can demote." });
    }

    const user = await User.findByPk(id);
    const userRole = await Role.findOne({ where: { name: 'user' } });

    await user.update({ role_id: userRole.id });
    res.json({ message: "Admin demoted to User" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const requester = req.user;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.email === SUPER_ADMIN_EMAIL && requester.email !== SUPER_ADMIN_EMAIL) {
    return res.status(403).json({ error: "Cannot delete super admin." });
  }
  await user.destroy();
  res.json({ message: "User deleted" });
};