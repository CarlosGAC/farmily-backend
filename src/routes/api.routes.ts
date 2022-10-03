import { Router } from "express";

const router = Router();

// Routes
router.use("/user", require("./user.routes"));
router.use("/score", require("./score.routes"));
router.use("");

module.exports = router;