import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Movie from "./Movie.js";

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: "id" } },
  movie_id: { type: DataTypes.INTEGER, references: { model: Movie, key: "id" } },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT }
});

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });
Movie.hasMany(Review, { foreignKey: "movie_id" });
Review.belongsTo(Movie, { foreignKey: "movie_id" });

export default Review;