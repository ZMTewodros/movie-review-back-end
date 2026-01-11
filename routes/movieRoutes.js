import express from "express";
import { 
  getAllMovies, 
  getMovie,   // <--- This must exist in the controller
  createMovie, 
  updateMovie, 
  deleteMovie 
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovie);
router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;