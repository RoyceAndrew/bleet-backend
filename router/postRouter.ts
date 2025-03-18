import express from "express";
import { createPost, getProfilePost, deletePost } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost", getProfilePost)

router.delete("/delete", deletePost)

export default router;