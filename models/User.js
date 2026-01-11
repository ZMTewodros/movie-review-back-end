import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Role from "./Role.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role_id: { type: DataTypes.INTEGER, references: { model: Role, key: "id" } }
});

Role.hasMany(User, { foreignKey: "role_id" });
User.belongsTo(Role, { foreignKey: "role_id" });

export default User;