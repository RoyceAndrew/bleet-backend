import express from "express";
import { createPost, getProfilePost, deletePost, getAllPosts } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost", getProfilePost)

router.delete("/delete", deletePost)

router.get("/", getAllPosts)

export default router;