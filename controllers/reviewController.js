import Review from "../models/Review.js";
import User from "../models/User.js";

// 1. Create a Review
export const createReview = async (req, res) => {
  const { movie_id, rating, comment } = req.body;
  try {
    const review = await Review.create({
      movie_id,
      rating,
      comment,
      user_id: req.user.id
    });
    res.json(review);
  } catch {
    res.status(400).json({ error: "Invalid review" });
  }
};

// 2. Update a Review
export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;
  const reviewId = req.params.id;

  try {
    const review = await Review.findByPk(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(400).json({ error: "Failed to update review" });
  }
};

// 3. Get Reviews for a specific movie (Used by the Admin Dashboard)
export const getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params; // Matches the route /movie/:movieId
    const reviews = await Review.findAll({
      where: { movie_id: movieId },
      include: [{ model: User, attributes: ["name"] }], 
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};