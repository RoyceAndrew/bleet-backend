import express from "express";
import { upComment, createPost, getProfilePost, deletePost, getAllPosts, streamPost, likePost, detailPost } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost", getProfilePost)

router.delete("/delete", deletePost)

router.get("/", getAllPosts)

router.get("/stream", streamPost)

router.post("/like", likePost)

router.get("/detail/:postId", detailPost)

router.post("/comment", upComment)

export default router;