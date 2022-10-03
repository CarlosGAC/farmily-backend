import { Router } from "express";
import UserRoutes from "./user.routes";
import ScoreRoutes from "./score.routes";

const router = Router();

// Routes
router.use("/user", UserRoutes);
router.use("/score", ScoreRoutes);

export default router;