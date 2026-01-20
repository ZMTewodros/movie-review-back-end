import express from "express";
import { 
  createReview, 
  updateReview, 
  getReviewsByMovie 
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create and Update
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);

// Get reviews for a movie (Dashboard/Details)

router.get("/movie/:movieId", getReviewsByMovie);

export default router;