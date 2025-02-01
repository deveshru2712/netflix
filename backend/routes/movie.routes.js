import express from "express";
import {
  getByCategoryMovies,
  getDetailsMovies,
  getSimilarMovies,
  getTrailerMovies,
  getTrendingMovies,
} from "../controllers/movie.controller.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/trending", protectRoute, getTrendingMovies);
router.get("/trailer/:id", protectRoute, getTrailerMovies);
router.get("/details/:id", protectRoute, getDetailsMovies);

router.get("/similar/:id", protectRoute, getSimilarMovies);
router.get("/:category", protectRoute, getByCategoryMovies);

export default router;
