import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
} from "../controllers/user.controller";

const router = Router();

// Get routes
router.route("/:username").get(getUser);
router.route("/").get(getUsers);

// Post routes
router.route("/").post(createUser);

// Patch routes
router.route("/:username").patch(updateUser);

// Delete routes
router.route("/:username").delete(deleteUser);

export default router;
