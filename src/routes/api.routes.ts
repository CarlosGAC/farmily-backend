import { Router } from "express";

const userRoutes = require("./user.routes").user;
const scoreRoutes = require("./score.routes").score;
const api = Router();

// Routes
api.use("/user", userRoutes);
api.use("/score", scoreRoutes);

module.exports.api = api;