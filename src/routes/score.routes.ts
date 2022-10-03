import { Router } from "express";
import {
    getScores,
    scoreOperation,
} from "../controllers/score.controller";

const score = Router();

// Get routes
score.route("/:levelId").get(getScores);
score.route("/").get(getScores);

// Post routes
score.route("/").post(scoreOperation);

module.exports.score = score;
