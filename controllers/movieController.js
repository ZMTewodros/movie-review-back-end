import Movie from "../models/Movie.js";
import MovieCategory from "../models/MovieCategory.js";
import Review from "../models/Review.js";
// MISSING IMPORT ADDED BELOW
import User from "../models/User.js"; 
import sequelize from "../config/db.js";

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      attributes: [
        "id", "title", "author", "director", "image", "year", "category_id",
        [sequelize.fn("COALESCE", sequelize.fn("AVG", sequelize.col("Reviews.rating")), 0), "avgRating"],
        [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "reviewCount"],
      ],
      include: [
        { model: MovieCategory, attributes: ["category"] },
        { model: Review, attributes: [] } 
      ],
      group: ["Movie.id", "MovieCategory.id"],
    });
    res.json(movies);
  } catch (error) {
    console.error("Fetch Movies Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    await movie.destroy();
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};

// CORRECTED GETMOVIE FUNCTION
export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        { 
          model: MovieCategory, 
          attributes: ["category"] 
        },
        { 
          model: Review,
          include: [
            { 
              model: User, 
              attributes: ["name"] 
            }
          ]
        }
      ]
    });

    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    console.error("Get Movie Error:", error);
    res.status(500).json({ error: error.message });
  }
};