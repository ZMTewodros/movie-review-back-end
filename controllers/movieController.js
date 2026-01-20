import Movie from "../models/Movie.js";
import MovieCategory from "../models/MovieCategory.js";
import Review from "../models/Review.js";
import User from "../models/User.js"; 
import sequelize from "../config/db.js";

//  Get All Movies (with stable ordering for jumping pages)
export const getAllMovies = async (req, res) => {
  try {
    const { page, limit, category_id } = req.query;
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 4;
    
    const whereClause = {};
    if (category_id && category_id !== "undefined" && category_id !== "") {
      whereClause.category_id = category_id;
    }

    const { count, rows } = await Movie.findAndCountAll({
      where: whereClause,
      limit: l,
      offset: (p - 1) * l,
      order: [["id", "DESC"]], // Fixes the repeating movies issue
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
      distinct: true,
      subQuery: false
    });

    const totalItems = Array.isArray(count) ? count.length : count;

    res.json({
      movies: rows,
      totalPages: Math.ceil(totalItems / l),
      currentPage: p
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Single Movie Details
export const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [
        { model: MovieCategory, attributes: ["category"] },
        { 
          model: Review,
          include: [{ model: User, attributes: ["name"] }]
        }
      ]
    });
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Movie (This is the one causing your error)
export const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//  Update Movie
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

// Delete Movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    await movie.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};