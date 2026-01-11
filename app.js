import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import Role from "./models/Role.js";
import MovieCategory from "./models/MovieCategory.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  // Seed roles/categories if not present
  const roles = await Role.findAll();
  if (roles.length === 0) {
    // IMPORTANT: Ensure these match the frontend strings 'admin' and 'user'
    await Role.bulkCreate([{ name: "admin" }, { name: "user" }]);
    console.log("Roles seeded.");
  }
  
  const categories = await MovieCategory.findAll();
  if (categories.length === 0) {
    await MovieCategory.bulkCreate([
      { category: "Drama" },
      { category: "Comedy" },
      { category: "Historical" },
      { category: "Romance" }
    ]);
    console.log("Categories seeded.");
  }
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error("Database connection failed:", err);
});