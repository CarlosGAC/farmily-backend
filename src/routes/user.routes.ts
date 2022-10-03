import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUser,
    getUsers,
    updateUser
} from "../controllers/user.controller";

const user = Router();

// Get routes
user.route("/:username").get(getUser);
user.route("/").get(getUsers);

// Post routes
user.route("/").post(createUser);

// Patch routes
user.route("/:username").patch(updateUser);

// Delete routes
user.route("/:username").delete(deleteUser);

module.exports.user = user;
