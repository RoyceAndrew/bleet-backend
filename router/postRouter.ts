import express from "express";
import { createPost, getProfilePost, deletePost, getAllPosts, streamPost, likePost } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost", getProfilePost)

router.delete("/delete", deletePost)

router.get("/", getAllPosts)

router.get("/stream", streamPost)

router.post("/like", likePost)

export default router;