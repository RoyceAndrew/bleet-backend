import express from "express";
import {followList, getFollow, reportPost, getUserFollowing, getFollowPosts, getUserFollowers, upComment, getReply, streamPost, repost, createPost, getProfilePost, getProfileReply, deletePost, getAllPosts, likePost, detailPost, getComment } from "../controller/postController.ts";

const router: express.Router = express.Router();

router.post("/create", createPost);

router.post("/report", reportPost)

router.get('/followPosts', getFollowPosts)

router.get('/:userId/followers', getUserFollowers);

router.get('/:userId/following', getUserFollowing);

router.get("/follow/:user/:followType", followList)

router.get("/follow/:id", getFollow)

router.get("/profilepost/:username", getProfilePost)

router.delete("/delete", deletePost)

router.get("/", getAllPosts)

router.get("/stream", streamPost)

router.get("/reply/:username", getReply)

router.post("/like", likePost)

router.get("/detail/:postId", detailPost)

router.post("/comment", upComment)

router.get("/comment/:postId", getComment)

router.get("/profileReply", getProfileReply)

router.post("/repost", repost)

export default router;