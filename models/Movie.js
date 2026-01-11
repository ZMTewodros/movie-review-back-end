import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import MovieCategory from "./MovieCategory.js";

const Movie = sequelize.define("Movie", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING },   // Add this
  director: { type: DataTypes.STRING }, // Add this
  year: { type: DataTypes.INTEGER },
  image: { type: DataTypes.STRING },
  category_id: { type: DataTypes.INTEGER, references: { model: MovieCategory, key: "id" } }
  
});

Movie.belongsTo(MovieCategory, { foreignKey: "category_id" });
MovieCategory.hasMany(Movie, { foreignKey: "category_id" });
export default Movie;