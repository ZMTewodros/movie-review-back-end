import { User } from "../models/User.js";

export const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Change role_id to 2 (Admin)
    await user.update({ role_id: 2 }); 

    res.json({ message: "User promoted to Admin", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};