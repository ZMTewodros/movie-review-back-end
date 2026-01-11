import MovieCategory from "../models/MovieCategory.js";

export const getCategories = async (req, res) => {
  try {
    // This fetches all categories (Comedy, Drama, etc.) from your database
    const categories = await MovieCategory.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};