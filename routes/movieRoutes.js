import express from "express";
import { 
  getAllMovies, 
  getMovie,   
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