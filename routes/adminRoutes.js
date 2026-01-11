import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import Role from "../models/Role.js";
import sequelize from "../config/db.js"; // IMPORT THIS

const router = express.Router();

router.get("/stats", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const userCount = await User.count();
    const movieCount = await Movie.count();
    const reviewCount = await Review.count();

    // Get movies with their average ratings
    const movies = await Movie.findAll({
      attributes: [
        "id", "title", "image",
        [sequelize.fn("AVG", sequelize.col("Reviews.rating")), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "reviewCount"],
      ],
      include: [{ model: Review, attributes: [] }],
      group: ["Movie.id"],
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: Role, attributes: ["name"] }]
    });

    res.json({
      counts: { users: userCount, movies: movieCount, reviews: reviewCount },
      movies,
      recentUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
});

export default router;