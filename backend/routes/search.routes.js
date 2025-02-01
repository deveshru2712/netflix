import express from "express";
import {
  searchMovie,
  searchPerson,
  searchTv,
  getSearchHistory,
  removeFromSearchHistory,
} from "../controllers/search.controller.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/person/:query", protectRoute, searchPerson);
router.get("/movie/:query", protectRoute, searchMovie);
router.get("/tv/:query", protectRoute, searchTv);

router.get("/history", protectRoute, getSearchHistory);
router.delete("/history/:id", protectRoute, removeFromSearchHistory);

export default router;
