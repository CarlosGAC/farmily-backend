import { Router } from "express";
import {
    getScores,
    scoreOperation,
} from "../controllers/score.controller";

const router = Router();

// Get routes
router.route("/:levelId").get(getScores);
router.route("/").get(getScores);

// Post routes
router.route("/").post(scoreOperation);

module.exports = router;
