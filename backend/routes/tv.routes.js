import express from "express";
import {
  getTrendingTv,
  getTrailerTv,
  getDetailsTv,
  getSimilarTv,
  getByCategoryTv,
} from "../controllers/tv.controller.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/trending", protectRoute, getTrendingTv);
router.get("/trailer/:id", protectRoute, getTrailerTv);
router.get("/details/:id", protectRoute, getDetailsTv);

router.get("/similar/:id", protectRoute, getSimilarTv);
router.get("/:category", protectRoute, getByCategoryTv);

export default router;
