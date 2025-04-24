import express from "express";
import { upComment, repost, createPost, getProfilePost, getProfileReply, deletePost, getAllPosts, likePost, detailPost, getComment } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.get("/profilepost/:username", getProfilePost)

router.delete("/delete", deletePost)

router.get("/", getAllPosts)

// router.get("/stream", streamPost)

router.post("/like", likePost)

router.get("/detail/:postId", detailPost)

router.post("/comment", upComment)

router.get("/comment/:postId", getComment)

router.get("/profileReply", getProfileReply)

router.post("/repost", repost)

export default router;