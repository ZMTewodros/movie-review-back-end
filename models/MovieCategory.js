import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MovieCategory = sequelize.define("MovieCategory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  category: { type: DataTypes.STRING, unique: true }
});

export default MovieCategory;